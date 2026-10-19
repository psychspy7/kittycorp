import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { HttpError, setting } from "./kitty-server";

const lifetime = 20 * 60 * 1000;
function signature(value: string) {
  return createHmac("sha256", setting("FEEDBACK_GATEWAY_TOKEN")).update("kitty-snake-v2:" + value).digest();
}
export function createGameChallenge(visitor: string) {
  const value = { v: 2, seed: randomBytes(4).readUInt32BE(), nonce: randomBytes(16).toString("hex"), issuedAt: Date.now(), visitor };
  const encoded = Buffer.from(JSON.stringify(value)).toString("base64url");
  return { seed: value.seed, challenge: encoded + "." + signature(encoded).toString("base64url") };
}
export function readGameChallenge(token: string, visitor: string) {
  const parts = token.split(".");
  if (parts.length !== 2 || token.length > 1000) throw new HttpError("Start a new Snake round to continue.", 400);
  const received = Buffer.from(parts[1], "base64url"), expected = signature(parts[0]);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) throw new HttpError("This Snake round could not be verified.", 400);
  let value: { v?: number; seed?: number; nonce?: string; issuedAt?: number; visitor?: string };
  try { value = JSON.parse(Buffer.from(parts[0], "base64url").toString()); } catch { throw new HttpError("Start a new Snake round.", 400); }
  if (value.v !== 2 || !Number.isInteger(value.seed) || value.seed! < 0 || value.seed! > 4294967295 || !/^[a-f0-9]{32}$/.test(value.nonce || "") || value.visitor !== visitor || !value.issuedAt || Date.now() - value.issuedAt > lifetime || value.issuedAt > Date.now()) throw new HttpError("This Snake round expired. Start a new one.", 400);
  return { seed: value.seed!, nonce: value.nonce! };
}
export function rewardCode(attempt: string, percent: number) {
  const suffix = createHmac("sha256", setting("FEEDBACK_GATEWAY_TOKEN")).update(`kitty-reward-v1:${attempt}:${percent}`).digest("hex").slice(0, 16).toUpperCase();
  return `KITTY-${percent}-${suffix}`;
}
export function rewardHash(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!/^KITTY-(5|7)-[A-F0-9]{16}$/.test(normalized)) throw new HttpError("Enter the complete KITTY reward code.", 400);
  return createHash("sha256").update(normalized).digest("hex");
}

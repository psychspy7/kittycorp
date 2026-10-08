import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes, timingSafeEqual } from "node:crypto";

export const GOOGLE_PENDING_SECONDS = 300;
export function randomStudioToken() { return randomBytes(32).toString("hex"); }
export function studioHash(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
function sealingKey(secret: string) {
  return Buffer.from(hkdfSync("sha256", secret, "kitty-corp-studio", "google-pending-cookie-v1", 32));
}
export function sealStudioPayload(payload: unknown, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sealingKey(secret), iv);
  cipher.setAAD(Buffer.from("kitty-google-v1"));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}
export function openStudioPayload(value: string, secret: string): unknown {
  if (value.length > 3900) throw new Error("Invalid pending verification");
  const bytes = Buffer.from(value, "base64url");
  if (bytes.length < 29) throw new Error("Invalid pending verification");
  const decipher = createDecipheriv("aes-256-gcm", sealingKey(secret), bytes.subarray(0, 12));
  decipher.setAAD(Buffer.from("kitty-google-v1"));
  decipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString("utf8"));
}

export function approvedGoogleIdentity(
  identity: unknown,
  expectedEmail: string,
): identity is { email: string; email_verified: true; sub: string } {
  if (!identity || typeof identity !== "object") return false;
  const value = identity as Record<string, unknown>;
  return typeof value.email === "string"
    && value.email.toLowerCase() === expectedEmail.toLowerCase()
    && value.email_verified === true
    && typeof value.sub === "string"
    && /^[a-zA-Z0-9._-]{1,255}$/.test(value.sub);
}

export function pendingStudioIsCurrent(value: { expiresAt: number; fingerprint: string }, fingerprint: string, now = Date.now()) {
  return value.expiresAt > now && value.expiresAt <= now + GOOGLE_PENDING_SECONDS * 1000 && safeEqual(value.fingerprint, fingerprint);
}

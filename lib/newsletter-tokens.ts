import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { setting, HttpError } from "./kitty-server";
const uuid = z.string().uuid();
function signature(purpose: string, id: string, nonce: string) {
  return createHmac("sha256", setting("FEEDBACK_GATEWAY_TOKEN"))
    .update("kitty-newsletter-v1|" + purpose + "|" + id + "|" + nonce)
    .digest("hex");
}
export function newsletterToken(
  purpose: "confirm" | "unsubscribe",
  id: string,
  nonce: string,
) {
  uuid.parse(id);
  uuid.parse(nonce);
  return id + "." + nonce + "." + signature(purpose, id, nonce);
}
export function verifyNewsletterToken(
  purpose: "confirm" | "unsubscribe",
  value: string,
) {
  const [id, nonce, sig, ...extra] = value.split(".");
  if (
    extra.length ||
    !uuid.safeParse(id).success ||
    !uuid.safeParse(nonce).success ||
    !sig ||
    !/^[a-f0-9]{64}$/.test(sig) ||
    !timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(signature(purpose, id, nonce), "hex"),
    )
  )
    throw new HttpError(
      "This link is invalid or expired. Please request a new confirmation from the website.",
      400,
    );
  return { id, nonce };
}

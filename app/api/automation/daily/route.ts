import { timingSafeEqual } from "node:crypto";
import { failure, HttpError, privateJson } from "@/lib/kitty-server";
import { runDailyAutomation } from "@/lib/email-notifications";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret || secret.length < 32)
      throw new HttpError("Daily automation is not configured.", 503);
    const actual = request.headers.get("authorization") || "",
      expected = "Bearer " + secret;
    if (
      Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
    )
      throw new HttpError("Unauthorized", 401);
    const result = await runDailyAutomation();
    return privateJson(result);
  } catch (error) {
    return failure(error);
  }
}

import { z } from "zod";
import { database, failure, fingerprint, HttpError, privateJson, readBody, setting, verifyOrigin } from "@/lib/kitty-server";
import { beginStudioGoogle, studioGoogleStatus } from "@/lib/studio-google";
import { verifyTurnstile } from "@/lib/turnstile-server";
const googleLoginSchema = z.object({ turnstileToken: z.string().min(1).max(2048) }).strict();
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = googleLoginSchema.parse(await readBody(request));
    await verifyTurnstile(request, value.turnstileToken, "studio-login");
    const google = await studioGoogleStatus();
    if (!google.providerReady) throw new HttpError("Google sign-in is temporarily unavailable. Please try again shortly.", 503);
    const { error } = await database().rpc("kitty_website_login_attempt", {
      p_fingerprint: await fingerprint(request), p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
    });
    if (error) throw new HttpError(error.message.includes("Rate limit")
      ? "Too many sign-in attempts. Please try again in 15 minutes." : "Studio sign-in is temporarily unavailable. Please try again shortly.",
      error.message.includes("Rate limit") ? 429 : 503);
    return privateJson({ ok: true, googleUrl: await beginStudioGoogle(request) });
  } catch (error) { return failure(error); }
}

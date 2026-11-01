import { z } from "zod";
import { database, failure, fingerprint, HttpError, privateJson, readBody, setting, verifyOrigin } from "@/lib/kitty-server";
import { beginStudioGoogle, studioGoogleStatus } from "@/lib/studio-google";
const googleLoginSchema = z.object({ turnstileToken: z.string().max(2048).optional().default("") }).strict();
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    googleLoginSchema.parse(await readBody(request));
    // Studio access is gated by verified Google identity, the server-side
    // administrator allowlist and the database login rate limit below. Do not
    // put the unreliable third-party widget in front of the recovery path.
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

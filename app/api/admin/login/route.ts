import {
  database,
  failure,
  fingerprint,
  HttpError,
  privateJson,
  readBody,
  setStudioSession,
  setting,
  verifyOrigin,
} from "@/lib/kitty-server";
import { loginSchema } from "@/lib/kitty-validation";
import { beginStudioGoogle, studioGoogleStatus } from "@/lib/studio-google";
import { verifyTurnstile } from "@/lib/turnstile-server";
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const body = await readBody(request);
    const value = loginSchema.parse(body);
    await verifyTurnstile(request, (body as Record<string, unknown>).turnstileToken, "studio-login");
    const google = await studioGoogleStatus();
    if (google.required && !google.providerReady)
      throw new HttpError("Google verification is being configured. Please try again shortly.", 503);
    const db = database();
    const { error: limited } = await db.rpc("kitty_website_login_attempt", {
      p_fingerprint: await fingerprint(request),
      p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
    });
    if (limited) {
      if (limited.message.includes("Rate limit"))
        throw new HttpError(
          "Too many sign-in attempts. Please try again in 15 minutes.",
          429,
        );
      throw new HttpError(
        "Studio sign-in is temporarily unavailable. Please try again shortly.",
        503,
      );
    }
    if (value.username !== setting("ADMIN_LOGIN_ID"))
      throw new HttpError("That ID and password don’t match.", 401);
    const { data, error } = await db.auth.signInWithPassword({
      email: setting("ADMIN_EMAIL"),
      password: value.password,
    });
    if (error || data.user?.id !== setting("ADMIN_USER_ID") || !data.session)
      throw new HttpError("That ID and password don’t match.", 401);
    if (google.required) {
      try {
        const googleUrl = await beginStudioGoogle(request, data.session.access_token, data.user.id);
        return privateJson({ ok: true, googleUrl });
      } catch (error) {
        await database().auth.admin.signOut(data.session.access_token, "local").catch(() => {});
        throw error;
      }
    }
    await setStudioSession(data.session.access_token, data.session.expires_in);
    return privateJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

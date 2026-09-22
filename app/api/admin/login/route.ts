import { cookies } from "next/headers";
import {
  database,
  failure,
  fingerprint,
  HttpError,
  privateJson,
  readBody,
  SESSION_COOKIE,
  setting,
  verifyOrigin,
} from "@/lib/kitty-server";
import { loginSchema } from "@/lib/kitty-validation";
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = loginSchema.parse(await readBody(request));
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
    await (
      await cookies()
    ).set(SESSION_COOKIE, data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.min(data.session.expires_in, 3600),
    });
    return privateJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

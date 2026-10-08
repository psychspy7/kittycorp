import { cookies } from "next/headers";
import {
  failure,
  privateJson,
  adminSession,
  SESSION_COOKIE,
  verifyOrigin,
  setting,
} from "@/lib/kitty-server";
import { clearStudioGoogleCookies } from "@/lib/studio-google";
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    try {
      const session = await adminSession();
      if (session) {
        await session.db.rpc("kitty_website_studio_end", { p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN") });
        const { error } = await session.db.auth.admin.signOut(session.token, "local");
        if (error) throw error;
      }
    } finally {
      await (await cookies()).delete(SESSION_COOKIE);
      await clearStudioGoogleCookies();
    }
    return privateJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

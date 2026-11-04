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
import { recordAuditEvent } from "@/lib/audit-logger";

export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    let actorId: string | undefined;
    let actorEmail: string | undefined;
    try {
      const session = await adminSession();
      if (session) {
        actorId = session.user.id;
        actorEmail = session.user.email;
        await session.db.rpc("kitty_website_studio_end", {
          p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
        });
        const { error } = await session.db.auth.admin.signOut(session.token, "local");
        if (error) throw error;
      }
    } finally {
      await (await cookies()).delete(SESSION_COOKIE);
      await clearStudioGoogleCookies();
      recordAuditEvent({
        action: "auth.logout",
        severity: "info",
        status: "success",
        actor: { type: "admin", id: actorId, email: actorEmail },
      });
    }
    return privateJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

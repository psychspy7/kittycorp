import { cookies } from "next/headers";
import {
  failure,
  privateJson,
  requireAdmin,
  SESSION_COOKIE,
  verifyOrigin,
} from "@/lib/kitty-server";
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { db, token } = await requireAdmin();
    const { error } = await db.auth.admin.signOut(token, "local");
    if (error) throw error;
    await (await cookies()).delete(SESSION_COOKIE);
    return privateJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

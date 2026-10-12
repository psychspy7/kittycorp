import { refreshNotices } from "@/lib/notices-server";
import {
  failure,
  privateJson,
  readBody,
  requireAdmin,
  verifyOrigin,
} from "@/lib/kitty-server";
import { noticeSchema } from "@/lib/kitty-validation";
export async function GET() {
  try {
    const { db } = await requireAdmin();
    const { data, error } = await db
      .from("kitty_website_notices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return privateJson({ notices: data });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const value = noticeSchema.parse(await readBody(request));
    const { data, error } = await db
      .from("kitty_website_notices")
      .insert({
        ...value,
        published_at: value.published ? new Date().toISOString() : null,
      })
      .select()
      .single();
    if (error) throw error;
    refreshNotices();
    return privateJson({ notice: data });
  } catch (error) {
    return failure(error);
  }
}

import { refreshNotices } from "@/lib/notices-server";
import { z } from "zod";
import {
  failure,
  HttpError,
  privateJson,
  readBody,
  requireAdmin,
  verifyOrigin,
} from "@/lib/kitty-server";
import { noticeSchema } from "@/lib/kitty-validation";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const id = z
      .string()
      .uuid()
      .parse((await context.params).id);
    const value = noticeSchema.parse(await readBody(request));
    const { data: existing, error: lookupError } = await db
      .from("kitty_website_notices")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing) throw new HttpError("This notice no longer exists.", 404);
    const { data, error } = await db
      .from("kitty_website_notices")
      .update({
        ...value,
        published_at: value.published
          ? (existing.published_at ?? new Date().toISOString())
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    refreshNotices();
    return privateJson({ notice: data });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request: Request, context: Context) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const id = z
      .string()
      .uuid()
      .parse((await context.params).id);
    const { data, error } = await db
      .from("kitty_website_notices")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new HttpError("This notice no longer exists.", 404);
    refreshNotices();
    return privateJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

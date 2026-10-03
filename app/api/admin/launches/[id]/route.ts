import { z } from "zod";
import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { launchSchema, refreshLaunchPages, verifyRelease } from "@/lib/launches-server";
import { RELEASE_BUCKET, type Launch } from "@/lib/launches";
export const maxDuration = 60;
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const id = z.string().uuid().parse((await context.params).id);
    const value = launchSchema.parse(await readBody(request));
    const { data: existing, error: lookupError } = await db.from("kitty_website_launches").select("*").eq("id", id).maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing) throw new HttpError("This launch no longer exists.", 404);
    if (existing.slug === "secretchat" && value.slug !== "secretchat") throw new HttpError("Keep SecretChat’s page address so existing links continue to work.", 400);
    const release = await verifyRelease(db, value, existing as Launch);
    const { data, error } = await db.from("kitty_website_launches").update({ ...value, ...release, published_at: value.published ? (existing.published_at ?? new Date().toISOString()) : null, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error?.code === "23505") throw new HttpError("That page address is already in use.", 409);
    if (error) throw error;
    refreshLaunchPages();
    return privateJson({ launch: data });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const id = z.string().uuid().parse((await context.params).id);
    const { data, error } = await db.from("kitty_website_launches").delete().eq("id", id).select("apk_path").maybeSingle();
    if (error) throw error;
    if (!data) throw new HttpError("This launch no longer exists.", 404);
    if (data.apk_path?.startsWith("releases/")) {
      // Only remove unreferenced files; existing versions remain downloadable after replacements.
      const { data: uses, error: usesError } = await db.from("kitty_website_launches").select("id").eq("apk_path", data.apk_path).limit(1);
      if (!usesError && !uses?.length) await db.storage.from(RELEASE_BUCKET).remove([data.apk_path]);
    }
    refreshLaunchPages();
    return privateJson({ ok: true });
  } catch (error) { return failure(error); }
}

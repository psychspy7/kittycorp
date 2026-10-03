import { randomUUID } from "node:crypto";
import { z } from "zod";
import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { MAX_APK_BYTES, RELEASE_BUCKET } from "@/lib/launches";
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const input = z.object({ filename: z.string().min(5).max(180), bytes: z.number().int().min(1).max(MAX_APK_BYTES) }).parse(await readBody(request));
    if (!input.filename.toLowerCase().endsWith(".apk")) throw new HttpError("Select an Android APK file.", 400);
    const path = `releases/${randomUUID()}/${randomUUID()}.apk`;
    const { data, error } = await db.storage.from(RELEASE_BUCKET).createSignedUploadUrl(path, { upsert: false });
    if (error || !data) throw new HttpError("Upload could not start. Please try again.", 503);
    return privateJson({ path, uploadUrl: data.signedUrl });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const { path } = z.object({ path: z.string().regex(/^releases\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.apk$/) }).parse(await readBody(request));
    const { data: uses, error: lookupError } = await db.from("kitty_website_launches").select("id").eq("apk_path", path).limit(1);
    if (lookupError) throw lookupError;
    if (uses?.length) throw new HttpError("This APK is used by a saved launch.", 409);
    const { error } = await db.storage.from(RELEASE_BUCKET).remove([path]);
    if (error) throw error;
    return privateJson({ ok: true });
  } catch (error) { return failure(error); }
}

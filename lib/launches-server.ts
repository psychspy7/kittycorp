import "server-only";
import { database, HttpError } from "./kitty-server";
import { MAX_APK_BYTES, RELEASE_BUCKET, type Launch } from "./launches";
import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { secretChat } from "./secretchat";
import { z } from "zod";

export const launchSchema = z.object({
  slug: z.string().trim().min(3).max(60).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens for the page address."),
  name: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(3).max(140),
  description: z.string().trim().min(10).max(2000),
  release_notes: z.string().trim().max(4000),
  version: z.string().trim().min(1).max(40),
  android: z.string().trim().min(3).max(60),
  apk_path: z.string().nullable(),
  apk_sha256: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  apk_bytes: z.number().int().min(1).max(MAX_APK_BYTES).nullable(),
  published: z.boolean(),
  show_popup: z.boolean(),
});

export async function publishedLaunches(): Promise<Launch[]> {
  const { data, error } = await database().from("kitty_website_launches").select("*").eq("published", true).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(20);
  if (error) throw new HttpError("Launches are temporarily unavailable.", 503);
  return data as Launch[];
}
export async function publishedLaunch(slug: string): Promise<Launch | null> {
  const { data, error } = await database().from("kitty_website_launches").select("*").eq("slug", slug).eq("published", true).lte("published_at", new Date().toISOString()).maybeSingle();
  if (error) throw new HttpError("This launch is temporarily unavailable.", 503);
  return data as Launch | null;
}
export function refreshLaunchPages() {
  revalidatePath("/");
  revalidatePath("/secretchat");
  revalidatePath("/launches/[slug]", "page");
  revalidatePath("/sitemap.xml");
}
export async function verifyRelease(db: ReturnType<typeof database>, value: z.infer<typeof launchSchema>, existing?: Launch) {
  if (!value.apk_path) {
    if (value.published) throw new HttpError("Upload an APK before publishing.", 400);
    return { apk_path: null, apk_sha256: null, apk_bytes: null };
  }
  if (value.apk_path === secretChat.apk) {
    return { apk_path: secretChat.apk, apk_sha256: secretChat.sha256, apk_bytes: 5256093 };
  }
  if (!/^releases\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.apk$/.test(value.apk_path)) throw new HttpError("Choose an APK uploaded through Studio.", 400);
  if (existing?.apk_path === value.apk_path) return { apk_path: existing.apk_path, apk_sha256: existing.apk_sha256, apk_bytes: existing.apk_bytes };
  const { data, error } = await db.storage.from(RELEASE_BUCKET).download(value.apk_path);
  if (error || !data) throw new HttpError("The uploaded APK could not be read. Please upload it again.", 400);
  if (!data.size || data.size > MAX_APK_BYTES) throw new HttpError("APKs must be at most 50 MB.", 400);
  const bytes = Buffer.from(await data.arrayBuffer());
  // APKs are ZIP archives; release builds must include an APK v2/v3 signing block.
  if (bytes.length < 4 || bytes.readUInt32LE(0) !== 0x04034b50 || !bytes.includes(Buffer.from("APK Sig Block 42"))) throw new HttpError("Upload a signed Android release APK (v2 or newer).", 400);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== value.apk_sha256 || data.size !== value.apk_bytes) throw new HttpError("The uploaded APK did not match the selected file. Please upload it again.", 400);
  return { apk_path: value.apk_path, apk_sha256: hash, apk_bytes: data.size };
}

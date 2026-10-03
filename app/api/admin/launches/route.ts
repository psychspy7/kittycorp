import { failure, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { launchSchema, refreshLaunchPages, verifyRelease } from "@/lib/launches-server";
export const maxDuration = 60;
export async function GET() {
  try {
    const { db } = await requireAdmin();
    const { data, error } = await db.from("kitty_website_launches").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return privateJson({ launches: data });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const value = launchSchema.parse(await readBody(request));
    const release = await verifyRelease(db, value);
    const { data, error } = await db.from("kitty_website_launches").insert({ ...value, ...release, published_at: value.published ? new Date().toISOString() : null }).select().single();
    if (error?.code === "23505") return Response.json({ error: "That page address is already in use." }, { status: 409 });
    if (error) throw error;
    refreshLaunchPages();
    return privateJson({ launch: data });
  } catch (error) { return failure(error); }
}

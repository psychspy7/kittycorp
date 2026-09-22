import { database, failure } from "@/lib/kitty-server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { data, error } = await database()
      .from("kitty_website_notices")
      .select("id,title,body,category,published_at,created_at")
      .eq("published", true)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return Response.json(
      { notices: data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}

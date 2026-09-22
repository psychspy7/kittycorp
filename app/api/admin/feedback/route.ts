import { failure, privateJson, requireAdmin } from "@/lib/kitty-server";
export async function GET(request: Request) {
  try {
    const { db } = await requireAdmin();
    const cursor = new URL(request.url).searchParams.get("before");
    let query = db
      .from("kitty_website_feedback")
      .select("id,name,email,message,created_at")
      .order("created_at", { ascending: false })
      .limit(51);
    if (cursor && !Number.isNaN(Date.parse(cursor)))
      query = query.lt("created_at", cursor);
    const { data, error } = await query;
    if (error) throw error;
    return privateJson({
      feedback: data.slice(0, 50),
      nextCursor: data.length > 50 ? data[49].created_at : null,
    });
  } catch (error) {
    return failure(error);
  }
}

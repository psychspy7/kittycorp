import "server-only";
import { revalidatePath } from "next/cache";
import { database } from "./kitty-server";
import { PUBLIC_CONTENT_TAGS, publicContentCache, refreshPublicContent } from "./public-content-cache";
export const publicNotices = publicContentCache("notices", PUBLIC_CONTENT_TAGS.notices, async () => {
  const {data,error}=await database().from("kitty_website_notices")
    .select("id,title,body,category,published_at,created_at").abortSignal(AbortSignal.timeout(5000)).eq("published",true)
    .lte("published_at",new Date().toISOString()).order("published_at",{ascending:false}).limit(50);
  if(error) throw error;
  return data;
});
export function refreshNotices() {
  refreshPublicContent(PUBLIC_CONTENT_TAGS.notices);
  revalidatePath("/api/notices");
}

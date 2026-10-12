import { failure } from "@/lib/kitty-server";
import { publicNotices } from "@/lib/notices-server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json({notices:await publicNotices()}, {headers:{"Cache-Control":"no-store"}});
  } catch (error) { return failure(error); }
}

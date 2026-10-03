import { database, failure, HttpError } from "@/lib/kitty-server";
import { publishedLaunch } from "@/lib/launches-server";
import { RELEASE_BUCKET } from "@/lib/launches";
export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 60) throw new HttpError("Download not found.", 404);
    const launch = await publishedLaunch(slug);
    if (!launch?.apk_path) throw new HttpError("This download is no longer available.", 404);
    if (launch.apk_path.startsWith("/downloads/")) return new Response(null, { status: 302, headers: { Location: new URL(launch.apk_path, request.url).href, "Cache-Control": "no-store" } });
    const { data, error } = await database().storage.from(RELEASE_BUCKET).createSignedUrl(launch.apk_path, 60, { download: `${launch.slug}-${launch.version.replace(/[^a-zA-Z0-9.-]/g, "")}.apk` });
    if (error || !data) throw new HttpError("The download could not start. Please try again.", 503);
    return new Response(null, { status: 302, headers: { Location: data.signedUrl, "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}

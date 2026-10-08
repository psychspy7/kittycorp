import { cancelStudioGoogleFlow, finishStudioGoogle } from "@/lib/studio-google";
export const dynamic = "force-dynamic";
function redirect(target: string) {
  return new Response(null, { status: 303, headers: { Location: target, "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
}
export async function GET(request: Request) {
  try {
    const target = await finishStudioGoogle(request);
    return redirect(target);
  } catch {
    await cancelStudioGoogleFlow(new URL(request.url).searchParams.get("flow") || "");
    const origin = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname)
      ? new URL(request.url).origin : new URL(process.env.SITE_URL || "https://kittycorp.vercel.app").origin;
    return redirect(`${origin}/kitten?signin=verification-failed`);
  }
}

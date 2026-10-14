import { websiteHealth } from "@/lib/website-health";
export const dynamic = "force-dynamic";
export async function GET() {
  const health = await websiteHealth();
  return Response.json(health, { status: health.status === "healthy" ? 200 : 503, headers: { "Cache-Control": "no-store, max-age=0", "X-Robots-Tag": "noindex", ...(health.status === "degraded" ? { "Retry-After": "120" } : {}) } });
}

import "server-only";
export type WebsiteHealth = { status: "healthy" | "degraded"; database: "available" | "unavailable"; checkedAt: string };
export async function websiteHealth(): Promise<WebsiteHealth> {
  const checkedAt = new Date().toISOString();
  try {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY || "";
    if (!/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key)) throw Error();
    // A fixed, public, read-only target. Never expose returned records or credentials.
    const response = await fetch("https://mgkghnblbisubympudaa.supabase.co/rest/v1/kitty_website_notices?select=id&limit=1", {
      headers: { apikey: key, accept: "application/json" }, cache: "no-store",
      redirect: "manual", signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) { await response.body?.cancel(); throw Error(); }
    const rows: unknown = await response.json();
    if (!Array.isArray(rows) || rows.length > 1 || rows.some(row => !row || typeof row.id !== "string" || !/^[a-f0-9-]{36}$/i.test(row.id))) throw Error();
    return { status: "healthy", database: "available", checkedAt };
  } catch { return { status: "degraded", database: "unavailable", checkedAt }; }
}

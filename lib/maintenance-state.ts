import "server-only";
import type { MaintenanceState } from "./maintenance";

export async function maintenanceState(): Promise<MaintenanceState> {
  // Explicit local QA configuration cannot be activated by a visitor request.
  if (process.env.KITTY_LOCAL_PREVIEW === "true" && /^http:\/\/(localhost|127\.0\.0\.1):\d+\/?$/.test(process.env.SITE_URL || ""))
    return {enabled:false,revision:0,updated_at:new Date(0).toISOString()};
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) throw new Error("Maintenance state unavailable");
  const response = await fetch(new URL("/rest/v1/rpc/kitty_website_maintenance_status", url), {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("Maintenance state unavailable");
  const state = await response.json() as MaintenanceState;
  if (typeof state.enabled !== "boolean" || !Number.isSafeInteger(state.revision))
    throw new Error("Invalid maintenance state");
  return state;
}

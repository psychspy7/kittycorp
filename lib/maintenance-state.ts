import "server-only";
import type { MaintenanceState } from "./maintenance";

export async function maintenanceState(): Promise<MaintenanceState> {
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

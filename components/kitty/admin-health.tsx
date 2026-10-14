"use client";
import { useCallback, useEffect, useState } from "react";
import { studioRequest } from "./studio-content-helpers";
import type { WebsiteHealth } from "@/lib/website-health";
import type { PaymentProvider, ProviderReadiness } from "@/lib/commerce";
type State = { health: WebsiteHealth; assistantConfigured: boolean; emailConfigured: boolean; payments: Record<PaymentProvider, ProviderReadiness> };
export default function AdminHealth() {
  const [state, setState] = useState<State | null>(null), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setBusy(true); setError("");
    try { setState(await studioRequest<State>("/api/admin/health")); }
    catch { setError("The checks could not finish. Try again, or check your provider dashboards."); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { let active = true; void studioRequest<State>("/api/admin/health").then(value => { if (active) setState(value); }).catch(() => { if (active) setError("The checks could not finish. Try again."); }); return () => { active = false; }; }, []);
  return <><div className="panel-heading"><h2>Website health &amp; handover</h2><p>Read-only checks. No emails, payments or database changes happen here.</p><button className="button button-outline" onClick={() => void load()} disabled={busy}>{busy ? "Checking…" : "Refresh checks"}</button></div>{error && <p className="form-error" role="alert">{error}</p>}
    <div className="studio-health-grid"><article className="studio-health-card"><h3>Website database</h3><p>{state ? (state.health.status === "healthy" ? "Responding to a read-only check." : "Not responding. Check the Supabase dashboard.") : "Checking…"}</p>{state && <p>Checked {new Date(state.health.checkedAt).toLocaleString()}</p>}<a href="https://supabase.com/dashboard/project/mgkghnblbisubympudaa" target="_blank" rel="noopener noreferrer">Open website database ↗</a></article>
    <article className="studio-health-card"><h3>Connections</h3><p>KITTY AI: {state ? (state.assistantConfigured ? "Configured" : "Needs setup") : "Checking…"}<br />Gmail alerts: {state ? (state.emailConfigured ? "Configured" : "Needs setup") : "Checking…"}</p><p>Configuration checks do not confirm delivery or an AI reply. Use Email alerts to send a test.</p>{state && Object.entries(state.payments).map(([key, provider]) => <p key={key}>{key.toUpperCase()}: {provider.available ? `${provider.mode} checkout configured` : provider.message}</p>)}</article>
    <article className="studio-health-card"><h3>Daily Cloudflare check</h3><p>The deployed worker is kitty-corp-database-health. Schedule: 08:30 AM IST daily. Check Cloudflare invocation logs to confirm the last run.</p><a href="https://dash.cloudflare.com/8d31d4f22772768f621d4f337d97656b/workers/services/view/kitty-corp-database-health/production" target="_blank" rel="noopener noreferrer">Open Cloudflare worker ↗</a><p>Daily activity cannot guarantee Supabase Free will never pause.</p></article>
    <article className="studio-health-card"><h3>Before a long break</h3><p>Download the latest source ZIP. Back up private settings, the live database and uploaded files separately. The source archive excludes customer records and credentials.</p><p>Use an independent uptime monitor for the homepage and /api/health. Pause new paid orders if you cannot handle them while away.</p><a href="/api/health" target="_blank" rel="noopener noreferrer">View public database health ↗</a></article></div>
  </>;
}

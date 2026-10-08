"use client";
import { useEffect, useState } from "react";
import type { MaintenanceReply, MaintenanceState } from "@/lib/maintenance";
export default function AdminMaintenance() {
  const [state, setState] = useState<MaintenanceState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/admin/maintenance", { cache: "no-store" })
      .then(async response => {
        const reply = await response.json() as MaintenanceReply;
        if (!response.ok) throw Error(reply.error || "Couldn’t load the site status.");
        if (active && reply.state) setState(reply.state);
      })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : "Couldn’t load site controls."); });
    return () => { active = false; };
  }, []);
  async function change() {
    if (!state) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !state.enabled, revision: state.revision }),
      });
      const reply = await response.json() as MaintenanceReply;
      if (reply.state) setState(reply.state);
      if (!response.ok) throw Error(reply.error || "Couldn’t update the site.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Couldn’t update the site."); }
    finally { setBusy(false); }
  }
  return <div>
    <div className="panel-heading"><h2>Site controls</h2><p>Take public pages offline or restore the website. Studio stays accessible.</p></div>
    {state && <>
      <p role="status"><strong>{state.enabled ? "Maintenance is on" : "Website is live"}</strong></p>
      <p>{state.enabled ? "Visitors see the maintenance screen. Use the button below to restore the website." : "Switch on maintenance to replace public pages with the maintenance screen."}</p>
      <button className="button button-gold" disabled={busy} onClick={() => { void change(); }}>
        {busy ? "Updating…" : state.enabled ? "Bring website online" : "Take website offline"}
      </button>
      <p className="studio-publishing-note"><a href="/maintenance" target="_blank" rel="noopener noreferrer">Preview maintenance screen</a></p>
    </>}
    {!state && !error && <p className="empty-message">Loading site status…</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>;
}

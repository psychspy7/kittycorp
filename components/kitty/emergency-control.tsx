"use client";
import { useState } from "react";
import { LockKeyhole, Power, ShieldCheck } from "lucide-react";
import type { MaintenanceReply, MaintenanceState } from "@/lib/maintenance";
export function EmergencyControl() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<MaintenanceState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send(enabled?: boolean) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/emergency", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, ...(enabled === undefined ? {} : { enabled, revision: state?.revision }) }),
      });
      const reply = await response.json() as MaintenanceReply;
      if (reply.state) setState(reply.state);
      if (!response.ok) throw new Error(reply.error || "Couldn’t update the site. Try again.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setBusy(false); }
  }
  return <main id="main" className="emergency-page">
    <div className="emergency-card">
      <span className="emergency-label">KITTY CORP · PRIVATE CONTROL</span>
      {!state ? <>
        <LockKeyhole size={30} aria-hidden="true" />
        <h1>Emergency access.</h1>
        <form onSubmit={event => { event.preventDefault(); void send(); }}>
          <label htmlFor="emergency-code">Access code</label>
          <input id="emergency-code" type="password" inputMode="numeric" autoComplete="off"
            required maxLength={72} value={code} disabled={busy}
            onChange={event => setCode(event.target.value)} />
          <button className="emergency-unlock" disabled={busy}>{busy ? "Verifying…" : "Unlock control"}</button>
        </form>
      </> : <>
        <ShieldCheck size={30} aria-hidden="true" />
        <h1>Site control.</h1>
        <p className="emergency-status" role="status">
          <span className={state.enabled ? "offline-dot" : "online-dot"} />
          {state.enabled ? "Maintenance is on. Public pages are offline." : "The website is live."}
        </p>
        <button className={"emergency-power " + (state.enabled ? "restore" : "")}
          disabled={busy} onClick={() => { void send(!state.enabled); }}>
          <Power size={32} aria-hidden="true" />
          {busy ? "Updating…" : state.enabled ? "Bring website online" : "Emergency · take site offline"}
        </button>
        <p className="emergency-note">This control stays available in maintenance. Studio remains available as a backup.</p>
        <button className="emergency-lock" disabled={busy} onClick={() => { setCode(""); setState(null); setError(""); }}>Lock control</button>
      </>}
      {error && <p className="emergency-error" role="alert">{error}</p>}
    </div>
  </main>;
}

"use client";
import { useEffect, useState } from "react";
import { studioRequest } from "./studio-content-helpers";
import { toast } from "sonner";
type State = { configured: boolean; recipient: string; queue: { pending: number; sending: number; sent: number; needs_retry: number } };
export default function AdminEmail() {
  const [state, setState] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    const data = await studioRequest<State>("/api/admin/email");
    setState(data); setError("");
  }
  useEffect(() => {
    let active = true;
    void studioRequest<State>("/api/admin/email").then(data => { if (active) setState(data); }).catch(failure => { if (active) setError(failure instanceof Error ? failure.message : "Couldn’t load email settings."); });
    return () => { active = false; };
  }, []);
  async function act(action: "test" | "retry") {
    setBusy(true); setError("");
    try {
      const result = await studioRequest<{ sent?: number; failed?: number }>("/api/admin/email", "POST", { action });
      if (action === "test") toast.success("Test email accepted by Gmail. Check your inbox and spam folder.");
      else if (result.failed) toast.error("Gmail could not accept a message. It stays queued for retry.");
      else toast.success(`${result.sent || 0} notification(s) accepted by Gmail.`);
      await load();
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Couldn’t send email."); }
    finally { setBusy(false); }
  }
  return <><div className="panel-heading"><h2>Website email alerts</h2><p>Contact messages, project enquiries, visitor reviews and new early-access signups also go to your Gmail inbox. Messages stay in Studio.</p></div>
    {error && <p className="form-error" role="alert">{error}<button disabled={busy} onClick={() => void load().catch(() => setError("Couldn’t refresh email settings."))}>Refresh</button></p>}
    {state ? <div className="studio-settings-form"><p><strong>Inbox:</strong> {state.recipient}</p><p role="status">{state.configured ? "Gmail credential is configured. Send a test to check delivery." : "Setup pending. Add GMAIL_APP_PASSWORD to the private server environment, then restart or redeploy. Do not enter your normal Gmail password."}</p>
      <p>{state.queue.pending} queued · {state.queue.sending} sending · {state.queue.sent} accepted by Gmail</p>
      {state.queue.needs_retry > 0 && <p>{state.queue.needs_retry} notification(s) need a manual retry.</p>}
      <div className="email-alert-actions"><button className="button button-gold" disabled={busy || !state.configured} onClick={() => void act("test")}>Send test email</button><button className="button button-outline" disabled={busy || !state.configured} onClick={() => void act("retry")}>Send queued alerts</button><button className="text-link" disabled={busy} onClick={() => void load().catch(() => setError("Couldn’t refresh email settings."))}>Refresh status</button></div>
      <p>Up to three alerts send per batch. New submissions retry eligible queued alerts; use this button to send a backlog. Gmail acceptance does not guarantee inbox delivery.</p>
    </div> : !error && <p className="empty-message">Opening email status…</p>}</>;
}

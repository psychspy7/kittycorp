"use client";
import { useEffect, useState } from "react";
import { studioRequest } from "./studio-content-helpers";
import { toast } from "sonner";
type State = {
  configured: boolean;
  recipient: string;
  cronConfigured: boolean;
  timezone: string;
  retentionHours: number;
  queue: {
    pending: number;
    sending: number;
    sent: number;
    needs_retry: number;
    failed: number;
    uncertain: number;
    active_subscribers: number;
    pending_subscribers: number;
    legacy_subscribers: number;
    last_report: string | null;
    last_cleanup: string | null;
    last_cleanup_count: number;
    database_bytes: number;
    unresolved_error: string | null;
    recent_activity: Array<{ kind: string; occurred_at: string }>;
  };
};
const when = (v: string | null) =>
  v ? new Date(v).toLocaleString() : "Not completed yet";
export default function AdminEmail() {
  const [state, setState] = useState<State | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false),
    [preview, setPreview] = useState<number | null>(null);
  async function load() {
    setState(await studioRequest<State>("/api/admin/email"));
    setError("");
  }
  useEffect(() => {
    let active = true;
    void studioRequest<State>("/api/admin/email")
      .then((v) => {
        if (active) setState(v);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error ? e.message : "Could not load email status.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  async function act(
    action: "test" | "retry" | "report" | "cleanup-preview" | "retry-uncertain",
  ) {
    setBusy(true);
    setError("");
    try {
      const r = await studioRequest<{
        sent?: number;
        failed?: number;
        eligible_submissions?: number;
      }>("/api/admin/email", "POST", {
        action,
        ...(action === "retry-uncertain" ? { confirmDuplicates: confirm } : {}),
      });
      if (action === "cleanup-preview") setPreview(r.eligible_submissions || 0);
      else if (action === "test")
        toast.success("Test accepted by Gmail. Check Inbox and Spam.");
      else if (r.failed)
        toast.error("Some emails need attention. Their records remain saved.");
      else toast.success(`${r.sent || 0} email(s) accepted by SMTP.`);
      setConfirm(false);
      await load();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not complete this action.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="panel-heading">
        <h2>Email automation</h2>
        <p>
          Project and contact messages reach your Gmail inbox. Customer replies,
          newsletter confirmation and daily reports use the same account.
        </p>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!state ? (
        <p className="empty-message">Opening email status…</p>
      ) : (
        <div className="studio-settings-form">
          <p>
            <strong>Sender & inbox:</strong> KITTY CORP · {state.recipient}
          </p>
          <p role="status">
            {state.configured
              ? "Gmail credential is configured. Use the test button to check SMTP acceptance."
              : "Setup pending: save SMTP_APP_PASSWORD (or GMAIL_APP_PASSWORD) privately in Vercel, then redeploy. Use an app password, not your Gmail login password."}
          </p>
          <fieldset>
            <legend>Sending & recovery</legend>
            <p>
              {state.queue.pending} pending · {state.queue.sending} processing ·{" "}
              {state.queue.sent} accepted by SMTP
            </p>
            <p>
              {state.queue.failed} failed · {state.queue.uncertain} uncertain
              outcomes
            </p>
            <div className="email-alert-actions">
              <button
                className="button button-gold"
                disabled={busy || !state.configured}
                onClick={() => void act("test")}
              >
                Send test to KITTY CORP
              </button>
              <button
                className="button button-outline"
                disabled={busy || !state.configured}
                onClick={() => void act("retry")}
              >
                Retry failed & pending
              </button>
              <button
                className="text-link"
                disabled={busy}
                onClick={() =>
                  void load().catch(() =>
                    setError("Could not refresh email status."),
                  )
                }
              >
                Refresh status
              </button>
            </div>
            {state.queue.uncertain > 0 && (
              <>
                <p>
                  An uncertain send may already be in Sent mail. These messages
                  are held instead of being resent automatically.
                </p>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={confirm}
                    onChange={(e) => setConfirm(e.target.checked)}
                  />
                  I checked Sent mail and understand a resend may duplicate a
                  message.
                </label>
                <button
                  className="button button-outline"
                  disabled={busy || !confirm || !state.configured}
                  onClick={() => void act("retry-uncertain")}
                >
                  Retry uncertain messages
                </button>
              </>
            )}
          </fieldset>
          <fieldset>
            <legend>Daily report & newsletter</legend>
            <p>
              {state.cronConfigured
                ? "Cron secret is configured."
                : "Daily scheduling needs a private CRON_SECRET in Vercel and a redeploy."}{" "}
              Target: 8:30 PM IST. On Hobby, it may run later within the hour.
            </p>
            <p>Last accepted report: {when(state.queue.last_report)}</p>
            <p>
              {state.queue.active_subscribers} confirmed active ·{" "}
              {state.queue.pending_subscribers} awaiting confirmation ·{" "}
              {state.queue.legacy_subscribers} preserved legacy entries
            </p>
            <button
              className="button button-outline"
              disabled={busy || !state.configured}
              onClick={() => void act("report")}
            >
              Run daily report & recovery now
            </button>
          </fieldset>
          <fieldset>
            <legend>Safe storage cleanup</legend>
            <p>
              Minimum retention: {state.retentionHours} hours after submission.
              Required emails and the daily report must be accepted before
              temporary records can be removed.
            </p>
            <p>
              Project quotes, payments, customer accounts, reviews and active
              subscribers are protected. Historical records are not
              automatically removed.
            </p>
            <p>
              Last cleanup: {when(state.queue.last_cleanup)} ·{" "}
              {state.queue.last_cleanup_count} eligible submissions removed
            </p>
            <p>
              Database size:{" "}
              {(state.queue.database_bytes / 1024 / 1024).toFixed(2)} MiB
              (actual PostgreSQL database, including indexes and metadata).
            </p>
            <button
              className="button button-outline"
              disabled={busy}
              onClick={() => void act("cleanup-preview")}
            >
              Preview eligible cleanup
            </button>
            {preview !== null && (
              <p role="status">
                {preview} temporary submission(s) currently meet the cleanup
                conditions. This preview deletes nothing.
              </p>
            )}
          </fieldset>
          {state.queue.recent_activity.length > 0 && (
            <fieldset>
              <legend>Recent business activity</legend>
              {state.queue.recent_activity.map((e, i) => (
                <p key={i}>
                  {e.kind.replaceAll("_", " ")} · {when(e.occurred_at)}
                </p>
              ))}
              <p>
                Full messages and reviews remain in the existing Studio inbox.
              </p>
            </fieldset>
          )}
          <p>
            SMTP acceptance does not guarantee inbox delivery. Limits and
            backoff protect Gmail; no mass marketing campaigns are sent.
          </p>
        </div>
      )}
    </>
  );
}

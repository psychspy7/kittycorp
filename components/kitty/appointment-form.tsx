"use client";

import { useEffect, useRef, useState } from "react";
import { Turnstile } from "./turnstile";

export function AppointmentForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const day = String(form.get("day") || "");
    const time = String(form.get("time") || "");
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const topic = String(form.get("topic") || "").trim();
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{2}:\d{2}$/.test(time) || new Date(`${day}T${time}`).getTime() < Date.now() + 3600000) {
      setError("Choose a future date and time at least an hour from now."); return;
    }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "message", subject: "Appointment request", name, email,
          message: `Preferred time: ${day} at ${time} (${zone})\nConversation topic: ${topic}\nThis is a request; the time is not confirmed until KITTY CORP replies.`,
          website: String(form.get("website") || ""), startedAt: startedAt.current, turnstileToken,
        }),
      });
      const result = await response.json() as { error?: string; id?: string };
      if (!response.ok) throw Error(result.error || "Could not send the appointment request.");
      setReference(result.id ? `A-${result.id.slice(0, 8).toUpperCase()}` : "Check your email");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send the appointment request.");
    } finally {
      setBusy(false); setTurnstileToken(""); setVerificationAttempt(value => value + 1);
    }
  }

  if (reference) return <div className="appointment-success" role="status"><span className="eyebrow">REQUEST SENT</span><h2>We’ll confirm by email.</h2><p>Your reference is <strong>{reference}</strong>. Please keep the preferred time free until we reply; it is not booked yet.</p></div>;
  return <form className="appointment-form" onSubmit={submit}>
    <div className="project-form-grid">
      <div className="form-field"><label htmlFor="appointment-name">Your name</label><input id="appointment-name" name="name" required minLength={2} maxLength={100} autoComplete="name"/></div>
      <div className="form-field"><label htmlFor="appointment-email">Email address</label><input id="appointment-email" name="email" type="email" required maxLength={254} autoComplete="email"/></div>
      <div className="form-field"><label htmlFor="appointment-day">Preferred date</label><input id="appointment-day" name="day" type="date" required/></div>
      <div className="form-field"><label htmlFor="appointment-time">Preferred time, your local time</label><input id="appointment-time" name="time" type="time" required/></div>
    </div>
    <div className="form-field"><label htmlFor="appointment-topic">What would you like to discuss?</label><textarea id="appointment-topic" name="topic" rows={5} required minLength={12} maxLength={900} placeholder="A website, AI workflow, application or something else?"/></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="appointment-website">Leave empty</label><input id="appointment-website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <Turnstile action="contact" onToken={setTurnstileToken} resetKey={verificationAttempt}/>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="appointment-submit"><p>Free to request. We’ll email you to confirm a time and meeting method.</p><button className="button button-gold" type="submit" disabled={busy}>{busy ? "Sending…" : "Request appointment"}</button></div>
  </form>;
}

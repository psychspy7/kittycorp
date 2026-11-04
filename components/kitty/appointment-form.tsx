"use client";

import { useEffect, useRef, useState } from "react";
import { Turnstile } from "./turnstile";
import { CheckCircle2, LoaderCircle } from "lucide-react";

export function AppointmentForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    // Mount timestamp initialized with 3-second lead so fast form submissions succeed
    startedAt.current = Date.now() - 3000;
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const day = String(form.get("day") || "").trim();
    const time = String(form.get("time") || "").trim();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const topic = String(form.get("topic") || "").trim();
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";

    if (!day || !time) {
      setError("Please choose a preferred date and time.");
      return;
    }

    // Robust local date parsing independent of browser engine quirks
    const dateParts = day.split("-").map(Number);
    const timeParts = time.split(":").map(Number);
    if (dateParts.length !== 3 || timeParts.length < 2 || dateParts.some(isNaN) || timeParts.some(isNaN)) {
      setError("Please enter a valid date and time.");
      return;
    }

    const selectedDateTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], 0);
    // Allow upcoming times today or in the future with 5 min grace window for client clock variation
    if (selectedDateTime.getTime() < Date.now() - 300000) {
      setError("Please choose an upcoming date and time.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "message",
          subject: `Appointment Request: ${name} (${day} ${time})`,
          name,
          email,
          message: `APPOINTMENT REQUEST\nClient Name: ${name}\nClient Email: ${email}\nPreferred Date: ${day}\nPreferred Time: ${time} (${zone})\nTopic: ${topic}\n\nSubmitted at: ${new Date().toISOString()}`,
          website: String(form.get("website") || ""),
          startedAt: startedAt.current || (Date.now() - 3000),
          turnstileToken,
        }),
      });

      const result = (await response.json()) as { error?: string; id?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not send the appointment request. Please try again.");
      }

      setReference(result.id ? `A-${result.id.slice(0, 8).toUpperCase()}` : `A-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send the appointment request.");
    } finally {
      setBusy(false);
      setTurnstileToken("");
      setVerificationAttempt((val) => val + 1);
    }
  }

  if (reference) {
    return (
      <div className="appointment-success" role="status">
        <span className="eyebrow"><CheckCircle2 size={16} /> REQUEST CONFIRMED</span>
        <h2>We’ll confirm by email.</h2>
        <p>Your appointment reference is <strong>{reference}</strong>. We have received your preferred date and time and our team will reply shortly to confirm the calendar invite.</p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form className="appointment-form" onSubmit={submit}>
      <div className="project-form-grid">
        <div className="form-field">
          <label htmlFor="appointment-name">Your name</label>
          <input id="appointment-name" name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" />
        </div>
        <div className="form-field">
          <label htmlFor="appointment-email">Email address</label>
          <input id="appointment-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="name@domain.com" />
        </div>
        <div className="form-field">
          <label htmlFor="appointment-day">Preferred date</label>
          <input id="appointment-day" name="day" type="date" required min={todayStr} />
        </div>
        <div className="form-field">
          <label htmlFor="appointment-time">Preferred time (local time)</label>
          <input id="appointment-time" name="time" type="time" required />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="appointment-topic">What would you like to discuss?</label>
        <textarea id="appointment-topic" name="topic" rows={4} required minLength={3} maxLength={900} placeholder="A website, AI workflow, application, robotics or something else?" />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="appointment-website">Leave empty</label>
        <input id="appointment-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Turnstile action="contact" onToken={setTurnstileToken} resetKey={verificationAttempt} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="appointment-submit">
        <p>Free consultation. We’ll email you to confirm the time and meeting details.</p>
        <button className="button button-gold" type="submit" disabled={busy}>
          {busy ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Sending… <LoaderCircle size={16} className="animate-spin" />
            </span>
          ) : (
            "Request appointment"
          )}
        </button>
      </div>
    </form>
  );
}

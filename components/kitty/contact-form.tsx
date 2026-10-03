"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { feedbackSchema } from "@/lib/kitty-validation";

export function ContactForm({ subject = "" }: { subject?: string }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: subject ? `I’d love to hear more about ${subject}. ` : "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const startedAt = useRef(Date.now());
  const trap = useRef<HTMLInputElement>(null);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const payload = {
      ...values,
      website: trap.current?.value || "",
      startedAt: startedAt.current,
    };
    const valid = feedbackSchema.safeParse(payload);
    if (!valid.success) {
      setError(valid.error.issues[0]?.message || "Please check your entries.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok)
        throw new Error(
          data.error || "Couldn’t send your message. Please try again.",
        );
      setSent(true);
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn’t send your message. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (sent)
    return (
      <div className="contact-success" role="status">
        <span className="success-circle">
          <Check size={28} />
        </span>
        <h2>Your message is with us.</h2>
        <p>
          Thanks for taking the time. We’ll read your message and get back to
          you when we can.
        </p>
        <button
          className="button button-outline"
          onClick={() => {
            setSent(false);
            startedAt.current = Date.now();
          }}
        >
          Send another message <ArrowUpRight size={17} />
        </button>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-heading">
        <h2>Tell us what’s on your mind.</h2>
        <span>01 — START A CONVERSATION</span>
      </div>
      <div className="form-field">
        <label htmlFor="contact-name">Your name</label>
        <input
          id="contact-name"
          name="name"
          placeholder="What should we call you?"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email address</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          maxLength={254}
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="An idea, some feedback, a question. I’m listening."
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
        />
        <span className="field-count">{values.message.length} / 5,000</span>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input
          ref={trap}
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-submit-row">
        <p>
          Your message goes straight to me.
          <br />
          I’ll only use your email to reply.
        </p>
        <button className="button button-gold" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send message"}
          {busy ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <ArrowUpRight size={18} />
          )}
        </button>
      </div>
    </form>
  );
}

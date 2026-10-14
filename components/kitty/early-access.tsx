"use client";
import { useState } from "react";
import Link from "next/link";
import { Turnstile } from "./turnstile";
export function EarlyAccess() {
  const [startedAt] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "success">("idle");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          interests: form.getAll("interests"),
          website: form.get("website"),
          startedAt,
          turnstileToken,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok)
        throw Error(
          data.error || "Couldn’t save your email. Please try again.",
        );
      setState("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
      setTurnstileToken("");
      setVerificationAttempt((value) => value + 1);
    }
  }
  return (
    <section id="early-access" className="early-access wrap">
      <div>
        <span className="eyebrow">THE EARLY LIST</span>
        <h2>
          Follow what
          <br />
          we’re building.
        </h2>
        <p>
          Join for product updates and opportunities to test future KITTY
          releases.
        </p>
      </div>
      <div className="early-form-area">
        {state === "success" ? (
          <div className="early-success" role="status">
            <span className="micro-label">CHECK YOUR EMAIL</span>
            <h3>One quick confirmation.</h3>
            <p>
              If this address is eligible, we’ll send a confirmation link. Click
              it to join the list. Joining doesn’t guarantee a testing place or
              a launch date.
            </p>
            <Link href="/build-log" className="text-link">
              Read the build log
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="early-email">Your email</label>
            <div className="early-email-row">
              <input
                id="early-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                maxLength={254}
              />
              <button className="button button-gold" disabled={busy}>
                {busy ? "Joining…" : "Join early access"}
              </button>
            </div>
            <fieldset>
              <legend>
                I’m interested in <span>(optional)</span>
              </legend>
              {[
                "KITTY AI",
                "KITTY Sentinel",
                "LISA AI",
                "KITTY CORP updates",
              ].map((name) => (
                <label key={name} className="interest-choice">
                  <input type="checkbox" name="interests" value={name} />
                  {name}
                </label>
              ))}
            </fieldset>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="early-website">Website</label>
              <input
                id="early-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <Turnstile
              action="early-access"
              onToken={setTurnstileToken}
              resetKey={verificationAttempt}
            />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="privacy-note">
              Product news and testing invitations from KITTY CORP. No
              advertising list.{" "}
              <Link href="/privacy">How we use your email</Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

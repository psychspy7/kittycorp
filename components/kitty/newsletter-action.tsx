"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export function NewsletterAction({
  action,
}: {
  action: "confirm" | "unsubscribe";
}) {
  const [token, setToken] = useState(""),
    [ready, setReady] = useState(false),
    [done, setDone] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) {
        setToken(window.location.hash.slice(1));
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  async function submit() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/newsletter/" + action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = (await r.json()) as { error?: string };
      if (!r.ok) throw Error(data.error || "Please try again.");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-heading">
      <span className="eyebrow">KITTY CORP / EMAIL UPDATES</span>
      <h1>
        {done
          ? action === "confirm"
            ? "You’re on the list."
            : "You’re unsubscribed."
          : action === "confirm"
            ? "One quick confirmation."
            : "Choose what reaches your inbox."}
      </h1>
      <p>
        {done
          ? action === "confirm"
            ? "Thanks for joining us. We’ll share product launches and development updates when there’s something to tell you."
            : "You won’t receive newsletter updates. Project and payment messages remain separate."
          : action === "confirm"
            ? "Confirm that you’d like occasional KITTY CORP product and development updates."
            : "You can leave the KITTY CORP newsletter here. Your product account and project requests are unaffected."}
      </p>
      {ready && !token && !done && (
        <p role="alert">
          Open the complete link from your email. It includes your private
          confirmation code.
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!done && (
        <button
          className="button button-gold"
          disabled={busy || !token}
          onClick={() => void submit()}
        >
          {busy
            ? "Updating…"
            : action === "confirm"
              ? "Confirm my email"
              : "Unsubscribe"}
        </button>
      )}
      {done && (
        <Link className="button button-outline" href="/">
          Back to KITTY CORP →
        </Link>
      )}
    </div>
  );
}

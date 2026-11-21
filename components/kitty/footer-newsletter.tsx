"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Turnstile } from "./turnstile";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [startedAt] = useState(() => Date.now() - 3000);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setMessage("Please complete the Cloudflare security verification below before subscribing.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          interests: ["KITTY CORP updates"],
          website: "",
          startedAt: startedAt || Date.now() - 3000,
          turnstileToken,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Subscription could not be completed. Please try again.");
      }

      setStatus("success");
      setMessage("Subscribed. Thank you for following KITTY CORP updates.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Subscription failed. Please try again.");
    } finally {
      setTurnstileToken("");
      setVerificationAttempt((attempt) => attempt + 1);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-white/10 border border-white/25 text-sm text-white shadow-sm">
        <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
        <span className="font-medium text-white">{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Enter your email for updates"
          required
          disabled={status === "loading"}
          aria-label="Email address for research and project updates"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[14px] text-white placeholder-[#D1D5DB] focus:outline-none focus:border-[#2457D6] focus:bg-white/15 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2457D6] hover:bg-[#1D46B0] active:scale-[0.98] text-white text-[14px] font-semibold transition-all shadow-[0_2px_10px_rgba(36,87,214,0.3)] shrink-0 cursor-pointer disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing..." : (
            <>
              <span className="text-white">Subscribe</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
        </button>
      </div>

      {/* Cloudflare Turnstile Verification */}
      <div className="pt-2 min-h-[65px]">
        <Turnstile
          siteKey="0x4AAAAAAGLsBpxKM1tCKvOx"
          action="early-access"
          appearance="always"
          theme="dark"
          onToken={(token) => {
            setTurnstileToken(token);
            if (status === "error" && message.includes("security")) {
              setStatus("idle");
              setMessage("");
            }
          }}
          resetKey={verificationAttempt}
        />
      </div>

      {status === "error" && (
        <p className="text-[12px] text-[#FCA5A5] font-medium bg-red-950/40 border border-red-500/30 px-3 py-2 rounded-lg" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}

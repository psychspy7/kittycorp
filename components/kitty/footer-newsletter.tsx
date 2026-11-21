"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [startedAt] = useState(() => Date.now() - 3000);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
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
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white">
        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for updates"
          required
          disabled={status === "loading"}
          aria-label="Email for research and project updates"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-[#73777C] focus:outline-none focus:border-[#2457D6] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#2457D6] hover:bg-[#1D46B0] text-white text-xs font-medium transition-colors shrink-0 disabled:opacity-50"
        >
          {status === "loading" ? "..." : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      {status === "error" && (
        <p className="text-[11px] text-red-400 mt-1" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}

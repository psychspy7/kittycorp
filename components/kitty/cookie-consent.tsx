"use client";

import { updateAnalyticsConsent } from "@/lib/site-analytics";
import { useSyncExternalStore, useState } from "react";
import { Shield, X } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  try {
    return localStorage.getItem("kitty_cookie_consent_choice");
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return null;
}

export function CookieConsent() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [closed, setClosed] = useState(false);

  function saveChoice(value: "all" | "essential") {
    try {
      localStorage.setItem("kitty_cookie_consent_choice", value);
      window.dispatchEvent(new Event("storage"));
      updateAnalyticsConsent(value === "all");
    } catch {
      // safe fallback
    }
  }

  // Minimized badge
  if (choice || closed) {
    return (
      <button
        type="button"
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7]/95 backdrop-blur-sm text-[11px] font-mono text-[#62676D] hover:text-[#191B1D] hover:border-[#73777C] transition-all shadow-sm"
        onClick={() => {
          try {
            localStorage.removeItem("kitty_cookie_consent_choice");
            window.dispatchEvent(new Event("storage"));
          } catch {}
          setClosed(false);
        }}
        aria-label="Manage privacy preferences"
      >
        <Shield size={12} className="text-[#2457D6]" />
        <span>Privacy</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Privacy & cookie preferences"
      className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-[#191B1D]"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#2457D6]" />
          <span className="font-mono text-xs uppercase tracking-wider font-medium text-[#191B1D]">
            Privacy &amp; Telemetry
          </span>
        </div>
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="text-[#73777C] hover:text-[#191B1D] p-1 rounded transition-colors"
          aria-label="Dismiss privacy banner"
        >
          <X size={14} />
        </button>
      </div>

      <p className="text-xs text-[#62676D] leading-relaxed mb-4">
        We use essential cookies to maintain secure sessions and privacy-preserving site telemetry.
      </p>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => saveChoice("all")}
          className="px-4 py-2 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-xs font-medium transition-colors shadow-sm"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => saveChoice("essential")}
          className="px-4 py-2 rounded-full border border-[#D9D6CF] bg-[#E9E6E0] hover:bg-[#D9D6CF] text-[#191B1D] text-xs font-medium transition-colors"
        >
          Essential Only
        </button>
      </div>
    </aside>
  );
}

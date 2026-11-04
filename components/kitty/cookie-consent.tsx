"use client";

import { useSyncExternalStore, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

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
    } catch {
      // safe fallback
    }
  }

  // If already chosen or dismissed, show the cute minimized paw badge
  if (choice || closed) {
    return (
      <button
        type="button"
        className="kitty-cookie-tab-minimized"
        onClick={() => {
          try {
            localStorage.removeItem("kitty_cookie_consent_choice");
            window.dispatchEvent(new Event("storage"));
          } catch {
            // safe
          }
          setClosed(false);
        }}
        aria-label="Manage cookie and privacy settings"
        title="Cookie preferences 🐾"
      >
        <span className="kitty-paw-icon" aria-hidden="true">🐾</span>
        <span className="kitty-cookie-label">Cookies</span>
      </button>
    );
  }

  return (
    <aside className="kitty-cookie-card" role="region" aria-label="Cookie consent">
      <div className="kitty-cookie-header">
        <div className="kitty-cookie-title">
          <span className="kitty-paw-badge" aria-hidden="true">🐾</span>
          <strong>Cookie &amp; Experience Controls</strong>
        </div>
        <button
          type="button"
          className="kitty-cookie-close"
          onClick={() => setClosed(true)}
          aria-label="Minimize cookie preferences"
        >
          <X size={15} />
        </button>
      </div>

      <p className="kitty-cookie-desc">
        We use essential cookies to secure your sign-in, save dark mode preferences, and ensure optimal WebGL2 physical simulation rendering.
      </p>

      <div className="kitty-cookie-actions">
        <button
          type="button"
          className="button button-gold kitty-cookie-accept"
          onClick={() => saveChoice("all")}
        >
          <span>Allow Cookies 🐾</span>
        </button>
        <button
          type="button"
          className="button button-outline kitty-cookie-essential"
          onClick={() => saveChoice("essential")}
        >
          <ShieldCheck size={14} />
          <span>Essential Only</span>
        </button>
      </div>
    </aside>
  );
}

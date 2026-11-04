"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, LoaderCircle, Sparkles, X, Zap } from "lucide-react";
import type { User } from "firebase/auth";

export function SubscriptionModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    let alive = true;
    void import("@/lib/kitty-customer").then(async lib => {
      const auth = await lib.kittyCustomerAuth();
      if (!alive) return;
      lib.onAuthStateChanged(auth, u => {
        if (alive) setUser(u);
      });
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    // Only display once per session so returning visitors aren't interrupted repeatedly
    try {
      const alreadySeen = sessionStorage.getItem("kitty_subscription_modal_dismissed");
      if (!alreadySeen) {
        const timer = setTimeout(() => {
          setOpen(true);
        }, 1400);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case private browsing blocks sessionStorage
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      sessionStorage.setItem("kitty_subscription_modal_dismissed", "true");
    } catch {
      // fallback safe
    }
  }

  async function handleChooseKittyOne() {
    setSigningIn(true);
    setLoginError("");
    try {
      if (!user) {
        const lib = await import("@/lib/kitty-customer");
        const auth = await lib.kittyCustomerAuth();
        await lib.signInWithPopup(auth, new lib.GoogleAuthProvider());
      }
      dismiss();
      router.push("/payments?purpose=subscription&plan=kitty-one");
    } catch {
      setSigningIn(false);
      setLoginError("Google sign-in is required to register your KITTY One plan. Please try again.");
    }
  }

  if (!open) return null;

  return (
    <div className="subscription-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="sub-modal-title">
      <div className="subscription-modal-overlay" onClick={dismiss} />
      <div className="subscription-modal-container">
        {/* Animated Lightning Accent Border & Glow */}
        <div className="subscription-lightning-border" aria-hidden="true" />
        
        <button
          className="subscription-modal-close"
          onClick={dismiss}
          aria-label="Close subscription announcement"
        >
          <X size={18} />
        </button>

        <div className="subscription-modal-content">
          <div className="subscription-modal-badge">
            <Zap size={14} className="subscription-zap-icon" />
            <span>KITTY ONE · $199 USD ALL-ACCESS</span>
          </div>

          <h2 id="sub-modal-title">
            One subscription.<br />
            <span>Websites &amp; Intelligent AI.</span>
          </h2>

          <p className="subscription-modal-intro">
            Elevate your company with <strong>KITTY One ($199 USD)</strong>: tailored full-stack engineering, complete AI products, and continuous support.
          </p>

          <div className="subscription-modal-features">
            <div className="subscription-feature-item">
              <div className="feature-icon-wrap">
                <Check size={16} />
              </div>
              <div>
                <strong>1 Premium Website + 1 Basic Website</strong>
                <p>Custom full-stack architecture for your brand plus a sleek responsive microsite.</p>
              </div>
            </div>

            <div className="subscription-feature-item">
              <div className="feature-icon-wrap">
                <Sparkles size={16} />
              </div>
              <div>
                <strong>KITTY AI Products &amp; Future Updates</strong>
                <p>Full suite of intelligent companion &amp; workflow tools with continuous platform upgrades.</p>
              </div>
            </div>

            <div className="subscription-feature-item">
              <div className="feature-icon-wrap">
                <Check size={16} />
              </div>
              <div>
                <strong>6 Months Free Maintenance</strong>
                <p>Dedicated technical upkeep, routine performance tuning, and direct founder support.</p>
              </div>
            </div>
          </div>

          <div className="subscription-modal-actions">
            <button
              type="button"
              className="button button-gold subscription-cta-button"
              disabled={signingIn}
              onClick={() => void handleChooseKittyOne()}
            >
              {signingIn && <LoaderCircle size={17} className="checkout-spinner" aria-hidden="true" />}
              <span>{signingIn ? "Connecting Google…" : user ? "Choose Kitty One ($199 USD)" : "Sign in & Choose Kitty One ($199)"}</span>
              <ArrowUpRight size={17} />
            </button>
            {loginError && <p className="form-error" role="alert" style={{ fontSize: "0.825rem", marginTop: "0.5rem" }}>{loginError}</p>}
            <button
              type="button"
              className="subscription-dismiss-text"
              onClick={dismiss}
            >
              Explore website first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles, X, Zap } from "lucide-react";

export function SubscriptionModal() {
  const [open, setOpen] = useState(false);

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
            <Link
              href="/memberships"
              className="button button-gold subscription-cta-button"
              onClick={dismiss}
            >
              <span>Explore Kitty One ($199 USD)</span>
              <ArrowUpRight size={17} />
            </Link>
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

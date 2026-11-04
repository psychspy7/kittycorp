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
            <span>KITTY ALL-ACCESS SUBSCRIPTION</span>
          </div>

          <h2 id="sub-modal-title">
            One subscription.<br />
            <span>Websites &amp; Intelligent AI.</span>
          </h2>

          <p className="subscription-modal-intro">
            Elevate your company with continuous digital execution and instant intelligence.
          </p>

          <div className="subscription-modal-features">
            <div className="subscription-feature-item">
              <div className="feature-icon-wrap">
                <Check size={16} />
              </div>
              <div>
                <strong>Tailored Business Websites</strong>
                <p>Modern high-speed websites, automated inquiry routing, and ongoing maintenance.</p>
              </div>
            </div>

            <div className="subscription-feature-item">
              <div className="feature-icon-wrap">
                <Sparkles size={16} />
              </div>
              <div>
                <strong>KITTY AI Companion &amp; Workflows</strong>
                <p>Always-on conversational AI friend, task automation, and intelligence tools.</p>
              </div>
            </div>
          </div>

          <div className="subscription-modal-actions">
            <Link
              href="/memberships"
              className="button button-gold subscription-cta-button"
              onClick={dismiss}
            >
              <span>Explore Kitty Subscription</span>
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

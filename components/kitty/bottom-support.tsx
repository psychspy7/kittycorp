"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, ShieldCheck, Sparkles } from "lucide-react";

const QUICK_AMOUNTS = [100, 500, 1000, 2500, 5000];

export function BottomSupport() {
  const [amount, setAmount] = useState<string>("500");
  const [custom, setCustom] = useState(false);

  const parsedAmount = Math.max(1, parseInt(amount, 10) || 100);

  return (
    <section id="support-kitty" className="bottom-support-section wrap" aria-labelledby="support-kitty-heading">
      <div className="bottom-support-card">
        <div className="bottom-support-header">
          <span className="eyebrow">
            <Heart size={14} className="text-cyan-400" />
            VOLUNTARY SUPPORT &amp; LAB RESEARCH
          </span>
          <h2 id="support-kitty-heading">
            Fuel the independent experiments.
          </h2>
          <p>
            Help fund our robotics prototyping, autonomous agricultural rover exploration, and open software initiatives. Choose any amount that works for you.
          </p>
        </div>

        <div className="bottom-support-form">
          <div className="quick-amount-chips" role="group" aria-label="Preset support amounts">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                className={`quick-amount-chip ${amount === String(val) && !custom ? "is-selected" : ""}`}
                onClick={() => {
                  setAmount(String(val));
                  setCustom(false);
                }}
              >
                ₹{val.toLocaleString("en-IN")}
              </button>
            ))}
            <button
              type="button"
              className={`quick-amount-chip ${custom ? "is-selected" : ""}`}
              onClick={() => setCustom(true)}
            >
              Custom
            </button>
          </div>

          <div className="custom-amount-input-group">
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                min="10"
                max="1000000"
                step="10"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setCustom(true);
                }}
                aria-label="Enter desired support amount in INR"
                placeholder="Enter amount"
              />
              <span className="currency-code">INR</span>
            </div>

            <Link
              href={`/payments?purpose=donation&amount=${parsedAmount}`}
              className="button button-gold support-submit-btn"
            >
              <span>Support ₹{parsedAmount.toLocaleString("en-IN")}</span>
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="bottom-support-footer-info">
            <span>
              <ShieldCheck size={14} />
              Encrypted Razorpay, UPI, &amp; card clearing
            </span>
            <span>
              <Sparkles size={14} />
              100% directed towards hardware &amp; research
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

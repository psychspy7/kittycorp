"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Heart, ShieldCheck, Sparkles } from "lucide-react";

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export function BottomSupport() {
  const [amount, setAmount] = useState<string>("1000");
  const [custom, setCustom] = useState(false);

  const parsedAmount = Math.max(10, parseInt(amount, 10) || 1000);

  return (
    <div id="support-kitty" className="w-full" aria-labelledby="support-kitty-heading">
      <div className="flex flex-col gap-6">
        <div>
          <h3 id="support-kitty-heading" className="text-xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-1">
            Custom contribution amount
          </h3>
          <p className="text-sm text-[#62676D] font-light">
            Choose a preset or type any custom amount in INR. All contributions directly support physical hardware prototyping.
          </p>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Preset support amounts">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              className={`px-4 py-2 rounded-full border text-xs font-mono transition-all ${
                amount === String(val) && !custom
                  ? "bg-[#2457D6] text-white border-[#2457D6] shadow-sm font-semibold"
                  : "bg-[#FBFAF7] text-[#292D31] border-[#D9D6CF] hover:border-[#2457D6]"
              }`}
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
            className={`px-4 py-2 rounded-full border text-xs font-mono transition-all ${
              custom
                ? "bg-[#2457D6] text-white border-[#2457D6] shadow-sm font-semibold"
                : "bg-[#FBFAF7] text-[#292D31] border-[#D9D6CF] hover:border-[#2457D6]"
            }`}
            onClick={() => setCustom(true)}
          >
            Custom
          </button>
        </div>

        {/* Amount Input & Submit Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-4 text-[#73777C] font-mono text-base font-medium select-none pointer-events-none">
              ₹
            </span>
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
              className="w-full pl-8 pr-16 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[#191B1D] font-mono text-base focus:border-[#2457D6] focus:ring-2 focus:ring-[#2457D6]/20 transition-all outline-none"
            />
            <span className="absolute right-4 text-xs font-mono text-[#73777C] uppercase select-none pointer-events-none">
              INR
            </span>
          </div>

          <Link
            href={`/payments?purpose=donation&amount=${parsedAmount}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)] shrink-0 group"
          >
            <span>Proceed to Support ₹{parsedAmount.toLocaleString("en-IN")}</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Security / Allocation Disclosures */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#73777C]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2457D6]" />
            Encrypted Razorpay checkout (UPI, Cards, NetBanking)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#2457D6]" />
            100% directly allocated to lab hardware &amp; research
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeSession(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem("kc_brand_revealed") === "1";
  } catch {
    return false;
  }
}

export function BrandRevealLoader() {
  const isReducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
  const alreadyRevealed = useSyncExternalStore(subscribeSession, getSessionSnapshot, () => false);
  const [mounted, setMounted] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isUnmasking, setIsUnmasking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (alreadyRevealed || isReducedMotion) {
      return;
    }

    const t = setTimeout(() => {
      setMounted(true);
      document.body.style.overflow = "hidden";
    }, 0);

    const duration = 1250; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentVal = Math.round(progress * 100);
      setCounter(currentVal);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setIsUnmasking(true);
        setTimeout(() => {
          setIsDismissed(true);
          document.body.style.overflow = "";
          try {
            sessionStorage.setItem("kc_brand_revealed", "1");
          } catch {
            // Storage access safety
          }
        }, 650);
      }
    };

    const animId = requestAnimationFrame(frame);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(animId);
      document.body.style.overflow = "";
    };
  }, [alreadyRevealed, isReducedMotion]);

  if (alreadyRevealed || isReducedMotion || isDismissed) {
    return null;
  }

  if (!mounted) {
    return (
      <div
        className="brand-loader fixed inset-0 z-[100] bg-[#050506] flex flex-col items-center justify-center pointer-events-auto"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-6">
          <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-[0.35em] text-[#f8f8f9] uppercase font-normal">
            KITTY CORP
          </span>
          <div className="font-mono text-xs text-[#a1a1aa] tracking-[0.25em]">000%</div>
        </div>
      </div>
    );
  }

  const formattedCounter = String(counter).padStart(3, "0") + "%";

  return (
    <div
      className={`brand-loader fixed inset-0 z-[100] bg-[#050506] flex flex-col items-center justify-between p-8 sm:p-14 select-none pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isUnmasking ? "-translate-y-full opacity-90" : "translate-y-0 opacity-100"
      }`}
      aria-label="Loading KITTY CORP"
      role="status"
    >
      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-[#71717a] uppercase">
        <span className="text-[#c5a880]">KITTY CORP — AI ROBOTICS</span>
        <span className="hidden sm:inline">PHYSICAL-WORLD INTELLIGENCE</span>
        <span>INITIALIZING</span>
      </div>

      {/* Centerpiece: Liminal-Inspired Brand Wordmark & Hairline Progress */}
      <div className="flex flex-col items-center gap-7 my-auto">
        <div className="overflow-hidden">
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl lg:text-6xl tracking-[0.32em] text-[#f8f8f9] font-normal uppercase transition-transform duration-700 transform translate-y-0">
            KITTY CORP
          </h1>
        </div>

        <div className="flex items-center gap-4 w-56 sm:w-72 max-w-[85vw]">
          <div className="h-[1px] flex-1 bg-white/[0.08] relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#c5a880] transition-all duration-75 ease-out"
              style={{ width: `${counter}%` }}
            />
          </div>
          <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-[#a1a1aa] font-medium w-12 text-right">
            {formattedCounter}
          </span>
        </div>
      </div>

      {/* Bottom Status Row */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-[#71717a] uppercase">
        <span>R&amp;D VENTURE · 2026</span>
        <span className="text-[#a1a1aa]">SYSTEMS NOMINAL</span>
      </div>
    </div>
  );
}

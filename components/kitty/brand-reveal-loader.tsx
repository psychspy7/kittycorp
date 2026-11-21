"use client";

import { useEffect, useState } from "react";

export function BrandRevealLoader() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only trigger on first session load to keep experience fast and respectful
    try {
      if (typeof window !== "undefined") {
        if (sessionStorage.getItem("kc_brand_revealed")) {
          return;
        }
        sessionStorage.setItem("kc_brand_revealed", "true");
        const showTimer = setTimeout(() => {
          setVisible(true);
        }, 0);

        const fadeTimer = setTimeout(() => {
          setFading(true);
        }, 320);

        const removeTimer = setTimeout(() => {
          setVisible(false);
        }, 580);

        return () => {
          clearTimeout(showTimer);
          clearTimeout(fadeTimer);
          clearTimeout(removeTimer);
        };
      }
    } catch {
      // Fallback silently if storage unavailable
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] pointer-events-none transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Precision Hairline Progress Sweep */}
      <div className="h-[2px] w-full bg-transparent overflow-hidden">
        <div className="h-full bg-[#2457D6] animate-brand-progress shadow-[0_0_8px_rgba(36,87,214,0.6)]" />
      </div>
    </div>
  );
}

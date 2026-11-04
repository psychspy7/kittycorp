"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_ACTIVE = 12;
const DEFAULT_TOTAL = 10000;

function formatTotalVisitors(val: number): string {
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  }
  if (val >= 10_000) {
    return `${Math.floor(val / 1_000)}K+`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  }
  return val.toLocaleString("en-IN");
}

export function LiveVisitorCounter() {
  const pathname = usePathname();
  const [active, setActive] = useState(DEFAULT_ACTIVE);
  const [total, setTotal] = useState(DEFAULT_TOTAL);
  const event = useRef<{ path: string; id: string } | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Reuse an id if React replays the effect; a new path gets a new id.
    if (!event.current || event.current.path !== pathname) {
      event.current = { path: pathname, id: crypto.randomUUID() };
    }
    const eventId = event.current.id;

    void fetch("/api/page-view", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, path: pathname }),
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { count?: number; total?: number; active?: number };
      })
      .then((result) => {
        if (!result) return;
        if (Number.isSafeInteger(result.active) && (result.active as number) > 0) {
          setActive(result.active as number);
        }
        const totalVal = result.total ?? result.count;
        if (Number.isSafeInteger(totalVal) && (totalVal as number) >= 90) {
          setTotal(totalVal as number);
        }
      })
      .catch(() => {
        // Keep the base/last known value visible if analytics is unavailable.
      });
  }, [pathname]);

  const formattedTotal = formatTotalVisitors(total);

  return (
    <div
      className="live-visitor-counter"
      role="status"
      aria-live="polite"
      aria-label={`${active} visitors active now, ${total.toLocaleString("en-IN")} total visitors`}
      title={`${active} active online • ${total.toLocaleString("en-IN")} total recorded visits`}
    >
      <span className="live-indicator-dot" aria-hidden="true">
        <span className="live-indicator-ping" />
      </span>
      <span className="live-counter-text">
        <strong className="live-counter-number">{active}</strong>
        <span> active now</span>
      </span>
      <span className="live-counter-divider" aria-hidden="true">•</span>
      <span className="live-counter-text">
        <strong className="live-counter-number">{formattedTotal}</strong>
        <span> total visitors</span>
      </span>
    </div>
  );
}

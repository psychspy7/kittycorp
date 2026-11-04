"use client";

import { useEffect, useRef, useState } from "react";

const BASE_VIEW_COUNT = 90;

export function LiveVisitorCounter() {
  const [count, setCount] = useState(BASE_VIEW_COUNT);
  const eventId = useRef<string | null>(null);

  useEffect(() => {
    // Reuse the same id if React replays the effect in development. The
    // database also enforces uniqueness, so network retries cannot double-count.
    eventId.current ??= crypto.randomUUID();

    void fetch("/api/page-view", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: eventId.current,
        path: window.location.pathname,
      }),
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { count?: number };
      })
      .then((result) => {
        if (result && Number.isSafeInteger(result.count) && (result.count as number) >= BASE_VIEW_COUNT) {
          setCount(result.count as number);
        }
      })
      .catch(() => {
        // Keep the base/last known value visible if analytics is unavailable.
      });
  }, []);

  return (
    <div
      className="live-visitor-counter"
      role="status"
      aria-live="polite"
      aria-label={count + " website views"}
    >
      <span className="live-indicator-dot" aria-hidden="true">
        <span className="live-indicator-ping" />
      </span>
      <span className="live-counter-text">
        <strong className="live-counter-number">{count.toLocaleString("en-IN")}</strong>
        <span> website views</span>
      </span>
    </div>
  );
}

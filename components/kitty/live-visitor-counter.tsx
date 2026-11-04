"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const BASE_VIEW_COUNT = 90;

export function LiveVisitorCounter() {
  const pathname = usePathname();
  const [count, setCount] = useState(BASE_VIEW_COUNT);
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
        return (await response.json()) as { count?: number };
      })
      .then((result) => {
        if (
          result &&
          Number.isSafeInteger(result.count) &&
          (result.count as number) >= BASE_VIEW_COUNT
        ) {
          setCount(result.count as number);
        }
      })
      .catch(() => {
        // Keep the base/last known value visible if analytics is unavailable.
      });
  }, [pathname]);

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

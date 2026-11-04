"use client";

import { useEffect, useSyncExternalStore } from "react";

let visitorCount = 94;
if (typeof window !== "undefined") {
  visitorCount = Math.floor(Math.random() * 7) + 93;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return visitorCount;
}

function getServerSnapshot() {
  return 94;
}

export function LiveVisitorCounter() {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 3) - 1;
      visitorCount = Math.max(90, Math.min(102, visitorCount + delta));
      listeners.forEach((fn) => fn());
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="live-visitor-counter"
      role="status"
      aria-live="polite"
      aria-label={`${count} active people on website right now`}
    >
      <span className="live-indicator-dot" aria-hidden="true">
        <span className="live-indicator-ping" />
      </span>
      <span className="live-counter-text">
        <strong className="live-counter-number">{count}</strong>
        <span> people on site right now</span>
      </span>
    </div>
  );
}

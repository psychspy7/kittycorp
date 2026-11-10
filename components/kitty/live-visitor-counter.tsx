"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const HEARTBEAT_INTERVAL_MS = 30_000; // 30-second heartbeat
const SESSION_STORAGE_KEY = "kc_session_id";
const DEVICE_STORAGE_KEY = "kc_device_id";

function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server-device";
  try {
    let did = window.localStorage.getItem(DEVICE_STORAGE_KEY);
    if (!did || did.length < 10) {
      did = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "kcd-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      window.localStorage.setItem(DEVICE_STORAGE_KEY, did);
    }
    return did;
  } catch {
    return "kcd-anonymous";
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  try {
    let sid = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid || sid.length < 10) {
      sid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "kc-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return "session-" + Math.random().toString(36).substring(2, 9);
  }
}

export function LiveVisitorCounter() {
  const pathname = usePathname();
  const [active, setActive] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const sessionIdRef = useRef<string>("");
  const deviceIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    deviceIdRef.current = getOrCreateDeviceId();
  }, []);

  useEffect(() => {
    if (!pathname) return;

    let isSubscribed = true;

    async function sendTelemetry(isHeartbeat = false) {
      if (!sessionIdRef.current) {
        sessionIdRef.current = getOrCreateSessionId();
      }
      if (!deviceIdRef.current) {
        deviceIdRef.current = getOrCreateDeviceId();
      }

      try {
        const response = await fetch("/api/telemetry", {
          method: "POST",
          credentials: "same-origin",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            deviceId: deviceIdRef.current,
            path: pathname,
            heartbeat: isHeartbeat,
          }),
        });

        if (!response.ok) return;

        const data = (await response.json()) as {
          active?: number;
          total?: number;
        };

        if (isSubscribed && data) {
          if (typeof data.active === "number" && Number.isSafeInteger(data.active)) {
            setActive(data.active);
          }
          if (typeof data.total === "number" && Number.isSafeInteger(data.total)) {
            setTotal(data.total);
          }
        }
      } catch {
        // Fallback silently without throwing to preserve UI stability
      }
    }

    // 1. Initial page load telemetry
    void sendTelemetry(false);

    // 2. 30-second active heartbeat
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        void sendTelemetry(true);
      }
    }, HEARTBEAT_INTERVAL_MS);

    // 3. Immediately refresh when tab switches back to visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void sendTelemetry(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  const activeDisplay = active !== null ? active.toLocaleString("en-IN") : "--";
  const totalDisplay = total !== null ? total.toLocaleString("en-IN") : "--";

  return (
    <div
      id="kc-live-telemetry"
      className="kc-telemetry-badge"
      role="status"
      aria-live="polite"
      aria-label={`${activeDisplay} visitors active now, ${totalDisplay} total visitors`}
      title={`${activeDisplay} active online • ${totalDisplay} total recorded visitors`}
    >
      <span className="kc-pulse-dot" aria-hidden="true" />
      <span id="kc-active-count">{activeDisplay}</span>
      <span className="kc-telemetry-label">active now</span>
      <span className="kc-telemetry-sep">•</span>
      <span id="kc-total-count">{totalDisplay}</span>
      <span className="kc-telemetry-label">total visitors</span>
    </div>
  );
}

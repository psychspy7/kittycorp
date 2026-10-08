"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recoveryPath } from "@/lib/maintenance";
export function MaintenanceWatcher() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || recoveryPath(pathname)) return;
    let active = true;
    let checking = false;
    async function check() {
      if (!active || checking || document.visibilityState !== "visible") return;
      checking = true;
      try {
        const response = await fetch("/api/site-status", {
          cache: "no-store", signal: AbortSignal.timeout(5000),
        });
        const data = await response.json() as { maintenance?: boolean };
        if (active && data.maintenance === true) window.location.reload();
      } catch { /* Retry on the next check. */ }
      finally { checking = false; }
    }
    const timer = window.setInterval(() => { void check(); }, 15000);
    const visible = () => { void check(); };
    document.addEventListener("visibilitychange", visible);
    return () => {
      active = false; window.clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [pathname]);
  return null;
}

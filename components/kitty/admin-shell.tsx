"use client";

import { useEffect, useState } from "react";
import { AdminDashboard, AdminLogin } from "./admin";

export function AdminShell() {
  const [session, setSession] = useState<boolean | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/health", { cache: "no-store" });
        if (active) {
          if (res.ok) {
            setSession(true);
          } else {
            setSession(false);
          }
        }
      } catch {
        if (active) {
          setSession(false);
          setUnavailable(true);
        }
      }
    }
    checkAuth();
    return () => {
      active = false;
    };
  }, []);

  if (session === true) {
    return <AdminDashboard />;
  }

  return <AdminLogin unavailable={unavailable} />;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { analyticsPublicPath, declineAnalytics, readAnalyticsChoice, saveAnalyticsChoice, subscribeAnalyticsChoice } from "@/lib/site-analytics";

export function CookieBanner({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeAnalyticsChoice, readAnalyticsChoice, () => null);
  const [reopened, setReopened] = useState(false);
  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener("kitty:cookie-settings", open);
    return () => window.removeEventListener("kitty:cookie-settings", open);
  }, []);
  if (!measurementId || !analyticsPublicPath(pathname) || (choice && !reopened)) return null;
  function choose(value: "accepted" | "declined") {
    if (value === "declined") declineAnalytics(measurementId);
    saveAnalyticsChoice(value);
    setReopened(false);
  }
  return <aside className="cookie-banner" aria-label="Cookie choices">
    <div className="cookie-kitty"><Image src="/brand/monogram-small-v1.webp" width={34} height={34} alt=""/></div>
    <div className="cookie-copy"><strong>A small note from KITTY.</strong><p>We use essential storage to run the site. May we also use analytics to learn which pages help? Your choice won’t affect the site.</p><Link href="/privacy#analytics">How we use data</Link></div>
    <div className="cookie-actions"><button className="button button-gold" type="button" onClick={() => choose("accepted")}>Allow analytics</button><button className="cookie-essential" type="button" onClick={() => choose("declined")}>Essential only</button></div>
  </aside>;
}

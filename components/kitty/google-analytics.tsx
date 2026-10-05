"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ANALYTICS_SETTINGS_EVENT, analyticsPublicPath, configureAnalytics, declineAnalytics,
  pauseAnalytics, readAnalyticsChoice, saveAnalyticsChoice, subscribeAnalyticsChoice,
  trackPageView, type AnalyticsChoice,
} from "@/lib/site-analytics";

export function AnalyticsSettingsButton({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <button className="analytics-settings-link" type="button" onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}>Analytics settings</button>;
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeAnalyticsChoice, readAnalyticsChoice, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tagReady, setTagReady] = useState(false);
  const configured = useRef(false);
  const previousPage = useRef("");
  const lastTracked = useRef("");
  const publicPage = analyticsPublicPath(pathname);
  const enabled = !!measurementId && publicPage && choice === "accepted";

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    const protectPrivateNavigation = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (link instanceof HTMLAnchorElement && link.origin === window.location.origin && !analyticsPublicPath(link.pathname) && measurementId) pauseAnalytics(measurementId);
    };
    window.addEventListener(ANALYTICS_SETTINGS_EVENT, open);
    document.addEventListener("click", protectPrivateNavigation, true);
    return () => {
      window.removeEventListener(ANALYTICS_SETTINGS_EVENT, open);
      document.removeEventListener("click", protectPrivateNavigation, true);
    };
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId) return;
    if (!enabled || !pathname) {
      pauseAnalytics(measurementId);
      lastTracked.current = "";
      return;
    }
    if (!configured.current) configured.current = configureAnalytics(measurementId, pathname);
    if (tagReady && lastTracked.current !== pathname) {
      // Configuration can be re-applied after a visitor opts back in.
      configureAnalytics(measurementId, pathname);
      trackPageView(measurementId, pathname, previousPage.current);
      previousPage.current = window.location.origin + pathname;
      lastTracked.current = pathname;
    }
  }, [enabled, measurementId, pathname, tagReady]);

  function choose(value: AnalyticsChoice) {
    if (value === "declined") declineAnalytics(measurementId);
    saveAnalyticsChoice(value);
    setSettingsOpen(false);
  }

  if (!measurementId || !publicPage) return null;
  return <>
    {enabled && <Script id="kitty-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" onReady={() => setTagReady(true)} />}
    {(choice === null || settingsOpen) && <section className="analytics-consent" aria-label="Analytics preferences">
      <div><strong>Help us understand what’s useful.</strong><p>Allow Google Analytics to measure visits to our public pages? Optional analytics stays off unless you choose to allow it. <Link href="/privacy#analytics">Privacy details</Link></p></div>
      <div className="analytics-consent-actions"><button type="button" className="button button-outline" onClick={() => choose("declined")}>No thanks</button><button type="button" className="button button-gold" onClick={() => choose("accepted")}>Allow analytics</button>{choice !== null && <button type="button" className="analytics-settings-link" onClick={() => setSettingsOpen(false)}>Keep current choice</button>}</div>
    </section>}
  </>;
}

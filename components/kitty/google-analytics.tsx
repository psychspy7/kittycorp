"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  analyticsPublicPath, configureAnalytics,
  pauseAnalytics, readAnalyticsChoice, subscribeAnalyticsChoice,
  trackPageView, trackConversion,
} from "@/lib/site-analytics";

export function AnalyticsSettingsButton({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null;
  return <button className="analytics-settings-link" type="button" onClick={() => window.dispatchEvent(new Event("kitty:cookie-settings"))}>Cookie choices</button>;
}

const subscribeHydration = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(subscribeHydration, hydratedSnapshot, serverSnapshot);
  const choice = useSyncExternalStore(subscribeAnalyticsChoice, readAnalyticsChoice, () => null);
  const [tagReady, setTagReady] = useState(false);
  const configured = useRef(false);
  const previousPage = useRef("");
  const lastTracked = useRef("");
  const publicPage = analyticsPublicPath(pathname);
  const enabled = hydrated && !!measurementId && publicPage && choice === "accepted";

  useEffect(() => {
    const protectPrivateNavigation = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (link instanceof HTMLAnchorElement) {
        const conversion=link.dataset.conversion;
        if(conversion)trackConversion(conversion,link.dataset.context||"navigation");
        else if(link.protocol==="mailto:" || (link.hostname.endsWith("linkedin.com") && link.pathname.startsWith("/in/")))trackConversion("contact_click","contact");
      }
      if (link instanceof HTMLAnchorElement && link.origin === window.location.origin && !analyticsPublicPath(link.pathname) && measurementId) pauseAnalytics(measurementId);
    };
    document.addEventListener("click", protectPrivateNavigation, true);
    return () => {
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

  if (!enabled) return null;
  return <Script id="kitty-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" onReady={() => setTagReady(true)} />;
}

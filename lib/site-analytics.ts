export const ANALYTICS_CHOICE_KEY = "kitty-analytics-consent-v1";
export const ANALYTICS_CHOICE_EVENT = "kitty:analytics-choice";
export const ANALYTICS_SETTINGS_EVENT = "kitty:analytics-settings";
export type AnalyticsChoice = "accepted" | "declined";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean | undefined;
};

let sessionChoice: AnalyticsChoice | null = null;
const initializedTags = new Set<string>();
const choiceLifetime = 180 * 24 * 60 * 60 * 1000;
const publicPages = new Set([
  "/", "/services", "/products", "/company", "/team", "/kitty-ai",
  "/lisa-ai", "/sentinel", "/secretchat", "/build-log", "/research",
  "/investors", "/contact", "/privacy",
]);

export function analyticsPublicPath(pathname: string | null) {
  if (!pathname) return false;
  return publicPages.has(pathname) || /^\/(build-log|launches)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathname);
}

export function readAnalyticsChoice(): AnalyticsChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ANALYTICS_CHOICE_KEY);
    if (!raw) return sessionChoice;
    const saved = JSON.parse(raw) as { choice?: string; savedAt?: number };
    if (typeof saved.savedAt !== "number" || Date.now() - saved.savedAt > choiceLifetime || saved.savedAt > Date.now()) return null;
    return saved.choice === "accepted" || saved.choice === "declined" ? saved.choice : null;
  } catch {
    return sessionChoice;
  }
}

export function saveAnalyticsChoice(choice: AnalyticsChoice) {
  sessionChoice = choice;
  try {
    window.localStorage.setItem(ANALYTICS_CHOICE_KEY, JSON.stringify({ choice, savedAt: Date.now() }));
  } catch {
    // Storage can be blocked; the visitor's choice still applies to this visit.
  }
  window.dispatchEvent(new Event(ANALYTICS_CHOICE_EVENT));
}

export function subscribeAnalyticsChoice(notify: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === ANALYTICS_CHOICE_KEY || event.key === null) {
      sessionChoice = null;
      notify();
    }
  };
  window.addEventListener(ANALYTICS_CHOICE_EVENT, notify);
  window.addEventListener("storage", storage);
  return () => {
    window.removeEventListener(ANALYTICS_CHOICE_EVENT, notify);
    window.removeEventListener("storage", storage);
  };
}

export function analyticsReferrer(value: string, origin: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) return "";
    if (url.origin !== origin) return url.origin;
    return analyticsPublicPath(url.pathname) ? url.origin + url.pathname : "";
  } catch {
    return "";
  }
}

function analyticsWindow() {
  return window as unknown as AnalyticsWindow;
}

export function pauseAnalytics(id: string) {
  analyticsWindow()[`ga-disable-${id}`] = true;
}

export function configureAnalytics(id: string, pathname: string) {
  const target = analyticsWindow();
  if (!analyticsPublicPath(pathname) || readAnalyticsChoice() !== "accepted") return false;
  target.dataLayer ||= [];
  target.gtag ||= function (...args: unknown[]) {
    // Google's command queue uses the function's Arguments object.
    // eslint-disable-next-line prefer-rest-params
    if (args.length) target.dataLayer!.push(arguments);
  };
  target[`ga-disable-${id}`] = false;
  target.gtag("consent", initializedTags.has(id) ? "update" : "default", {
    analytics_storage: "granted",
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
  if (!initializedTags.has(id)) {
    target.gtag("js", new Date());
    target.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: window.location.origin + pathname,
      page_referrer: analyticsReferrer(document.referrer, window.location.origin),
    });
    initializedTags.add(id);
  }
  return true;
}

export function trackPageView(id: string, pathname: string, previous: string) {
  const target = analyticsWindow();
  if (!analyticsPublicPath(pathname) || readAnalyticsChoice() !== "accepted" || target[`ga-disable-${id}`]) return;
  const pageLocation = window.location.origin + pathname;
  target.gtag?.("set", { page_location: pageLocation, page_referrer: analyticsReferrer(previous || document.referrer, window.location.origin) });
  target.gtag?.("event", "page_view", {
    send_to: id,
    page_location: pageLocation,
    page_title: document.title,
    page_referrer: analyticsReferrer(previous || document.referrer, window.location.origin),
  });
}

export function declineAnalytics(id: string) {
  pauseAnalytics(id);
  // Remove this website's GA cookies. The Studio session cookie is untouched.
  const names = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0]).filter(name => /^_ga(?:_|$)/.test(name));
  const parts = window.location.hostname.split(".");
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    for (let index = 0; index < parts.length - 1; index++) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${parts.slice(index).join(".")}; SameSite=Lax`;
    }
  }
}

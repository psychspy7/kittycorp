type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean | undefined;
};

const initializedTags = new Set<string>();
const publicPages = new Set([
  "/", "/services", "/products", "/memberships", "/company", "/team", "/kitty-ai",
  "/lisa-ai", "/sentinel", "/secretchat", "/build-log", "/research",
  "/investors", "/contact", "/privacy", "/projects", "/pricing", "/appointments", "/terms", "/refunds", "/play", "/services/coaching-centres", "/services/agencies",
]);

export function analyticsPublicPath(pathname: string | null) {
  if (!pathname) return false;
  return publicPages.has(pathname) || /^\/(build-log|launches)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathname);
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
  if (!analyticsPublicPath(pathname)) return false;
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
  if (!analyticsPublicPath(pathname) || target[`ga-disable-${id}`]) return;
  const pageLocation = window.location.origin + pathname;
  target.gtag?.("set", { page_location: pageLocation, page_referrer: analyticsReferrer(previous || document.referrer, window.location.origin) });
  target.gtag?.("event", "page_view", {
    send_to: id,
    page_location: pageLocation,
    page_title: document.title,
    page_referrer: analyticsReferrer(previous || document.referrer, window.location.origin),
  });
}

export const conversionEvents = ["service_cta","project_form_start","enquiry_submit","form_error","contact_click","portfolio_view","investor_cta","investor_enquiry_submit","subscription_view","subscription_click"] as const;
const conversionContexts = new Set(["home","services","projects","contact","coaching-centres","agencies","research","investors","appointment","labs","navigation","memberships"]);
const recentConversions = new Map<string,number>();
export function trackConversion(event: string, context: string) {
  if(typeof window==="undefined")return;
  const path=window.location.pathname;
  if(!analyticsPublicPath(path) || !conversionEvents.includes(event as typeof conversionEvents[number]) || !conversionContexts.has(context))return;
  const target=analyticsWindow();
  const activeIds=[...initializedTags].filter(id=>!target[`ga-disable-${id}`]);
  if(!target.gtag || !activeIds.length)return;
  const key=path+":"+event+":"+context,now=Date.now();
  if(now-(recentConversions.get(key)||0)<1000)return;
  recentConversions.set(key,now);
  if(recentConversions.size>100)recentConversions.delete(recentConversions.keys().next().value!);
  // Fixed labels and public paths only; no form values, query strings or raw errors.
  for(const id of activeIds)target.gtag("event",event,{send_to:id,context,page_path:path,page_location:window.location.origin+path});
}

export function updateAnalyticsConsent(granted: boolean) {
  const target = analyticsWindow();
  target.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

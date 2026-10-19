import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise privacy boundaries without making requests to Google or using real visitors.
const source = ts.transpileModule(readFileSync("lib/site-analytics.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const stored = new Map();
const listeners = new Map();
const removedCookies = [];
let storageBlocked = false;
const cookieJar = "_ga=example; _ga_TEST=example; kitty-session=keep";
const document = { title: "KITTY CORP", referrer: "https://example.com/private?email=private@example.com#token" };
Object.defineProperty(document, "cookie", { get: () => cookieJar, set: value => removedCookies.push(value) });
const window = {
  location: { origin: "https://kittycorp.vercel.app", hostname: "kittycorp.vercel.app" },
  localStorage: {
    getItem: key => { if (storageBlocked) throw Error("Blocked"); return stored.get(key) || null; },
    setItem: (key, value) => { if (storageBlocked) throw Error("Blocked"); stored.set(key, value); },
  },
  addEventListener: (name, fn) => { const set = listeners.get(name) || new Set(); set.add(fn); listeners.set(name, set); },
  removeEventListener: (name, fn) => listeners.get(name)?.delete(fn),
  dispatchEvent: event => { for (const fn of listeners.get(event.type) || []) fn(event); },
};
const context = vm.createContext({ exports: {}, window, document, URL, Event, Date });
vm.runInContext(source, context);
const api = context.exports;
const id = "G-TEST123456";
assert.equal(api.readAnalyticsChoice(), null);
assert.equal(window.dataLayer, undefined, "No queue before configuration");
assert.equal(api.configureAnalytics(id, "/"), false, "No analytics before visitor consent");
api.saveAnalyticsChoice("declined");
assert.equal(api.configureAnalytics(id, "/"), false);
api.saveAnalyticsChoice("accepted");
assert.equal(api.configureAnalytics(id, "/"), true);
api.configureAnalytics(id, "/services");
const commands = () => Array.from(window.dataLayer, value => Array.from(value));
assert.equal(commands().filter(row => row[0] === "config").length, 1, "One tag configuration per document");
assert.equal(commands().find(row => row[0] === "config")[2].send_page_view, false);
assert.equal(commands().find(row => row[0] === "consent")[2].ad_storage, "denied");
api.trackPageView(id, "/services", "https://kittycorp.vercel.app/contact?email=private@example.com#token");
const event = commands().find(row => row[0] === "event")[2];
assert.equal(event.page_location, "https://kittycorp.vercel.app/services");
assert.equal(event.page_referrer, "https://kittycorp.vercel.app/contact");
assert.equal(JSON.stringify(commands()).includes("private@example.com"), false, "Query and fragment values stay out of tracking");
for (const pathname of ["/admins", "/admins/settings", "/kitten", "/kitten/settings", "/api/contact", "/unknown", "/build-log/unsafe%20slug"]) {
  const before = commands().length;
  assert.equal(api.configureAnalytics(id, pathname), false);
  api.trackPageView(id, pathname, "");
  assert.equal(commands().length, before, `No tracking for ${pathname}`);
}
assert.equal(api.analyticsPublicPath("/build-log/making-kitty-ai-remember"), true);
assert.equal(api.analyticsReferrer("https://kittycorp.vercel.app/admins?token=private", window.location.origin), "");
assert.equal(api.analyticsReferrer("https://example.com/private?token=private", window.location.origin), "https://example.com");
window.location.pathname="/services/coaching-centres";
const beforeConversion=commands().length;
api.trackConversion("service_cta","coaching-centres");
api.trackConversion("service_cta","coaching-centres");
assert.equal(commands().length,beforeConversion+1,"Duplicate click events are suppressed");
assert.equal(commands().at(-1)[1],"service_cta");
assert.equal(commands().at(-1)[2].page_path,"/services/coaching-centres");
const beforeUnsafe=commands().length;
api.trackConversion("raw user message","contact");
api.trackConversion("form_error","private@example.com");
window.location.pathname="/account/projects/private";
api.trackConversion("enquiry_submit","projects");
assert.equal(commands().length,beforeUnsafe,"Private paths and unbounded event labels are refused");
window.location.pathname="/projects";
api.declineAnalytics(id);
api.saveAnalyticsChoice("declined");
const beforeDeclinedView = commands().length;
api.trackPageView(id, "/", "");
api.trackConversion("enquiry_submit","projects");
assert.equal(commands().length, beforeDeclinedView);
assert.equal(window[`ga-disable-${id}`], true);
assert.ok(removedCookies.some(value => value.startsWith("_ga=")));
assert.ok(removedCookies.every(value => !value.startsWith("kitty-session=")), "Opt-out keeps Studio's session intact");
stored.set(api.ANALYTICS_CHOICE_KEY, JSON.stringify({ choice: "accepted", savedAt: Date.now() - 181 * 86400000 }));
assert.equal(api.readAnalyticsChoice(), null, "Old permission expires");
let notifications = 0;
const unsubscribe = api.subscribeAnalyticsChoice(() => notifications++);
window.dispatchEvent({ type: "storage", key: api.ANALYTICS_CHOICE_KEY });
storageBlocked = true;
api.saveAnalyticsChoice("declined");
assert.equal(api.readAnalyticsChoice(), "declined", "Blocked storage still respects the current visit's choice");
assert.equal(notifications, 2, "Choices update across tabs and in the same tab");
unsubscribe();
assert.equal(listeners.get(api.ANALYTICS_CHOICE_EVENT).size, 0);
console.log("PASS: explicit opt-in, saved choices, expiry, blocked storage, private routes, sanitized URLs, tag configuration and Studio-cookie protection, bounded conversion labels and deduplication.");

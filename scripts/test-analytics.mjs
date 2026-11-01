import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise privacy boundaries without making requests to Google or using real visitors.
const source = ts.transpileModule(readFileSync("lib/site-analytics.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const listeners = new Map();
let cookieJar = "kitty-session=keep";
const document = { title: "KITTY CORP", referrer: "https://example.com/private?email=private@example.com#token" };
Object.defineProperty(document, "cookie", { get: () => cookieJar, set: value => { cookieJar = value; } });
const window = {
  location: { origin: "https://thekittycorp.com", hostname: "thekittycorp.com", pathname: "/" },
  addEventListener: (name, fn) => { const set = listeners.get(name) || new Set(); set.add(fn); listeners.set(name, set); },
  removeEventListener: (name, fn) => listeners.get(name)?.delete(fn),
  dispatchEvent: event => { for (const fn of listeners.get(event.type) || []) fn(event); },
};
const context = vm.createContext({ exports: {}, window, document, URL, Event, Date });
vm.runInContext(source, context);
const api = context.exports;
const id = "G-TEST123456";
assert.equal(window.dataLayer, undefined, "No analytics queue before public-page initialization");
assert.equal(api.configureAnalytics(id, "/"), true, "Public analytics initializes without a consent prompt");
api.configureAnalytics(id, "/services");
const commands = () => Array.from(window.dataLayer, value => Array.from(value));
assert.equal(commands().filter(row => row[0] === "config").length, 1, "One tag configuration per document");
assert.equal(commands().find(row => row[0] === "config")[2].send_page_view, false);
assert.equal(commands().find(row => row[0] === "consent")[2].analytics_storage, "granted");
assert.equal(commands().find(row => row[0] === "consent")[2].ad_storage, "denied");
api.trackPageView(id, "/services", "https://thekittycorp.com/contact?email=private@example.com#token");
const event = commands().find(row => row[0] === "event")[2];
assert.equal(event.page_location, "https://thekittycorp.com/services");
assert.equal(event.page_referrer, "https://thekittycorp.com/contact");
assert.equal(JSON.stringify(commands()).includes("private@example.com"), false, "Query and fragment values stay out of tracking");
for (const pathname of ["/admins", "/admins/settings", "/kitten", "/kitten/settings", "/api/contact", "/unknown", "/build-log/unsafe%20slug"]) {
  const before = commands().length;
  assert.equal(api.configureAnalytics(id, pathname), false);
  api.trackPageView(id, pathname, "");
  assert.equal(commands().length, before, `No tracking for ${pathname}`);
}
assert.equal(api.analyticsPublicPath("/build-log/making-kitty-ai-remember"), true);
assert.equal(api.analyticsReferrer("https://thekittycorp.com/admins?token=private", window.location.origin), "");
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
window.location.pathname="/";
api.pauseAnalytics(id);
const beforePausedView = commands().length;
api.trackPageView(id, "/", "");
assert.equal(commands().length, beforePausedView, "Navigation to non-public areas pauses measurement");
assert.equal(window[`ga-disable-${id}`], true);
assert.equal(cookieJar, "kitty-session=keep", "Analytics does not modify Studio session storage");
api.configureAnalytics(id,"/");
api.trackPageView(id,"/","");
assert.equal(window[`ga-disable-${id}`], false, "Returning to a public page resumes page views");
console.log("PASS: automatic public-page analytics, private-route exclusions, sanitized URLs, ad-signal denial, Studio-cookie isolation and bounded conversion labels.");

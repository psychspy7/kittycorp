import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { z } from "zod";
import { database, HttpError, SESSION_COOKIE, setting, setStudioSession } from "./kitty-server";
import { approvedGoogleIdentity, GOOGLE_PENDING_SECONDS, openStudioPayload, randomStudioToken, safeEqual, sealStudioPayload } from "./studio-google-crypto";

const PENDING_PREFIX = "kitty_studio_google_";
const COOKIE_PATH = "/api/admin";
const STORAGE_KEY = "kitty-studio-google-pkce";
const pendingSchema = z.object({
  flow: z.string().regex(/^[a-f0-9]{64}$/), verifier: z.string().min(20).max(300),
  expiresAt: z.number().int().positive(),
}).strict();

function canonicalOrigin(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  if (process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname)) return requestOrigin;
  const site = new URL(setting("SITE_URL"));
  if (site.protocol !== "https:" || requestOrigin !== site.origin)
    throw new HttpError("Open the Studio on the official website to sign in.", 403);
  return site.origin;
}
function cookieName(flow: string) { return PENDING_PREFIX + flow.slice(0, 24); }
function cookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: COOKIE_PATH, maxAge: GOOGLE_PENDING_SECONDS };
}
function oauthClient(verifier?: string) {
  const values = new Map<string, string>();
  if (verifier) values.set(`${STORAGE_KEY}-code-verifier`, verifier);
  const client = createClient(setting("SUPABASE_URL"), setting("SUPABASE_PUBLISHABLE_KEY"), {
    // The SDK only uses custom PKCE storage when persistSession is true.
    // This adapter is a per-request Map; nothing is persisted in a browser or on disk.
    auth: { flowType: "pkce", persistSession: true, autoRefreshToken: false, detectSessionInUrl: false, storageKey: STORAGE_KEY,
      storage: { getItem: (key) => values.get(key) || null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } } },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal || AbortSignal.timeout(10000) }) },
  });
  return { client, values };
}

export async function studioGoogleStatus() {
  const { data, error } = await database().rpc("kitty_website_studio_security", { p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN") });
  if (error || typeof data?.google_enforced !== "boolean")
    throw new HttpError("Studio security is being configured. Please try again shortly.", 503);
  let providerReady = false;
  try {
    const response = await fetch(`${setting("SUPABASE_URL")}/auth/v1/settings`, { headers: { apikey: setting("SUPABASE_PUBLISHABLE_KEY") }, cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw Error("Auth settings unavailable");
    const settings = await response.json() as { external?: { google?: boolean } };
    providerReady = settings.external?.google === true;
  } catch {
    throw new HttpError("Studio sign-in is temporarily unavailable. Please try again shortly.", 503);
  }
  return { enforced: data.google_enforced, providerReady, required: data.google_enforced || providerReady };
}

export async function beginStudioGoogle(request: Request) {
  const origin = canonicalOrigin(request);
  const flow = randomStudioToken();
  const { client, values } = oauthClient();
  const { data, error } = await client.auth.signInWithOAuth({ provider: "google", options: {
    redirectTo: `${origin}/api/admin/google/callback?flow=${flow}`,
    skipBrowserRedirect: true, scopes: "openid email profile",
    queryParams: { prompt: "select_account", login_hint: setting("ADMIN_EMAIL") },
  } });
  const verifier = values.get(`${STORAGE_KEY}-code-verifier`);
  if (error || !data.url || !verifier || new URL(data.url).origin !== new URL(setting("SUPABASE_URL")).origin)
    throw new HttpError("Google verification could not start. Please try again.", 503);
  const payload = { flow, verifier, expiresAt: Date.now() + GOOGLE_PENDING_SECONDS * 1000 };
  const sealed = sealStudioPayload(payload, setting("FEEDBACK_GATEWAY_TOKEN"));
  if (sealed.length > 3900) throw new HttpError("Google verification could not start. Please try again.", 503);
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.set(cookieName(flow), sealed, cookieOptions());
  return data.url;
}

export async function clearStudioGoogleCookies() {
  const store = await cookies();
  for (const item of store.getAll()) {
    if (/^kitty_studio_google_[a-f0-9]{24}$/.test(item.name)) {
      store.set(item.name, "", { ...cookieOptions(), maxAge: 0 });
    }
  }
}

export async function cancelStudioGoogleFlow(flow: string) {
  if (!/^[a-f0-9]{64}$/.test(flow)) return;
  const store = await cookies();
  const name = cookieName(flow);
  const value = store.get(name)?.value;
  if (!value) return;
  try {
    const pending = pendingSchema.parse(openStudioPayload(value, setting("FEEDBACK_GATEWAY_TOKEN")));
    if (!safeEqual(pending.flow, flow)) return;
    store.set(name, "", { ...cookieOptions(), maxAge: 0 });
  } catch { /* Untrusted callbacks cannot clear other flows or a signed-in session. */ }
}

export async function finishStudioGoogle(request: Request) {
  const origin = canonicalOrigin(request);
  const url = new URL(request.url);
  const flow = url.searchParams.get("flow") || "";
  const code = url.searchParams.get("code") || "";
  if (!/^[a-f0-9]{64}$/.test(flow) || !code || code.length > 2048 || url.searchParams.getAll("flow").length !== 1 || url.searchParams.getAll("code").length !== 1)
    throw new HttpError("Google verification did not finish. Sign in again.", 401);
  const store = await cookies();
  const sealed = store.get(cookieName(flow))?.value;
  if (!sealed) throw new HttpError("Google verification expired. Sign in again.", 401);
  let pending: z.infer<typeof pendingSchema>;
  try { pending = pendingSchema.parse(openStudioPayload(sealed, setting("FEEDBACK_GATEWAY_TOKEN"))); }
  catch { throw new HttpError("Google verification expired. Sign in again.", 401); }
  if (!safeEqual(flow, pending.flow)) throw new HttpError("Google verification did not finish. Sign in again.", 401);
  store.set(cookieName(flow), "", { ...cookieOptions(), maxAge: 0 });
  let googleToken: string | undefined;
  try {
    if (pending.expiresAt <= Date.now() || pending.expiresAt > Date.now() + GOOGLE_PENDING_SECONDS * 1000)
      throw new HttpError("Google verification expired. Sign in again.", 401);
    const { providerReady } = await studioGoogleStatus();
    if (!providerReady) throw new HttpError("Google verification is not configured yet.", 503);
    const { client } = oauthClient(pending.verifier);
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (error || !data.session || !data.user) throw new HttpError("Google verification did not finish. Sign in again.", 401);
    googleToken = data.session.access_token;
    const { data: verified, error: userError } = await database(googleToken).auth.getUser(googleToken);
    if (userError || verified.user?.id !== setting("ADMIN_USER_ID") || verified.user.email?.toLowerCase() !== setting("ADMIN_EMAIL").toLowerCase() || !data.session.provider_token)
      throw new HttpError("Use the approved Google account to open the Studio.", 403);
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${data.session.provider_token}` }, cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new HttpError("Google verification did not finish. Sign in again.", 401);
    const identity: unknown = await response.json();
    if (!approvedGoogleIdentity(identity, setting("ADMIN_EMAIL")))
      throw new HttpError("Use the approved Google account to open the Studio.", 403);
    const db = database(googleToken);
    const { error: grantError } = await db.rpc("kitty_website_studio_google_grant", {
      p_google_email: identity.email, p_google_subject: identity.sub, p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
    });
    if (grantError) throw new HttpError("Studio access could not be verified. Sign in with the approved Google account.", 403);
    const { data: authorized, error: statusError } = await db.rpc("kitty_website_admin_status");
    if (statusError || authorized !== true) throw new HttpError("Studio access could not be verified.", 403);
    await setStudioSession(googleToken, data.session.expires_in);
    return `${origin}/kitten`;
  } catch (error) {
    if (googleToken) await database().auth.admin.signOut(googleToken, "local").catch(() => {});
    throw error;
  }
}

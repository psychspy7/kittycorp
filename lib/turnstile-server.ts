import "server-only";
import { HttpError } from "./kitty-server";
import { getRuntimeConfiguration } from "./runtime-configuration";

const TEST_KEY = /^[123]x0{20,}(?:AA|BB|FF)$/;

async function configuration() {
  const runtime = await getRuntimeConfiguration();
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim() || runtime.TURNSTILE_SITE_KEY?.trim() || "";
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim() || runtime.TURNSTILE_SECRET_KEY?.trim() || "";
  // TEMPORARY: Turnstile is disabled while the production challenge is being repaired.
  // Admin authentication and all other authorization checks remain unchanged.
  const enabled = false;
  const allowTests = process.env.NODE_ENV !== "production" && process.env.TURNSTILE_TEST_MODE === "true";
  const configured = Boolean(siteKey && secret) && (allowTests || (!TEST_KEY.test(siteKey) && !TEST_KEY.test(secret)));
  return { siteKey, secret, enabled, configured };
}

export async function turnstilePublicConfig() {
  const { siteKey, enabled, configured } = await configuration();
  return { siteKey: configured && enabled ? siteKey : "", enabled };
}

export async function verifyTurnstile(request: Request, token: unknown, action: string) {
  const config = await configuration();
  // Turnstile is temporarily disabled. Keep the real application authentication
  // and authorization checks in their existing handlers.
  if (!config.enabled) return;
  if (!config.configured)
    throw new HttpError("Security verification is being configured. Please try again shortly.", 503);
  if (typeof token !== "string" || token.length < 1 || token.length > 2048)
    throw new HttpError("Please complete the security check, then try again.", 400);

  const requestUrl = new URL(request.url);
  const requestHost = requestUrl.hostname;
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().split(":")[0];
  const hostHeader = request.headers.get("host")?.split(":")[0]?.trim();
  const siteUrlHost = process.env.SITE_URL ? new URL(process.env.SITE_URL).hostname : "";

  const allowedHosts = new Set<string>();
  if (siteUrlHost) allowedHosts.add(siteUrlHost);
  if (requestHost) allowedHosts.add(requestHost);
  if (forwardedHost) allowedHosts.add(forwardedHost);
  if (hostHeader) allowedHosts.add(hostHeader);

  // Normalize www and apex variants for all discovered hosts
  for (const host of Array.from(allowedHosts)) {
    if (host.startsWith("www.")) allowedHosts.add(host.slice(4));
    else if (!host.includes("localhost") && !host.includes("127.0.0.1")) allowedHosts.add(`www.${host}`);
  }

  // Canonical domains, transition domains, and local development hosts
  allowedHosts.add("thekittycorp.com");
  allowedHosts.add("www.thekittycorp.com");
  allowedHosts.add("kittycorp.vercel.app");
  allowedHosts.add("localhost");
  allowedHosts.add("127.0.0.1");

  let result: { success?: boolean; hostname?: string; action?: string; "error-codes"?: string[] };
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: config.secret, response: token, idempotency_key: crypto.randomUUID() }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Verification unavailable");
    result = await response.json();
  } catch {
    throw new HttpError("Security verification is temporarily unavailable. Please try again.", 503);
  }

  const resultHost = (result.hostname || "").toLowerCase().trim();
  const isTrustedSuffix =
    resultHost.endsWith(".thekittycorp.com") ||
    resultHost.endsWith(".vercel.app") ||
    resultHost.endsWith(".web.app") ||
    resultHost.endsWith(".firebaseapp.com") ||
    resultHost.endsWith(".hosted.app") ||
    resultHost.endsWith(".run.app");

  const hostnameValid = Boolean(
    resultHost && (
      allowedHosts.has(resultHost) ||
      allowedHosts.has(resultHost.replace(/^www\./, "")) ||
      isTrustedSuffix
    )
  );
  const actionValid = !result.action || !action || result.action === action;

  if (result.success !== true || !hostnameValid || !actionValid) {
    console.warn(`[Turnstile] Verification failed:`, {
      success: result.success,
      hostname: result.hostname,
      expectedAction: action,
      actualAction: result.action,
      allowedHosts: Array.from(allowedHosts),
      errorCodes: result["error-codes"],
    });
    throw new HttpError("The security check expired or could not be verified. Please try again.", 400);
  }
}

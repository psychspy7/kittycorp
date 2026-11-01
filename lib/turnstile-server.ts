import "server-only";
import { HttpError } from "./kitty-server";
import { getRuntimeConfiguration } from "./runtime-configuration";
import { websiteOrigin } from "./site-metadata";

const TEST_KEY = /^[123]x0{20,}(?:AA|BB|FF)$/;

async function configuration() {
  const runtime = await getRuntimeConfiguration();
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim() || runtime.TURNSTILE_SITE_KEY?.trim() || "";
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim() || runtime.TURNSTILE_SECRET_KEY?.trim() || "";
  // Opt in only after the site and secret keys are configured. If enabled is
  // explicitly true but the keys are invalid or missing, verification fails closed.
  const enabled = process.env.TURNSTILE_ENABLED?.trim() === "true";
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
  // Turnstile remains optional until its widget and keys are configured. Keep
  // the application authentication and authorization checks in every handler.
  if (!config.enabled) return;
  if (!config.configured)
    throw new HttpError("Security verification is being configured. Please try again shortly.", 503);
  if (typeof token !== "string" || token.length < 1 || token.length > 2048)
    throw new HttpError("Please complete the security check, then try again.", 400);

  const expectedHost = process.env.SITE_URL
    ? new URL(websiteOrigin()).hostname
    : new URL(request.url).hostname;
  const allowedHosts = new Set([expectedHost]);
  if (process.env.NODE_ENV !== "production") allowedHosts.add(new URL(request.url).hostname);
  let result: { success?: boolean; hostname?: string; action?: string };
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
  if (result.success !== true || !result.hostname || !allowedHosts.has(result.hostname) || result.action !== action)
    throw new HttpError("The security check expired or could not be verified. Please try again.", 400);
}

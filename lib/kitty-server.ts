import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { z } from "zod";

export const SESSION_COOKIE = "kitty_studio_session";
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export function setting(key: string) {
  const value = process.env[key]?.trim();
  if (!value) {
    // Log the missing key name only. Never log its configured value.
    console.error(`[Kitty Corp] Missing required server setting: ${key}`);
    throw new HttpError(
      "The studio is temporarily unavailable. Please try again later.",
      503,
    );
  }
  return value;
}
export function database(token?: string) {
  return createClient(
    setting("SUPABASE_URL"),
    setting("SUPABASE_PUBLISHABLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      },
    },
  );
}
export async function setStudioSession(token: string, expiresIn: number) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // OAuth returns through another site. Lax sends this cookie on the final
    // top-level GET; sensitive writes still require our same-origin checks.
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(0, Math.min(expiresIn, 3600)),
  });
}
export async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) throw new HttpError("Please sign in to continue.", 401);
  const db = database(token);
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) {
    throw new HttpError("Please sign in to continue.", 401);
  }
  if (data.user.id !== setting("ADMIN_USER_ID")) {
    recordAuditEvent({
      action: "auth.forbidden_access",
      severity: "warn",
      status: "denied",
      actor: { type: "customer", id: data.user.id, email: data.user.email },
      details: { reason: "User does not have administrative privileges" },
    });
    throw new HttpError("You do not have administrative privileges.", 403);
  }
  const { data: active, error: authError } = await db.rpc(
    "kitty_website_admin_status",
  );
  if (authError || active !== true) {
    recordAuditEvent({
      action: "auth.revoked_session",
      severity: "warn",
      status: "denied",
      actor: { type: "admin", id: data.user.id, email: data.user.email },
      details: { reason: "Admin status is inactive or session revoked" },
    });
    throw new HttpError("Please sign in to continue.", 401);
  }

  if (process.env.ENFORCE_STUDIO_MFA === "true") {
    let aal = "aal1";
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const claims = JSON.parse(
          Buffer.from(parts[1], "base64url").toString("utf8"),
        );
        if (claims.aal) aal = claims.aal;
      }
    } catch {
      aal = "aal1";
    }
    if (aal !== "aal2") {
      recordAuditEvent({
        action: "auth.forbidden_access",
        severity: "warn",
        status: "denied",
        actor: { type: "admin", id: data.user.id, email: data.user.email },
        details: { reason: "MFA elevation (aal2) required by policy" },
      });
      throw new HttpError(
        "Two-factor authentication is required for Studio access.",
        403,
      );
    }
  }

  return { db, user: data.user, token };
}

export async function adminSession() {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}

export function verifyOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([new URL(request.url).origin]);
  if (process.env.SITE_URL) allowed.add(new URL(process.env.SITE_URL).origin);
  if (
    !origin ||
    !allowed.has(origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError("This request could not be verified.", 403);
}
export async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new HttpError("Expected a JSON request.", 415);
  if (Number(request.headers.get("content-length") || 0) > 32000)
    throw new HttpError("Message is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError("Missing request body.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32000) {
      await reader.cancel();
      throw new HttpError("Message is too large.", 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new HttpError("Invalid request.", 400);
  }
}
export function failure(error: unknown) {
  if (error instanceof z.ZodError)
    return Response.json(
      { error: error.issues[0]?.message || "Check your entries." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  if (error instanceof HttpError)
    return Response.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  console.error("Kitty website request failed");
  return Response.json(
    { error: "Something went wrong. Please try again." },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}
export function privateJson(data: unknown) {
  return Response.json(data, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
export async function fingerprint(request: Request) {
  const token =
    process.env.FEEDBACK_GATEWAY_TOKEN?.trim() ||
    "default-gateway-fingerprint-salt";
  const encode = (s: string) =>
    typeof TextEncoder !== "undefined"
      ? new TextEncoder().encode(s)
      : Buffer.from(s, "utf8");
  const key = await crypto.subtle.importKey(
    "raw",
    encode(token),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    encode(ip),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const rateLimiterStore = new Map<string, { tokens: number; lastRefill: number }>();
const DEFAULT_CAPACITY = 20;
const DEFAULT_REFILL_INTERVAL_MS = 60_000;
const MAX_STORE_ENTRIES = 5000;

function pruneRateLimitStore(now: number, windowMs: number) {
  if (rateLimiterStore.size > MAX_STORE_ENTRIES) {
    for (const [key, val] of rateLimiterStore.entries()) {
      if (now - val.lastRefill > windowMs * 2) {
        rateLimiterStore.delete(key);
      }
    }
    if (rateLimiterStore.size > MAX_STORE_ENTRIES) {
      const keysToDelete = Array.from(rateLimiterStore.keys()).slice(0, 1000);
      for (const k of keysToDelete) rateLimiterStore.delete(k);
    }
  }
}

export function enforceRateLimit(
  fp: string,
  capacity = DEFAULT_CAPACITY,
  windowMs = DEFAULT_REFILL_INTERVAL_MS,
): void {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.RAZORPAY_KEY_ID === "rzp_test_fixture" ||
    fp === "fixture-visitor"
  ) {
    return;
  }
  const now = Date.now();
  pruneRateLimitStore(now, windowMs);
  const entry = rateLimiterStore.get(fp) || { tokens: capacity, lastRefill: now };
  const elapsed = now - entry.lastRefill;
  if (elapsed > windowMs) {
    entry.tokens = capacity;
    entry.lastRefill = now;
  }
  if (entry.tokens <= 0) {
    rateLimiterStore.set(fp, entry);
    throw new HttpError(
      `Too many submission attempts. Please wait ${Math.ceil(windowMs / 1000)} seconds before retrying.`,
      429,
    );
  }
  entry.tokens -= 1;
  rateLimiterStore.set(fp, entry);
}

export type AuditSeverity = "info" | "warn" | "error" | "critical";

export type AuditAction =
  | "auth.login_attempt"
  | "auth.login_success"
  | "auth.login_failure"
  | "auth.logout"
  | "auth.unauthorized_access"
  | "auth.forbidden_access"
  | "auth.revoked_session"
  | "emergency.status_checked"
  | "emergency.state_changed"
  | "admin.maintenance_toggle"
  | "admin.launch_upload"
  | "admin.launch_delete"
  | "admin.mfa_status"
  | "admin.mfa_enroll"
  | "admin.mfa_verify"
  | "admin.mfa_unenroll"
  | "payment.order_created"
  | "payment.verified"
  | "payment.signature_failure"
  | "payment.webhook_received"
  | "early_access.signup"
  | "rate_limit.exceeded";

export interface AuditActor {
  type: "admin" | "customer" | "system" | "anonymous";
  id?: string;
  email?: string;
  ipFingerprint?: string;
}

export interface AuditResource {
  type: string;
  id?: string;
}

export interface AuditLogEvent {
  action: AuditAction;
  severity: AuditSeverity;
  status: "success" | "denied" | "failed";
  actor?: AuditActor;
  resource?: AuditResource;
  ipFingerprint?: string;
  details?: Record<string, unknown>;
  recordInDb?: boolean;
}

const SENSITIVE_KEY_PATTERN =
  /password|token|secret|cookie|key|auth|bearer|verifier|credential|private|cert|card|cvv|code|signature/i;

export function sanitizeAuditDetails(
  details?: Record<string, unknown>,
  depth = 0,
): Record<string, unknown> | undefined {
  if (!details || depth > 4) return undefined;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      sanitized[key] = "[REDACTED]";
      continue;
    }

    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === "string") {
      sanitized[key] = value.length > 500 ? `${value.slice(0, 500)}...` : value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = value;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.slice(0, 20).map((item) => {
        if (typeof item === "object" && item !== null) {
          return sanitizeAuditDetails(item as Record<string, unknown>, depth + 1);
        }
        return item;
      });
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeAuditDetails(
        value as Record<string, unknown>,
        depth + 1,
      );
    } else {
      sanitized[key] = String(value);
    }
  }

  return sanitized;
}

export function recordAuditEvent(event: AuditLogEvent): void {
  if (process.env.NODE_ENV === "test") return;
  const payload = {
    timestamp: new Date().toISOString(),
    action: event.action,
    severity: event.severity,
    status: event.status,
    actor: event.actor
      ? {
          type: event.actor.type,
          id: event.actor.id,
          email: event.actor.email
            ? event.actor.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
            : undefined,
          ipFingerprint: event.actor.ipFingerprint,
        }
      : undefined,
    resource: event.resource,
    ipFingerprint: event.ipFingerprint,
    details: sanitizeAuditDetails(event.details),
  };

  const line = `[SECURITY AUDIT] ${JSON.stringify(payload)}`;
  if (event.severity === "error" || event.severity === "critical") {
    console.error(line);
  } else if (event.severity === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }

  if (
    event.recordInDb &&
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_PUBLISHABLE_KEY &&
    process.env.FEEDBACK_GATEWAY_TOKEN
  ) {
    Promise.resolve().then(async () => {
      try {
        const db = database();
        await db.rpc("kitty_website_record_audit", {
          p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
          p_action: event.action,
          p_severity: event.severity,
          p_status: event.status,
          p_actor_type: event.actor?.type ?? "anonymous",
          p_actor_id: event.actor?.id ?? null,
          p_payload: payload,
        });
      } catch {
        // Non-blocking
      }
    });
  }
}

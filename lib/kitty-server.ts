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
      global: token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined,
    },
  );
}
export async function adminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = database(token);
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user || data.user.id !== setting("ADMIN_USER_ID"))
    return null;
  // RLS checks the live session and explicit admin allowlist, including revocation.
  const { data: active, error: authError } = await db.rpc(
    "kitty_website_admin_status",
  );
  if (authError || active !== true) return null;
  return { db, user: data.user, token };
}
export async function requireAdmin() {
  const session = await adminSession();
  if (!session) throw new HttpError("Please sign in to continue.", 401);
  return session;
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
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(setting("FEEDBACK_GATEWAY_TOKEN")),
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
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

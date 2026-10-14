const DATABASE_ORIGIN = "https://mgkghnblbisubympudaa.supabase.co";
const CHECK_URL = `${DATABASE_ORIGIN}/rest/v1/kitty_website_notices?select=id&limit=1`;
const KEY_PATTERN = /^sb_publishable_[A-Za-z0-9_-]{20,}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class DatabaseHealthError extends Error {
  constructor(reason, status = null, attempts = 0) {
    super("Website database health check failed.");
    this.name = "DatabaseHealthError";
    this.reason = reason;
    this.status = status;
    this.attempts = attempts;
  }
}

export async function checkDatabase(env, dependencies = {}) {
  const key = env.SUPABASE_PUBLISHABLE_KEY;
  if (typeof key !== "string" || !KEY_PATTERN.test(key)) {
    throw new DatabaseHealthError("configuration");
  }
  const request = dependencies.fetch ?? ((url, options) => fetch(url, options));
  const sleep = dependencies.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const started = Date.now();
  for (let attempt = 1; attempt <= 2; attempt++) {
    let response;
    try {
      response = await request(CHECK_URL, {
        method: "GET",
        headers: {
          apikey: key,
          accept: "application/json",
          "cache-control": "no-cache",
          "x-client-info": "kitty-corp-database-health/1.0.0",
        },
        cache: "no-store",
        redirect: "manual",
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      if (attempt === 2) throw new DatabaseHealthError("connection", null, attempt);
      await sleep(1000);
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      const transient = response.status === 429 || response.status >= 500;
      if (!transient || attempt === 2) {
        throw new DatabaseHealthError("http", response.status, attempt);
      }
      await sleep(1000);
      continue;
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw new DatabaseHealthError("response", response.status, attempt);
    }
    if (!Array.isArray(data) || data.length > 1 || data.some((row) => !row || typeof row.id !== "string" || !UUID_PATTERN.test(row.id))) {
      throw new DatabaseHealthError("response", response.status, attempt);
    }
    return { ok: true, status: response.status, attempts: attempt, elapsedMs: Date.now() - started };
  }
  throw new DatabaseHealthError("connection", null, 2);
}

const worker = {
  async scheduled(controller, env) {
    const scheduledAt = new Date(controller.scheduledTime).toISOString();
    try {
      const result = await checkDatabase(env);
      console.info(JSON.stringify({ event: "website_database_health", scheduledAt, ...result }));
    } catch (error) {
      const safe = error instanceof DatabaseHealthError ? error : new DatabaseHealthError("unexpected");
      console.error(JSON.stringify({ event: "website_database_health", scheduledAt, ok: false, reason: safe.reason, status: safe.status, attempts: safe.attempts }));
      throw safe;
    }
  },
  async fetch() {
    return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
  },
};

export default worker;

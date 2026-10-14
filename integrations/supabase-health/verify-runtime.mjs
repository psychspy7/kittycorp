import assert from "node:assert/strict";
import { Miniflare } from "miniflare";
import { fileURLToPath } from "node:url";
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!key || !key.startsWith("sb_publishable_") || process.env.SUPABASE_URL !== "https://mgkghnblbisubympudaa.supabase.co") throw Error("Load the website's existing private configuration.");
const runtime = new Miniflare({ modules: true, cf: false, scriptPath: fileURLToPath(new URL("./worker.mjs", import.meta.url)), compatibilityDate: "2026-05-22", bindings: { SUPABASE_PUBLISHABLE_KEY: key } });
try {
  const worker = await runtime.getWorker();
  const result = await worker.scheduled({ cron: "0 3 * * *" });
  assert.equal(result.outcome, "ok");
  assert.equal((await worker.fetch("https://health.invalid/")).status, 404);
  console.log("PASS: workerd scheduled invocation completed against the real website database; public fetch denied.");
} finally { await runtime.dispose(); }

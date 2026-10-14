import assert from "node:assert/strict";
import worker, { checkDatabase, DatabaseHealthError } from "./worker.mjs";
const key = "sb_publishable_" + "x".repeat(32);
const env = { SUPABASE_PUBLISHABLE_KEY: key };
const success = () => new Response("[]", { headers: { "content-type": "application/json" } });
let calls = 0;
const result = await checkDatabase(env, { fetch: async (url, options) => {
  calls++;
  assert.equal(url, "https://mgkghnblbisubympudaa.supabase.co/rest/v1/kitty_website_notices?select=id&limit=1");
  assert.equal(options.method, "GET");
  assert.equal(options.cache, "no-store");
  assert.equal(options.redirect, "manual");
  assert.equal(options.headers.apikey, key);
  assert.equal(options.signal instanceof AbortSignal, true);
  return success();
} });
assert.equal(result.ok, true); assert.equal(calls, 1);
for (const invalid of [undefined, "", "sb_secret_" + "x".repeat(32), "eyJ.admin.secret"]) {
  await assert.rejects(checkDatabase({ SUPABASE_PUBLISHABLE_KEY: invalid }, { fetch: () => { throw Error("Must not call"); } }), (error) => error instanceof DatabaseHealthError && error.reason === "configuration");
}
let retries = 0, sleeps = 0;
assert.equal((await checkDatabase(env, { fetch: async () => ++retries === 1 ? new Response("temporary", { status: 503 }) : success(), sleep: async (ms) => { assert.equal(ms, 1000); sleeps++; } })).attempts, 2);
assert.equal(retries, 2); assert.equal(sleeps, 1);
for (const status of [301, 302, 307, 308, 401, 403, 400]) {
  let count = 0;
  await assert.rejects(checkDatabase(env, { fetch: async () => { count++; return new Response("provider body must not escape", { status, headers: { location: "https://untrusted.invalid/" } }); } }), (error) => error.status === status && error.attempts === 1 && !error.message.includes("provider"));
  assert.equal(count, 1);
}
let failures = 0;
await assert.rejects(checkDatabase(env, { fetch: async () => { failures++; throw Error(key); }, sleep: async () => {} }), (error) => error.reason === "connection" && error.attempts === 2 && !error.message.includes(key));
assert.equal(failures, 2);
for (const body of ["not-json", '{"private":"never logged"}', '[{"id":"invalid"}]', '[{"id":"a"},{"id":"b"}]']) {
  await assert.rejects(checkDatabase(env, { fetch: async () => new Response(body) }), (error) => error.reason === "response");
}
const before = globalThis.fetch; const log = console.info; const entries = [];
try {
  globalThis.fetch = async () => success(); console.info = (value) => entries.push(value);
  await worker.scheduled({ scheduledTime: 0 }, env);
  assert.equal(entries.length, 1); assert.equal(JSON.parse(entries[0]).ok, true); assert.equal(entries[0].includes(key), false);
  assert.equal((await worker.fetch(new Request("https://example.invalid/"))).status, 404);
} finally { globalThis.fetch = before; console.info = log; }
console.log("PASS: fixed read-only database target, public-key-only access, cache/redirect protection, bounded retries, safe failures and private scheduled-only worker.");

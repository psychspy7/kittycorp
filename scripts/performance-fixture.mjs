import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

// Loopback-only fake Supabase for production-build performance checks.
// No private env files, real identities, email, AI or payment providers are read.
const require = createRequire(import.meta.url);
function moduleSource(file, mocks = {}) {
  const output = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(output, { module: mod, exports: mod.exports, require: key => mocks[key] ?? require(key) });
  return mod.exports;
}
const products = moduleSource("lib/products.ts");
const company = moduleSource("lib/company-content.ts", { "./products": products });
const assistant = moduleSource("lib/assistant-settings.ts");
const tables = {
  kitty_website_products: structuredClone(company.defaultProducts),
  kitty_website_team: structuredClone(company.defaultTeam).map((member, i) => ({ ...member, id: `00000000-0000-4000-8000-${String(i+1).padStart(12,"0")}`, created_at: "2026-01-01T00:00:00Z" })),
  kitty_website_company: [structuredClone(company.defaultSettings)],
  kitty_website_launches: [], kitty_website_journal: [], kitty_website_testimonials: [], kitty_website_notices: [],
};
let counts = {};
const latency = Number(process.env.PERF_FIXTURE_LATENCY_MS || 40);
const port = Number(process.env.PERF_FIXTURE_PORT || 3101);
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const send = (status, body) => { res.writeHead(status, {"content-type":"application/json"}); res.end(JSON.stringify(body)); };
  if (url.pathname === "/__metrics") {
    if (req.method === "DELETE") counts = {};
    return send(200, {counts, latency_ms:latency});
  }
  counts[url.pathname] = (counts[url.pathname] || 0) + 1;
  await new Promise(resolve => setTimeout(resolve, latency));
  if (url.pathname === "/rest/v1/rpc/kitty_website_maintenance_status") return send(200, {enabled:false,revision:0,updated_at:"2026-01-01T00:00:00Z"});
  if (url.pathname === "/rest/v1/rpc/kitty_website_runtime_configuration") return send(200, null);
  if (url.pathname === "/rest/v1/rpc/kitty_website_assistant_settings") return send(200, {...assistant.defaultAssistantSettings, enabled:false});
  if (url.pathname === "/rest/v1/rpc/kitty_website_admin_status") return send(200, req.headers.authorization === "Bearer fixture-admin-token");
  if (url.pathname === "/auth/v1/user" && req.headers.authorization === "Bearer fixture-admin-token")
    return send(200, {id:"00000000-0000-4000-8000-000000000099",email:"owner@example.invalid",app_metadata:{provider:"google"},user_metadata:{},aud:"authenticated",created_at:"2026-01-01T00:00:00Z"});
  if (url.pathname === "/auth/v1/settings") return send(200, {external:{google:true}});
  const table = url.pathname.replace("/rest/v1/", "");
  if (!Object.hasOwn(tables, table)) return send(403, {message:"Fixture does not expose this operation"});
  let rows = tables[table];
  for (const [key,value] of url.searchParams) {
    if (value.startsWith("eq.")) rows = rows.filter(row => String(row[key]) === value.slice(3));
  }
  if (req.method === "PATCH") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const patch = JSON.parse(body);
    for (const row of rows) Object.assign(row, patch);
  } else if (req.method !== "GET") return send(403, {message:"Fixture only supports reads and isolated product edits"});
  return send(200, req.headers.accept?.includes("application/vnd.pgrst.object+json") ? rows[0] ?? null : rows);
});
server.listen(port,"127.0.0.1",()=>console.log(`Isolated database fixture on http://127.0.0.1:${port}; ${latency}ms simulated latency.`));

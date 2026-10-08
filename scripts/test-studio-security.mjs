import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { webcrypto } from "node:crypto";
import vm from "node:vm";
import ts from "typescript";

// Exercise the real server flow against isolated OAuth, cookie and database adapters.
// No provider credentials, live users, remote tables or Analytics are used.
const require = createRequire(import.meta.url);
const env = {
  NODE_ENV: "production", SITE_URL: "https://kittycorp.vercel.app",
  SUPABASE_URL: "https://website-project.supabase.co", SUPABASE_PUBLISHABLE_KEY: "fixture-public-key",
  ADMIN_EMAIL: "viratanand1221@gmail.com", ADMIN_USER_ID: "638e886a-45f2-4b04-8347-c80e6598a3fd",
  FEEDBACK_GATEWAY_TOKEN: "ab".repeat(32),
};
function source(file, mocks = {}, extra = {}) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const runtimeModule = { exports: {} };
  const sandbox = { module: runtimeModule, exports: runtimeModule.exports, require: name => name === "server-only" ? {} : Object.hasOwn(mocks, name) ? mocks[name] : require(name),
    process: { env }, Buffer, URL, AbortSignal, crypto: webcrypto, Response, Request, console, setTimeout, clearTimeout, ...extra };
  vm.runInNewContext(code, sandbox, { filename: file });
  return runtimeModule.exports;
}
const cryptoHelpers = source("lib/studio-google-crypto.ts");
const sql = readFileSync("supabase/studio-google-security.sql","utf8");
assert.equal((sql.match(/language sql(?: stable)? security invoker set search_path='' as \$\$select kitty_website_private\.studio_/g)||[]).length,4);
const publicHeaders=sql.match(/create or replace function public\.kitty_website_studio_[a-z]+\([^;]*?as \$\$/g)||[];
assert.equal(publicHeaders.length,4); assert(publicHeaders.every(header=>header.includes("security invoker")&&!header.includes("security definer")));
const googleOnlySql=readFileSync("supabase/studio-google-only.sql","utf8");
assert.match(googleOnlySql,/language sql security invoker/);
assert.match(googleOnlySql,/i\.provider='google' and i\.provider_id=p_google_subject/);
assert.match(googleOnlySql,/m->>'method'='oauth'/);
const jar = new Map();
const cookieWrites = [];
const cookieStore = { get: name => jar.has(name) ? { name, value: jar.get(name) } : undefined,
  getAll: () => [...jar].map(([name,value]) => ({ name,value })),
  delete: name => jar.delete(name),
  set: (name,value,options) => { cookieWrites.push({ name,options }); if (options?.maxAge === 0) jar.delete(name); else jar.set(name,value); } };
const passwordToken = "password-access-token-for-isolated-tests";
const googleToken = "google-access-token-for-isolated-tests";
const challenges = new Map();
const live = new Set();
const granted = new Set();
const fingerprint = "cd".repeat(32);
let googleUserId = env.ADMIN_USER_ID;
let identity = { email: env.ADMIN_EMAIL, email_verified: true, sub: "123456789012345678901" };
let providerToken = "fixture-google-provider-token";
let lastFlow;
let issuedSession;
let codeUsed = false;
let completions = 0;
let grantFails = false;
class HttpError extends Error { constructor(message,status) { super(message); this.status = status; } }
function database(token) {
  return {
    auth: {
      getUser: async value => ({ data: { user: live.has(value) ? { id: value === googleToken ? googleUserId : env.ADMIN_USER_ID, email: env.ADMIN_EMAIL } : null }, error: null }),
      admin: { signOut: async value => { live.delete(value); granted.delete(value); return { error: null }; } },
    },
    rpc: async (name,args) => {
      if (name === "kitty_website_studio_security") return { data: { google_enforced: true }, error: null };
      if (name === "kitty_website_admin_status") return { data: live.has(token) && granted.has(token), error: null };
      if (name === "kitty_website_studio_google_grant") {
        if (token !== googleToken || !live.has(token) || grantFails || args.p_google_subject!=="123456789012345678901"
          || args.p_google_email !== env.ADMIN_EMAIL || args.p_gateway_token !== env.FEEDBACK_GATEWAY_TOKEN) return { error: { message: "Unauthorized" } };
        completions++; granted.add(token); return { error: null };
      }
      throw Error("Unexpected RPC: "+name);
    },
  };
}
const sdk = {
  createClient: (_url,_key,options) => {
    assert.equal(options.auth.flowType,"pkce"); assert.equal(options.auth.persistSession,true);
    return { auth: {
      signInWithOAuth: async ({provider,options:oauth}) => {
        assert.equal(provider,"google"); assert.equal(oauth.queryParams.prompt,"select_account");
        lastFlow = new URL(oauth.redirectTo).searchParams.get("flow");
        assert.equal(new URL(oauth.redirectTo).pathname,"/api/admin/google/callback");
        options.auth.storage.setItem(options.auth.storageKey+"-code-verifier",JSON.stringify("a-secure-random-verifier-fixture"));
        return { data: { url: env.SUPABASE_URL+"/auth/v1/authorize?provider=google" }, error: null };
      },
      exchangeCodeForSession: async code => {
        assert.equal(code,"fresh-code");
        assert(options.auth.storage.getItem(options.auth.storageKey+"-code-verifier"));
        if (codeUsed) return { data: { user:null,session:null }, error: {} };
        codeUsed = true; live.add(googleToken);
        return { data: { user: { id:googleUserId },session: { access_token:googleToken,provider_token:providerToken,expires_in:3600 } }, error:null };
      },
    } };
  },
};
const server = { database, fingerprint: async () => fingerprint, HttpError, SESSION_COOKIE:"kitty_studio_session", setting: key => env[key],
  setStudioSession: async token => { issuedSession=token; jar.set("kitty_studio_session",token); } };
const google = source("lib/studio-google.ts", { "@supabase/supabase-js":sdk,"next/headers": { cookies:async()=>cookieStore },
  "./kitty-server":server,"./studio-google-crypto":cryptoHelpers }, { fetch: async url => url.endsWith("/auth/v1/settings")
    ? Response.json({ external:{ google:true } }) : Response.json(identity) });
function reset() {
  jar.clear(); cookieWrites.length=0; challenges.clear(); granted.clear(); live.clear(); live.add(passwordToken);
  googleUserId=env.ADMIN_USER_ID; identity={email:env.ADMIN_EMAIL,email_verified:true,sub:"123456789012345678901"};
  providerToken="fixture-google-provider-token"; issuedSession=undefined; codeUsed=false; grantFails=false;
}
const request = () => new Request(env.SITE_URL+"/api/admin/login");
const callback = () => new Request(env.SITE_URL+"/api/admin/google/callback?flow="+lastFlow+"&code=fresh-code");
async function start() { await google.beginStudioGoogle(request()); assert.equal(issuedSession,undefined); }
async function rejects(fn,status) { await assert.rejects(fn, error => error.status===status); assert.equal(issuedSession,undefined); }

reset(); await start();
assert.equal(cookieWrites[0].options.httpOnly,true); assert.equal(cookieWrites[0].options.sameSite,"lax");
assert.equal(cookieWrites[0].options.path,"/api/admin"); assert.equal(cookieWrites[0].options.maxAge,300);
const originalCookie = [...jar][0];
assert.equal(await google.finishStudioGoogle(callback()),env.SITE_URL+"/kitten");
assert.equal(issuedSession,googleToken);
const beforeReplay = completions;
issuedSession=undefined; jar.set(...originalCookie);
await rejects(()=>google.finishStudioGoogle(callback()),401); assert.equal(completions,beforeReplay);

reset(); await start(); identity.email="another@gmail.com";
await rejects(()=>google.finishStudioGoogle(callback()),403); assert.equal(granted.size,0);
reset(); await start(); identity.email_verified=false;
await rejects(()=>google.finishStudioGoogle(callback()),403);
reset(); await start(); googleUserId="ffffffff-ffff-4fff-bfff-ffffffffffff";
await rejects(()=>google.finishStudioGoogle(callback()),403);
reset(); await start(); providerToken=undefined;
await rejects(()=>google.finishStudioGoogle(callback()),403);
reset(); await start(); identity.sub="different-google-subject";
await rejects(()=>google.finishStudioGoogle(callback()),403); assert.equal(live.has(googleToken),false);
reset(); await start(); grantFails=true;
await rejects(()=>google.finishStudioGoogle(callback()),403); assert.equal(live.has(googleToken),false);
reset(); await start();
const [name,value]=[...jar][0]; const payload=cryptoHelpers.openStudioPayload(value,env.FEEDBACK_GATEWAY_TOKEN);
payload.expiresAt=Date.now()-1; jar.set(name,cryptoHelpers.sealStudioPayload(payload,env.FEEDBACK_GATEWAY_TOKEN));
await rejects(()=>google.finishStudioGoogle(callback()),401); assert.equal(codeUsed,false);
reset(); await start();
const [tamperName,tamperValue]=[...jar][0]; jar.set(tamperName,tamperValue.slice(0,10)+(tamperValue[10]==="A"?"B":"A")+tamperValue.slice(11));
await rejects(()=>google.finishStudioGoogle(callback()),401);
reset(); lastFlow="a".repeat(64); await rejects(()=>google.finishStudioGoogle(callback()),401);
reset(); await start();
lastFlow=lastFlow.slice(0,-1)+(lastFlow.endsWith("a")?"b":"a");
await rejects(()=>google.finishStudioGoogle(callback()),401);
assert.equal(jar.size,1); assert.equal(live.has(passwordToken),true);
reset(); await start(); jar.set("kitty_studio_session",googleToken);
await google.cancelStudioGoogleFlow("not-a-valid-flow"); assert.equal(jar.get("kitty_studio_session"),googleToken);
await google.cancelStudioGoogleFlow(lastFlow); assert.equal(jar.get("kitty_studio_session"),googleToken);
reset(); await start(); await google.clearStudioGoogleCookies(); assert.equal(jar.size,0);
reset(); await rejects(()=>google.beginStudioGoogle(new Request("https://attacker.example/api/admin/login")),403);

// The real adminSession must reject raw password sessions and direct Google sessions.
const kitty = source("lib/kitty-server.ts", { "@supabase/supabase-js": { createClient: (_url,_key,options) => database(options.global.headers?.Authorization?.replace("Bearer ","")) }, "next/headers":{cookies:async()=>cookieStore} });
await kitty.setStudioSession(googleToken,7200);
const finalCookie=cookieWrites.at(-1);assert.equal(finalCookie.options.sameSite,"lax");assert.equal(finalCookie.options.httpOnly,true);assert.equal(finalCookie.options.secure,true);assert.equal(finalCookie.options.maxAge,3600);
reset(); jar.set("kitty_studio_session",passwordToken); assert.equal(await kitty.adminSession(),null);
await assert.rejects(()=>kitty.requireAdmin(),error=>error.status===401);
live.add(googleToken); jar.set("kitty_studio_session",googleToken); assert.equal(await kitty.adminSession(),null);
granted.add(googleToken); assert.equal((await kitty.adminSession()).user.id,env.ADMIN_USER_ID);
live.delete(googleToken); assert.equal(await kitty.adminSession(),null);

// Actual Turnstile validation: setup failures, test-key prohibition, origin/action and replay.
let outcome={success:true,hostname:"kittycorp.vercel.app",action:"assistant"};
let verificationCalls=0; const seen=new Set();
const turnstile=source("lib/turnstile-server.ts", { "./kitty-server":{HttpError}, "./runtime-configuration": { getRuntimeConfiguration: async()=>({}) } }, { fetch: async (_url,options) => {
  verificationCalls++; const body=JSON.parse(options.body); assert.equal(body.secret,env.TURNSTILE_SECRET_KEY);
  if (seen.has(body.response)) return Response.json({success:false}); seen.add(body.response); return Response.json(outcome);
} });
delete env.TURNSTILE_SITE_KEY; delete env.TURNSTILE_SECRET_KEY; delete env.TURNSTILE_ENABLED;
await turnstile.verifyTurnstile(request(),undefined,"assistant"); assert.equal(verificationCalls,0);
env.TURNSTILE_ENABLED="true"; await assert.rejects(()=>turnstile.verifyTurnstile(request(),"token","assistant"),e=>e.status===503);
env.TURNSTILE_SITE_KEY="1x00000000000000000000AA"; env.TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA";
await assert.rejects(()=>turnstile.verifyTurnstile(request(),"token","assistant"),e=>e.status===503);
env.TURNSTILE_SITE_KEY="real-widget-fixture"; env.TURNSTILE_SECRET_KEY="server-secret-fixture";
await assert.rejects(()=>turnstile.verifyTurnstile(request(),"x".repeat(2049),"assistant"),e=>e.status===400);
await turnstile.verifyTurnstile(request(),"fresh-turnstile","assistant");
await assert.rejects(()=>turnstile.verifyTurnstile(request(),"fresh-turnstile","assistant"),e=>e.status===400);
outcome={success:true,hostname:"attacker.example",action:"assistant"};
await assert.rejects(()=>turnstile.verifyTurnstile(request(),"wrong-host","assistant"),e=>e.status===400);
outcome={success:true,hostname:"kittycorp.vercel.app",action:"contact"};
await assert.rejects(()=>turnstile.verifyTurnstile(request(),"wrong-action","assistant"),e=>e.status===400);
console.log("PASS: Google-only PKCE flow, owner UUID/email/subject checks, missing proof, expired/tampered cookies, code replay, canonical callback, Lax session handoff, direct-session rejection/revocation and Turnstile fail-closed/host/action/replay checks.");

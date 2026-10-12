import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
const env = { SITE_URL: "https://kitty.example", FEEDBACK_GATEWAY_TOKEN: "fixture-private-gateway" };
const messages = [], acknowledgements = [], logs = [];
let jobs = [], sendFailure = false, queueFailure = false;
const db = { rpc: async (name, args) => {
  assert.equal(args.p_gateway_token, env.FEEDBACK_GATEWAY_TOKEN);
  if (name === "kitty_website_claim_email") return queueFailure ? { error: new Error("fixture") } : { data: jobs.shift() || null };
  assert.equal(name, "kitty_website_finish_email"); acknowledgements.push(args); return { data: true };
} };
function source(file, mocks) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(code, { module: mod, exports: mod.exports, process: { env }, URL,
    console: { error: text => logs.push(text) },
    require: name => name === "server-only" ? {} : Object.hasOwn(mocks, name) ? mocks[name] : require(name),
  }, { filename: file });
  return mod.exports;
}
const email = source("lib/email-notifications.ts", {
  "./company-contact": { CONTACT_EMAIL: "kittycorp.info@gmail.com" },
  "./kitty-server": { database: () => db, setting: key => env[key] },
  nodemailer: { createTransport: options => {
    assert.equal(options.host, "smtp.gmail.com"); assert.equal(options.port, 465); assert.equal(options.secure, true);
    assert.equal(options.auth.user, "kittycorp.info@gmail.com"); assert.equal(options.auth.pass, "abcdefghijklmnop");
    assert.equal(options.logger, false); assert.equal(options.debug, false);
    return { sendMail: async message => {
      if (sendFailure) throw new Error("fixture-provider-secret-must-not-be-logged");
      messages.push(message); return { accepted: ["kittycorp.info@gmail.com"] };
    } };
  } },
});
assert.equal(email.emailConfiguration().configured, false);
assert.equal((await email.drainEmailQueue()).configured, false); assert.equal(acknowledgements.length, 0);
env.GMAIL_APP_PASSWORD = "bad"; assert.equal(email.emailConfiguration().configured, false);
env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop"; assert.equal(email.emailConfiguration().configured, true);
function job(kind, i = 1) { return { id: `00000000-0000-4000-8000-${String(i).padStart(12,"0")}`, claim_token: "10000000-0000-4000-8000-000000000001", name: "A real visitor", email: "visitor@example.com", message: "Private visitor details <script>never HTML</script>", kind, created_at: "2026-10-09T12:00:00Z" }; }
jobs = [job("message", 1), job("project", 2), job("review", 3), job("early-access", 4)];
const first = await email.drainEmailQueue(100);
assert.equal(first.sent, 3); assert.equal(jobs.length, 1);
assert.equal((await email.drainEmailQueue()).sent, 1);
assert.equal(acknowledgements.length, 4); assert(acknowledgements.every(a => a.p_error === null));
for (const message of messages) {
  assert.equal(message.to, "kittycorp.info@gmail.com"); assert.equal(message.replyTo, "visitor@example.com");
  assert.equal(message.from.address, "kittycorp.info@gmail.com"); assert.equal(message.html, undefined);
  assert.equal(message.disableFileAccess, true); assert.equal(message.disableUrlAccess, true);
  assert(!message.text.includes(env.GMAIL_APP_PASSWORD)); assert(!message.text.includes(env.FEEDBACK_GATEWAY_TOKEN));
}
sendFailure = true; jobs = [job("message", 5), job("message", 6)];
const failed = await email.drainEmailQueue();
assert.equal(failed.failed, 1); assert.equal(jobs.length, 1); assert.equal(acknowledgements.at(-1).p_error, "mail_failed");
sendFailure = false; queueFailure = true; assert.equal((await email.drainEmailQueue()).sent, 0);
assert(!logs.join(" ").includes("fixture-provider-secret")); assert(!logs.join(" ").includes(env.FEEDBACK_GATEWAY_TOKEN));
queueFailure = false; await email.sendTestEmail(); assert.equal(messages.at(-1).replyTo, undefined);
console.log("Email checks passed: missing-credential pause, fixed recipient, private replies, bounded queue processing, safe failures and test delivery adapter. No email was sent.");

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const env = {
  SITE_URL: "https://kitty.example",
  FEEDBACK_GATEWAY_TOKEN: "fixture-private-gateway",
  SMTP_APP_PASSWORD: "abcd efgh ijkl mnop",
};
const sent = [],
  receipts = [],
  calls = [];
let jobs = [],
  failure = null,
  claimError = false;
const admin = "kittycorp.info@gmail.com";
const database = () => ({
  rpc: async (name, args) => {
    assert.equal(name, "kitty_website_email_worker");
    assert.equal(args.p_gateway_token, env.FEEDBACK_GATEWAY_TOKEN);
    calls.push(args);
    if (args.p_action === "claim")
      return claimError
        ? { error: { message: "fixture" } }
        : { data: jobs.shift() || null };
    if (args.p_action === "finish") {
      receipts.push(args.p_value);
      return { data: { ok: true } };
    }
    if (args.p_action === "report")
      return { data: { id: "00000000-0000-4000-8000-000000000099" } };
    if (args.p_action === "cleanup")
      return { data: { removed_submissions: 0 } };
    throw Error("Unexpected action");
  },
});
function load(file, mocks = {}) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(
    code,
    {
      module: mod,
      exports: mod.exports,
      require: (name) =>
        name === "server-only"
          ? {}
          : Object.hasOwn(mocks, name)
            ? mocks[name]
            : require(name),
      process: { env },
      Buffer,
      URL,
      Date,
      Intl,
      console: { error: () => {} },
    },
    { filename: file },
  );
  return mod.exports;
}
const tokens = load("lib/newsletter-tokens.ts", {
  "./kitty-server": {
    setting: (key) => env[key],
    HttpError: class HttpError extends Error {
      constructor(message, status) {
        super(message);
        this.status = status;
      }
    },
  },
});
const templates = load("lib/email-templates.ts", {
  "./newsletter-tokens": tokens,
  "./company-contact": { CONTACT_EMAIL: admin },
});
const email = load("lib/email-notifications.ts", {
  "./company-contact": { CONTACT_EMAIL: admin },
  "./kitty-server": { database, setting: (key) => env[key] },
  "./email-templates": templates,
  nodemailer: {
    createTransport: (options) => {
      assert.equal(options.host, "smtp.gmail.com");
      assert.equal(options.port, 465);
      assert.equal(options.secure, true);
      assert.equal(options.tls.rejectUnauthorized, true);
      assert.equal(options.auth.user, admin);
      assert.equal(options.auth.pass, "abcdefghijklmnop");
      return {
        sendMail: async (message) => {
          if (failure) throw failure;
          sent.push(message);
          return { accepted: [message.to] };
        },
      };
    },
  },
});
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
function job(template, kind, n) {
  return {
    id: id(n),
    claim_token: id(900),
    template,
    kind,
    name: "Test Visitor",
    email: "kittycorp.info@gmail.com",
    message: "Private details <script>bad</script>\nService: Website",
    created_at: "2026-10-13T11:00:00Z",
    reference: "KC-" + id(n),
    signup_id: id(99),
    nonce: id(98),
    report_day: "2026-10-13",
  };
}
const project = templates.renderEmail(
  job("admin", "project", 1),
  "https://kitty.example",
);
assert.match(project.subject, /New Project Enquiry/);
assert.match(project.text, /Private details <script>bad<\/script>/);
assert.match(project.text, /KC-/);
assert.match(project.html, /Reply to client/);
assert.doesNotMatch(project.html, /<script>bad<\/script>/);
assert.match(project.html, /&lt;script&gt;/);
assert.equal(project.to, admin);
assert.equal(project.replyTo, admin);
const projectAck = templates.renderEmail(
  job("ack", "project", 2),
  "https://kitty.example",
);
assert.equal(projectAck.to, admin);
assert.match(projectAck.subject, /received your project enquiry/);
assert.match(projectAck.text, /KC-/);
assert.match(
  templates.renderEmail(job("admin", "message", 3), "https://kitty.example")
    .subject,
  /Contact Message/,
);
assert.match(
  templates.renderEmail(job("ack", "message", 4), "https://kitty.example").text,
  /Thanks for getting in touch/,
);
assert.match(
  templates.renderEmail(
    job("review_thanks", "review", 5),
    "https://kitty.example",
  ).subject,
  /Thank you for your review/,
);
const confirm = templates.renderEmail(
  job("confirm", "newsletter", 6),
  "https://kitty.example",
);
const welcome = templates.renderEmail(
  job("welcome", "newsletter", 7),
  "https://kitty.example",
);
assert.match(confirm.text, /newsletter\/confirm#/);
assert.match(welcome.text, /newsletter\/unsubscribe#/);
const report = templates.renderEmail(
  {
    ...job("report", "report", 8),
    totals: { project: 1, message: 1, review: 1, subscribed: 1 },
    active_subscribers: 4,
    items: [
      {
        kind: "review",
        name: "Test Visitor",
        message: "Useful & honest",
        moderation: "Private",
        occurred_at: "2026-10-13T11:00:00Z",
      },
    ],
    health: { accepted: 6, failed_attempts: 1, pending: 0, unresolved: 1 },
  },
  "https://kitty.example",
);
assert.match(report.text, /New project enquiries: 1/);
assert.match(report.text, /Useful & honest/);
assert.match(report.text, /tracking is not configured/);
assert.match(report.text, /SMTP acceptance is not guaranteed inbox delivery/);
assert.doesNotMatch(report.html, /Useful & honest/);
assert.match(report.html, /Useful &amp; honest/);
assert.equal(email.emailConfiguration().configured, true);
const confirmationToken = tokens.newsletterToken("confirm", id(99), id(98));
assert.match(confirmationToken, /\./);
assert.equal(tokens.verifyNewsletterToken("confirm", confirmationToken).id, id(99));
assert.throws(() => tokens.verifyNewsletterToken("unsubscribe", confirmationToken));
assert.throws(() => tokens.verifyNewsletterToken("confirm", confirmationToken.slice(0, -1) + "0"));
assert.equal(email.reportDay(new Date("2026-10-13T15:00:00Z")), "2026-10-13");
jobs = [
  job("admin", "project", 1),
  job("ack", "project", 2),
  job("admin", "message", 3),
  job("ack", "message", 4),
  job("review_thanks", "review", 5),
  job("confirm", "newsletter", 6),
  job("welcome", "newsletter", 7),
  { ...job("report", "report", 8), totals: {}, items: [], health: {} },
];
assert.equal((await email.drainEmailQueue(20)).sent, 8);
assert.equal(receipts.length, 8);
assert(receipts.every((x) => x.result === "accepted"));
assert(
  sent.every(
    (x) =>
      x.from.address === admin && x.disableFileAccess && x.disableUrlAccess,
  ),
);
assert(
  sent.every(
    (x) =>
      !x.text.includes(env.FEEDBACK_GATEWAY_TOKEN) &&
      !x.text.includes("abcdefghijklmnop"),
  ),
);
failure = { responseCode: 421, command: "RCPT TO" };
jobs = [job("ack", "message", 9)];
assert.equal((await email.drainEmailQueue(1)).failed, 1);
assert.equal(receipts.at(-1).result, "transient");
failure = { responseCode: 550, command: "RCPT TO" };
jobs = [job("ack", "message", 10)];
await email.drainEmailQueue(1);
assert.equal(receipts.at(-1).result, "rejected");
failure = { code: "ETIMEDOUT", command: "DATA" };
jobs = [job("ack", "message", 11)];
assert.equal((await email.drainEmailQueue(1)).uncertain, 1);
assert.equal(receipts.at(-1).result, "uncertain");
failure = { code: "ECONNECTION", command: "DATA" };
jobs = [job("ack", "message", 12)];
assert.equal((await email.drainEmailQueue(1)).uncertain, 1);
assert.equal(receipts.at(-1).result, "uncertain");
failure = null;
claimError = true;
assert.equal((await email.drainEmailQueue(1)).sent, 0);
claimError = false;
env.SMTP_SECURE = "false";
assert.equal(email.emailConfiguration().configured, false);
assert.equal((await email.drainEmailQueue(1)).configured, false);
let cronRuns = 0;
const CronError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
};
const cron = load("app/api/automation/daily/route.ts", {
  "@/lib/kitty-server": {
    HttpError: CronError,
    failure: (error) => ({ status: error.status || 500 }),
    privateJson: (data) => ({ status: 200, data }),
  },
  "@/lib/email-notifications": {
    runDailyAutomation: async () => {
      cronRuns++;
      return { configured: true };
    },
  },
});
const cronRequest = (authorization) => ({
  headers: { get: () => authorization },
});
assert.equal((await cron.GET(cronRequest(""))).status, 503);
env.CRON_SECRET = "fixture-secret-at-least-thirty-two-characters";
assert.equal((await cron.GET(cronRequest("Bearer bad"))).status, 401);
assert.equal(cronRuns, 0);
assert.equal(
  (await cron.GET(cronRequest("Bearer " + env.CRON_SECRET))).status,
  200,
);
assert.equal(cronRuns, 1);
console.log(
  "Email checks passed: project/contact/review/opt-in/report templates, HMAC link purpose/tamper checks, HTML escaping, TLS and sender, accepted receipts, transient/rejected/uncertain outcomes, bounded queue, missing configuration and cron authentication. Isolated fixtures; no real email or customer data.",
);

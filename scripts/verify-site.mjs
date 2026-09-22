import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

// Exercises the actual HTTP routes. Pass a local origin and the original private brief.
// Never logs credentials, cookies, JWTs, or feedback contents.
const origin = new URL(process.argv[2] || "http://localhost:5173").origin;
const briefPath = process.argv[3];
if (!briefPath)
  throw new Error("Pass the private brief path as the second argument.");
const password = readFileSync(briefPath, "utf8").match(
  /Admin Password:\s*(\S+)/,
)?.[1];
if (!password) throw new Error("No password found in supplied brief.");
let cookie = "";
const marker = `qa-${randomUUID()}`;
let noticeId;
let feedbackId;
async function api(path, method = "GET", body, extra = {}) {
  const response = await fetch(`${origin}${path}`, {
    method,
    headers: {
      Origin: origin,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...extra,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(60000),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  return { response, data };
}
for (const path of ["/", "/contact", "/admins"]) {
  const { response } = await api(path);
  assert.equal(response.status, 200, `${path} renders`);
}
assert.equal(
  (await api("/api/admin/feedback")).response.status,
  401,
  "private inbox blocks anonymous access",
);
assert.equal(
  (await api("/api/admin/notices", "POST", {})).response.status,
  401,
  "notice writes require authentication",
);
assert.equal(
  (
    await api(
      "/api/feedback",
      "POST",
      {},
      { Origin: "https://untrusted.example" },
    )
  ).response.status,
  403,
  "cross-origin writes blocked",
);
assert.equal(
  (
    await api("/api/feedback", "POST", {
      name: "A",
      email: "bad",
      message: "",
      startedAt: Date.now(),
    })
  ).response.status,
  400,
  "inputs validated",
);
console.log("PASS: routes, anonymous access, CSRF, input validation");
const login = await api("/api/admin/login", "POST", {
  username: process.env.ADMIN_LOGIN_ID,
  password,
});
assert.equal(
  login.response.status,
  200,
  `admin sign-in: ${login.data?.error || "unexpected response"}`,
);
const setCookie = login.response.headers.get("set-cookie");
assert.ok(setCookie?.includes("HttpOnly"), "session is HTTP-only");
assert.ok(
  /SameSite=Strict/i.test(setCookie),
  "session has strict same-site protection",
);
cookie = setCookie.split(";")[0];
try {
  assert.equal(
    (await api("/api/admin/feedback")).response.status,
    200,
    "admin inbox accessible",
  );
  const feedback = await api("/api/feedback", "POST", {
    name: "Kitty website verification",
    email: `${marker}@example.invalid`,
    message: `Integration verification ${marker}. Safe literal text: <script>not executable</script>`,
    website: "",
    startedAt: Date.now() - 5000,
  });
  assert.equal(
    feedback.response.status,
    200,
    `contact stored: ${feedback.data?.error || ""}`,
  );
  feedbackId = feedback.data.id;
  const inbox = await api("/api/admin/feedback");
  assert.ok(
    inbox.data.feedback.some((item) => item.id === feedbackId),
    "contact persisted in the admin inbox",
  );
  const created = await api("/api/admin/notices", "POST", {
    title: `Verification ${marker}`,
    body: "Temporary integration check. This record is deleted before publication.",
    category: "Development",
    published: false,
  });
  assert.equal(
    created.response.status,
    200,
    `notice created: ${created.data?.error || ""}`,
  );
  noticeId = created.data.notice.id;
  assert.ok(
    !(await api("/api/notices")).data.notices.some(
      (item) => item.id === noticeId,
    ),
    "draft is private",
  );
  const updated = await api(`/api/admin/notices/${noticeId}`, "PATCH", {
    title: `Verified ${marker}`,
    body: "Temporary integration check. This record is deleted before publication.",
    category: "Studio note",
    published: true,
  });
  assert.equal(updated.response.status, 200, "notice update and publication");
  assert.ok(
    (await api("/api/notices")).data.notices.some(
      (item) => item.id === noticeId,
    ),
    "published notice appears publicly",
  );
  assert.equal(
    (await api(`/api/admin/notices/${noticeId}`, "DELETE")).response.status,
    200,
    "notice deletion",
  );
  assert.ok(
    !(await api("/api/notices")).data.notices.some(
      (item) => item.id === noticeId,
    ),
    "deleted notice removed",
  );
  noticeId = undefined;
  console.log(
    "PASS: contact persistence, draft privacy, notice create/edit/publish/delete",
  );
} finally {
  if (noticeId) await api(`/api/admin/notices/${noticeId}`, "DELETE");
  const logout = await api("/api/admin/logout", "POST");
  assert.equal(
    logout.response.status,
    200,
    `sign out: ${logout.data?.error || ""}`,
  );
}
assert.equal(
  (await api("/api/admin/feedback")).response.status,
  401,
  "old cookie is invalid after sign out",
);
console.log("PASS: sign out revokes access, including replayed cookie");
console.log(`Verification feedback to clean up: ${feedbackId || "none"}`);

import assert from "node:assert/strict";
import { createHmac, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

// Run the actual server modules in isolated provider/cookie adapters. All credentials
// below are fixtures; the test never reads private env files or calls Razorpay.
const require = createRequire(import.meta.url);
const env = { NODE_ENV: "production", SITE_URL: "https://kitty.example", RAZORPAY_KEY_ID: "rzp_test_fixture",
  NEXT_PUBLIC_RAZORPAY_KEY_ID: "rzp_test_fixture", RAZORPAY_KEY_SECRET: "fixture-server-secret-for-tests", RAZORPAY_CHECKOUT_AMOUNT_PAISE: "100" };
const jar = new Map();
const writes = [];
const cookieStore = { get: name => jar.has(name) ? { value: jar.get(name) } : undefined,
  getAll: () => Array.from(jar, ([name, value]) => ({ name, value })),
  set: (name, value, options) => { writes.push({ name, value, options }); if (options.maxAge === 0) jar.delete(name); else jar.set(name, value); } };
function source(file, mocks = {}) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(code, { module: mod, exports: mod.exports,
    require: name => name === "server-only" ? {} : Object.hasOwn(mocks, name) ? mocks[name] : require(name),
    process: { env }, Buffer, URL, AbortSignal, crypto: webcrypto, Response, Request, TextDecoder, Uint8Array, console }, { filename: file });
  return mod.exports;
}
const headers = { cookies: async () => cookieStore };
const server = source("lib/kitty-server.ts", { "next/headers": headers });
let orderError, paymentError, badOrder = false, turnstileRequired = false, calls = 0, fetches = 0, serial = 0;
let createdOrder, payment;
class Provider {
  api = { rq: { defaults: {} } };
  constructor(config) { assert.equal(config.key_id, env.RAZORPAY_KEY_ID); assert.equal(config.key_secret, env.RAZORPAY_KEY_SECRET); }
  orders = { create: async input => {
    calls++; if (orderError) throw orderError;
    if (input.notes.purpose !== "donation") assert.equal(input.amount, 100);
    assert.equal(input.currency, "INR"); assert.equal(input.partial_payment, false);
    assert(input.receipt.length <= 40);
    createdOrder = { id: `order_Fixture${String(++serial).padStart(6, "0")}`, amount: badOrder ? 200 : input.amount, currency: input.currency,receipt:input.receipt,notes:input.notes };
    return createdOrder;
  },fetch:async id=>{assert.equal(id,createdOrder.id);return createdOrder;},all:async params=>{assert.equal(params.receipt,createdOrder.receipt);return {items:quoteMissing?[]:[createdOrder]};} };
  payments = { fetch: async id => { fetches++; if (paymentError) throw paymentError; assert.equal(id, "pay_Fixture000001"); return payment; } };
}
const helpers = source("lib/razorpay-server.ts", { razorpay: Provider, "./kitty-server": server });
// Isolated configuration and ledger adapters; provider/RLS governance is tested in test-commerce.
helpers.resolvedRazorpayConfiguration = async () => helpers.paymentConfiguration();
const ledger = new Map();
const paymentLedger = { recordPayment: async order => {const old=ledger.get(order.order_id);if(old && (old.amount_minor!==order.amount_minor || old.purpose!==order.purpose))throw new server.HttpError("Order mismatch",400);ledger.set(order.order_id,{...old,...order});},storedPayment:async (_provider,id)=>ledger.get(id)||null };
let quoteMissing=false,quoteState=null,accountCustomer=null;const ownedQuoteId="22222222-2222-4222-8222-222222222222";const ownedActions=[];const quoteActions=[];
const quoteBridge={reserveQuote:async(token,choice,reservation,amount)=>{assert.equal(token,"a".repeat(64));if(amount!==100)throw new server.HttpError("Stale quote",409);quoteState||={id:"11111111-1111-4111-8111-111111111111",reservation_id:reservation,order_id:null};return {quote:quoteState,amount:100,reference:`Q-${quoteState.id}-${choice}`};},quoteAction:async(action,_token,value)=>{quoteActions.push(action);if(action==="attach"){assert.equal(value.reservation,quoteState.reservation_id);quoteState.order_id=value.orderId;}if(action==="release")quoteState=null;}};
const dependencies = { "@/lib/customer-account-server":{optionalCustomer:async()=>accountCustomer,customerAction:async(customer,action,value)=>{assert.equal(customer.uid,"owner-fixture");assert.equal(action,"project");ownedActions.push(value.action);if(value.id!==ownedQuoteId)throw new server.HttpError("Not your record",404);if(value.action==="read")return {id:ownedQuoteId,status:"approved",amount_minor:103,choice:null,paid_minor:0,review_ready:false};if(value.action==="reserve"){quoteState||={id:ownedQuoteId,reservation_id:value.reservation,order_id:null};return quoteState;}if(value.action==="attach")quoteState.order_id=value.orderId;if(value.action==="release")quoteState=null;}}, "@/lib/project-quotes":source("lib/project-quotes.ts"), "@/lib/project-quotes-server":quoteBridge, "@/lib/payment-ledger":paymentLedger, "next/headers": headers, "@/lib/kitty-server": server, "@/lib/razorpay-server": helpers,
  "@/lib/turnstile-server": { verifyTurnstile: async (_request, token, action) => {
    assert.equal(action, "payment-order");
    if (turnstileRequired && token !== "valid-widget-fixture") throw new server.HttpError("Security check required", 400);
  } } };
const create = source("app/api/create-order/route.ts", dependencies).POST;
const verify = source("app/api/verify-payment/route.ts", dependencies).POST;
function request(path, body, options = {}) {
  return new Request(`https://kitty.example/api/${path}`, { method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://kitty.example", ...options.headers },
    body: options.raw ?? JSON.stringify(body) });
}
async function expectStatus(handler, path, body, status, options) {
  const response = await handler(request(path, body, options));
  assert.equal(response.status, status); assert.match(response.headers.get("cache-control"), /no-store/);
  const data = await response.json();
  assert(!JSON.stringify(data).includes(env.RAZORPAY_KEY_SECRET));
  return data;
}
const valid = { amount: 100, currency: "INR" };
for (const amount of [0, 99, -100, 100.5, "100", null, 100_000_001]) await expectStatus(create, "create-order", { ...valid, amount }, 400);
for (const currency of ["USD", "inr", null]) await expectStatus(create, "create-order", { ...valid, currency }, 400);
await expectStatus(create, "create-order", { amount: 100 }, 400);
await expectStatus(create, "create-order", { ...valid, amount: 200 }, 400);
await expectStatus(create, "create-order", { ...valid, receipt: "x".repeat(41) }, 400);
await expectStatus(create, "create-order", { ...valid, receipt: "<script>" }, 400);
await expectStatus(create, "create-order", valid, 403, { headers: { Origin: "https://evil.example" } });
await expectStatus(create, "create-order", valid, 403, { headers: { Origin: "" } });
await expectStatus(create, "create-order", valid, 415, { headers: { "Content-Type": "text/plain" } });
await expectStatus(create, "create-order", valid, 400, { raw: "{" });
await expectStatus(create, "create-order", valid, 413, { raw: "x".repeat(32001) });
assert.equal(calls, 0);
turnstileRequired = true;
await expectStatus(create, "create-order", valid, 400);
assert.equal(calls, 0); turnstileRequired = false;
orderError = { statusCode: 401, error: { description: env.RAZORPAY_KEY_SECRET } };
await expectStatus(create, "create-order", valid, 401);
orderError = { statusCode: 500 }; await expectStatus(create, "create-order", valid, 500); orderError = undefined;
badOrder = true; await expectStatus(create, "create-order", valid, 500); assert.equal(jar.size, 0); badOrder = false;
const result = await expectStatus(create, "create-order", valid, 200);
assert.equal(result.amount, 100); assert.equal(result.currency, "INR"); assert.equal(Object.keys(result).length, 3);
const cookie = writes.at(-1);
assert.equal(cookie.options.httpOnly, true); assert.equal(cookie.options.secure, true);
assert.equal(cookie.options.sameSite, "strict"); assert.equal(cookie.options.path, "/api"); assert.equal(cookie.options.maxAge, 3600);
const paymentId = "pay_Fixture000001";
const signature = createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(`${result.order_id}|${paymentId}`).digest("hex");
const callback = { razorpay_order_id: result.order_id, razorpay_payment_id: paymentId, razorpay_signature: signature };
payment = { id: paymentId, order_id: result.order_id, amount: 100, currency: "INR", amount_refunded: 0, captured: true, status: "captured" };
await expectStatus(verify, "verify-payment", {}, 400);
await expectStatus(verify, "verify-payment", { ...callback, razorpay_signature: "0".repeat(64) }, 400);
await expectStatus(verify, "verify-payment", { ...callback, razorpay_order_id: "order_Unknown000001" }, 400);
assert.equal(fetches, 0);
jar.set(cookie.name, cookie.value + "tampered"); await expectStatus(verify, "verify-payment", callback, 400);
jar.set(cookie.name, helpers.sealOrder({ orderId: result.order_id, amount: 100, currency: "INR", keyId: env.RAZORPAY_KEY_ID, expires: Date.now() - 1 }, env.RAZORPAY_KEY_SECRET));
await expectStatus(verify, "verify-payment", callback, 400); assert.equal(fetches, 0);
jar.set(cookie.name, cookie.value);
const captured = await expectStatus(verify, "verify-payment", callback, 200);
assert.equal(captured.success, true); assert.equal(captured.paid, true); assert.equal(captured.verified, true);
assert.equal((await expectStatus(verify, "verify-payment", callback, 200)).paid, true); // Safe repeat verification.
assert.equal((await expectStatus(verify, "verify-payment", { ...callback, razorpay_signature: signature.toUpperCase() }, 200)).paid, true);
for (const changed of [{ amount: 200 }, { currency: "USD" }, { order_id: "order_Unknown000002" }, { amount_refunded: 1 }, { status: "failed", captured: false }, { status: "captured", captured: false }]) {
  const original = payment; payment = { ...payment, ...changed }; await expectStatus(verify, "verify-payment", callback, 400); payment = original;
}
payment = { ...payment, status: "authorized", captured: false };
const authorized = await expectStatus(verify, "verify-payment", callback, 200);
assert.equal(authorized.verified, true); assert.equal(authorized.paid, false); assert.equal(authorized.success, false);
paymentError = { statusCode: 401 }; await expectStatus(verify, "verify-payment", callback, 401);
paymentError = { statusCode: 500 }; await expectStatus(verify, "verify-payment", callback, 500); paymentError = undefined;
env.NEXT_PUBLIC_RAZORPAY_KEY_ID = "rzp_test_wrong";
await expectStatus(create, "create-order", valid, 503); env.NEXT_PUBLIC_RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID;
delete env.RAZORPAY_KEY_SECRET;
await expectStatus(create, "create-order", valid, 503); env.RAZORPAY_KEY_SECRET = "fixture-server-secret-for-tests";
jar.clear(); writes.length = 0;
for (let i = 0; i < 7; i++) await expectStatus(create, "create-order", valid, 200);
assert.equal(jar.size, 5); assert(writes.some(entry => entry.options.maxAge === 0));
const maintenance = source("lib/maintenance.ts");
assert.equal(maintenance.recoveryPath("/api/verify-payment"), true);
assert.equal(maintenance.recoveryPath("/api/create-order"), false);
await expectStatus(create, "create-order", { ...valid, purpose: "unknown" }, 400);
await expectStatus(create, "create-order", { ...valid, purpose: "project", amount: 200, reference: "KITTY-01" }, 400);
await expectStatus(create, "create-order", { ...valid, purpose: "project", reference: "<script>" }, 400);
await expectStatus(create, "create-order", { ...valid, purpose: "project", reference: "x".repeat(81) }, 400);
await expectStatus(create, "create-order", { ...valid, purpose: "donation", amount: 1_000_001 }, 400);
const donation = await expectStatus(create, "create-order", { ...valid, purpose: "donation", amount: 25000 }, 200);
const donationContext = helpers.readOrder(jar.get(helpers.orderCookieName(donation.order_id)), env.RAZORPAY_KEY_SECRET, env.RAZORPAY_KEY_ID);
assert.equal(donationContext.purpose, "donation"); assert.equal(donationContext.amount, 25000);
payment = { id: paymentId, order_id: donation.order_id, amount: 25000, currency: "INR", amount_refunded: 0, captured: true, status: "captured" };
const donationCallback = { ...callback, razorpay_order_id: donation.order_id,
  razorpay_signature: createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(`${donation.order_id}|${paymentId}`).digest("hex") };
assert.equal((await expectStatus(verify, "verify-payment", donationCallback, 200)).purpose, "donation");
env.RAZORPAY_KEY_ID = env.NEXT_PUBLIC_RAZORPAY_KEY_ID = "rzp_live_fixture";
await expectStatus(create, "create-order", { ...valid, purpose: "project" }, 400);
await expectStatus(create,"create-order",{...valid,purpose:"project",reference:"Q-11111111-1111-4111-8111-111111111111-full"},400);
const project = await expectStatus(create, "create-order", { ...valid, purpose: "project", reference: "KITTY-01" }, 200);
const projectContext = helpers.readOrder(jar.get(helpers.orderCookieName(project.order_id)), env.RAZORPAY_KEY_SECRET, env.RAZORPAY_KEY_ID);
assert.equal(projectContext.purpose, "project"); assert.equal(projectContext.reference, "KITTY-01");
// A private quote reuses its order on retry; an uncertain concurrent creation
// queries the unique receipt and never blindly submits another order.
const quoteBody={...valid,purpose:"project",quoteToken:"a".repeat(64),paymentChoice:"full"};
await expectStatus(create,"create-order",{...quoteBody,amount:200},409);
let beforeQuotes=calls;const quoteOrder=await expectStatus(create,"create-order",quoteBody,200);assert.equal(calls,beforeQuotes+1);assert.equal(quoteActions.at(-1),"attach");
const quoteRetry=await expectStatus(create,"create-order",quoteBody,200);assert.equal(quoteRetry.order_id,quoteOrder.order_id);assert.equal(calls,beforeQuotes+1);
quoteState.order_id=null;quoteMissing=true;await expectStatus(create,"create-order",quoteBody,409);assert.equal(calls,beforeQuotes+1);quoteMissing=false;
const recovered=await expectStatus(create,"create-order",quoteBody,200);assert.equal(recovered.order_id,quoteOrder.order_id);assert.equal(calls,beforeQuotes+1);
const savedNotes=createdOrder.notes;createdOrder={...createdOrder,notes:{...savedNotes,project_reference:"OTHER-QUOTE"}};await expectStatus(create,"create-order",quoteBody,409);createdOrder={...createdOrder,notes:savedNotes};
quoteState=null;
const accountQuoteBody={...valid,purpose:"project",accountQuoteId:ownedQuoteId,paymentChoice:"full"};
let beforeAccount=calls;
await expectStatus(create,"create-order",accountQuoteBody,401);assert.equal(calls,beforeAccount);
accountCustomer={uid:"owner-fixture",email:"owner@example.invalid"};
await expectStatus(create,"create-order",{...accountQuoteBody,quoteToken:"a".repeat(64)},400);assert.equal(calls,beforeAccount);
await expectStatus(create,"create-order",{...accountQuoteBody,accountQuoteId:"33333333-3333-4333-8333-333333333333"},404);assert.equal(calls,beforeAccount);
await expectStatus(create,"create-order",{...accountQuoteBody,amount:200},409);assert.equal(calls,beforeAccount);
const ownedOrder=await expectStatus(create,"create-order",accountQuoteBody,200);assert.equal(calls,beforeAccount+1);assert.equal(ownedActions.at(-1),"attach");
assert.equal((await expectStatus(create,"create-order",accountQuoteBody,200)).order_id,ownedOrder.order_id);assert.equal(calls,beforeAccount+1);
accountCustomer=null;
console.log("Razorpay checks passed: original safeguards, server-controlled project totals/references, bounded voluntary contributions and signed purpose binding.");

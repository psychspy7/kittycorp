import assert from "node:assert/strict";
import { webcrypto,createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require=createRequire(import.meta.url);
const env={FEEDBACK_GATEWAY_TOKEN:"fixture-gateway-not-a-real-credential",NODE_ENV:"production",SITE_URL:"https://kitty.example"};
class HttpError extends Error{constructor(message,status){super(message);this.status=status;}}
const server={HttpError,setting:key=>env[key]||(()=>{throw Error("Missing fixture setting");})(),privateJson:data=>Response.json(data,{headers:{"Cache-Control":"private, no-store"}}),failure:error=>Response.json({error:error instanceof HttpError?error.message:"Invalid request"},{status:error instanceof HttpError?error.status:400,headers:{"Cache-Control":"no-store"}}),database:()=>({rpc:async()=>({data:null,error:null})})};
function load(file,mocks={},extras={}){const mod={exports:{}};const code=ts.transpileModule(readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{module:mod,exports:mod.exports,require:key=>key==="server-only"?{}:Object.hasOwn(mocks,key)?mocks[key]:require(key),process:{env},Buffer,crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,URL,AbortSignal,Request,Response,console,structuredClone,...extras},{filename:file});return mod.exports;}
const commerce=load("lib/commerce.ts",{"./company-content":{mediaPathPattern:/^(icons|portraits|screenshots)\/[0-9a-f-]{36}\.webp$/}});
const runtime=load("lib/runtime-configuration.ts",{react:{cache:fn=>fn},"./kitty-server":server});
const original={TURNSTILE_SITE_KEY:"fixture-site-key",TURNSTILE_SECRET_KEY:"fixture-turnstile-secret",KITTY_AI_WEBSITE_URL:"https://kitty-ai-v2.kitty-ai.workers.dev/api/website/chat",KITTY_AI_GATEWAY_TOKEN:"fixture-ai-gateway",PAYPAL_CLIENT_SECRET:"fixture-paypal-secret",WEBSITE_COMMERCE_SETTINGS:JSON.stringify(commerce.defaultCommerce)};
const encrypted=await runtime.encryptRuntimeConfiguration(original);
assert(!encrypted.includes(original.PAYPAL_CLIENT_SECRET));assert.notEqual(encrypted,await runtime.encryptRuntimeConfiguration(original));assert.deepEqual(JSON.parse(JSON.stringify(await runtime.decodeRuntimeConfiguration(encrypted))),original);
const tampered=JSON.parse(encrypted);tampered.data="ff"+tampered.data.slice(2);await assert.rejects(runtime.decodeRuntimeConfiguration(JSON.stringify(tampered)));
await assert.rejects(runtime.decodeRuntimeConfiguration(JSON.stringify({...tampered,v:9})));
let settings=structuredClone(commerce.defaultCommerce),keys={};
const governance=load("lib/commerce-server.ts",{react:{cache:fn=>fn},"./commerce":commerce,"./kitty-server":server,"./runtime-configuration":{getRuntimeConfiguration:async()=>({...keys,WEBSITE_COMMERCE_SETTINGS:JSON.stringify(settings)})}});
assert.equal((await governance.publicPaymentProviders()).length,0);
settings.providers.paypal.mode="live";keys.PAYPAL_CLIENT_ID="fixture-client";keys.PAYPAL_CLIENT_SECRET="fixture-secret";await assert.rejects(governance.providerConfiguration("paypal"),e=>e.status===503);
settings.providers.paypal.approved=true;await assert.rejects(governance.providerConfiguration("paypal"),e=>e.status===503);
keys.PAYPAL_WEBHOOK_ID="fixture-webhook";assert.equal((await governance.providerConfiguration("paypal")).testMode,false);
settings.providers.razorpay.mode="sandbox";keys.RAZORPAY_KEY_ID="rzp_live_fixture";keys.RAZORPAY_KEY_SECRET="fixture-secret";await assert.rejects(governance.providerConfiguration("razorpay"),e=>e.status===503);keys.RAZORPAY_KEY_ID="rzp_test_fixture";assert.equal((await governance.providerConfiguration("razorpay")).testMode,true);
settings.providers.cashfree.mode="off";keys.CASHFREE_CLIENT_ID="fixture-cashfree";keys.CASHFREE_CLIENT_SECRET="fixture-cashfree-secret";await assert.rejects(governance.providerConfiguration("cashfree"));assert.equal((await governance.providerConfiguration("cashfree","sandbox")).testMode,true);
assert(!JSON.stringify(await governance.publicPaymentProviders()).includes("fixture-secret"));
// A configured provider with no client quote still allows donations.
let readyOptions=await governance.publicPaymentProviders();
assert.equal(commerce.paymentOptionsForPurpose(readyOptions,"project").length,0);
assert.equal(commerce.paymentOptionsForPurpose(readyOptions,"donation").length,readyOptions.length);
let readiness=await governance.paymentProviderReadiness();
assert.equal(readiness.razorpay.available,true);assert.equal(readiness.razorpay.projectReady,false);
assert.equal(readiness.cashfree.available,false);assert(!JSON.stringify(readiness).includes("fixture-secret"));
settings.providers.razorpay.projectAmountMinor=10000;
assert.equal(commerce.paymentOptionsForPurpose(await governance.publicPaymentProviders(),"project").length,1);
assert.equal((await governance.paymentProviderReadiness()).razorpay.projectReady,true);
settings.providers.razorpay.projectAmountMinor=0;

assert(!commerce.commerceSchema.safeParse({...commerce.defaultCommerce,entitlements:true}).success);
assert(!commerce.gallerySchema.safeParse({path:"https://evil.example/pixel",title:"Preview",caption:"Long enough caption"}).success);
const ledger=[];let providerCalls=[];let scenario="created";let captured=false;
const pp={provider:"paypal",clientId:"fixture-client",secret:"fixture-paypal-secret",webhook:"fixture-webhook",testMode:true,currency:"USD",amount:100,mode:"sandbox"};
const cf={provider:"cashfree",clientId:"fixture-cashfree",secret:"fixture-cashfree-secret",webhook:"fixture-cashfree-secret",testMode:true,currency:"INR",amount:100,mode:"sandbox"};
let lastCashfreeId="";
const response=data=>Response.json(data);
const fakeFetch=async(url,options={})=>{providerCalls.push({url,options});assert(/^https:\/\/(api-m\.sandbox\.paypal\.com|sandbox\.cashfree\.com)/.test(url));if(url.endsWith("/v1/oauth2/token"))return response({access_token:"fixture-access-token"});
 if(scenario==="authfail")return responseWithStatus(401);
 if(url.endsWith("/verify-webhook-signature"))return response({verification_status:scenario==="bad-webhook"?"FAILURE":"SUCCESS"});
 if(url.includes("paypal.com")&&url.endsWith("/v2/checkout/orders")&&options.method==="POST")return response({id:"PAYPALORDER12345",status:scenario==="payer-action"?"PAYER_ACTION_REQUIRED":"CREATED"});
 if(url.includes("paypal.com")){const isCapture=url.endsWith("/capture");if(isCapture){assert.equal(options.headers["PayPal-Request-Id"],"kitty-capture-PAYPALORDER12345");captured=true;}return response({id:scenario==="wrong-id"?"DIFFERENTORDER":"PAYPALORDER12345",intent:"CAPTURE",status:captured?"COMPLETED":"APPROVED",purchase_units:[{amount:{currency_code:scenario==="wrong-currency"?"INR":"USD",value:scenario==="wrong-amount"?"2.00":"1.00"},payments:captured?{captures:[{id:"CAPTURE12345",status:scenario==="pending"?"PENDING":"COMPLETED",amount:{currency_code:"USD",value:"1.00"}}]}:undefined}]});}
 if(url.endsWith("/orders")&&options.method==="POST"){const body=JSON.parse(options.body);lastCashfreeId=body.order_id;assert.equal(body.order_amount,1);assert.equal(body.customer_details.customer_phone,"9999999999");assert(options.headers["x-idempotency-key"]);return response({order_id:lastCashfreeId,order_amount:1,order_currency:"INR",order_status:"ACTIVE",payment_session_id:"fixture-cashfree-session"});}
 if(url.endsWith("/payments"))return response([{cf_payment_id:"CFPAY12345",payment_status:"SUCCESS",payment_amount:scenario==="wrong-cf-payment"?2:1,payment_currency:"INR"}]);
 return response({order_id:scenario==="wrong-id"?"DIFFERENTORDER":lastCashfreeId,order_amount:scenario==="wrong-amount"?2:1,order_currency:scenario==="wrong-currency"?"USD":"INR",order_status:scenario==="cf-pending"?"ACTIVE":"PAID"});};
function responseWithStatus(status){return Response.json({error:"fixture-private-provider-error"},{status});}
const alternative=load("lib/alternative-payments.ts",{"./kitty-server":server,"./commerce-server":{},"./payment-ledger":{recordPayment:async order=>ledger.push(order)}},{fetch:fakeFetch});
const value={amount:100,purpose:"project",reference:"KITTY-01"};
assert.equal(alternative.resolveAmount(value,pp),100);assert.throws(()=>alternative.resolveAmount({...value,amount:200},pp),e=>e.status===400);assert.throws(()=>alternative.resolveAmount({...value,reference:""},{...pp,testMode:false}),e=>e.status===400);assert.throws(()=>alternative.resolveAmount({...value,purpose:"donation",amount:1000001},pp));
scenario="payer-action";await alternative.createAlternative(pp,value);scenario="created";const created=await alternative.createAlternative(pp,value);const ctx=created.ctx;const sealed=alternative.sealAlternative(ctx);assert.equal(alternative.readAlternative(sealed,pp).orderId,ctx.orderId);
for(const [cookie,config]of[[sealed+"x",pp],[sealed,{...pp,clientId:"other"}],[sealed,{...pp,testMode:false}],[alternative.sealAlternative({...ctx,expires:1}),pp],[sealed,cf]])assert.equal(alternative.readAlternative(cookie,config),null);
for(const change of ["wrong-id","wrong-amount","wrong-currency"]){scenario=change;await assert.rejects(alternative.verifyAlternative(pp,ctx,true));assert.equal(captured,false);}
scenario="created";const paid=await alternative.verifyAlternative(pp,ctx,true);assert.equal(paid.paid,true);assert.equal(ledger.at(-1).status,"paid");const captures=providerCalls.filter(c=>c.url.endsWith("/capture")).length;await alternative.verifyAlternative(pp,ctx,true);assert.equal(providerCalls.filter(c=>c.url.endsWith("/capture")).length,captures);
scenario="pending";assert.equal((await alternative.verifyAlternative(pp,ctx,false)).paid,false);
scenario="authfail";await assert.rejects(alternative.verifyAlternative(pp,ctx,false),e=>e.status===401);
scenario="created";await assert.rejects(alternative.createAlternative(cf,value),e=>e.status===400);const cfCreated=await alternative.createAlternative(cf,{...value,email:"fixture@example.invalid",phone:"9999999999"});assert.equal(cfCreated.sessionId,"fixture-cashfree-session");assert.equal((await alternative.verifyAlternative(cf,cfCreated.ctx)).paid,true);
for(const change of ["wrong-id","wrong-amount","wrong-currency","wrong-cf-payment"]){scenario=change;await assert.rejects(alternative.verifyAlternative(cf,cfCreated.ctx));}scenario="cf-pending";assert.equal((await alternative.verifyAlternative(cf,cfCreated.ctx)).paid,false);
const webhook=load("app/api/payments/webhooks/[provider]/route.ts",{"@/lib/kitty-server":server,"@/lib/commerce-server":{getCommerce:async()=>({runtime:{RAZORPAY_WEBHOOK_SECRET:"fixture-rzp-webhook",CASHFREE_CLIENT_SECRET:cf.secret}}),providerConfiguration:async provider=>provider==="cashfree"?cf:pp},"@/lib/alternative-payments":alternative,"@/lib/payment-ledger":{recordPayment:async order=>ledger.push(order),storedPayment:async(provider,id)=>({provider,order_id:id,environment:"sandbox",purpose:"project",reference:"KITTY-01",amount_minor:100,currency:provider==="paypal"?"USD":"INR"})},"@/lib/razorpay-server":{razorpayClient:()=>({payments:{fetch:async()=>({id:"pay_Fixture12345",order_id:"order_Fixture12345",amount:100,currency:"INR",status:"captured",captured:true,amount_refunded:0})}})}}).POST;
async function hook(provider,body,headers={},status=200){const result=await webhook(new Request(`https://kitty.example/api/payments/webhooks/${provider}`,{method:"POST",headers,body}),{params:Promise.resolve({provider})});assert.equal(result.status,status);assert.match(result.headers.get("cache-control"),/no-store/);}
const rzpBody=JSON.stringify({event:"payment.captured",payload:{payment:{entity:{id:"pay_Fixture12345",order_id:"order_Fixture12345"}}}});await hook("razorpay",rzpBody,{},400);await hook("razorpay",rzpBody,{"x-razorpay-signature":createHmac("sha256","fixture-rzp-webhook").update(rzpBody).digest("hex")});await hook("razorpay",rzpBody+" ",{"x-razorpay-signature":createHmac("sha256","fixture-rzp-webhook").update(rzpBody).digest("hex")},400);
scenario="created";const cfBody=JSON.stringify({type:"PAYMENT_SUCCESS_WEBHOOK",data:{order:{order_id:lastCashfreeId}}});const tsValue=String(Date.now());await hook("cashfree",cfBody,{"x-webhook-timestamp":tsValue,"x-webhook-signature":"wrong"},400);await hook("cashfree",cfBody,{"x-webhook-timestamp":tsValue,"x-webhook-signature":createHmac("sha256",cf.secret).update(tsValue+cfBody).digest("base64")});
scenario="bad-webhook";const ppBody=JSON.stringify({event_type:"PAYMENT.CAPTURE.COMPLETED",resource:{supplementary_data:{related_ids:{order_id:"PAYPALORDER12345"}}}});const ppHeaders={"paypal-auth-algo":"SHA256withRSA","paypal-cert-url":"https://api.sandbox.paypal.com/v1/notifications/certs/FIXTURE","paypal-transmission-id":"fixture-transmission","paypal-transmission-sig":"fixture-signature","paypal-transmission-time":"2026-10-12T06:00:00Z"};await hook("paypal",ppBody,{},400);await hook("paypal",ppBody,ppHeaders,400);scenario="created";await hook("paypal",ppBody,ppHeaders);await hook("cashfree","x".repeat(32001),{},413);
const maintenance=load("lib/maintenance.ts");for(const path of ["/api/payments/webhooks/paypal","/api/payments/paypal/verify","/api/payments/cashfree/verify","/api/memberships/webhook","/api/memberships/verify","/api/memberships/status","/api/memberships/cancel"])assert(maintenance.recoveryPath(path));assert(!maintenance.recoveryPath("/api/payments/cashfree/order"));assert(!maintenance.recoveryPath("/api/memberships/order"));
assert.equal(commerce.alternativeOrderSchema,undefined);assert(!alternative.alternativeOrderSchema.safeParse({...value,purpose:"membership"}).success);
const metadata=load("lib/site-metadata.ts");assert(metadata.jsonLd({text:"</script>"}).includes("\\u003c"));assert.equal(metadata.pageMetadata("Services","A clear description","/services").alternates.canonical,"/services");
// Studio writes preserve unrelated credentials and reject stale edits; secrets never return.
let adminAllowed=true, storedRow={ciphertext:encrypted,updated_at:"2026-10-11T00:00:00Z"}, written=null, loseRace=false;
const adminDb={from:()=>{let operation="read",payload=null;const chain={select:()=>chain,eq:()=>chain,update:value=>{operation="update";payload=value;return chain;},insert:value=>{operation="insert";payload=value;return chain;},maybeSingle:async()=>{if(operation==="read")return {data:storedRow,error:null};if(loseRace)return {data:null,error:null};written=payload;storedRow=payload;return {data:{updated_at:payload.updated_at},error:null};},single:async()=>chain.maybeSingle()};return chain;}};
const adminServer={...server,requireAdmin:async()=>{if(!adminAllowed)throw new HttpError("Sign in",401);return {db:adminDb};},readBody:request=>request.json(),verifyOrigin:request=>{if(request.headers.get("origin")!=="https://kitty.example")throw new HttpError("Invalid origin",403);}};
const admin=load("app/api/admin/commerce/route.ts",{"next/cache":{revalidatePath:()=>{}},"@/lib/commerce":commerce,"@/lib/commerce-server":{getCommerce:async()=>({settings:commerce.defaultCommerce,runtime:original}),paymentProviderReadiness:async()=>({razorpay:{available:false,mode:"off",projectReady:false,message:"Disabled"}})},"@/lib/runtime-configuration":runtime,"@/lib/kitty-server":adminServer});
adminAllowed=false;assert.equal((await admin.GET()).status,401);adminAllowed=true;
const visible=await (await admin.GET()).json();assert.equal(visible.configured.PAYPAL_CLIENT_SECRET,true);assert(!JSON.stringify(visible).includes("fixture-paypal-secret"));
const payload={settings:commerce.defaultCommerce,version:storedRow.updated_at,credentials:{PAYPAL_CLIENT_SECRET:"new-private-fixture",CASHFREE_CLIENT_SECRET:"fixture-new-cashfree"}};
const patch=(value,origin="https://kitty.example")=>admin.PATCH(new Request("https://kitty.example/api/admin/commerce",{method:"PATCH",headers:{origin,"content-type":"application/json"},body:JSON.stringify(value)}));
assert.equal((await patch(payload,"https://foreign.example")).status,403);assert.equal(written,null);
assert.equal((await patch({...payload,version:"stale"})).status,409);assert.equal(written,null);
loseRace=true;assert.equal((await patch(payload)).status,409);assert.equal(written,null);loseRace=false;
assert.equal((await patch(payload)).status,200);const preserved=await runtime.decodeRuntimeConfiguration(written.ciphertext);
assert.equal(preserved.KITTY_AI_GATEWAY_TOKEN,original.KITTY_AI_GATEWAY_TOKEN);assert.equal(preserved.TURNSTILE_SECRET_KEY,original.TURNSTILE_SECRET_KEY);assert.equal(preserved.PAYPAL_CLIENT_SECRET,"new-private-fixture");
assert.equal((await patch({settings:commerce.defaultCommerce,version:storedRow.updated_at,credentials:{PAYPAL_CLIENT_SECRET:null,CASHFREE_CLIENT_SECRET:""}})).status,200);
const removed=await runtime.decodeRuntimeConfiguration(written.ciphertext);assert.equal(removed.PAYPAL_CLIENT_SECRET,undefined);assert.equal(removed.CASHFREE_CLIENT_SECRET,"fixture-new-cashfree");
console.log("Commerce checks passed: encrypted credentials, provider mode gates, amount/currency binding, signed and expired sessions, verified captures, safe retries, tampered webhooks, maintenance recovery and closed membership checkout, private Studio responses and concurrent-save protection. No real providers contacted.");

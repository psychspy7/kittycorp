import assert from "node:assert/strict";
import {createHmac,webcrypto} from "node:crypto";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";
// Isolated adapters execute the real server code. Fixture secrets only; no network or private env.
const require=createRequire(import.meta.url);
const env={KITTY_MEMBERSHIP_BACKEND:"https://kitty-ai-v2.kitty-ai.workers.dev",KITTY_COMMERCE_GATEWAY_TOKEN:"fixture-gateway-token-long-enough-32"};
class HttpError extends Error{constructor(message,status){super(message);this.status=status;}}
const config={keyId:"rzp_test_fixture",keySecret:"fixture-payment-secret",webhookSecret:"fixture-webhook-secret-long",previousWebhookSecret:"fixture-previous-secret-long",testMode:true,enabled:true};
const intents=new Map();let payment,created=0,fetches=0,reconciled=0,serial=0;
class Provider{
 api={rq:{defaults:{}}};
 constructor(c){assert.equal(c.key_id,config.keyId);assert.equal(c.key_secret,config.keySecret);}
 orders={
 create:async input=>{created++;assert.equal(input.amount,9900);assert.equal(input.currency,"INR");assert.equal(input.partial_payment,false);assert.equal(input.notes.purpose,"membership");assert.equal(input.notes.product,"kitty");assert(!JSON.stringify(input).includes("alice"));return{id:"order_Fixture"+String(++serial).padStart(6,"0"),amount:input.amount,currency:"INR"};},
 fetchPayments:async()=>({items:payment?[payment]:[]})
 };
 payments={fetch:async id=>{fetches++;assert.equal(id,payment.id);return payment;}};
}
function response(data,status=200){return new Response(JSON.stringify(data),{status});}
async function bridge(url,options){
 assert.equal(options.headers["X-Kitty-Commerce-Token"],env.KITTY_COMMERCE_GATEWAY_TOKEN);
 assert.equal(options.redirect,"error");assert.equal(options.cache,"no-store");
 const path=new URL(url).pathname.slice(5),token=options.headers.Authorization?.slice(7),body=options.body?JSON.parse(options.body):undefined;
 if(path==="commerce/provider")return response(config);
 if(path==="memberships/catalog")return response({plans:[],purchasesEnabled:false});
 if(path==="commerce/intents"&&options.method==="POST"){
  const old=intents.get(body.id);
  if(old&&old.uid!==token)return response({error:"Wrong account"},409);
  const intent=old||{id:body.id,uid:token,product:"kitty",plan_id:body.planId,provider_key_id:config.keyId,status:"created",terms:{amount:9900,months:1,chatLimit:100,speechLimit:10}};
  intents.set(body.id,intent);return response(intent);
 }
 if(path.startsWith("commerce/intents/")){
  const intent=intents.get(path.split("/").at(-1));
  if(!intent||intent.uid!==token)return response({error:"Not found"},404);
  if(options.method==="PUT")intent.provider_order_id=body.orderId;
  if(options.method==="DELETE")intent.status="cancelled";
  return response(intent);
 }
 if(path==="commerce/order"){
  const intent=[...intents.values()].find(x=>x.provider_order_id===body.orderId);
  return intent?response(intent):response({error:"Not a membership"},404);
 }
 if(path==="commerce/reconcile"){reconciled++;return response({status:body.status,active:body.captured&&body.status==="captured"&&body.refunded===0});}
 throw Error("Unexpected bridge path "+path);
}
function source(file,mocks={}){
 const code=ts.transpileModule(readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const mod={exports:{}};
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:name=>name==="server-only"?{}:Object.hasOwn(mocks,name)?mocks[name]:require(name),process:{env},fetch:bridge,Buffer,URL,AbortSignal,crypto:webcrypto,Response,Request,TextDecoder,console},{filename:file});
 return mod.exports;
}
const helpers=source("lib/razorpay-server.ts",{razorpay:Provider,"./kitty-server":{HttpError}});
const api=source("lib/membership-server.ts",{"./kitty-server":{HttpError},"./razorpay-server":helpers,"./membership-types":{draftMemberships:{plans:[],purchasesEnabled:false}}});
const request=(uid="alice")=>new Request("https://kitty.example/api/memberships/order",{headers:uid?{Authorization:"Bearer "+uid}:{}});
async function rejects(fn,status){await assert.rejects(fn,e=>e.status===status);}
const id="2f6dd6b4-cdc1-4bb0-bb90-1a8b8e7394d9";
await rejects(()=>api.createMembership(request(null),{id,planId:"kitty-plus"}),401);
await assert.rejects(()=>api.createMembership(request(),{id,planId:"kitty-plus",amount:1}));
assert.equal(created,0);
config.enabled=false;
await rejects(()=>api.createMembership(request(),{id,planId:"kitty-plus"}),503);
assert.equal(created,0);config.enabled=true;
const order=await api.createMembership(request(),{id,planId:"kitty-plus"});
assert.equal(order.amount,9900);assert.equal(order.currency,"INR");
assert(!JSON.stringify(order).includes(config.keySecret));
assert(!JSON.stringify(order).includes(config.webhookSecret));
await api.createMembership(request(),{id,planId:"kitty-plus"});assert.equal(created,1);
payment={id:"pay_Fixture000001",order_id:order.orderId,amount:9900,currency:"INR",status:"captured",captured:true,amount_refunded:0};
const callback={intentId:id,razorpay_order_id:order.orderId,razorpay_payment_id:payment.id,razorpay_signature:createHmac("sha256",config.keySecret).update(order.orderId+"|"+payment.id).digest("hex")};
await rejects(()=>api.verifyMembership(request("bob"),callback),404);assert.equal(fetches,0);assert.equal(reconciled,0);
await rejects(()=>api.verifyMembership(request(),{...callback,razorpay_signature:"0".repeat(64)}),400);assert.equal(fetches,0);
payment.amount=100;await rejects(()=>api.verifyMembership(request(),callback),409);assert.equal(reconciled,0);payment.amount=9900;
assert.equal((await api.verifyMembership(request(),callback)).active,true);
payment.status="authorized";payment.captured=false;assert.equal((await api.verifyMembership(request(),callback)).active,false);
payment.status="captured";payment.captured=true;payment.amount_refunded=1;assert.equal((await api.verifyMembership(request(),callback)).active,false);payment.amount_refunded=0;
await api.cancelMembership(request(),{intentId:id});assert.equal(intents.get(id).status,"cancelled");
await rejects(()=>api.cancelMembership(request("bob"),{intentId:id}),404);
assert.equal((await api.membershipPaymentStatus(request(),{intentId:id})).active,true);
const raw=JSON.stringify({event:"payment.captured",payload:{payment:{entity:{id:payment.id}}}});
const signature=secret=>createHmac("sha256",secret).update(raw).digest("hex");
const before=reconciled;
await rejects(()=>api.webhookMembership(raw+" ",signature(config.webhookSecret),"fixture-event"),400);
assert.equal(reconciled,before);
await api.webhookMembership(raw,signature(config.webhookSecret),"fixture-event");
await api.webhookMembership(raw,signature(config.previousWebhookSecret),"fixture-retry");
payment.order_id="order_Service000001";
assert.equal((await api.webhookMembership(raw,signature(config.webhookSecret),"fixture-service")).ignored,true);
const saved=env.KITTY_MEMBERSHIP_BACKEND;env.KITTY_MEMBERSHIP_BACKEND="https://untrusted.example";
await rejects(()=>api.commerce("commerce/provider"),503);env.KITTY_MEMBERSHIP_BACKEND=saved;
console.log("Membership server checks passed: immutable order price, retry reuse, ownership, signature/status/refund verification, cancellation recovery, raw webhook integrity, rotated webhook secret, service separation and trusted bridge. Isolated fixtures; no live provider charge.");

import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require=createRequire(import.meta.url);
function load(file,mocks={}){const loaded={exports:{}};const code=ts.transpileModule(readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{module:loaded,exports:loaded.exports,require:key=>mocks[key]||require(key),Date,Request,Response,Buffer,AbortSignal,console},{filename:file});return loaded.exports;}
const validation=load("lib/enquiries.ts");
const body={name:"Example Customer",email:"example@example.invalid",service:"Website",message:"A simple course website with a clear admissions enquiry.",startedAt:Date.now()-3000};
assert(validation.enquirySchema.safeParse(body).success,"Four-field enquiry is supported");
assert.equal(validation.enquirySchema.parse(body).paymentChoice,undefined,"No payment decision is implied");
for(const value of [{...body,email:"wrong"},{...body,name:"x"},{...body,message:"short"},{...body,service:"unapproved"}])assert(!validation.enquirySchema.safeParse(value).success);
let writes=[],queued=[],customer=null,challengeAllowed=true;
class HttpError extends Error{constructor(message,status){super(message);this.status=status;}}
const server={HttpError,verifyOrigin:r=>{if(r.headers.get("origin")!=="http://localhost:3000")throw new HttpError("Origin",403);},readBody:r=>r.json(),fingerprint:async()=>"fixture-visitor",privateJson:v=>Response.json(v,{headers:{"Cache-Control":"private, no-store"}}),failure:e=>Response.json({error:e.message},{status:e.status||400})};
const route=load("app/api/enquiries/route.ts",{"@/lib/customer-account-server":{optionalCustomer:async()=>customer},"@/lib/project-quotes-server":{quoteAction:async(...args)=>{writes.push(args);return {id:"11111111-1111-4111-8111-111111111111",feedback_id:"22222222-2222-4222-8222-222222222222"};}},"@/lib/kitty-server":server,"@/lib/enquiries":validation,"@/lib/turnstile-server":{verifyTurnstile:async()=>{if(!challengeAllowed)throw new HttpError("Challenge",400);}},"@/lib/email-notifications":{drainEmailQueue:async(...args)=>{queued.push(args);return {sent:0,failed:1};}}});
const submit=(value,origin="http://localhost:3000")=>route.POST(new Request("http://localhost:3000/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json",Origin:origin},body:JSON.stringify(value)}));
const result=await submit(body);assert.equal(result.status,200);assert.match(result.headers.get("cache-control"),/no-store/);const saved=await result.json();assert.match(saved.quoteToken,/^[a-f0-9]{64}$/);assert.equal(saved.reference,"Q-11111111-1111-4111-8111-111111111111");assert.equal(saved.accountLinked,false);assert.equal(writes[0][2].preference,"Not discussed; agree after scope and quote");assert.equal(writes[0][2].budget,"");assert.equal(queued[0][1].feedback_id,"22222222-2222-4222-8222-222222222222");
const before=writes.length;assert.equal((await submit(body,"https://foreign.example")).status,403);assert.equal((await submit({...body,startedAt:Date.now()})).status,400);challengeAllowed=false;assert.equal((await submit(body)).status,400);assert.equal(writes.length,before);
challengeAllowed=true;customer={uid:"fixture-customer",email:"other@example.invalid"};assert.equal((await submit(body)).status,400);assert.equal(writes.length,before);
customer={uid:"fixture-customer",email:body.email};assert.equal((await submit(body)).status,200);assert.equal(writes.at(-1)[2].customer_uid,"fixture-customer");
console.log("PASS: short guest enquiries, optional fields, deferred payment choice, protected origins/challenge/timing, account ownership, private references and notification routing. No real records or emails.");

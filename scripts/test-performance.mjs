import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require=createRequire(import.meta.url);
const env={SUPABASE_URL:"https://website-fixture.supabase.co"};
function source(file,mocks={},extras={}){
  const code=ts.transpileModule(readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const mod={exports:{}};
  vm.runInNewContext(code,{module:mod,exports:mod.exports,require:name=>name==="server-only"?{}:Object.hasOwn(mocks,name)?mocks[name]:require(name),process:{env},Promise,URL,Response,AbortSignal,Date,console,...extras});
  return mod.exports;
}
const {singleFlight}=source("lib/single-flight.ts");
let reads=0;
const shared=singleFlight(async()=>{reads++;await new Promise(resolve=>setTimeout(resolve,5));return reads;});
assert((await Promise.all(Array.from({length:100},()=>shared()))).every(value=>value===1));
assert.equal(reads,1);assert.equal(await shared(),2);
let retries=0;
const retry=singleFlight(async()=>{if(++retries===1)throw Error("temporary");return "recovered";});
await assert.rejects(retry());assert.equal(await retry(),"recovered");

let clock=0;
const stored=new Map(),registrations=[],invalidations=[];
const nextCache={unstable_cache:(read,keys,options)=>{
  registrations.push({keys,options});const key=keys.join("|");
  return async()=>{const hit=stored.get(key);if(hit&&clock-hit.at<options.revalidate*1000)return hit.value;
    const value=await read();stored.set(key,{value,at:clock,tags:options.tags});return value;};
},revalidateTag:(tag,profile)=>{assert.equal(profile.expire,0);invalidations.push(tag);for(const [key,entry]of stored)if(entry.tags.includes(tag))stored.delete(key);},revalidatePath:()=>{}};
const publicCache=source("lib/public-content-cache.ts",{"next/cache":nextCache,"./single-flight":{singleFlight}});
const tableCalls=new Map();let failureTable;
const fixture={
  kitty_website_products:[{slug:"kitty-ai",name:"KITTY AI",published:true,sort_order:0}],
  kitty_website_team:[{id:"founder",name:"Founder",published:true,sort_order:0}],
  kitty_website_company:[{id:"company",socials:{}}],
  kitty_website_launches:[{slug:"released-app",published:true,published_at:"2020-01-01",apk_path:"releases/example.apk"}],
  kitty_website_journal:[{slug:"a-build",kind:"article",published:true,entry_date:"2020-01-01",body:"Article body"},{slug:"future",kind:"article",published:true,entry_date:"2099-01-01"}],
  kitty_website_testimonials:[{id:"review",quote:"A real permitted review",published:true,permission_confirmed:true},{id:"no-permission",published:true,permission_confirmed:false}],
  kitty_website_notices:[{id:"notice",title:"Update",published:true,published_at:"2020-01-01"}],
};
const database=(token)=>{assert.equal(token,undefined,"Public caches must use an anonymous client");return{from:table=>{
  const filters=[];let one=false,columns="*";
  const query={select:cols=>{columns=cols;return query;},eq:(key,value)=>{filters.push(row=>row[key]===value);return query;},lte:(key,value)=>{filters.push(row=>row[key]<=value);return query;},order:()=>query,limit:()=>query,single:()=>{one=true;return query;},maybeSingle:()=>{one=true;return query;},then:(resolve,reject)=>{
    tableCalls.set(table,(tableCalls.get(table)||0)+1);
    if(failureTable===table)return Promise.resolve({data:null,error:Error("temporary")}).then(resolve,reject);
    const rows=structuredClone(fixture[table]).filter(row=>filters.every(filter=>filter(row))).map(row=>columns==="*"?row:Object.fromEntries(columns.split(",").map(key=>[key,row[key]])));
    return Promise.resolve({data:one?rows[0]??null:rows,error:null}).then(resolve,reject);
  }};return query;
}};};
class HttpError extends Error{constructor(message,status){super(message);this.status=status;}}
const common={"react":{cache:fn=>fn},"next/cache":nextCache,"./kitty-server":{database,HttpError},"./public-content-cache":publicCache};
const products=source("lib/products.ts");
const content=source("lib/company-content.ts",{"./products":products});
const company=source("lib/company-server.ts",{...common,"./company-content":content});
await Promise.all(Array.from({length:50},()=>company.companyProducts()));assert.equal(tableCalls.get("kitty_website_products"),1);
fixture.kitty_website_products[0].name="Updated icon and product";
assert.equal((await company.companyProducts())[0].name,"KITTY AI");company.refreshCompany();
assert.equal((await company.companyProducts())[0].name,"Updated icon and product");
clock+=61000;await company.companyProducts();assert.equal(tableCalls.get("kitty_website_products"),3);
company.refreshCompany();failureTable="kitty_website_products";await company.companyProducts();failureTable=undefined;
assert.equal((await company.companyProducts())[0].name,"Updated icon and product","Failures must not persist fallback data");
const appRelease=source("lib/kitty-app-release.ts");
const launches=source("lib/launches-server.ts",{...common,"./kitty-app-release":appRelease,"./launches":{MAX_APK_BYTES:50e6,RELEASE_BUCKET:"fixture"},"./secretchat":{secretChat:{}},"./company-content":content});
const bundled=await launches.verifyRelease({}, {slug:"kitty-ai",apk_path:appRelease.kittyAppRelease.apk,published:true});assert.equal(bundled.apk_sha256,appRelease.kittyAppRelease.sha256);assert.equal(bundled.apk_bytes,4479005);
await launches.publishedLaunches();fixture.kitty_website_launches[0].published=false;
assert.equal(await launches.publishedLaunch("released-app"),null,"Downloads must see current publication status even with a warm listing cache");
launches.refreshLaunchPages();assert.equal((await launches.publishedLaunches()).length,0);
const journal=source("lib/journal-server.ts",{...common,"./journal":{journalCategories:["AI","Robotics","Engineering","Research","Company"]}});
const summaries=await journal.publicJournal();assert.equal(summaries.length,1);assert(!Object.hasOwn(summaries[0],"body"));journal.refreshJournal();
const reviews=source("lib/testimonials-server.ts",common);
assert.equal((await reviews.publicTestimonials()).length,1);fixture.kitty_website_testimonials[0].permission_confirmed=false;reviews.refreshTestimonials();assert.equal((await reviews.publicTestimonials()).length,0);
const notices=source("lib/notices-server.ts",common);await notices.publicNotices();fixture.kitty_website_notices[0].published=false;notices.refreshNotices();assert.equal((await notices.publicNotices()).length,0);
const settings = source("lib/assistant-settings.ts");
let assistantEnabled = true;
const presentation = source("lib/assistant-presentation.ts", {
  "./public-content-cache":publicCache, "./assistant-settings":settings,
  "./assistant-settings-server": { getAssistantSettings:async()=>({...settings.defaultAssistantSettings,enabled:assistantEnabled,guidance:"private owner instructions"}),assistantConnectionConfigured:async()=>true },
  "./turnstile-server":{turnstilePublicConfig:async()=>({enabled:true,siteKey:"public-site-key"})},
});
const publicConfig=await presentation.publicAssistantPresentation();
assert.equal(publicConfig.settings.enabled,true);assert.equal(publicConfig.siteKey,"public-site-key");
assert(!JSON.stringify(publicConfig).includes("private owner instructions"));
assert.deepEqual(Object.keys(publicConfig.settings).sort(),["enabled","greeting","max_messages","title"]);
assistantEnabled=false;publicCache.refreshPublicContent(publicCache.PUBLIC_CONTENT_TAGS.assistant);
assert.equal((await presentation.publicAssistantPresentation()).settings.enabled,false);
assert.deepEqual(new Set(invalidations),new Set(Object.values(publicCache.PUBLIC_CONTENT_TAGS)));
assert(registrations.every(entry=>entry.options.revalidate===60&&entry.keys.includes(env.SUPABASE_URL)));
assert.equal(registrations.length,8);
let checks=0,maintenance=false,fail=false;
const state=source("lib/maintenance-state.ts",{"./single-flight":{singleFlight}},{fetch:async()=>{checks++;await new Promise(resolve=>setTimeout(resolve,5));if(fail)throw Error("unavailable");return Response.json({enabled:maintenance,revision:checks,updated_at:"2026-01-01"});}});
env.SUPABASE_PUBLISHABLE_KEY="fixture-public-key";
await Promise.all(Array.from({length:50},()=>state.maintenanceState()));assert.equal(checks,1);
maintenance=true;assert.equal((await state.maintenanceState()).enabled,true);assert.equal(checks,2);
fail=true;await assert.rejects(state.maintenanceState());fail=false;await state.maintenanceState();assert.equal(checks,4);
const maintenanceHelpers=source("lib/maintenance.ts");assert(maintenanceHelpers.recoveryPath("/ecosystem/ibm-v1.svg"));assert(!maintenanceHelpers.recoveryPath("/products"));
console.log("PASS: public cache hits/expiry/invalidation/recovery; fresh downloads and maintenance; no draft/permission leaks; concurrent reads coalesced.");

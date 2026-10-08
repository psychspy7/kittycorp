import assert from "node:assert/strict";
// Read-only HTTP checks. Google sign-in is handled in the owner's browser;
// this script never reads a password or creates visitor/Studio records.
const origin=new URL(process.argv[2]||"http://localhost:3000").origin;
for(const path of ["/","/contact","/kitten"]){const r=await fetch(origin+path);assert.equal(r.status,200,`${path} renders`);}
assert.equal((await fetch(origin+"/admins")).status,404,"old Studio address retired");
for(const path of ["/api/admin/feedback","/api/admin/assistant","/api/admin/maintenance"]){assert.equal((await fetch(origin+path)).status,401,"private API blocks anonymous access");}
for(const path of ["/api/admin/login","/api/feedback"]){const r=await fetch(origin+path,{method:"POST",headers:{Origin:"https://untrusted.example","Content-Type":"application/json"},body:"{}"});assert.equal(r.status,403,"cross-origin writes blocked");}
const oldLogin=await fetch(origin+"/api/admin/login",{method:"POST",headers:{Origin:origin,"Content-Type":"application/json"},body:JSON.stringify({username:"retired-id",password:"retired-password",turnstileToken:"invalid"})});assert.equal(oldLogin.status,400,"password payload is no longer accepted");
const invalidCallback=await fetch(origin+"/api/admin/google/callback?flow=invalid&code=invalid",{redirect:"manual"});assert.equal(invalidCallback.status,303);assert.equal(invalidCallback.headers.get("location"),origin+"/kitten?signin=verification-failed");
const security=await fetch(origin+"/api/admin/security").then(r=>r.json());assert.equal(security.signInMethod,"google");assert.equal(security.googleReady,true);
const home=await fetch(origin+"/").then(r=>r.text());assert.doesNotMatch(home,/<a[^>]+href=["']\/(?:admins|kitten)["']/i,"public page has no Studio hyperlink");
console.log("PASS: public routes, retired Studio address, anonymous API protection, CSRF, removed password login, Google readiness and safe callback redirect.");

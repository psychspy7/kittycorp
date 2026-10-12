import assert from "node:assert/strict";
const base="http://127.0.0.1:3103";
const fixture="http://127.0.0.1:3101";
// Deliberately fixed loopback addresses and a fake identity; no real accounts.
const [original]=await (await fetch(`${fixture}/rest/v1/kitty_website_products?slug=eq.kitty-ai`)).json();
const originalHtml=await (await fetch(`${base}/products`)).text();
assert(originalHtml.includes(original.name));
const edit=async name=>{
  const response=await fetch(`${base}/api/admin/content/products/kitty-ai`,{method:"PATCH",headers:{"content-type":"application/json",origin:base,cookie:"kitty_studio_session=fixture-admin-token"},body:JSON.stringify({...original,name})});
  const body=await response.json();assert.equal(response.status,200,JSON.stringify(body));assert.match(response.headers.get("cache-control"),/private.*no-store/);
};
try{
  await edit("KITTY AI Cache Refresh Verified");
  const updated=await (await fetch(`${base}/products`)).text();
  assert(updated.includes("KITTY AI Cache Refresh Verified"),"The first refresh must see the saved Studio edit");
}finally{await edit(original.name);}
for(const path of ["/api/admin/content","/api/admin/feedback","/api/admin/email"]){
  const response=await fetch(`${base}${path}`);assert.equal(response.status,401,path);assert.match(response.headers.get("cache-control"),/no-store/);
}
const metrics=async()=>await(await fetch(`${fixture}/__metrics`)).json();
const before=await metrics();
const logo=await fetch(`${base}/ecosystem/ibm-v1.svg`);assert.equal(logo.status,200);assert.match(logo.headers.get("cache-control"),/immutable/);await logo.text();
const after=await metrics();
const flag="/rest/v1/rpc/kitty_website_maintenance_status";
assert.equal(before.counts[flag],after.counts[flag],"Static logo requests must not call the database");
console.log("PASS: native production Studio edit visible on first refresh; anonymous private routes rejected; immutable logos make no database request. Fixture restored.");

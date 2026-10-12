import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const config=JSON.parse(readFileSync("vercel.json","utf8"));
const pkg=JSON.parse(readFileSync("package.json","utf8"));
assert.equal(config.framework,"nextjs");assert.equal(config.buildCommand,"npm run build:next");assert.equal(config.installCommand,"npm ci");assert.equal(config.outputDirectory,".next");assert.deepEqual(config.regions,["bom1"]);
assert.equal(pkg.scripts["build:next"],"next build");assert.equal(pkg.scripts["start:next"],"next start");
assert(!readFileSync("next.config.ts","utf8").includes('output: "export"'),"Studio and payments need a server");
if(!process.argv.includes("--static")){
  const required=["SUPABASE_URL","SUPABASE_PUBLISHABLE_KEY","FEEDBACK_GATEWAY_TOKEN","ADMIN_USER_ID","SITE_URL"];
  const missing=required.filter(key=>!process.env[key]?.trim());
  if(missing.length)throw Error("Missing private hosting settings: "+missing.join(", "));
  assert.equal(new URL(process.env.SUPABASE_URL).hostname,"mgkghnblbisubympudaa.supabase.co","Use the website Supabase project");
  assert(/^https?:$/.test(new URL(process.env.SITE_URL).protocol));
  console.log("Required local setting names are present. Restore these separately in Vercel; local env files are not uploaded.");
}
console.log("PASS: native Next.js hosting configuration, locked install, Mumbai function region and server routes.");

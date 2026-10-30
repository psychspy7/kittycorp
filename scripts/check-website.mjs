import { spawnSync } from "node:child_process";
const checks=[
  ["node_modules/typescript/lib/tsc.js","--noEmit"],
  ["scripts/test-site-identity-security.mjs"],
  ["scripts/test-performance.mjs"],
  ["scripts/test-studio-security.mjs"],
  ["scripts/test-analytics.mjs"],
  ["scripts/check-website-assistant.mjs"],
  ["scripts/test-razorpay.mjs"],
  ["scripts/test-commerce.mjs"],
  ["scripts/test-project-quotes.mjs"],
  ["scripts/test-business-conversion.mjs"],
  ["scripts/test-discount-game.mjs"],
  ["scripts/test-customer-accounts.mjs"],
  ["scripts/test-lisa-preorders.mjs"],
  ["scripts/test-memberships.mjs"],
  ["scripts/test-email-notifications.mjs"],
  ["scripts/verify-hosting.mjs","--static"],
];
for(const args of checks){console.log(`Checking ${args[0]}`);const result=spawnSync(process.execPath,args,{stdio:"inherit"});if(result.status!==0)process.exit(result.status||1);}
console.log("All website checks passed. No deployment was performed.");

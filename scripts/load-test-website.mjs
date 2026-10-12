import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { resolve, relative } from "node:path";

// Bounded read-only test against a local production server. Never targets live hosts.
const base = new URL(process.env.LOAD_TEST_URL || "http://127.0.0.1:3102");
if (base.protocol !== "http:" || !["127.0.0.1","localhost"].includes(base.hostname) || base.username || base.password || base.search || base.hash)
  throw Error("Load testing is restricted to a loopback HTTP server.");
const total = Number(process.env.LOAD_TEST_REQUESTS || 120);
const concurrency = Number(process.env.LOAD_TEST_CONCURRENCY || 10);
if (!Number.isInteger(total) || total < 1 || total > 500 || !Number.isInteger(concurrency) || concurrency < 1 || concurrency > 20)
  throw Error("Use 1–500 requests and 1–20 concurrent requests.");
const paths = ["/","/products","/services","/contact","/build-log","/api/notices"];
const check = async path => {
  const start = performance.now();
  const response = await fetch(new URL(path, base), {redirect:"manual",signal:AbortSignal.timeout(15000)});
  const ttfb = performance.now()-start;
  const body = await response.text();
  assert.equal(response.status,200,`${path}: HTTP ${response.status}`);
  if (path !== "/api/notices") {
    assert(body.includes("KITTY CORP"),`${path}: missing expected brand`);
    assert(body.includes('name="google-adsense-account"'),`${path}: missing shared head`);
  }
  return {path,status:response.status,ttfb_ms:ttfb,total_ms:performance.now()-start};
};
for (const path of paths) await check(path);
const records = [];
let index=0;
const started=performance.now();
await Promise.all(Array.from({length:concurrency},async()=>{
  while(index<total){const current=index++;try{records.push(await check(paths[current%paths.length]));}catch(error){records.push({path:paths[current%paths.length],error:error.message});}}
}));
const elapsed=performance.now()-started;
const timings=records.filter(row=>!row.error).map(row=>row.total_ms).sort((a,b)=>a-b);
const percentile=(n)=>timings[Math.min(timings.length-1,Math.ceil(timings.length*n)-1)]??null;
const report={timestamp:new Date().toISOString(),target:base.origin,scope:"Local production build; public GET routes only",requests:total,concurrency,failures:records.filter(row=>row.error).length,elapsed_ms:Math.round(elapsed),requests_per_second:Number((total/(elapsed/1000)).toFixed(2)),p50_ms:Math.round(percentile(.5)??0),p95_ms:Math.round(percentile(.95)??0),p99_ms:Math.round(percentile(.99)??0),routes:paths,errors:records.filter(row=>row.error)};
if(process.env.PERF_FIXTURE_URL){const fixture=new URL(process.env.PERF_FIXTURE_URL);if(fixture.protocol!=="http:"||fixture.hostname!=="127.0.0.1")throw Error("Metrics fixture must be loopback");report.database_fixture=await (await fetch(new URL("/__metrics",fixture))).json();}
const output=resolve(process.env.LOAD_TEST_REPORT || "outputs/performance/load-test.json");
if(relative(process.cwd(),output).startsWith(".."))throw Error("Report must stay inside this website workspace.");
await mkdir(resolve(output,".."),{recursive:true});await writeFile(output,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(report.failures)process.exitCode=1;

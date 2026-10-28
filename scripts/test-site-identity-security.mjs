import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const siteMetadata = read("lib/site-metadata.ts");
const layout = read("app/layout.tsx");
const robots = read("app/robots.ts");
const sitemap = read("app/sitemap.ts");
const nextConfig = read("next.config.ts");

assert.ok(siteMetadata.includes('const SITE_ORIGIN = "https://thekittycorp.com";'), "canonical site origin must be the official domain");
assert.ok(!siteMetadata.includes("https://kittycorp.vercel.app"), "legacy Vercel hostname must not be a canonical fallback");
assert.ok(layout.includes("metadataBase: new URL(websiteOrigin())"), "metadataBase must use the official site origin");
assert.ok(robots.includes('sitemap: `${websiteOrigin()}/sitemap.xml`'), "robots.txt must advertise the official sitemap");
assert.ok(sitemap.includes("const origin = websiteOrigin();"), "sitemap URLs must use the official origin");
assert.ok(nextConfig.includes('key: "X-Content-Type-Options", value: "nosniff"'), "MIME sniffing protection must be set");
assert.ok(nextConfig.includes('key: "X-Frame-Options", value: "DENY"'), "framing must be blocked to reduce clickjacking risk");
assert.ok(nextConfig.includes('key: "Strict-Transport-Security", value: "max-age=31536000"'), "HTTPS must be enforced by HSTS");
assert.ok(nextConfig.includes('destination: "https://thekittycorp.com/:path*"'), "legacy Vercel URLs must redirect to the official domain");

console.log("Official domain metadata, sitemap, legacy-host redirect and baseline security headers verified.");

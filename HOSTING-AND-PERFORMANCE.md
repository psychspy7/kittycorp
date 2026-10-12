# Hosting and performance

Use the website project at `C:/Users/HP/Downloads/Project (Kitty-Corp)/KITTY CORP STARTUP WEBSITE`. Keep its own repository, `psychspy7/kittycorp`, separate from the other KITTY projects.

## The simple hosting path

1. Install the locked dependencies with `npm ci` (Node.js 22.13+).
2. Restore your private `.env.local` separately. Never put it in GitHub or a source ZIP.
3. Run `npm run check:website`. This checks types, caching, Studio security, Analytics, the assistant proxy, test checkout and email safeguards using isolated adapters.
4. Run `npm run check:hosting` to check local setting names and the intended website database. It does not print secret values or verify production account settings.
5. Run `npm run build:next`. For a local production preview, run `npm run start:next`.
6. Reconcile reviewed changes with the latest GitHub main before pushing. The local repository contains earlier uncommitted work, including payment/email features that are not on production. Do not push the entire checkout just to publish a performance patch.
7. The existing Vercel Git integration can build the approved website commit. Preserve the existing project, domain and environment variables. `vercel.json` selects Next.js, `npm ci`, `npm run build:next`, `.next` and one Mumbai function region (`bom1`), near website Supabase in ap-south-1.
8. After a deployment, verify the homepage, contact form, Studio Google return and affected publishing actions. Inspect the build status and actual production headers. The new Mumbai setting takes effect only after deployment; static assets still use the CDN and routing middleware has its own placement.

Use the native Next.js scripts for Vercel. The alternative `build`/`dev` scripts belong to the retained Sites/vinext workflow. A static HTML export cannot host Studio, server payments, private credentials or API routes.

## Private configuration

The hosting check requires `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `FEEDBACK_GATEWAY_TOKEN`, `ADMIN_USER_ID` and `SITE_URL`. Restore these privately in the existing Vercel project as well as locally. The intended website Supabase project is `mgkghnblbisubympudaa`; the private-chat database is separate.

Keep optional Google, Turnstile, assistant, Razorpay and Gmail settings consistent with the existing setup guides. Runtime configuration is encrypted in the database and depends on the original gateway token. Do not replace that token as a performance fix. Live checkout and Gmail delivery remain separate setup/release tasks.

## What is cached

Only anonymous published products, team/company content, launch listings, build-log summaries, permitted testimonials, notices and the assistant's sanitized public presentation use the Next.js Data Cache. The revalidation interval is 60 seconds. Dataset keys also include the public database URL so isolated fixtures cannot collide with production.

Every successful relevant Studio write expires its public tag with `revalidateTag(tag, { expire: 0 })`, then refreshes the existing page paths. This uses the project's current non-Cache-Components Next.js model; enabling Cache Components would be a separate migration.

Failures in public content readers are handled outside the persistent cache. A temporary failure cannot save fallback company content or an empty review list into it. Scheduled content may need the next timed revalidation. Direct SQL edits do not run Studio's invalidation, so revisit/refresh after the timed revalidation or save through Studio.

Authentication, authorization, inboxes, secrets, actual chat checks, payment calls, signed download URLs and download publication checks remain uncached. The cached assistant display contains only enabled/title/greeting/message limit and a public widget site key. Real assistant requests always repeat the existing server security checks.

Maintenance reads share an in-flight request only. Once it settles, the next request fetches the flag again; errors do not retain a status. Existing fail-closed behavior remains. Immutable, versioned ecosystem SVGs bypass that database check and have long-lived asset caching. Bump their filenames whenever their bytes change. Uploaded icons already use new UUID paths and remain compatible with Studio publishing.

## Repeatable local load testing

Never direct the supplied load tool at production. It accepts loopback HTTP URLs only, performs public GET requests, uses no Studio cookies and is capped at 500 requests/20 concurrent requests. It does not charge payments, generate AI replies, send email or submit forms.

`npm run test:load` targets `http://127.0.0.1:3102` by default. Configure `LOAD_TEST_URL`, `LOAD_TEST_REQUESTS`, `LOAD_TEST_CONCURRENCY` and `LOAD_TEST_REPORT` when needed. Reports stay inside the website folder. Keep real private data out of test fixtures and output.

`scripts/performance-fixture.mjs` supplies a fake Supabase server on 127.0.0.1:3101 with 40ms simulated latency. It uses public source defaults, a deliberately fake owner identity and in-memory product edits only. Its test token has no value against the real database. Override the website's SUPABASE_URL, publishable key, gateway token, admin UUID and SITE_URL with the fixture configuration before building and starting that isolated preview. Disable Analytics and Turnstile for the isolated benchmark, never for the real deployment. Use a separate NEXT_DIST_DIR, then rebuild normally before deployment.

Compare the same routes, warm-up, request count and concurrency before and after a change. Inspect failures, p50/p95/p99 latency, database-call counts and throughput. Fixture results demonstrate behavior on this computer; they are not a guaranteed live visitor capacity or a production SLA.

## Database indexes

The additive `website_studio_foreign_key_indexes` migration was applied to the website database on 11 October 2026 and recorded in `supabase/performance-indexes.sql`. All three indexes were verified valid/ready with table RLS still enabled. Existing publishing, slug, inbox, rate-limit and outbox indexes were retained. Do not rerun first-install schema files against the live database.

The small database does not justify adding indexes to every field. Existing journal query EXPLAIN used its public feed index. Recheck real plans and Supabase advisors as data grows. Newly added or currently idle indexes can appear as unused; do not remove foreign-key protection or the planned email queue index just because the test dataset is small.

## Archives and continuation

After verified major changes, refresh only the website snapshot using `Source File Zip/Update-Source-Zips.ps1 -Project website`. The updater validates a replacement before replacing the previous source ZIP and preserves local private files and Git history. The source archive is not a live database backup or a deployment.

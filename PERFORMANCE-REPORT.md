# Website performance verification — 11 October 2026

Scope: KITTY CORP website only. Source: canonical `KITTY CORP STARTUP WEBSITE`; repository `psychspy7/kittycorp`. KITTY AI, LISA and SecretChat were not changed.

## Outcome and release state

Three additive Studio foreign-key indexes are applied and verified **live** in website Supabase `mgkghnblbisubympudaa`. The optimized application source and Mumbai Vercel region setting are **local only**. No GitHub push, deployment, payment, message submission, real email, AI invocation or live load test was performed in this task.

The live homepage was available (HTTP 200). One response had `private, no-cache, no-store, max-age=0, must-revalidate`, Vercel cache MISS and a request ID spanning `bom1::iad1`; source previously had no explicit function region. The authenticated Vercel connector did not expose this existing project, so its current dashboard configuration was not changed or verified. The prepared single-region `bom1` setting needs deployment to become active.

## Changes

- Next.js Data Cache for published products/team/company content, launch lists, build-log summaries, consented testimonials and notices; 60-second revalidation and dataset/environment keys.
- Cache only sanitized public assistant presentation, including its public widget site key. Credentials, owner instructions and actual chat/security decisions remain fresh and private.
- Successful Studio publishing expires the corresponding cache tag immediately. Existing path revalidation is retained.
- Maintenance reads coalesce only while one read is in flight. Settled values/errors are not cached; fail-closed behavior remains.
- Versioned public ecosystem SVGs bypass maintenance database reads and receive immutable cache headers.
- Assistant presentation resolves behind Suspense so it does not block the main page shell.
- One-command website checks, bounded loopback load test, fake local database, native publishing verification and an owner hosting guide.

## Production-build load tests

Actual compiled native Next.js 16.3.4 builds ran on loopback against an isolated fake Supabase with **40ms simulated latency**. Workloads covered `/`, `/products`, `/services`, `/contact`, `/build-log` and `/api/notices`, after identical route warm-ups. Every result below contains 120 measured requests at 10 concurrent workers; database counts include the six warm-up requests too. Counts are database HTTP calls, not SQL execution counts.

| Build/run | Requests | Concurrency | Errors | p50 ms | p95 ms | Requests/sec | Database calls |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline 1 | 120 | 10 | 0 | 263 | 639 | 33.95 | 756 |
| baseline 2 | 120 | 10 | 0 | 365 | 529 | 29.12 | 756 |
| baseline 3 | 120 | 10 | 0 | 278 | 367 | 37.03 | 756 |
| optimized 1 | 120 | 10 | 0 | 685 | 1196 | 16.46 | 35 |
| optimized 2 | 120 | 10 | 0 | 249 | 312 | 45.44 | 32 |
| optimized 3 | 120 | 10 | 0 | 153 | 303 | 56.19 | 20 |

All **360 baseline and 360 final optimized requests** passed. Final optimized database calls fell from 756 per workload to 35/32/20, a **95.4–97.4% reduction**. The initial timing sample was slower on the optimized build; both subsequent alternating warm comparisons improved (p95 529→312ms and 367→303ms). Do not report every latency metric as consistently improved or treat these fixture results as a real visitor capacity, production benchmark or SLA. Timings vary with the local machine, cache warmth and network. Reduced repeated database calls and tested publishing semantics are the strongest verified outcomes.

An intermediate candidate without cached assistant presentation also passed 120 requests. Its measurements exposed remaining repeated presentation reads and led to the final refinement; it is not the delivered implementation.

Raw reports remain in `outputs/performance/` locally. This summary is included in the clean source archive; raw generated output is excluded by the standard updater.

## Correctness and security checks

- `npm run check:website`: passed types, public-cache regression suite, Google-only Studio/Turnstile security, Analytics, 20 isolated assistant checks, Razorpay signature/order/purpose safeguards, Gmail queue safeguards and static hosting configuration.
- `npm run build:next`: final production build passed compilation, TypeScript and route generation using isolated configuration.
- `npm run check:hosting`: native Next.js/Vercel configuration and required local setting names passed; no secret values were printed. This does not establish provider approval or live SMTP delivery.
- `scripts/test-publishing-cache.mjs`: the real compiled Studio PATCH route updated a fake product; the **first** public refresh showed the edit. The fixture was restored. Anonymous content/inbox/email endpoints returned 401 with no-store headers. An immutable logo request caused no database read.
- Cache expiry, recovery after errors, immediate tag invalidation, public-field projection, permission filtering, scheduled-content exclusion, fresh download publication checks and fresh maintenance checks passed isolated module tests.

## Database verification

Applied migration: `website_studio_foreign_key_indexes`. All three new indexes are valid/ready, and table RLS remains enabled:

- `kitty_studio_challenges_user_idx` on Studio challenge user_id.
- `kitty_studio_challenges_session_idx` on Studio challenge password_session_id.
- `kitty_studio_sessions_user_idx` on Studio session user_id.

Supabase's three unindexed-foreign-key findings cleared. Public feeds, slug uniqueness, feedback/rate limits and email-queue indexes were retained. A read-only EXPLAIN ANALYZE used `kitty_website_journal_public_idx` for the current build log (5 rows; execution 0.757ms in that sample). Existing tiny data did not justify indexing every product/team field.

The performance advisor still notes [overlapping authenticated notice SELECT policies](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies). Changing access policies was unnecessary for these index/cache changes, so their existing semantics were preserved. Newly created indexes and the currently idle email queue can be listed as [unused](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index); retaining these is intentional for foreign-key checks and future queue use. The existing security advisor's [leaked-password setting](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) was unchanged; Studio's current Google-only flow was regression-tested.

## Hosting and next continuation

Read `HOSTING-AND-PERFORMANCE.md`. Use `npm ci`, `npm run check:website`, `npm run check:hosting`, `npm run build:next` and `npm run start:next`. Vercel uses native Next.js, not the alternate Sites/vinext build or a static export.

Reconcile only approved changes with fresh GitHub main before release. Prior local payment/review/Gmail work is still outside the deployed branch. This performance task does not activate memberships, live payments or Gmail delivery. Keep all private env files, gateway/encryption keys, user records and Git history preserved locally and separate from the clean source ZIP.

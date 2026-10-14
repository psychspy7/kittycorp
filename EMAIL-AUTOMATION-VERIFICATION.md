# Website email automation — verified 14 October 2026

Scope: KITTY CORP website only. Production code release: `b627b93d3876cad38457438d525af6f9d725a224`. Repository: https://github.com/psychspy7/kittycorp. Site: https://kittycorp.vercel.app. Website Supabase project: `mgkghnblbisubympudaa`.

## Implemented behavior

- Project enquiries and contact submissions queue a full administrator notification and a separate customer acknowledgement. Quotes and customer-account links remain separate operational records.
- Reviews stay private for moderation and queue a thank-you email.
- Early-list signups require an explicit confirmation, then receive one welcome email. Confirmation and unsubscribe links require a POST triggered by an explicit click. Existing subscribers remain legacy records without retroactive marketing.
- One daily Vercel job recovers pending notifications, sends the business report, then performs guarded cleanup. Gmail SMTP uses the official mailbox and TLS; credentials stay in private server settings.
- Temporary project/contact submissions qualify for cleanup only after the required mail receipts, an accepted report and at least 72 hours. Reviews, active/legacy subscribers, unresolved sends, quotes, payments and accounts are protected.
- Studio → Email automation monitors configuration, queue outcomes, subscribers, reports, cleanup and actual database size. Ambiguous SMTP outcomes require manual review rather than automatic replay.

## Actual verification

- TypeScript: passed.
- Lint: passed with six existing warnings in unrelated code; no errors.
- `npm run check:website`: all checks passed, including isolated email/template/token/SMTP/cron tests and the existing security, assistant, payment, membership and account checks. These send no live email or charge.
- `npm run build:next`: passed; 55 pages generated and required server routes built.
- Database transaction regression: gateway denial, project linkage, contact/review queues, newsletter confirmation idempotency and unsubscribe, backoff, uncertain holds, failed-report recovery, cleanup guards and record preservation passed. Every fixture and simulated receipt rolled back; no real email was sent by this SQL test.
- Post-test database check: zero fixture rows; original live records preserved. Five new private tables have RLS and neither anonymous nor ordinary authenticated users can read them directly.
- GitHub push and Vercel production deployment of `b627b93`: succeeded. Public pages and newsletter action pages return 200; private email API and cron without authorization return 401 with no-store responses.
- Owner signed into the deployed Studio and sent one test email. The connected official Gmail mailbox confirmed it in Inbox and Sent at 11:21 UTC / 4:51 PM IST on 14 October.
- Owner ran the deployed daily report/recovery action. Its report was confirmed in Inbox and Sent at 11:22 UTC / 4:52 PM IST. Database receipts show five accepted queued messages, zero failed attempts and no pending jobs; report checkpoint and cleanup timestamp were recorded. Cleanup removed zero records; the owner’s cleanup preview also showed zero.

The live checks confirm the test email and daily report arrived in this mailbox. SMTP acceptance for other recipients does not guarantee their inbox delivery. Project/contact/review/newsletter behavior was also verified with isolated application fixtures and rolled-back database fixtures; fresh public form and newsletter confirmation journeys were not completed in a customer browser during this release.

## Migrations and future continuation

The following were applied to the existing website database through its signed-in SQL dashboard while the write connector was unreliable:

1. `supabase/migrations/20261013080633_website_communication_automation.sql`
2. `supabase/migrations/20261014044402_website_email_worker_aliases.sql`

The follow-up fixes a tested PL/pgSQL record/table-alias naming conflict in report and cleanup branches. Do not replay the first migration against this already-upgraded production schema; some constraints are intentionally created once. Inspect current schema and migration history before any later migration or restore. Preserve existing data and private settings.

`scripts/test-email-database.sql` is an administrator-only regression batch. Run the entire batch, never individual statements, and retain its ROLLBACK. It temporarily changes a gateway hash only inside that transaction and restores it through rollback. Use isolated test infrastructure for repeated development when possible.

The cron expression `0 15 * * *` targets 8:30 PM IST daily. A Hobby schedule may run during that hour. The protected route and manual worker were verified; the first platform-scheduled execution after this deployment has not yet occurred. Studio shows the last successful report/cleanup. Review the plan’s commercial-use rules in EMAIL-AUTOMATION-GUIDE.md; this release does not change billing.

## File map

- `lib/email-notifications.ts`, `lib/email-templates.ts`, `lib/newsletter-tokens.ts`: SMTP queue processing, escaped templates and purpose-bound links.
- `app/api/enquiries/route.ts`, `app/api/feedback/route.ts`, `app/api/early-access/route.ts`: public submission integration.
- `app/api/newsletter/confirm/route.ts`, `app/api/newsletter/unsubscribe/route.ts`, `app/newsletter/`, `components/kitty/newsletter-action.tsx`: explicit confirmation/unsubscribe flow.
- `app/api/admin/email/route.ts`, `components/kitty/admin-email.tsx`, admin early-access route/editor: Studio monitoring and recovery.
- `app/api/automation/daily/route.ts`, `vercel.json`: authenticated daily schedule.
- Supabase migration files: transactional queue/events/report state, access controls, newsletter state and guarded cleanup.
- `scripts/test-email-notifications.mjs`, `scripts/test-email-database.sql`: isolated and transaction-only regression checks.
- `.env.example`, `EMAIL-AUTOMATION-GUIDE.md`, this report: private-setting names, owner workflow and verified limits. Private filled-in environment files are excluded from GitHub and source ZIPs.

No additional email credential setup is currently required. Keep the app password and cron secret private, and inspect Studio and Gmail if a send becomes failed or uncertain.

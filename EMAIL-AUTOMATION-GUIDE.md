# KITTY CORP website email automation

This guide covers the website only. It uses the existing website Supabase project, Gmail SMTP through Nodemailer, and one Vercel cron. The official mailbox is `kittycorp.info@gmail.com`. Do not use the private-chat Supabase project.

## What happens

- A new project enquiry or contact message is stored, then its full contents are sent to the official mailbox. A separate acknowledgement is sent to the visitor. The project quote and its customer-account links remain operational records.
- A submitted review is kept private for moderation. The reviewer receives a thank-you message; nothing is published automatically.
- The early-list form sends a 48-hour confirmation link. Only someone who confirms becomes an active subscriber. A welcome email follows once per confirmation. Confirmation and unsubscribe require an explicit button click. Existing early-list entries are retained as legacy records, with no automatic retroactive marketing email.
- A daily worker recovers pending mail, attempts one activity report, then runs guarded cleanup. The report contains actual stored activity and explicitly labels unavailable metrics.
- An SMTP send is recorded as **accepted by Gmail**, which is not proof of final inbox delivery. A result that may have been accepted but lacks a trustworthy receipt is held as **uncertain** for manual review. Check Gmail Sent mail before manually retrying it.

## Private configuration

In the existing Vercel website project, set these as **server environment variables for Production**. Redeploy after changing them. The sender and admin-notification destination are fixed to the official mailbox; a visitor cannot choose another destination.

| Variable | Value or purpose |
| --- | --- |
| `SMTP_APP_PASSWORD` | A Google app password for `kittycorp.info@gmail.com`. The existing `GMAIL_APP_PASSWORD` remains a supported fallback. Keep the value private. |
| `SMTP_USER` | `kittycorp.info@gmail.com` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | `smtp.gmail.com`, `465`, `true` |
| `SITE_URL` | `https://kittycorp.vercel.app` |
| `CRON_SECRET` | A private random string of at least 32 characters, set in Vercel. Never put it in a public-prefixed variable or source control. |
| `TEMP_DATA_RETENTION_HOURS` | Default `72`; the server enforces a minimum of 72. |
| `EMAIL_DAILY_LIMIT` | Default `200` attempts/day; the server caps it at 400. Gmail account-wide limits can still be lower after other sends. |
| `REPORT_TIMEZONE` | `Asia/Kolkata` |

`ADMIN_EMAIL` in this repository controls **Studio owner sign-in**. Do not change it to the notification mailbox. Use the existing website `FEEDBACK_GATEWAY_TOKEN` and database variables unchanged. Never add a `NEXT_PUBLIC_` prefix to any email or database secret.

## Safe deployment order

1. Review and apply `supabase/migrations/20261013080633_website_communication_automation.sql` followed by `supabase/migrations/20261014044402_website_email_worker_aliases.sql` to website project `mgkghnblbisubympudaa` using the Supabase migration tool. Do not apply it to the private-chat project. The migration is additive for business records, retains old feedback and subscribers, and temporarily retires the old sender during the rolling deployment.
2. Verify the migration functions, private-table RLS and execute grants. The application queries use the existing private gateway token. The new private tables should not be readable by anonymous or ordinary authenticated clients.
3. Confirm the private Vercel variable names are present. Never paste their values in chat, a ticket, GitHub or a ZIP. The Gmail password alone does not enable the daily cron; `CRON_SECRET` is also required.
4. Deploy the corresponding website code. The one daily Vercel cron uses `0 15 * * *`, targeting 8:30 PM IST. On a Hobby plan it can run within the scheduled hour rather than at an exact minute.
5. In Studio → Email automation, inspect the sender and cron indicators. Send **one** test to the official mailbox, then check Inbox and Spam yourself. Submit only test messages using your own address. Confirm project/contact/review receipts, confirmation/welcome/unsubscribe, a manual report, and the cleanup preview before relying on the automation. Avoid test submissions to real customer addresses.
6. Keep the current source ZIP and previous Git deployment until the migration, build, mail acceptance and live routes are verified. Refresh the website archive after a verified release.

## Monitoring and recovery

Studio → Email automation shows pending, processing, accepted, failed and uncertain jobs, subscribers, report and cleanup times, recent activity, and the actual PostgreSQL database size. The **Preview eligible cleanup** action reads the number of eligible temporary submissions without deleting them. The scheduled worker applies cleanup only after the required two mail receipts, a successful report and the minimum retention period. It preserves pending, failed and ambiguous sources, reviews, active subscribers, legacy records, quotes, payments and customer accounts.

The worker caps its work and daily attempts. Definitive temporary SMTP failures back off and retry up to six times; permanent failures need Studio action. Unknown send outcomes stay held because automatic replay could duplicate a customer email. The report checkpoint moves only after SMTP acceptance, so a failed report does not consume the activity interval. The system cannot guarantee exactly-once email delivery or final mailbox arrival.

## Verification

Run `npm run typecheck`, `npm run lint`, `npm run check:website` and `npm run build:next` from this website folder. `scripts/test-email-notifications.mjs` uses isolated mail/database fixtures: it sends no real email. The live SMTP and database checks above are separate acceptance steps.

Vercel's Hobby tier is for personal, noncommercial use. This business website must be on a plan that permits its commercial use; the code does not change the hosting plan or enable paid usage.

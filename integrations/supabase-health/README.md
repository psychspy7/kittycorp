# Daily website database health check

Deployed on 14 October 2026. This is a separate Cloudflare Worker; the website stays on Vercel.

## What runs

- Worker: `kitty-corp-database-health`.
- Cron: `0 3 * * *` (03:00 UTC / **08:30 AM IST**, daily).
- Target: the existing website Supabase project `mgkghnblbisubympudaa`.
- Action: read at most one public notice ID through the REST API, with caching disabled. No rows are created, changed or deleted. Published-notice RLS still applies.
- Credential: the existing **publishable** key, stored as a Cloudflare secret. No service-role key, customer identity, admin token or database password is used.
- Each request has a ten-second timeout. Connection failures, HTTP 429 and server errors get at most one retry after one second. Redirects and permission errors are rejected.
- Logs contain time, success/failure, HTTP status, attempts and elapsed time. They exclude the key and returned notice data.
- There is no public HTTP trigger, workers.dev address, preview URL or custom route. The HTTP handler returns 404.

The daily query adds database activity and independently checks availability. It does **not guarantee** the Free project will never be paused. [Supabase may pause Free projects with low activity over seven days; Pro guarantees no inactivity pausing](https://supabase.com/docs/guides/deployment/going-into-prod#availability). This worker cannot restore a paused project. Restore it in the Supabase dashboard if necessary.

The existing website email/report job remains separate. This check does not send email, create analytics traffic, inspect customer records, touch the private-chat project, or change either provider's billing plan.

## View and maintain

Open Cloudflare -> Workers & Pages -> **kitty-corp-database-health**. View its Cron trigger and invocation logs there. Cloudflare schedules use UTC; changes may take up to 15 minutes to propagate. See [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/).

Source files live in this folder. Run the following from the website root after installing the existing lockfile dependencies with `npm ci`:

```powershell
# Isolated behavior and error-path tests, with no credentials or network access
node integrations/supabase-health/test.mjs

# Actual Cloudflare runtime test; one read-only database check
node --env-file-if-exists=.env --env-file-if-exists=.env.local integrations/supabase-health/verify-runtime.mjs

# Deploy source, cron and publishable-key binding together
node --env-file-if-exists=.env --env-file-if-exists=.env.local integrations/supabase-health/deploy.mjs
```

The two last commands require your existing private website `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. The deploy command also requires your Cloudflare CLI sign-in. It validates the website target, uses a temporary secret file and removes that file after the command. Keep private configuration out of GitHub, archives and chat.

To change the time, edit `triggers.crons` in `wrangler.jsonc` and redeploy. To stop the check, set the list to `[]` and redeploy. Editing GitHub alone does not deploy this Cloudflare Worker; Vercel's normal website auto-deployment remains separate.

## Verification record

- Isolated tests passed, including redirected requests, invalid/private credentials, bounded retries, invalid responses, safe logs and HTTP denial.
- ESLint passed without warnings.
- Actual workerd scheduled invocation read the website database: HTTP 200, one attempt; public fetch returned 404.
- Cloudflare confirmed the daily trigger and 100% deployment of version `b2da6730-5324-4275-9d43-23fb2dbb306f` at `2026-10-14T12:10:35Z`.
- Secret names were read back: only `SUPABASE_PUBLISHABLE_KEY`, type `secret_text`.
- Wrangler 4.92.0; compatibility date 2026-05-22, matching the installed runtime. Redirect handling uses Workers-supported `manual` mode and never follows a redirect with the key.
- The first automatic cron occurrence is expected on 15 October 2026 at 08:30 AM IST; it has not happened at the time of this verification. Check Cloudflare invocation logs after that time.

After a verified source change, refresh only the website snapshot using the workspace's provided Source File Zip updater. Generated `.wrangler` files and private settings are excluded.

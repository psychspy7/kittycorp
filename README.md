# Kitty Corp

A responsive, cinematic brand website with a real Supabase inbox and a protected studio at `/admins`.

## Stack and routes

- Next.js App Router, TypeScript, React, Tailwind CSS, and Framer Motion.
- `/`: story, future vision, KITTY AI concept, public notices, and support wallets.
- `/contact`: validated contact form backed by Supabase.
- `/admins`: server-authenticated notice editor and private feedback inbox.
- The Sites build uses Vinext to run the same App Router source on Cloudflare Workers. Vercel and Netlify use the native Next.js build.

## Run locally

Use Node.js 24 and the committed npm lockfile.

```sh
npm ci
cp .env.example .env.local
# Set the environment values described below.
npm run dev
```

The Sites preview runs on port 5173. For native Next.js development, use `npm run dev:next` on port 3000. The ZIP includes `.env.example`; create and configure your own `.env.local` after extracting it.

```sh
npm run typecheck
npm run build        # Sites / Cloudflare Worker output in dist/
npm run build:next   # Native Next.js output in .next/
npm run start:next   # Serve the native production build
```

## Environment

All application configuration is server-only. No `NEXT_PUBLIC_` secrets are used.

| Name | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Project publishable key; a legacy anon key also works |
| `ADMIN_LOGIN_ID` | ID entered on the studio sign-in form |
| `ADMIN_EMAIL` | Email of the dedicated Supabase Auth administrator |
| `ADMIN_USER_ID` | Explicit administrator UUID |
| `FEEDBACK_GATEWAY_TOKEN` | Random 32-byte token, encoded as 64 hexadecimal characters |
| `SITE_URL` | Actual production origin, including `https://`; no trailing slash |

Keep `.env.local` out of Git. Set production variables in your hosting dashboard. Mark the gateway token as a secret. The original admin password is held by Supabase Auth, which hashes passwords; it is never embedded in application code or stored in the website environment.

If a backend route returns “The studio is temporarily unavailable,” check the hosting provider's runtime logs for the name of a missing server setting. The application logs the missing variable name only; it never logs a configured value.

## Supabase setup

The dedicated Supabase project for this website is already created in the KITTY CORP organization (`mgkghnblbisubympudaa`, Mumbai region). It keeps website data and its administrator separate from the private-chat project. Its database is initialized with both SQL files below. Do not run them again; these are first-install schema snapshots.

To connect the created project:

1. The `pgcrypto` extension, website tables, RLS policies, rate-limit functions, and feedback gateway hash are already installed.
2. The admin Auth account has been created and allowlisted in this project. Set `ADMIN_EMAIL` to that account's email and `ADMIN_USER_ID` to its UUID in your website environment; find the UUID under Supabase Dashboard → Authentication → Users. To provision a replacement later, use the dashboard or `scripts/setup-admin.mjs` locally with `SUPABASE_SECRET_KEY` and `ADMIN_PASSWORD` supplied through a private environment. Remove those provisioning variables afterward; the running website does not need them.
3. The gateway token and matching SHA-256 hash are already configured locally and in the new database. Keep the token private and configure it in the hosting provider's environment.

To provision a different project later, generate one `FEEDBACK_GATEWAY_TOKEN` with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Save it privately in `.env.local` and your host's environment. Compute its SHA-256 hash, then store **only the hash** in the project's settings table:

```sql
insert into kitty_website_private.settings(key, value)
values ('feedback_gateway_hash', 'SHA256_HEX_OF_YOUR_GATEWAY_TOKEN');
```

For token rotation, update both the environment secret and this database hash together, then redeploy. No database service-role key is required by the live website.

## Admin and security behavior

- Sign in at `/admins` with the configured ID (`Kitty`) and the password for the Supabase Auth account associated with the configured email and UUID.
- Sessions use HTTP-only, SameSite=Strict cookies, with Secure enabled in production and a maximum lifetime of one hour. Re-authentication is required after expiry.
- Every admin page/API request verifies the user with Supabase, the explicit administrator UUID, database allowlist membership, and the live `auth.sessions` record. Sign-out revokes the session; replaying its old cookie does not restore access.
- Notices can be saved as drafts, published, edited, unpublished, and deleted. Only published notices appear publicly. Destructive deletion requires confirmation.
- Feedback is readable only by the administrator. Public table inserts are disabled; submission uses a token-validated database function. Raw IP addresses are not stored.
- Form handling includes validation, a honeypot, minimum completion time, body-size limits, same-origin checks, and durable database throttling. Messages are limited to 3 per hour per email/fingerprint and 1,000 per day globally. Sign-ins are limited to 5 per 15 minutes per fingerprint and 30 per hour globally.
- Names, messages, and notices render as escaped React text. HTML is not interpreted.
- The deployment proxy should overwrite client IP forwarding headers. A deliberately strict global rate limit provides a fallback when those headers are absent or untrusted.
- No one-time admin-setup function is deployed. Provision the account directly through Supabase Dashboard or the local setup script.

## Assets and presentation

Your supplied assets live in `public/brand/`: `monogram.png`, `wordmark.png`, `silver-mark.png`, and `reveal.mp4`. The QR files encode the exact support addresses. USDT is labeled Ethereum/ERC-20; its QR encodes the address only. Never change a wallet without also regenerating its QR.

The reveal loads only when opened. Native video controls, keyboard-accessible dialogs, visible focus states, a skip link, responsive layouts, and reduced-motion handling are included. The preloader disappears using CSS even if JavaScript is unavailable. No sound starts automatically on page load.

Edit public copy in `components/kitty/home-sections.tsx`, the opening and navigation in `components/kitty/site.tsx`, and design tokens/styles in `app/globals.css`. The flagship is labeled as a concept in development; the website does not claim that the physical AI product is already available.

SEO includes per-page titles/descriptions, Open Graph and Twitter metadata, the supplied monogram favicon, a sitemap, and robots exclusions for the studio/API.

## Deploy

**Vercel:** Import the repository, use the Next.js preset, and set all seven server variables above in the **Production** environment: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `ADMIN_LOGIN_ID`, `ADMIN_EMAIL`, `ADMIN_USER_ID`, `FEEDBACK_GATEWAY_TOKEN`, and `SITE_URL`. Keep `FEEDBACK_GATEWAY_TOKEN` secret. Use the Supabase project URL and its current publishable key, the same admin values used by Supabase Auth, and the matching gateway token whose SHA-256 hash is stored in `kitty_website_private.settings`. Set `SITE_URL` to the actual domain. Redeploy after changing any values so the production functions receive them. `vercel.json` selects `npm run build:next`.

**Netlify:** Import the repository with Next.js framework support enabled. `netlify.toml` selects the native build and Node.js 24. Add the same runtime environment values to the functions/build environment. Netlify's Next.js adapter handles server routes. Do not use static export: the contact and studio routes need a server.

**Sites:** Preserve `.openai/hosting.json` and its existing `project_id`. The default build emits the Worker and static assets. Configure runtime values in Sites and deploy the validated output. The initial Sites publication is private to its owner.

## Verification

`scripts/verify-site.mjs` exercises real HTTP routes, anonymous access rejection, CSRF, validation, contact persistence, notice CRUD/draft visibility, HTTP-only cookies, and session revocation. It requires a running local server and access to the original private brief to read the password without hardcoding it:

```sh
node --env-file=.env.local scripts/verify-site.mjs http://localhost:5173 /absolute/path/to/private-brief.txt
```

The script deletes its temporary notice and prints only the ID of its test feedback record. Remove that exact feedback ID in Supabase after the check. Tests never log passwords or tokens. Browser visual/interaction QA is separate from these HTTP checks.

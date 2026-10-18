# Configuration and local setup

## Required website environment values

The exact names below come from `.env.example` and the active server code. All are read on the server. Keep the values in ignored `.env.local` or private hosting settings. Do not add a `NEXT_PUBLIC_` prefix to them.

| Name | Purpose | Where the correct value comes from |
| --- | --- | --- |
| `SUPABASE_URL` | Website database API address | Website project’s API configuration; current project is `mgkghnblbisubympudaa` |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable API key used with RLS | That same project’s API keys; not a service-role/secret key |
| `ADMIN_EMAIL` | Email of the existing Supabase Auth administrator | Existing configuration and Auth user record |
| `ADMIN_USER_ID` | UUID of that Auth administrator | Existing configuration, Auth record and private database allowlist |
| `FEEDBACK_GATEWAY_TOKEN` | Private token for login throttling, forms and submission fingerprints | Existing private configuration; its SHA-256 hash must match `kitty_website_private.settings` key `feedback_gateway_hash` |
| `SITE_URL` | Canonical site/origin setting | `https://kittycorp.vercel.app` for the current public deployment |

Studio at `/kitten` uses Google-only sign-in. `ADMIN_LOGIN_ID` is no longer read by the login route; an existing legacy environment value can be left unused. No administrator password is needed in the website form or hosting environment. Google credentials belong in Supabase provider settings. Do not place `ADMIN_PASSWORD`, `SUPABASE_SECRET_KEY` or a service-role key in the deployed website environment to try to fix a normal login issue. See `GOOGLE_STUDIO_SETUP.md` for the callback, approved account and recovery details.

`scripts/setup-admin.mjs` is a one-time local provisioning helper using a privileged key. It is not the normal startup or maintenance procedure. Do not rerun it for this existing account. It also does not finish the private database allowlist by itself.

## Find and recreate .env.local

In the original workspace it lives beside `package.json`:

`C:\Users\HP\Downloads\Project (Kitty-Corp)\KITTY CORP STARTUP WEBSITE\.env.local`

The file is intentionally excluded from this ZIP. In a new local folder, copy `.env.example` to `.env.local`, then fill in the values from your existing private configuration. Keep an encrypted private backup of them. Vercel’s production settings and your local file are independent; editing one does not change the other.

On Windows in the extracted `kitty-corp` directory:

```powershell
Copy-Item -LiteralPath .env.example -Destination .env.local
```

Do this only when `.env.local` does not already contain your correct values. Preserve an existing file rather than overwriting it. If Explorer makes the file hard to find, enable hidden items and file-name extensions. A file accidentally named `.env.local.txt` is not the intended file.

If you use the Vercel CLI, link to the existing `kittycorp` project and check `vercel env --help`. The supported `vercel env pull [file]` workflow can download permitted values for the selected environment. Do not assume a write-only secret can be recovered this way; the CLI may leave a placeholder. Confirm every required value privately. [Official CLI reference](https://vercel.com/docs/cli/env)

## Local development

Use Node.js **24** with the committed `package-lock.json`. The package requires at least Node 22.13.0; Node 24 is the documented handover choice.

```powershell
npm ci
npm run dev:next
```

Open `http://localhost:3000`. If that port is occupied, stop your own old development server or choose another port explicitly through the Next command. Do not kill an unrelated process. After changing `.env.local`, restart the development server.

Production checks:

```powershell
npm run typecheck
npm run build:next
npm run start:next
```

Run the last command after a successful build and when port 3000 is free. Lint the changed TypeScript/React files with the existing ESLint configuration; a whole-tree lint can also include historical or generated files, so diagnose its output rather than silently ignoring it. `next-env.d.ts` and `.next/` are generated locally and excluded from the archive.

Starting locally with production configuration uses the live Supabase database. Content saves, enquiry submissions and deletes can affect real data even on localhost. Use a separate test project for broad destructive testing, or use private temporary records with an explicit cleanup plan.

## Vercel settings

- Framework preset: **Next.js**.
- Repository: `psychspy7/kittycorp`; production branch: `main`.
- Project root: the folder containing `app/` and `package.json`.
- Install command: `npm ci`.
- Build command: `npm run build:next`.
- Output directory: `.next`, as configured in `vercel.json`.
- Runtime: keep the supported Node configuration consistent with your local checks.
- Configure the six required server variables above for Production. Preview and Development have their own scopes; do not assume they inherit the same values. AI and Turnstile configuration uses encrypted runtime settings, with optional environment overrides documented in `.env.example`.

Check Vercel’s **Settings → Environment Variables** for changes. New values apply to new deployments, so redeploy afterward. Existing deployments keep their previous values. Keep secret fields private and do not include values in logs or screenshots. [Official environment documentation](https://vercel.com/docs/environment-variables)

Do not use static export, GitHub Pages or plain static hosting for this application. It relies on server routes for Studio sessions, protected content, forms, image delivery and APK signing URLs. An alternative hosting platform must support the same Next.js server behavior and private environment values.

## Domain or hosting changes

Connect the domain in Vercel, configure the DNS records that Vercel provides, then verify HTTPS. Update `SITE_URL` to the intended canonical origin and deploy again. Review metadata, sitemap and any redirect rules. The server also recognizes its own request origin, but canonical links still depend on the configured website address.

An allowed preview origin does not isolate its data: a preview connected to the production Supabase project can edit production content. Give a staging deployment separate database configuration if you need genuine isolation.

## Dependency changes

Use the lockfile for repeatable installation. Do not change Next.js, Supabase, React, build tools or package versions as part of an unrelated visual edit. If an upgrade is requested, read release notes and the installed Next.js guides, change the lockfile with the package manifest, build, and test the affected authentication/content flows.

The project’s current installed Next.js rules are documented in `AGENTS.md`; relevant guides are under `node_modules/next/dist/docs/` after installation.

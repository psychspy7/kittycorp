# Handoff to another AI coding app

Use the latest `psychspy7/kittycorp` GitHub `main` when continuing later. This package captures the tested source at `764c2bd182f9a03700b7c622e7ce151c377765ee`, including consent-based Google Analytics added on 5 October 2026. See `GOOGLE-ANALYTICS.md` for the stream connection. The public content and backend reference copies were prepared on 3 October 2026.

## Reusable request

Copy this into your coding app and replace the last line with the specific work you want:

> Maintain my existing KITTY CORP website. Read OWNER-GUIDE.md, handover/CONFIGURATION.md, handover/FILE-MAP.md and AGENTS.md first. Start from the latest GitHub main and show the revision you are using. This is a Next.js 16.3.4 / React 19.2.6 website on Vercel, backed by the existing Kitty Corp Website Supabase project mgkghnblbisubympudaa. Use npm ci, npm run dev:next and npm run build:next. Read the relevant installed Next.js guides before writing framework code. Preserve the light ivory/graphite design, Dirtyline display headings, Geist body type, clear Services navigation, separate detail pages and founder-only homepage. Preserve protected Studio, current Auth/admin checks, private enquiries/subscribers, rate limits, separate icon uploads, APK release publishing, founder profiles and company socials. Do not recreate the database, reset existing data, rerun first-install SQL or touch the separate private-chat project. Keep secrets in ignored configuration and never print or commit them. New development-product types need coordinated validation, schema and route changes; Apps & launches already creates Android launch pages. Work on a branch for substantial changes. Run appropriate lint, TypeScript, build and desktop/mobile checks, and verify any affected Studio/form flow. Explain exactly what changed and any remaining limitation. Do not claim a deployment succeeded until it is verified. My requested change is: [describe it here].

## Context the next maintainer needs

- Public website: `https://kittycorp.vercel.app/`; Studio: `/kitten`, with Google-only owner sign-in. The old `/admins` route is retired. Public pages must not link to Studio.
- Repository: `https://github.com/psychspy7/kittycorp`; production branch: `main`; Vercel project: `kittycorp`.
- Website project ref: `mgkghnblbisubympudaa`, name **Kitty Corp Website**, region `ap-south-1`.
- Private-chat project is separate. Do not pause, migrate or reuse it for website work.
- Native Next.js is the active Vercel build. Vinext/Vite, Drizzle/D1 and Sites support remain in the source as an alternate runtime; they are not the website’s Supabase migration or production build path.
- Public content uses `kitty_website_*` tables. Privileged settings and the explicit administrator allowlist use `kitty_website_private`.
- No Supabase Edge Functions were listed in the current website project during handover. Form submission and login throttling use Postgres RPCs, not a missing Edge Function.
- One configured Studio administrator is enforced by environment UUID plus the live database allowlist and active Auth session. Team profile editing is unrelated to administrator permissions.
- Hosted launch APKs are in the private `kitty-website-releases` bucket. Published downloads get short-lived signed URLs through the website; drafts remain restricted.
- Website images are in the public `kitty-website-media` bucket. UUID file names prevent stale icon replacement caching. Images are deliberately public assets even if a content entry is a draft.
- Exact public and private-data access rules are in the structural inventory. Preserve authorization and validation on both the website and database sides.

## Files supplied for review

`BACKEND-INVENTORY.json` contains current structural references, including RPC definitions, policies, indexes, constraints and bucket settings. It has no private row data or credential values and is **not an executable migration**. `PUBLISHED-CONTENT-REFERENCE.json` contains only currently public entries. It is **not an import script or full backup**. Files copied under `public-assets/` do not upload themselves back to Storage.

For code-only work, repository access is enough. Provide database access only for work that needs it, to this exact website project. Private secrets should be supplied through local environment files or the coding app’s secret facility rather than included in this handoff.

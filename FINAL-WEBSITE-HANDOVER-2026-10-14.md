# KITTY CORP website — final owner handover (14 October 2026)

This document describes the website source and its operational limits. Read `AGENTS.md`, `START-HERE.md`, `OWNER-GUIDE.md`, `CUSTOMER-ACCOUNTS-GUIDE.md`, `PROJECT-PAYMENTS-GUIDE.md`, `EMAIL-AUTOMATION-GUIDE.md` and `integrations/supabase-health/README.md` before making changes.

## Current public experience

The homepage leads with websites, apps and personal AI. It offers a visible project request, published KITTY AI and developing LISA AI, product plans, project payments, a real founder profile, build notes and voluntary support. AI agents and n8n-style business automations are an offered service on `/services#automation` and an accepted project request type. Scope, price, hosting, model usage and sensitive-action approvals are agreed for each client; this is not a claim that every workflow has already shipped.

The KITTY AI website guide opens from the homepage and prefills a selected question. A visitor must choose to send it and pass the existing bot check. Studio controls its enabled state and guidance. The Android app is a separate product and account. Existing receipts, memberships, refunds, customer account tracking, launch records and Studio authorization remain on their own backend paths.

## Source and deployment

- Canonical source: `C:\Users\HP\Downloads\Project (Kitty-Corp)\KITTY CORP STARTUP WEBSITE`.
- Existing GitHub repository: `https://github.com/psychspy7/kittycorp`, branch `main`.
- Existing Vercel production project: `kittycorp`, public host `https://kittycorp.vercel.app`.
- Website Supabase project only: `mgkghnblbisubympudaa`. Never substitute the separate private-chat project.
- Studio: `/kitten`, Google owner sign-in; customer accounts: `/account`, existing KITTY AI Google identity.
- Native Next.js scripts: `npm ci`, `npm run dev:next`, `npm run check:website`, `npm run build:next`; Node 22.13+ is required.
- Website health: `/api/health` performs a bounded public read. HTTP 200 means that read succeeded; HTTP 503 means it did not. Studio > Health & handover shows this result and configured connections to the owner. Configuration is not a proof of Gmail delivery, model replies or provider settlement.

## KITTY AI release and content

`public/downloads/kitty-ai-2.0.0.apk` is the owner's already signed KITTY AI 2.0.0 Android package. Verified bytes: 4,495,385; SHA-256: `3bc61fa51b7afd6a51d9464d931cda9bccd27c4dd7b12cbd62bd18092e8159cd`. Do not re-sign it. The website's public launch listing and icon are stored in Supabase. Future icons, release notes, visibility, APKs and product details can be changed in Studio > Apps & websites without code changes. Keep the original Android signing key privately backed up.

A source ZIP is NOT a backup of live customer records, Supabase uploaded media, encrypted payment settings, Vercel/Cloudflare secrets, identity-provider configurations or Git history. Back those up privately in their own services. Never publish filled environment files, customer data or signing keys.

## Payment and customer boundaries

KITTY Plus, LISA preorder, project quotes and voluntary contributions are separate flows. Existing server-side order creation, approved amounts, signatures, ownership, webhook handling and refunds must stay intact. LISA's paid preorder terms promise a full refund before early access; there is no promised delivery date. Provider availability is controlled in Studio. Do not mark an order paid based on a browser response or a disabled provider. Project request estimates do not bypass owner-approved quotes. The business-automation service has no fabricated instant price.

## Running during a study break

The Cloudflare Worker `kitty-corp-database-health` makes one read-only website database check at 08:30 IST each day. It does not guarantee that Supabase Free will never pause. Its invocation log is in Cloudflare. Set up an independent monitor for the public homepage and `/api/health` if you want outage alerts, and periodically export the private database and uploaded media. The current source package is not that backup. Check the KITTY CORP email queue and payment dashboard occasionally; pause new paid checkouts in Studio if you cannot fulfil them while away. Supabase's paid plan is the provider's option for stronger inactivity guarantees.

## Verification performed for this release

The full `check:website` suite passed, including Google Studio security, customer identity, payment signatures and quote rules, LISA and KITTY entitlements, email templates and the public assistant proxy with mocked external services. Next.js production build and ESLint on changed files passed. Desktop (1440px), mobile (390px) and small mobile (320px) pages rendered with no horizontal overflow or browser page errors. Mobile navigation opened. The assistant prefilled a question without sending it. Anonymous `/api/admin/health` returned 401. Local `/api/health` returned 200 with no-store. A bounded local 60-request, 6-concurrent-user read-only check had 0 failures, 187 ms median and 600 ms 95th percentile. These are local measurements, not a guarantee of production performance or a live payment test.

For a future AI coding app, paste `handover/CONTINUATION-PROMPT-2026-10-14.txt`. Preserve the separate KITTY AI and other project Git repositories. Re-run the checks and update the source archive with `python -u source_archive.py --project website` from `Source File Zip` after each major verified change.
# KITTY CORP — Current State Audit
**Document Date:** October 30, 2026  
**Repository:** https://github.com/psychspy7/kittycorp.git  
**Target:** https://thekittycorp.com  
**Branch:** `redesign/client-conversion`

---

## 1. Executive Summary & Existing Features

KITTY CORP is an independent technology and software engineering studio specializing in high-performance web applications, native mobile systems (Android), applied AI automations, and custom software.

### Core Feature Inventory:
- **Client Project Inquiries & Conversion Pipeline**: Multi-step project inquiry form (`/projects`, `ProjectEnquiry`) with scope selection, estimated timeline/budget, honeypot bot trap, timing threshold checks (min 2s, max 24h), and Cloudflare Turnstile verification.
- **Client Account & Portal (`/account`)**: Google OAuth (PKCE) verified customer sign-in; allows client to claim guest inquiries, inspect itemized project quotes, approve scopes, review staging links, and monitor payment schedules.
- **Project Quotes System (`/projects/quote`)**: Immutable HMAC-signed quotes with secret hashing, payment installment schedule (e.g., 50% kickoff, 50% staging verification), or full upfront advance with a 2.5% discount.
- **Appointment Scheduling (`/appointments`)**: Scoped meeting request flow sending structured calendar proposals to engineering with validation preventing booking less than 1 hour in advance.
- **Studio Admin & CMS (`/kitten`)**: Google-only PKCE authentication with hardware/email whitelist, managing project quotes, customer communications, early access, product launches, journal/build-logs, media assets, team profiles, and maintenance status.
- **Payment & Commerce Integrations**: Multi-provider support (Razorpay, PayPal, Cashfree) with tamper-proof signatures, currency conversion (`price-estimate`), idempotency keys, and webhook replay protection.
- **Proprietary Labs & Products**:
  - **KITTY AI**: Mobile AI assistant with on-device memory and voice engine (`/kitty-ai`).
  - **LISA AI**: Desktop companion with spatial awareness and 2D character (`/lisa-ai`).
  - **SecretChat**: End-to-end encrypted messaging application (`/secretchat`).
  - **Suvid AI**: Physical assistant robotics research initiative (`/research/suvid-ai`).
- **Interactive Discount Utility (`/play`)**: Seeded Snake game providing legitimate 5%–7% project discounts upon verified completion and social follow confirmations.

---

## 2. Inventory of Existing Routes

### Public Pages (36 Total):
- `/` — Homepage
- `/services` — Overview of studio services
- `/services/[segment]` — Targeted landing pages (`coaching-centres`, `agencies`)
- `/projects` — Client work, case studies & primary project inquiry form
- `/projects/quote` — Client quote inspection and payment authorization
- `/products` — Directory of proprietary apps and production releases
- `/kitty-ai` — Flagship Android AI application
- `/lisa-ai` — Desktop interactive agent & preorder details
- `/lisa-ai/preorder` — LISA preorder checkout
- `/secretchat` — Encrypted chat application download & details
- `/research` — Applied research, robotics, and computer vision
- `/research/suvid-ai` — Physical assistant research direction
- `/company` — Company overview, mission, and registered details
- `/team` — Engineering team directory and verified roles
- `/contact` — Direct communication form and appointment links
- `/appointments` — Direct client strategy call booking
- `/pricing` — Clear project tiers, packages, and inclusions
- `/memberships` — Product recurring memberships and support tiers
- `/account` — Client portal, tracking, and Google authentication
- `/account/projects/[id]` — Individual project milestone view
- `/account/preorders/[id]` — Individual preorder tracking
- `/build-log` — Public engineering journal & technical updates
- `/build-log/[slug]` — Individual engineering log entry
- `/launches/[slug]` — Production release notes and APK downloads
- `/play` — Snake discount challenge
- `/payments` — Client project milestone settlement and support donations
- `/investors` — Research, incubation & partnership briefings
- `/privacy` — Privacy policy and data retention disclosures
- `/terms` — Client service terms and warranty specifications
- `/refunds` — Transparent refund and cancellation guidelines
- `/kitten` — Studio administrative portal (Google PKCE authenticated)
- `/admins` — Legacy redirect preserving security notices
- `/sentinel` — Infrastructure health and security canary
- `/abcdefghijklmnopqrstuvwxyz` — Canary honey-route for malicious scrapers
- `/newsletter/confirm` — Double opt-in confirmation
- `/newsletter/unsubscribe` — Cryptographic one-click unsubscribe

### Key API Routes (50+ Total):
- `/api/enquiries` — Handles project inquiries with Turnstile & email routing
- `/api/feedback` — Handles contact & appointment messages
- `/api/admin/login` — PKCE Google OAuth start
- `/api/admin/google/callback` — Validates Google OAuth code and issues studio session
- `/api/security/turnstile` — Returns active Turnstile public configuration
- `/api/payments/[provider]/order` — Creates payment orders with amount binding
- `/api/payments/webhooks/[provider]` — Webhook ingestion with HMAC validation
- `/api/assistant/chat` — Scoped, quota-protected technical assistant
- `/api/account/*` — Client account data and claimed link associations
- `/api/site-status` — Runtime health and emergency maintenance reporting

---

## 3. Integrations & External Services

| Integration | Purpose | Verification / Security Mechanism |
|---|---|---|
| **Supabase PostgreSQL** | Primary datastore (projects, quotes, team, logs, feedback) | Service role key isolated in backend; access through hardened SQL RPCs |
| **Cloudflare Turnstile** | Bot protection for inquiries, logins, and games | Secret verified server-side against `challenges.cloudflare.com/turnstile/v0/siteverify` with dynamic host resolution |
| **Nodemailer SMTP** | Direct email dispatch to `support@thekittycorp.com` | Verified TLS connection; fail-closed queue buffering |
| **Google Identity (OAuth 2.0)** | Studio admin & Client account authentication | SHA-256 PKCE challenge; admin UUID/email domain allowlist |
| **Razorpay / PayPal / Cashfree** | Client project milestones & product memberships | Cryptographic signature verification, order amount lock, replay prevention |
| **Google Analytics (Optional)** | Privacy-respecting conversion tracking | Explicit user consent gate; blocked by default until accepted |

---

## 4. Technology Stack & Key Dependencies

- **Framework**: Next.js 16.3.4 (App Router, Server Components, Route Handlers)
- **Runtime**: Node.js >= 22.13.0
- **UI & Styling**: React 19.2.6, Tailwind CSS 4.2.1, Lucide React 1.31.0, Radix UI primitives
- **Validation & Typing**: TypeScript 5.9.3, Zod 3.25.76
- **Database & Persistence**: Supabase JS 2.116.0, Drizzle ORM 0.45.2
- **Image Processing**: Sharp 0.34.5
- **Animation**: Framer Motion 13.2.0

---

## 5. Security Controls & Protections

1. **Host-Aware Turnstile**: Dynamic hostname validation accepting canonical (`thekittycorp.com`), `www.`, Vercel staging (`kittycorp.vercel.app`), Cloud Run / Firebase App Hosting, and localhost.
2. **Strict Origin & CORS Verification**: Enforced via `verifyOrigin()` in `lib/kitty-server.ts`.
3. **Database-Controlled Rate Limiting**: Enforced via PostgreSQL RPCs (`kitty_website_login_attempt`, fingerprint limits).
4. **Honeypot & Interaction Timing**: Inquiries require a minimum of 2,000ms and max 24h interaction time; hidden `website` trap field rejects automated spambots.
5. **No Secret Leaks**: Zero client-side leakage of gateway tokens, API keys, or private certificates.
6. **Strict Security Headers**: HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.

---

## 6. Identified Defects & Resolved Issues

- **Turnstile Host Rejection Defect**: Previously in `lib/turnstile-server.ts`, `allowedHosts` was restricted to single `process.env.SITE_URL` in production, rejecting users submitting from `kittycorp.vercel.app`, `www.thekittycorp.com`, or local production builds.
  - *Status*: **Resolved** in commit `55ad2cd` by dynamically extracting the active host and admitting trusted domain suffixes.
- **Frontend AI Slop & Ticker Clutter**: Previous versions had generic animated tickers and placeholder prompt cards.
  - *Status*: **Resolved**; elevated to executive capability matrices and direct engineering engagement.

---

## 7. Redesign Risks & Non-Negotiables

### Redesign Risks:
- Modifying form markup must preserve field names (`name`, `email`, `service`, `message`, `organization`, `budget`, `timeline`, `website`, `turnstileToken`) to avoid breaking API validation.
- Retain all test assertions in `scripts/` to ensure `npm run check:website` passes 100%.
- Ensure high contrast and accessibility compliance (WCAG AA).
- Maintain responsive navigation across mobile devices (320px–430px) without overflow.

### Non-Negotiable Preservations:
1. **Never alter API contracts** for `/api/enquiries`, `/api/feedback`, `/api/admin/*`, `/api/payments/*`.
2. **Never weaken or disable security checks** (Turnstile, origin verification, rate limits, PKCE).
3. **Never delete existing URL routes** (sitemap, canonical references, legacy redirects must remain intact).
4. **Preserve database RPC mappings and customer account associations**.

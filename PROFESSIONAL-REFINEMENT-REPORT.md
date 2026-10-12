# Website refinement verification — 12 October 2026

Canonical project: KITTY CORP STARTUP WEBSITE, within the Downloads/Project (Kitty-Corp) workspace. This report covers website source and its new service/contribution ledger; app releases retain their separate repositories.

## What changed

The homepage now leads with business websites, web applications and Android apps, using a real published EXAMIFY screenshot and actual app icons. The primary action opens the project enquiry form. Services, process and six-month maintenance scope are visible without searching through the company story. Products/shipped work and research link to their own pages. Virat Anand appears on the homepage, with a prominent full-team link.

The visual system uses warm near-white, graphite and restrained gold. Dirtyline 36D is retained for the opening headline; Geist handles body text, navigation, forms and most section headings. Mobile cards stack intentionally, controls are touch sized, and typography stays readable. No invented client totals, reviews, employment credentials or partnerships were added. The site renders only real reviews published in Studio.

Header logos are colored, slightly larger and faster. Footer logo tracks remain understated, with pause controls, reduced-motion handling and clear technology/initiative attribution. Footer navigation is shorter and grouped. Existing product icons, team images, social links, forms, assistant, analytics and AdSense remain in place.

LISA's page presents optimized real room, rig and expression-development imagery with accurate captions. The USD100 version-lifetime draft and unspecified preorder gifts are presented as planned access, with checkout closed. Studio manages the gallery and draft LISA terms.

The KITTY AI chat's membership work was coordinated into the website. Its backend catalogue and Firebase customer identity stay authoritative; Studio continues using its existing Supabase Google owner sign-in. The membership page combines KITTY's actual draft pricing/limits with the LISA presentation without duplicating purchase grants. Membership purchase activation and app-side provisioning remain separate from this website release.

Razorpay, PayPal and Cashfree service/contribution checkout code is prepared. Provider modes start Off; live modes require owner-confirmed approval and the required credentials/webhook settings. Private encrypted Studio writes preserve existing AI and Turnstile keys and reject stale concurrent saves. Secrets are not returned to the client. In-flight provider and membership verification/webhooks can finish during maintenance; new orders remain blocked.

Canonical page metadata, descriptions, social sharing image and genuine Organization structured data were added/refined. The social image uses a small PNG logo for renderer compatibility. Versioned LISA images use immutable caching. Public data caching remains separate from private sessions, messages, orders and permission checks.

## Verification

- The combined `npm run check:website` passed: TypeScript, public cache isolation, Studio Google sign-in, bot verification failures, analytics privacy, assistant proxy safeguards, Razorpay, alternative payment providers, memberships, notification queue and native hosting configuration.
- Provider regression checks include fixed server quotes, amount/currency mismatches, expired/tampered sessions, forged signatures, fetched capture status, safe retries, provider modes, encrypted configuration, secret-free Studio responses and concurrent writes. Tests use fixtures; no real payment or model request was made.
- Membership tests cover ownership, immutable pricing, reused orders, capture/refund status, callbacks, webhook integrity, rotated webhook secret and service/payment separation. They do not prove merchant approval or production app provisioning.
- Native Next.js production compilation was verified. The initial social-image rendering failure was corrected by using PNG rather than WebP in the image renderer.
- Desktop (1440px) and mobile (390px) homepage were reviewed in the browser. The mobile menu opens and its service link dismisses the menu and navigates successfully. Document width stayed within the viewport. Published hero screenshot and app icons loaded. LISA was reviewed at desktop and mobile widths, with three real gallery items and USD100 planned pricing.
- The local services/contact/LISA/memberships/payment routes returned HTTP200; each included one AdSense account meta tag. The social image returned image/png. Unsigned `/api/admin/commerce` and its orders endpoint returned HTTP401 and no-store headers.
- An isolated local production load test ran 120 requests at concurrency10 across six public routes: zero failures; p50 917ms, p95 3958ms, p99 3961ms, 7.65requests/sec. Each public content collection was fetched once from the 40ms-latency mock database. This is a local fixture result under shared machine load, not a production capacity or Core Web Vitals claim. See outputs/performance/professional-load-test.json locally.

## Database and deployment state

The additive `website_payment_provider_ledger` migration was applied to website Supabase project mgkghnblbisubympudaa. Its private payment_orders table has RLS enabled, no anonymous/authenticated direct SELECT grants, an idempotent provider/payment uniqueness rule, and a recent-order index. Reads and writes use separately guarded gateway/admin functions. Existing chat project and content tables were preserved; no provider credentials, payments or customer records were created.

Supabase reports an informational “RLS enabled, no policy” notice for this deliberately private RPC-only table. This is expected; direct access is denied. Existing unused-index notices reflect new/low-traffic indexes and are retained. The prior notice-policy overlap and leaked-password-protection warning remain outside this change; Studio uses Google authentication. References: [RLS notice](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [index notice](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index), [notice policy overlap](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies), [password settings](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

No GitHub push or Vercel deployment was performed for this refinement. The tested source snapshot can be ahead of GitHub. Keep the current private configuration and existing repository history when continuing. Read PAYMENT-PROVIDERS-SETUP.md before activating any payment flow. Gmail delivery still needs its separately configured app password; fixture email tests do not send messages.

Preview: http://localhost:3075/ (local process; analytics and Turnstile are disabled only in this loopback preview, with production settings unchanged). The website source ZIP excludes private environment files, signing material, dependencies, Git metadata, APK binaries and live records. Restore those separately when needed.

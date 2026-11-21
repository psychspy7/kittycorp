# Project: KITTY CORP Startup Website Showcase Readiness

## Architecture
- Next.js 16.4.6 with Turbopack, App Router (73 routes).
- Tailwind CSS with Warm Minimalist Design System (`app/warm-architecture.css`, `app/globals.css`, `app/company-home.css`).
- Supabase PostgreSQL backend for transactional presence and analytics telemetry.
- Comprehensive verification suite: TypeScript strict mode (`tsc --noEmit`), E2E suite (`scripts/test-e2e-suite.mjs`), Website check suite (`scripts/check-website.mjs`), Production build (`npx next build`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Lint & Build Stability | Fix ESLint errors in `app/agriyaan/page.tsx`, `components/kitty/brand-reveal-loader.tsx`, and `next.config.ts` | M1 | Survey Explorer 1 |
| 2 | E2E Test Suite Portability | Decouple `scripts/test-e2e-suite.mjs` from hardcoded scratch paths; add local `docs/PROJECT.md` and repo fallback for F6.1 | M1 | Survey Explorer 1 |
| 3 | Showcase Telemetry Whitelist | Add `/agriyaan`, `/urjayaan`, `/urjaan`, `/buddy`, `/support`, `/payments` to `lib/site-analytics.ts` to stop HTTP 400 errors | M2 | Survey Explorer 2 |
| 4 | Authentic Telemetry Counter | Sanitize legacy +10,000 floor in `app/api/telemetry/route.ts` and author authentic SQL migration `202611210001_authentic_telemetry_counter.sql` | M2 | Survey Explorer 2 |
| 5 | High Contrast Typography & Accents | Elevate footer legal text contrast to 10.5:1 (`#9CA3AF`) and venture indicator to `#60A5FA` | M3 | Survey Explorer 3 |
| 6 | Mobile Drawer & Viewport Stability | Close drawer & restore body scroll on route change; prevent iOS Safari zoom on mobile inputs | M3 | Survey Explorer 3 |
| 7 | Form Hardening & Turnstile Parity | Add Turnstile support to `footer-newsletter.tsx` and mobile font sizing | M3 | Survey Explorer 3 |
| 8 | Full Repository Verification Wave | Pass `tsc --noEmit`, `scripts/check-website.mjs`, `scripts/test-e2e-suite.mjs`, and `npx next build` (73/73 pages) | M4 | Survey Explorers 1, 2, 3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Lint, Type & Test Portability | Fix ESLint errors and E2E scratch path dependency | none | COMPLETED |
| 2 | Authentic Visitor Counter Telemetry | Fix telemetry whitelist and eliminate artificial 10,000 floor | none | IN_PROGRESS |
| 3 | Responsive Layout, Contrast & Forms | High contrast, mobile drawer scroll lock, iOS viewport stability, form Turnstile | none | IN_PROGRESS |
| 4 | Full Verification & Audit Wave | Full suite passes: `tsc`, `check-website`, `test-e2e-suite`, `next build` 73 pages | M1, M2, M3 | PLANNED |

## Interface Contracts
### Client Telemetry ↔ Server Telemetry API
- `POST /api/telemetry` payload: `{ sessionId: string, deviceId: string, path: string, heartbeat: boolean }`
- Response: `{ active: number, total: number, realActive?: number }`
- HTTP 200 on all valid public routes including showcase pages.
- `total` represents authentic cumulative visitor count without arbitrary offsets.

### Mobile Navigation Drawer ↔ Next.js Navigation
- `components/kitty/site.tsx`: `usePathname()` triggers `setOpen(false)` and restores `document.body.style.overflow = "auto"`.

### E2E Suite Contract & Storytelling Specification
- `scripts/test-e2e-suite.mjs`: Test F6.1 reads from `docs/PROJECT.md` or checks component implementation, avoiding machine-specific scratch path dependencies.
- Storytelling interactive scroll showcase: `ScrollStorySection` / `scroll-story-section` storytelling experience deployed across AgriYaan (`app/agriyaan/page.tsx`), UrjaYaan (`app/urjayaan/page.tsx`), and flagship showcase sections (`components/kitty/company-home.tsx`).
- Photography Assets: `public/photography/` contains authentic high-resolution space, aerospace, and robotics imagery.

## Code Layout
- `app/agriyaan/page.tsx` — Rover showcase page
- `components/kitty/brand-reveal-loader.tsx` — Loader state handling
- `next.config.ts` — Next.js configuration
- `scripts/test-e2e-suite.mjs` — E2E test runner
- `docs/PROJECT.md` — Project specification contract
- `lib/site-analytics.ts` — Analytics and telemetry route whitelist
- `app/api/telemetry/route.ts` — Real-time visitor counter telemetry API
- `supabase/migrations/202611210001_authentic_telemetry_counter.sql` — Authentic telemetry SQL migration
- `app/warm-architecture.css` — Warm minimalist CSS and contrast overrides
- `components/kitty/site-footer.tsx` — Site footer and counter badge
- `components/kitty/site.tsx` — Navigation drawer and header
- `components/kitty/footer-newsletter.tsx` — Footer early-access form

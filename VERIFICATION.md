# Verification — 3 October 2026

- TypeScript checks and the Next.js production build passed.
- The redesign's company, product, research, investor, privacy, journal and article routes passed HTTP checks. Both founders appear in the homepage copy.
- Studio sign-in, journal creation/editing/deletion, private drafts and future-dated publication were verified against the website backend. Temporary test entries were removed.
- Early-access submissions, selected interests, duplicate handling, validation, private list access, anti-spam timing, cross-origin blocking and gateway authorization passed integration checks. The temporary signup was removed.
- The new launch code passed targeted lint checks.
- SecretChat 1.5.0 build 6 passed Android `apksigner` verification, package/label checks, release-mode checks, and the private-credential scan. SHA-256: `b32be6a4ac9555a1fe23943a90507a6e9d4583f9522e018162240268ca9de53b`.
- HTTP checks passed for the homepage, SecretChat page, Studio, sitemap, and exact APK download. Download responses use the APK MIME type, attachment header, and immutable caching.
- Administrator sign-in was verified without logging credentials.
- A temporary launch exercised direct 5.3 MB upload, server-side SHA-256 verification, private drafts, public publishing, exact storage download, unpublishing, deletion, and logout. The temporary launch and file were removed afterward.
- Anonymous requests cannot use launch management or upload endpoints. Cross-origin writes are blocked. Row-level security hides draft rows and APKs from anonymous visitors.
- Browser preview verified the launch popup, product page, installation instructions, and mobile layout. No browser errors were recorded.
- Brand display images total about 77 KB, compared with about 2.6 MB for the original displayed PNGs. The opening loader was removed. Original artwork is retained.
- The package excludes private environment files, credentials, dependencies, Git data, and generated builds.

Checks verify the website and release-delivery flow. They do not constitute an independent security audit of the Android app.

The refined site was verified on the live deployment: desktop and mobile typography, product layouts, mobile navigation, anchor links and early-access confirmation. Geist loaded from the website, with no horizontal overflow at the checked mobile sizes. The live backend integration checks passed; temporary records were removed.

Company publishing update: production build and TypeScript passed. Integration checks verified optimized image uploads, immutable replacement addresses, public product icons, separate launch icons, team creation/editing/visibility/removal, portraits and profile links, company socials, private project enquiries, input validation, draft visibility and origin protection. Synthetic profiles, enquiries and image objects were removed; the original product, launch and company data were restored. No new environment secrets are required.

Final interface update: targeted ESLint checks, the Next.js production build and TypeScript passed. Public route checks covered the lighter homepage, services, products, company, full team and existing detail pages. The self-hosted Dirtyline font returned the expected 15,456 bytes. Studio login and overview, private team drafts, separate release-icon replacement, optimized WebP delivery and project-enquiry delivery were verified against the configured backend. Desktop and mobile layouts, mobile menu and direct project-form navigation were reviewed in the browser. Temporary images, drafts and enquiry records were cleaned up.


## Shipped work and Studio reviews — 8 October 2026

- Preserved the latest website-launch publishing flow and live/explore actions from GitHub.
- Production build, TypeScript check and targeted lint passed. Archived source copies in `outputs/` and handover material are excluded from compilation.
- Isolated browser checks passed on desktop (1440px) and mobile (390px): real EXAMIFY screenshot/live URL, Android release actions, two founder positions, tool links, mobile navigation, enquiry anchor, native FAQ and no client-side errors. Reduced motion was enabled for public-page checks.
- Studio sign-in and review draft create/list/edit/delete passed against the dedicated website backend. Publication without permission and unsafe source URLs returned 400. Unauthenticated reads/writes returned 401; cross-origin mutations returned 403.
- Direct anonymous database insertion was denied with 42501. Private drafts were invisible to anonymous reads and the public homepage.
- An uncommitted database fixture confirmed public reads see approved/published rows but not drafts; the transaction was rolled back. The separate Studio QA draft was deleted, and its isolated session signed out. No review was published for testing.
- The new table has RLS, restricted grants, live-admin policies, a database permission constraint and a partial public-order index. No new table warning was reported by security advisors. Existing gateway/auth advisories remain documented through the [Supabase advisor guidance](https://supabase.com/docs/guides/database/database-linter).
- Toolkit labels describe tools, not customers or endorsements. GitHub’s official unmodified mark is vendored with source notes; other companies use plain-text references.

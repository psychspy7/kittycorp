# Important files and what they control

Paths below are relative to the inner `kitty-corp` folder. Keep the folders together; several pages share components and server utilities.

| Area | Files |
| --- | --- |
| Homepage structure and copy | `app/page.tsx`, `components/kitty/home-sections.tsx` |
| Overall document, fonts and metadata | `app/layout.tsx` |
| Original styles, shared styles and final light theme | `app/globals.css`, `app/refined.css`, `app/final.css` |
| Desktop/mobile navigation and reusable identity | `components/kitty/site.tsx` |
| Footer and company social links | `components/kitty/site-footer.tsx` |
| Services page and enquiry form | `app/services/page.tsx`, `components/kitty/project-enquiry.tsx`, `lib/enquiries.ts`, `app/api/enquiries/route.ts` |
| Product directory and details | `app/products/page.tsx`, `app/kitty-ai/`, `app/lisa-ai/`, `app/sentinel/`, `components/kitty/product-page.tsx` |
| Company and full team pages | `app/company/page.tsx`, `app/team/page.tsx` |
| Content types, defaults, founder-selection rule and media addresses | `lib/company-content.ts`, `lib/company-server.ts` |
| SecretChat page and bundled fallback information | `app/secretchat/page.tsx`, `components/kitty/secretchat.tsx`, `lib/secretchat.ts` |
| General launch pages and release notice | `app/launches/[slug]/page.tsx`, `components/kitty/launches.tsx`, `components/kitty/launch-announcement.tsx`, `lib/launches.ts`, `lib/launches-server.ts` |
| Published APK download authorization and redirect | `app/api/downloads/[slug]/route.ts` |
| Build journal and articles | `app/build-log/`, `components/kitty/journal.tsx`, `lib/journal.ts`, `lib/journal-server.ts` |
| Research, partnerships and privacy pages | `app/research/`, `app/investors/`, `app/privacy/` |
| Contact form and validation | `app/contact/`, `components/kitty/contact-form.tsx`, `app/api/feedback/route.ts`, `lib/kitty-validation.ts` |
| Early-access form, API and private list | `components/kitty/early-access.tsx`, `app/api/early-access/`, `app/api/admin/early-access/`, `components/kitty/admin-early-access.tsx` |
| Google-only Studio login, overview, enquiries and tab navigation | `app/kitten/page.tsx`, `components/kitty/admin.tsx`, `lib/studio-google.ts`, `supabase/studio-google-only.sql` |
| Product/icon editor | `components/kitty/admin-products.tsx` |
| Team editor | `components/kitty/admin-team.tsx` |
| Company/social editor | `components/kitty/admin-company.tsx` |
| APK/launch editor | `components/kitty/admin-launches.tsx` |
| Journal editor | `components/kitty/admin-journal.tsx` |
| Shared Studio image/social fields | `components/kitty/studio-content-helpers.tsx` |
| Session, origin, server settings and request protection | `lib/kitty-server.ts`, `app/api/admin/login/`, `app/api/admin/logout/` |
| Protected content writes | `app/api/admin/content/`, `app/api/admin/journal/`, `app/api/admin/launches/` |
| Image optimization and delivery | `app/api/admin/media/route.ts`, `app/api/media/[kind]/[file]/route.ts` |
| Brand artwork and identity film | `public/brand/` |
| Fonts and required licence notices | `public/fonts/` |
| Bundled Android fallback and product screenshots | `public/downloads/`, `public/secretchat/` |
| Sitemap | `app/sitemap.ts` |
| Build commands and pinned installation | `package.json`, `package-lock.json`, `.npmrc` |
| Native Next.js build/headers | `next.config.ts`, `vercel.json`, `tsconfig.json` |
| Private-setting template | `.env.example` |
| Files excluded from Git | `.gitignore` |
| First-install database schema references | `supabase/*.sql` |
| Source-only ZIP builder | `scripts/package-release.ps1` |
| Human-readable owner instructions | `OWNER-GUIDE.md`, `START-HERE.md`, `README.md` |
| Completed website checks | `VERIFICATION.md` |
| Current public content and schema references | `handover/PUBLISHED-CONTENT-REFERENCE.json`, `handover/BACKEND-INVENTORY.json` |
| Copies of current uploaded icons and published APK | `handover/public-assets/`, with `MANIFEST.json` |
| Source baseline and file checksums | `handover/RELEASE-MANIFEST.json`, `handover/SOURCE-SHA256SUMS.txt` |

Live database entries normally take precedence over code defaults. Editing a fallback string in `lib/company-content.ts` will not replace an existing published database value. For those fields, use Studio.

The final theme is a layer over the earlier styles. Inspect the stylesheet order and existing responsive rules before changing a selector. Preserve Dirtyline’s web/desktop licence and Geist’s SIL licence when distributing the source or changing fonts.

`build/`, `db/`, `drizzle/`, `vite.config.ts`, `cloudflare-env.d.ts`, `netlify.toml` and `.openai/hosting.json` support alternate configurations. They are retained for completeness. Drizzle files are not the live Supabase schema, and the Vite/Sites build is not the active Vercel build.

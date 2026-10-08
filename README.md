# Kitty Corp

A restrained company website for an early-stage team, with product pages, an engineering journal, an early-access list and protected Studio. Built with Next.js, TypeScript, React, Tailwind CSS and Supabase.

See **OWNER-GUIDE.md** for the complete owner handover. The `handover/` folder includes configuration, a source map, another-AI handoff prompt, recovery guidance, current structural/public-content references and checksum-verified copies of current public assets. These references do not include private records or secrets and are not a full Supabase backup.

## Pages

- `/`: services, concise product summaries, founders and early access.
- `/services`: website and app development, process and private project-brief form.
- `/products`: full product directory and Android releases.
- `/company`: company background, approach, research link and identity film.
- `/team`: every published team member, including biographies and profile links.
- `/kitty-ai`, `/sentinel`, `/lisa-ai`: product directions and development notes.
- `/build-log` and `/build-log/[slug]`: category-filtered journal and full articles.
- `/research`: current areas of exploration.
- `/investors`: company overview and partnership conversations.
- `/privacy`: website form and email-list privacy.
- `/secretchat`: Android download, installation guide, and privacy explanation.
- `/launches/[slug]`: launch pages for Android apps and websites published from Studio.
- `/contact`: contact form.
- `/admins`: private Studio for the build journal, apps, early access, contact inbox and legacy notices.

## Run locally

Use Node.js 24 and the committed lockfile. Run `npm ci`, copy `.env.example` to `.env.local`, and supply your settings privately. Run `npm run dev:next` and open `http://localhost:3000`.

`npm run typecheck` checks TypeScript. `npm run build:next` creates the native production build. Vercel and Netlify configuration files are included. The alternative Sites build uses `npm run build`.

## Manage the build journal and early list

Open **Build log & updates** to write a full article or a short development update. Add a title, address, summary, body, category, status and date. Optional covers use public HTTPS image addresses and require an image description. Separate body paragraphs with blank lines; `## ` starts a section heading. HTML is displayed as text. Keep published work factual; prototypes and plans should be labeled clearly.

Unpublished entries are private. Entries dated in the future stay hidden until that UTC date. Updates appear in **Currently at KITTY**; full articles get their own pages. Publishing and editing update the website without a code deployment. The journal stores up to 20,000 body characters, within the form service's 32 KB request limit.

Open **Early access** to view signups, selected interests, export loaded entries or remove someone from the list. Load every page before exporting the complete list. The website records signups; it does not automatically send email campaigns. Public visitors cannot read the email list. Submissions use the existing server-only gateway, rate limiting and spam checks.

**Legacy notices** preserves the earlier notice manager. Use the build journal for the redesigned public feed.

## App and website launches

Sign in to Studio and open **Apps & websites**. Choose **New launch** and select either **Android app** or **Website**. Android launches keep the existing signed-APK flow. Website launches accept a live HTTPS URL, separate icon, one optimized screenshot, description and optional extra details. Enable **Publish on the website** and save. These content updates require no GitHub push or redeployment.

The newest published launch with **Show launch popup** enabled is announced once per browser session. Published apps and websites also have persistent homepage entries and their own launch pages. Website actions open the configured live HTTPS address; app actions keep the APK download. Turning publishing off hides the page, announcement, and download link. Files already downloaded by visitors cannot be recalled.

APKs may be up to 50 MB. Uploads go directly to private storage through a temporary URL, avoiding the hosting provider's request-body limit. Drafts and unpublished uploads are restricted to the signed-in administrator.

Studio verifies the uploaded file's size and SHA-256 and checks its APK ZIP/signing-block structure. This is not a malware scan or complete Android signature verification. Test a trusted release on an Android phone before publishing. Compatible updates require the app's original signing key.

The bundled SecretChat 1.5.0 build 6 was verified with Android's `apksigner` and checked for private credentials before publication. Its product page explains supported privacy features and their limits.

## Configuration and deployment

Keep environment values in private local files or hosting settings. `.env.example` contains names and placeholders only. Never commit administrator passwords, private signing keys, service-role keys, or filled-in environment files.

Import the repository into Vercel using the Next.js preset. Configure the settings listed in `.env.example` privately. `vercel.json` selects the production build. Contact and Studio routes need a server; do not use a static export.

Files under `supabase/` document schema and access policies. They are first-install snapshots, not scripts to rerun against an initialized database. Deployment-specific configuration and credentials are omitted from public documentation.

## Presentation and verification

Original brand artwork and video remain in `public/brand/`. Display images use smaller WebP copies. Dirtyline 36D is self-hosted for display headings under the supplied commercial web license. Geist remains the readable interface and body font under its included SIL Open Font License. The reveal video loads only when opened. Keyboard-accessible dialogs, reduced-motion handling, responsive layouts and metadata are included. Founder initials are used until real portraits are uploaded; unreleased product pages reserve space for real demos. Only verified social addresses are linked.

See `VERIFICATION.md` for completed checks. The release ZIP excludes credentials, dependencies, Git data, and generated build output.

## Publishing company content

The existing website backend has been updated with `supabase/company-publishing.sql`. This is a one-time schema snapshot for a new setup; do not reapply it to the configured project. No additional environment settings are needed.

Studio’s **Products** tab edits the three development-stage products. **Apps & websites** supports APK publishing plus website launches with separate icons and screenshots. Uploaded website images are resized, stripped of metadata, and saved as WebP under unique filenames. **Team** manages real profiles and the complete suggested role list, with custom roles, visibility and order. **Company & socials** controls company links and team copy. Image uploads are intentionally public website assets; private APK drafts remain in the separate releases bucket.

The services form posts validated briefs to the existing private Studio inbox. It uses the same server-only gateway, timing checks, origin validation and submission rate limits as contact messages. The public site shows no invented clients, completed commissions or prices.

## Final interface update

The public site uses a light ivory and graphite theme with restrained gold details. Services and Start a project are visible immediately. Secondary company, research, product and team content lives on dedicated pages. The homepage includes the first published Founder & CEO and Co-Founder profiles in that order; every published member appears on `/team`. Removing or hiding a founder profile removes it from the homepage as well. Roles, images, biographies and links remain editable in Studio.

Studio starts with an Overview and direct links to each publishing task. Project briefs are under **Project enquiries & inbox**. Release announcements are small dismissible notices; they do not block the homepage or move keyboard focus. The current backend, accounts and hosting environment remain compatible. Publishing extensions are documented below; no new environment secrets are needed.

## Shipped work and genuine reviews

The homepage and Services page show published website launches with their real screenshots and live links, and Android releases with APK downloads and details. Development-stage products are shown separately. Launch content still comes from Studio; new releases appear after saving and refreshing.

Studio → **Reviews** manages attributed testimonials. Add the reviewer’s actual words, name, optional role/company and an optional HTTPS public source. Confirm the feedback is genuine and the reviewer has permitted publication before enabling **Publish on the website**. Save drafts, change display order, edit, unpublish or remove entries without a redeployment. The first six approved published entries appear on the homepage and Services page. Both pages omit the review section when no entries are published. No reviews, ratings or client claims are seeded.

`supabase/testimonials.sql` documents the one-time extension already applied to the dedicated website backend. Do not rerun it against that project. Public reads require both publication and permission confirmation; all writes and private drafts require the live website admin session. No changes were made to the separate private-chat project.

The header and footer technology marquees identify tools/platforms the owner reports using, alongside clearly labelled innovation initiative references. They do not claim client relationships, partnerships, sponsorship or government recognition. Brand entries and official links are in `lib/technology-ecosystem.ts`; locally hosted logo sources are documented in `public/ecosystem/README.md`. A shared pause control stops both strips. Reduced-motion preferences disable scrolling and show a static footer grid. The original KITTY CORP artwork is preserved.

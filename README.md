# Kitty Corp

A responsive brand website with a protected Studio, contact inbox, notices, and Android app launches. Built with Next.js, TypeScript, React, Tailwind CSS, and Supabase.

## Pages

- `/`: brand story, products, launches, public updates, and support.
- `/secretchat`: Android download, installation guide, and privacy explanation.
- `/launches/[slug]`: download pages for apps published from Studio.
- `/contact`: contact form.
- `/admins`: private Studio, including **Apps & launches**.

## Run locally

Use Node.js 24 and the committed lockfile. Run `npm ci`, copy `.env.example` to `.env.local`, and supply your settings privately. Run `npm run dev:next` and open `http://localhost:3000`.

`npm run typecheck` checks TypeScript. `npm run build:next` creates the native production build. Vercel and Netlify configuration files are included. The alternative Sites build uses `npm run build`.

## Publish apps from Studio

Sign in to Studio and open **Apps & launches**. Choose **New launch**, or edit an existing app. Add its name, page address, headline, description, version, Android requirement, and release notes. Upload a trusted signed release APK, enable **Publish on the website**, and save. These content updates require no GitHub push or redeployment.

The newest published launch with **Show launch popup** enabled is announced once per browser session. Published apps also have persistent homepage entries and download pages. Turning publishing off hides the page, announcement, and download link. Files already downloaded by visitors cannot be recalled.

APKs may be up to 50 MB. Uploads go directly to private storage through a temporary URL, avoiding the hosting provider's request-body limit. Drafts and unpublished uploads are restricted to the signed-in administrator.

Studio verifies the uploaded file's size and SHA-256 and checks its APK ZIP/signing-block structure. This is not a malware scan or complete Android signature verification. Test a trusted release on an Android phone before publishing. Compatible updates require the app's original signing key.

The bundled SecretChat 1.5.0 build 6 was verified with Android's `apksigner` and checked for private credentials before publication. Its product page explains supported privacy features and their limits.

## Configuration and deployment

Keep environment values in private local files or hosting settings. `.env.example` contains names and placeholders only. Never commit administrator passwords, private signing keys, service-role keys, or filled-in environment files.

Import the repository into Vercel using the Next.js preset. Configure the settings listed in `.env.example` privately. `vercel.json` selects the production build. Contact and Studio routes need a server; do not use a static export.

Files under `supabase/` document schema and access policies. They are first-install snapshots, not scripts to rerun against an initialized database. Deployment-specific configuration and credentials are omitted from public documentation.

## Presentation and verification

Original brand artwork and video remain in `public/brand/`. Display images use smaller WebP copies. The reveal video loads when opened. Keyboard-accessible dialogs, reduced-motion handling, responsive layouts, and metadata are included.

See `VERIFICATION.md` for completed checks. The release ZIP excludes credentials, dependencies, Git data, and generated build output.

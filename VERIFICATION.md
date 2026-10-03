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

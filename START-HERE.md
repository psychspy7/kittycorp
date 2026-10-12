# Kitty Corp website

Read **OWNER-GUIDE.md** first for detailed instructions on every Studio task, updating the code yourself, handing work to another AI app, deployment and recovery.

The archive contains the latest tested website source, brand assets, font licences, signed Android APKs, schema snapshots, hosting configuration and a complete handover folder. `handover/public-assets/` additionally contains the currently published SecretChat **1.6.1** APK and uploaded icons. `public/downloads/` retains the older bundled fallback; the live database chooses the current release.

Use this package to continue working with the existing Supabase website project. Private credentials and live private records are excluded. It is not a full database backup. Start from the latest GitHub `main` if more updates have been made since 3 October 2026.

Useful handover files:

- `OWNER-GUIDE.md`: detailed owner instructions.
- `handover/AI-HANDOFF.md`: context and a reusable request for another coding app.
- `handover/CONFIGURATION.md`: exact private-setting names, local setup and Vercel settings.
- `handover/FILE-MAP.md`: which source files control each part of the site.
- `handover/BACKUP-AND-RECOVERY.md`: backups, Studio diagnosis, hosting moves and restore limits.
- `handover/BACKEND-INVENTORY.json`: current read-only schema, RPC, policy and bucket references.
- `handover/PUBLISHED-CONTENT-REFERENCE.json`: current public content only.
- `handover/RELEASE-MANIFEST.json` and `handover/SOURCE-SHA256SUMS.txt`: dated baseline and source integrity checks.

To run locally:

1. Extract the ZIP.
2. Install Node.js 24 if needed.
3. Open a terminal in the extracted `kitty-corp` folder and run `npm ci`.
4. Copy `.env.example` to `.env.local` and supply your settings privately.
5. Run `npm run dev:next` and open `http://localhost:3000`.

Run `npm run build:next` for production. See `README.md` for general deployment instructions. Private environment files and credentials are excluded.

SecretChat's download page is `/secretchat`. Open `/kitten` and sign in with the approved Google account, then open **Apps & websites** to upload future Android APKs, edit release notes, and publish or hide apps. These content updates require no GitHub push. The former ID/password login and `/admins` address are retired.

**Build log & updates** manages full articles and development-feed updates, including dates, categories, status and cover images. **Early access** manages the private email list and export. Existing Studio credentials are unchanged. See the README for the publication workflow and privacy behavior.

Use trusted signed APKs and keep original app signing keys backed up privately. Never put filled-in environment files, administrator passwords, signing keys, or server credentials in GitHub.

**Products** edits KITTY AI, LISA AI and Sentinel: separate icons, descriptions, stages and product notes. **Team** adds, edits, hides or removes real people, with photographs, roles and profile links. **Company & socials** edits official company links and the team introduction. Uploaded PNG, JPEG and WebP images (up to 3 MB) are optimized; save the entry, then refresh the website to see the newest image.

The **Websites & applications** page lets visitors send project briefs. These appear as **Project enquiry** messages in the private **Project enquiries & inbox**, including the requested service, business name, budget, timing and message.

The homepage now leads with website and app services. Company background is at `/company`, full product information at `/products`, and the complete published team at `/team`. Studio’s **Overview** explains every publishing task. Use the exact suggested roles **Founder & CEO** and **Co-Founder** for the two homepage founder positions. Other published roles appear on the full team page.

The supplied Dirtyline 36D font is included with its commercial web license. Geist is used for readable forms, navigation and body copy.

## Performance and hosting checks

Read `HOSTING-AND-PERFORMANCE.md` for native Next.js hosting, safe public caching, Studio refresh behavior and isolated load testing. Run `npm run check:website` before a release; `npm run check:hosting` checks local setup without printing credentials. See `PERFORMANCE-REPORT.md` for the latest verified results and deployment status.

## Professional website and payment setup

Read `PAYMENT-PROVIDERS-SETUP.md` for encrypted Studio provider settings, approval gates, project payments, contributions and the separate KITTY/LISA product access paths. `PROFESSIONAL-REFINEMENT-REPORT.md` records the combined local checks and preview. The source archive excludes private settings and live records.

Read **PROJECT-PAYMENTS-GUIDE.md** for the latest per-client quote workflow, discounts, local-currency display and product-payment activation limits.

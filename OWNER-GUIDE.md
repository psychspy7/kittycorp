# KITTY CORP — owner’s guide

Updated on 8 October 2026 for the current website. Start here when you want to change something yourself or hand the work to another AI app.

## Your website and accounts

| Item | Current location |
| --- | --- |
| Public website | https://kittycorp.vercel.app/ |
| Private Studio | https://kittycorp.vercel.app/kitten |
| Website repository | https://github.com/psychspy7/kittycorp |
| Production branch | `main` |
| Hosting project | `kittycorp` in Vercel |
| Website database | **Kitty Corp Website**, Supabase project `mgkghnblbisubympudaa` |
| Website database dashboard | https://supabase.com/dashboard/project/mgkghnblbisubympudaa |
| Website version | Business homepage, KITTY AI guide, Google Studio verification and Cloudflare form protection, 8 October 2026. See the [latest source history](https://github.com/psychspy7/kittycorp/commits/main). |

Studio now uses **Sign in with Google** for the approved owner account, `viratanand1221@gmail.com`. The old ID/password form and `/admins` address are retired. No Studio link is displayed on public pages; bookmark the address above. Your website database is separate from the private-chat project. Website maintenance should use the project above.

## Choose the right way to update

Use **Studio** for products, app and website launches, images, people, social links, genuine reviews and journal entries. Save the entry, then refresh the public page. No code upload or redeployment is needed.

Use **GitHub + Vercel** for layout, navigation, new page types, main hero text, colours, fonts, forms or new features. Commit the changed source files. Your connected Vercel project builds the production branch automatically.

Use **Vercel settings** for private server configuration and your domain. Use **Supabase** for database, authentication, storage, backups or access-policy changes. Ordinary content editing does not require changing either service’s settings.

| What you want to change | Where to do it |
| --- | --- |
| SecretChat icon, version, APK or announcement | Studio → Apps & websites |
| KITTY AI, LISA AI or Sentinel icon, details or stage | Studio → Products |
| Founder photograph, biography or personal links | Studio → Team |
| Add, hide, reorder or remove a real team member | Studio → Team |
| Company social links and team introduction | Studio → Company & socials |
| Genuine client/user reviews | Studio → Reviews |
| New live website with its screenshot and launch page | Studio → Apps & websites → New launch → Website |
| Full article or development update | Studio → Build log & updates |
| Read a website/app project brief or contact message | Studio → Project enquiries & inbox |
| View or export people who joined early access | Studio → Early access |
| Website AI visibility, greeting, instructions and reply length | Studio → KITTY AI & security |
| Temporarily pause the public website | Studio → Site controls |
| Homepage headline, services copy, page layout or menu | Website source in GitHub |
| New development-product type beyond the existing three | Code and a reviewed database change |
| New Android app/download page | Studio → Apps & websites → New launch |
| Password, another Studio administrator or security settings | Authentication/configuration work; not the Team editor |

## Update icons and product details

1. Open Studio and sign in.
2. For KITTY AI, LISA AI or Sentinel, open **Products** and choose **Edit product**. For SecretChat or another released app, open **Apps & websites** and edit that app.
3. Choose a separate PNG, JPEG or WebP icon, up to **3 MB**. Wait for the upload to finish. Icons are optimized to WebP, up to 512 pixels on their longest side.
4. Update the description, stage, version or other fields you need.
5. **Save the entry.** Uploading an image alone does not attach it permanently to the entry.
6. Refresh the public product page and homepage. The replacement has a new image address, so the browser can load the latest saved image.

You can replace an app icon without uploading its APK again. Website icons do not automatically sync with the icon embedded inside an Android app. To change the icon on someone’s Android launcher, change the app itself, create a new signed APK, and publish that release too.

The Products editor currently manages three existing development products. Their addresses are `/kitty-ai`, `/lisa-ai` and `/sentinel`. Changing a display name does not create a new page address. Adding a completely new development product requires extending the code and database validation. Apps & websites can create additional Android releases without this code change.

## Publish a new Android app or update SecretChat

1. Build and test a **signed release APK**. Test installation on an Android phone.
2. Open **Apps & websites**. Edit the existing app for an update, or choose **New launch** for a different app.
3. Enter its name, page address, headline, description, version, Android requirement and release notes. Keep SecretChat’s address `secretchat` so old links keep working.
4. Upload the APK, up to **50 MB**. Wait until Studio says the APK is ready. Add or replace the separate website icon if needed.
5. Leave **Publish on the website** off to save a private draft. Turn it on when ready to release.
6. The business homepage no longer opens launch announcements. Visitors can find all published releases in **Products & shipped work**. The announcement field is retained for compatibility.
7. Save, open the public app page, and check the download.

The app’s usual public page is `/launches/<page-address>`; SecretChat also has `/secretchat`. The product directory, app page and download remain reachable without an announcement.

Keep the original Android signing key backed up privately. Existing installations generally need updates signed with that same key. Studio checks size, checksum and APK structure; it does not perform a full malware review. Installed copies cannot be recalled by hiding the website entry.

Prefer turning publishing off when you want to hide a release. Deleting a launch can also delete its unreferenced uploaded APK. Replacing an APK can leave earlier files in storage, so check references before any storage cleanup.

The handover includes a checksum-verified copy of the **currently published SecretChat 1.6.1 APK** under `handover/public-assets/releases/`. The older 1.5.0 file in `public/downloads/` is a bundled fallback. The live website uses its current Supabase launch record, not that older fallback, when the published launch is available. Do not replace the current release with the fallback by accident.

## Manage founders and the full team

1. Open **Team**, then add a real member or edit an existing profile.
2. Enter the name, role, optional biography, photograph and personal social links. Use complete `https://` addresses.
3. Choose a display order: lower numbers appear first.
4. Enable **Show this person on the website** and save.
5. Check `/team`. For founder changes, also check the homepage.

The homepage shows the first published **Founder & CEO**, currently Virat Anand, with a highlighted **See full team** button. Use the suggested role name. Matching ignores letter case and surrounding spaces, but a different title such as “CEO” is not the same role. The Co-Founder and other published people appear on the full-team page. Hiding or removing the CEO also removes that homepage profile.

## Manage KITTY AI and Studio security

Open **KITTY AI & security** to turn the website guide on or off, edit its name and greeting, and set tone instructions. You can adjust conversation length, reply length and response variation. Save, then refresh the website. Published product, release, team and journal changes become the guide’s current context automatically; private Studio data is excluded.

The website guide uses the real KITTY AI backend through a separate stateless endpoint. It cannot read Android users’ memories or conversations. Browser conversations clear on refresh. Server limits cap requests at 12 per visitor per hour, 30 per day and 150 total per day. These fixed limits also protect the model allowance; the browser conversation setting does not replace them. AI replies can still be inaccurate.

Open `/kitten` and choose **Sign in with Google**. Use the approved owner Google account. Google setup and recovery are documented in **GOOGLE_STUDIO_SETUP.md**. The provider client secret stays in Supabase. Password-only sessions and raw Google sessions outside the verified website flow cannot edit the website database. A team profile does not grant Studio access.

Cloudflare Turnstile protects sign-in, enquiries, email signups, contact forms and assistant requests. Its widget usually verifies automatically, but may request interaction. On the shared `vercel.app` hostname this is application protection, not whole-site Cloudflare WAF.

AI and Turnstile credentials are encrypted in the dedicated website database using the private deployment gateway. The current production setup does not require copying new secrets into GitHub. If you rotate `FEEDBACK_GATEWAY_TOKEN`, re-encrypt the runtime configuration and update its private database hash in the same planned change. Keep a private configuration backup. `.env.example` contains safe names and optional overrides only.

When another AI updates the separate KITTY AI Android/backend project, require it to preserve the Worker’s `/api/website/chat` route and `WEBSITE_GATEWAY_TOKEN` secret binding. The reference files in `integrations/kitty-ai/` explain this. Deploying older backend code without that route will break the website guide.

Open **Site controls** to show or remove the public maintenance screen. Studio stays accessible. Wait for the save result before navigating away; if a newer change happened, reload the controls instead of retrying stale state. Keep the existing emergency recovery access private.

Suggested engineering, management, design, marketing and trainee roles are available, and you can type a custom role. Adding a role means adding a real person’s profile; it does not create a job vacancy or give that person a Studio login. Hide a profile before deleting it if you may want to restore it later.

Portrait uploads accept PNG, JPEG or WebP up to 3 MB and are optimized to a maximum 1,400 pixels on their longest side. Uploaded icons and portraits are public website assets, including images attached to a draft profile. Upload only images intended for public use.

## Add company and founder social links

For official KITTY CORP accounts, use **Company & socials**. For a founder’s or member’s accounts, edit that person in **Team**. Empty social fields stay hidden. Add the actual profile addresses; do not use a platform homepage as your account link.

Company & socials also edits the team note, introduction and story. Homepage hero wording, service offers and most other page headings remain code-controlled. This is a focused content manager, not a drag-and-drop page builder.

## Write an article or development update

1. Open **Build log & updates** and create a new entry.
2. Choose **article** for a full journal page or **update** for a short development-feed note.
3. Add a unique lower-case page address, title, summary, body, category, status and date.
4. Categories are AI, Robotics, Engineering, Research and Company.
5. Optional covers currently use a public HTTPS **image URL**, plus a meaningful image description. A normal sharing webpage URL may not display as an image. This field is not a cover-image upload tool.
6. Separate paragraphs with blank lines. Use `## ` to start a section heading. Arbitrary HTML is shown as text rather than executed.
7. Save a private draft first, then publish when ready.

An article gets `/build-log/<page-address>`. Published entries are surfaced by their type and category in the journal and relevant development sections; an update is not automatically a full article. Future-dated entries stay hidden until that date. The application compares dates in UTC, so the release boundary may differ from Indian local midnight. Bodies can contain up to 20,000 characters.

Keep a published address stable where possible. If you change it, old links may stop working. A redirect requires a code change.

## Read project enquiries and early-access signups

The prominent **Start a project** button opens `/services#project-enquiry`. Visitors can submit website, web-app or Android-app briefs. They appear in **Project enquiries & inbox**, marked as project enquiries, with the supplied business, budget, timing and message. Contact-page messages arrive in the same private inbox.

Open a message to read it. **Reply by email** opens your email application; the website does not send the reply or automatically notify you by email. Check the inbox regularly. Overview totals describe recently loaded inbox entries, not lifetime company figures. Use **Load more** to inspect older entries.

In **Early access**, load every available page before choosing export if you want the complete CSV. The downloaded CSV contains personal email addresses; store it privately. Removing a signup deletes that entry. The website collects interests but does not send newsletters or campaigns. An email provider, consent/unsubscribe workflow and notifications are future features if you decide you need them.

## Make a code change yourself

For a small text correction, open the relevant file in the GitHub repository, edit it, review the diff, and commit. For changes across multiple files, use a fresh clone and a code editor or AI coding app.

1. Start from the **latest GitHub `main`**. This ZIP is a dated snapshot; check for newer commits before changing it later.
2. Create a branch such as `codex/service-copy-update` for a substantial change.
3. Install Node.js 24 and run `npm ci` in the website folder.
4. Create `.env.local` privately from `.env.example` and use the existing configuration. Details are in `handover/CONFIGURATION.md`.
5. Run `npm run dev:next`; open `http://localhost:3000`.
6. Edit the relevant files. `handover/FILE-MAP.md` shows where each part lives.
7. Run `npm run typecheck` and `npm run build:next`. Run lint for the files you changed and check desktop/mobile views.
8. Commit only the intended source changes. Push the branch, inspect its Vercel preview, and merge into `main` when ready. A small direct commit to `main` also triggers the production build.
9. Wait until Vercel reports the deployment ready, then check the live website and Studio.

Use the scripts ending in **`:next`** for your Vercel website. Plain `npm run dev` and `npm run build` belong to an alternate Sites runtime included in the repository. Do not swap build systems during a routine update. The site needs server routes; a static-only export would break Studio and forms.

If you upload files through GitHub’s website, open the **inner `kitty-corp` folder** in this ZIP and upload its contents to the repository root. Do not upload a single ZIP as your website source or create an extra `kitty-corp/` level around `app/` and `package.json`. Check `.gitignore`, `.env.example` and `.npmrc` too; some file browsers hide dotfiles.

## Work with another AI app

Give it the latest repository or the extracted `kitty-corp` folder, plus `OWNER-GUIDE.md` and `handover/AI-HANDOFF.md`. Describe the exact change and pages affected. For a design or copy change, the source ZIP is usually enough; it does not need database administration access.

Use the reusable prompt in `AI-HANDOFF.md`. If database work is required, authorize only the website project, keep private configuration in that app’s local environment or secret store, and take a backup first. Do not paste passwords, gateway tokens, subscriber exports or private enquiries into a public prompt, repository or screenshot.

Ask the AI to preserve Studio, the existing database, the APK publishing flow and the current readable light design. Require a tested change, a clear file list and a reviewed deployment. The project uses Next.js 16.3.4; `AGENTS.md` requires reading the installed framework guides before changing its code.

## Find your environment file or fix an unavailable Studio

Your original local file is `.env.local` beside `package.json` in the project folder. A leading dot can make it easy to miss. It is not in any public ZIP. Vercel separately holds its production settings; uploading source files does not replace those values.

If Studio says it is temporarily unavailable, check the seven exact names in `.env.example`, that Vercel applies them to **Production**, that the website Supabase project is active, and that you deployed again after any environment change. The gateway token must match the hash configured in the database. A new random token in Vercel alone will break login and forms.

If login fails, verify the approved Google account, configured Auth email/UUID, pinned Google identity and database admin allowlist agree. Check Google provider configuration and the fixed callback address. Wait 15 minutes after too many failed attempts rather than repeatedly retrying. A session expires after at most one hour; sign in again when asked. Full diagnosis and recovery steps are in the handover folder.

## Keep a useful backup

Keep this source ZIP and your GitHub history. Separately back up private environment values, Android signing keys, database data and Supabase Storage files. The public-content reference and asset copies in this handover are helpful, but **they are not a full database backup**. Private drafts, enquiries, subscribers, Auth users and secret settings are excluded.

Read `handover/BACKUP-AND-RECOVERY.md` before moving to a new host or restoring a project. Do not rerun the first-install SQL snapshots on your working website. A code rollback does not undo database edits or restore deleted uploads.

## What this ZIP contains

Complete website source and lockfile; public brand artwork/video; self-hosted fonts and licences; bundled APK/screenshots; Vercel configuration; API/Studio code; schema snapshots; this owner’s guide; technical handoff; live structural inventory; current published-content reference; and copies of the current SecretChat 1.6.1 APK and uploaded public icons.

`handover/public-assets/MANIFEST.json` records those copies and checksums. One external journal cover remains a URL reference because it was supplied as an external sharing link. Source-file checksums and the source baseline are in the release manifest. Read `START-HERE.md` for the shortest setup instructions.

## Official references

- [Vercel environment variables](https://vercel.com/docs/environment-variables): environment changes apply to new deployments.
- [Vercel deployments](https://vercel.com/docs/deployments): Git deployments, preview builds and deployment logs.
- [Vercel environment CLI](https://vercel.com/docs/cli/env): optional private environment download; sensitive values can be write-only or placeholders.
- [Supabase backups](https://supabase.com/docs/guides/platform/backups): plan-dependent database backups and separate Storage-file backups.

Provider dashboards and plans can change. Check these references when carrying out hosting or recovery work later.


## Publish a website launch

Open **Apps & websites → New launch → Website**. Add the live HTTPS address, a separate icon, one screenshot, headline and description. Save as a draft while preparing it; enable publication when the site is ready. Published websites appear in the shipped-work section and product directory, with a direct live link and a launch details page. Android app publishing still uses the signed-APK flow.

## Add a genuine review

1. Open **Reviews** in Studio and choose **Add a review**.
2. Paste the reviewer’s actual feedback. Add their name, optional role/company or product used, and a public source link when available.
3. Obtain their permission to publish their words and attribution. Keep private email addresses or confidential project details out of the quote.
4. Confirm the permission checkbox, then enable **Publish on the website** and save. Without permission, save it as a private draft.
5. Refresh the homepage or Services page. The first six published reviews appear in display order; lower numbers come first.
6. To hide a review, uncheck publication and save. To remove it, use **Remove** and confirm.

The public reviews section stays hidden until real reviews are published. No sample reviews or star ratings have been inserted. Editing reviews requires your existing Studio sign-in; it creates no new admin account and needs no new environment secrets.

## Credibility and proof

The homepage now links to real published work: website screenshots/live URLs and Android APK releases. Manage this proof through **Apps & websites**. Development-stage products remain under **Products** and are shown separately from releases.

The tools section lists the platforms you reported using, including GitHub, Microsoft, Google, IBM, Claude and OpenAI. It is a toolkit, not a customer/partner list. Do not rename it to imply endorsement or add invented testimonials, clients, achievements or results. The source notes are in `public/toolkit/README.md`.

The dedicated website project has the `kitty_website_testimonials` table and access policies already applied. `supabase/testimonials.sql` records this one-time extension. Do not rerun it against the current project. The private-chat project is unchanged.

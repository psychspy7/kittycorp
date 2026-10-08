# Backups, troubleshooting and recovery

## What is backed up in this handover

The ZIP contains complete source, bundled assets, configuration templates, SQL snapshots, current public-content references, current structural inventory and copies of two uploaded public icons plus the SecretChat 1.6.1 APK. The downloaded APK’s SHA-256 matched the live launch record during packaging.

It does **not** contain private environment values, administrator passwords, Android signing keys, private enquiries, early-access emails, unpublished drafts, Supabase Auth accounts, secret-setting values or a complete Storage backup. The source snapshot is sufficient to continue coding against the existing backend; it cannot recreate that backend’s private state by itself.

One journal cover uses an external sharing URL and is recorded as a URL reference rather than bundled media. Keep the original image privately if you want to make that article independent of the external provider.

## Maintain four separate backups

| Backup | What to keep | Where to keep it |
| --- | --- | --- |
| Source | GitHub history, tested source ZIP, lockfile and licences | Repository and an additional personal backup |
| Private configuration | Environment values, account recovery details, original Android signing keys | Encrypted private storage/password manager |
| Database | Website content, private enquiries, subscribers, needed Auth/allowlist/settings and schema | Private database backup outside the project |
| Storage | `kitty-website-releases` APKs and `kitty-website-media` images | Private asset backup with object names and checksums |

On eligible plans, Supabase offers automated database backups; the free-tier guidance is to export regularly. Verify the actual options available in your project rather than assuming backups exist. Database backups contain Storage metadata but **do not include Storage file bytes**. [Supabase backup documentation](https://supabase.com/docs/guides/platform/backups)

For a real database dump, use the official Supabase backup workflow or CLI. Inspect the installed CLI’s `--help` before choosing commands or flags. Store dumps privately because they can include enquiries, emails, Auth data or privileged settings. Do not commit them to GitHub or add them to a shareable source archive. Keep old exports and new exports clearly dated.

## Check before updating

For a code change, record the current production commit and keep a working branch. For database changes, take a private backup and inspect the structural inventory. For APK publication, retain the previous signed release and signing key. For potentially temporary content removal, turn visibility off rather than immediately deleting it.

## Studio unavailable

1. Open the latest Vercel production deployment and check its runtime logs. Share only error messages and missing key names, not tokens, cookies, passwords or customer messages.
2. Confirm all seven variable names from `.env.example` are present in Production and are real values rather than placeholders.
3. Confirm they point to **Kitty Corp Website**, project `mgkghnblbisubympudaa`, and that this project is active.
4. Confirm `FEEDBACK_GATEWAY_TOKEN` agrees with the SHA-256 hash stored under `feedback_gateway_hash` in `kitty_website_private.settings`. Never fix only one side by inventing another token.
5. After correcting environment settings, create a new deployment. Existing deployments do not automatically adopt new settings. [Vercel environment documentation](https://vercel.com/docs/environment-variables)
6. If settings are correct, inspect the relevant RPC, database access grants and RLS policies against the inventory. Do not remove authentication or open private tables to anonymous users to make an error disappear.

There were no Edge Functions in this website project at handover. Login throttling and submission handling are PostgreSQL RPCs. Deploying an unrelated Edge Function will not repair an incorrect gateway token or admin allowlist.

## Sign-in fails but Studio loads

Use `/kitten` and the approved Google account. Check the existing Auth account’s email/UUID, `ADMIN_EMAIL`, `ADMIN_USER_ID`, linked Google provider identity and `kitty_website_private.admins`. They must describe the same intended administrator. Check the Google provider and fixed `/api/admin/google/callback` redirect; session cookies use SameSite=Lax so the return from Google can open Studio immediately. A Team profile is not a login account. Sessions last at most one hour; expired sessions need a new sign-in. Too many attempts can block login for 15 minutes, so wait instead of repeatedly retrying.

If access to the approved Google account is lost, use its owner-authorized account recovery process, then review Google provider configuration in Supabase. Do not reset the website database or grant access to another UUID as a shortcut. The source ZIP contains no private credentials. Adding another administrator requires coordinated website and database authorization changes because the server checks one configured UUID and pinned provider identity.

## Saved content does not appear

- Confirm you saved the entry after uploading the image.
- Check visibility/publishing and the date. Future journal dates stay hidden until their UTC date.
- Check the right page and content type: an article has a full journal page; an update is a feed note. Only the selected founder roles appear on the homepage.
- Reload the public page. Replacements use new image addresses.
- Check that the preview/local site and public site connect to the same intended database. A staging site may correctly have different content.
- Verify the save response and database row before repeatedly saving or deleting anything.

## Upload or download fails

For images, use PNG/JPEG/WebP under 3 MB and avoid extremely large pixel dimensions. For APKs, use a trusted signed release under 50 MB. Keep the Studio session active. Check bucket settings and administrator Storage policies rather than making the APK bucket public.

A launch needs a verified APK and publishing enabled for a public download. Signed download URLs are short-lived; use the persistent website download link rather than copying an expired Storage URL. Hiding a launch hides its website entry; it cannot uninstall previously downloaded apps.

## Enquiry is not received

Check the latest loaded inbox page and older pages. Verify the form has valid inputs and that the submission completed successfully. Forms require a short dwell time and apply rate limits; immediate automated submissions or repeated tests can be rejected. Check the gateway and origin settings if all forms fail. No email notification service is configured; inbox delivery and email notification are different features.

## A new deployment breaks the website

Use Vercel’s deployment history to inspect the error and, where available, restore the known working deployment. Then revert or fix the corresponding source change in GitHub so the next deployment does not reintroduce it. Availability and scope of rollback controls depend on your project/plan. [Vercel deployment documentation](https://vercel.com/docs/deployments), [Instant Rollback](https://vercel.com/docs/instant-rollback)

A website rollback affects deployed code/configuration. It does **not** reverse Studio saves, database migrations, deleted subscriber entries or removed Storage files. Restore those separately from a suitable private backup only after reviewing what else the restore would overwrite.

## Moving the website to another host

Keep the existing Supabase project and configure the seven environment values privately on the new server-capable Next.js host. Build with the committed lockfile and `npm run build:next`. Set the intended `SITE_URL`, configure DNS and HTTPS, then test public pages, Studio, forms, icons and downloads before switching traffic. Normal host migration does not require a new database.

## Creating a genuinely new backend

This is a planned migration, not a routine website update. Have a maintainer provision the destination, test with a backup and document a restore procedure. The `supabase/*.sql` files are one-time schema snapshots with initial content. They are not idempotent repair scripts and should never be rerun on the initialized website database.

The original dependency order is `schema.sql`, `auth-and-limits.sql`, `launches.sql`, `journal-and-early-access.sql`, then `company-publishing.sql`. Inspect the live structural inventory for changes and required extensions first. A fresh setup also needs an Auth administrator, the private admin allowlist, a configured gateway hash, private environment values, reviewed data import, Storage file restoration and correct object references. SQL snapshots alone do not perform these steps or restore the latest live content.

Public content references can help compare records, but they are not executable SQL and should not be imported blindly. New Auth IDs, image paths and APK object paths may differ. Test anonymously and as the administrator before moving the production environment to the new project. Keep the old project intact until the migration is verified.

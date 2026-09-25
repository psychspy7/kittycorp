# Verification — package prepared 25 September 2026

## Passed

- Cloudflare/Sites production build.
- Native Next.js production build for Vercel/Netlify (re-run for this package).
- TypeScript checks.
- HTTP rendering of `/`, `/contact`, and `/admins`.
- Anonymous requests cannot read the admin inbox or write notices.
- Cross-origin write requests are rejected.
- Invalid contact submissions are rejected before database access.
- The local environment file is ignored by Git.

## Backend status

- New project `Kitty Corp Website` (`mgkghnblbisubympudaa`) is active in `ap-south-1`. `supabase/schema.sql` and `supabase/auth-and-limits.sql` have been applied, and its gateway hash is configured.
- Supabase security advisors found no critical errors. They report informational warnings for RLS-protected private tables without client policies, and two `SECURITY DEFINER` gateway RPCs that require the private gateway token. The notices table also has overlapping admin/public read policies by design.
- The Supabase Auth admin account exists and its UUID is in the database allowlist. Set `ADMIN_EMAIL` and `ADMIN_USER_ID` in the host environment as described in `README.md`.
- Production hosting variables have not been changed or redeployed. The current Vercel deployment still needs the new project's URL and publishable key plus the admin identity and existing gateway token before live routes can be verified.

## Private files

- `.env.local` and credentials are excluded from the ZIP. The package script checks that the local gateway token is not present in packaged source.
- The integration script at `scripts/verify-site.mjs` requires the private admin password from the original brief; do not place it in the repository or ZIP.

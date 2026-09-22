# Kitty Corp website

This ZIP contains the complete website source, your original brand artwork and reveal video, database schema, admin setup script, and hosting configuration.

## Start the website

1. Extract the ZIP.
2. Install Node.js 24 if needed.
3. Open a terminal in the extracted `kitty-corp` folder.
4. Run `npm ci`.
5. Copy `.env.example` to `.env.local` and fill in your project settings using `README.md`.
6. Run `npm run dev:next` and open `http://localhost:3000`.

On Windows, the copy command is `Copy-Item .env.example .env.local`.

The main website is `/`, the contact page is `/contact`, and the private studio is `/admins`.

## Build and deploy

Run `npm run build:next` for the native Next.js production build. Vercel and Netlify configuration files are included. The Sites/Cloudflare build is available through `npm run build`.

See `README.md` for Supabase setup, secure environment variables, admin provisioning, wallet QR codes, and deployment instructions. See `VERIFICATION.md` for completed checks and the remaining live-service verification.

## Current connection status

The website code builds successfully. At the last live check, the previously configured Supabase project hostname did not resolve, and the Sites connector was unavailable. Contact storage, live notices, and admin sign-in need a reachable, configured Supabase project. A published website URL has not been verified.

The archive includes the full source and media. Installable dependencies and generated build caches are recreated by `npm ci` and the build commands. Private credentials remain in the original workspace's ignored `.env.local`; the ZIP includes a configuration template.

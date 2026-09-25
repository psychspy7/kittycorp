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

## Fresh Supabase setup

The ZIP intentionally excludes `.env.local` and every credential. A dedicated Supabase project for Kitty Corp Website already exists in the KITTY CORP organization (`mgkghnblbisubympudaa`); its website tables and gateway hash are installed. Keep the existing private-chat project separate.

The admin Auth account and database allowlist are ready. Set the seven server variables from `.env.example` in the hosting provider and redeploy before verifying `/api/notices`, contact submission, and `/admins` sign-in. Use the UUID recorded in **Supabase setup** in `README.md`.

Never put `.env.local`, the gateway token, the admin password, or Supabase service-role keys in GitHub or this ZIP. `.env.example` is a template only and will not connect until you supply the new project's values.

The archive includes the full source and media. Dependencies and generated build files are recreated by `npm ci` and the build commands. `.env.example` is a template only; it will not connect to Supabase until you fill in your own values.

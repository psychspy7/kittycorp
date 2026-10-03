# Kitty Corp website

The archive contains website source, brand assets, the signed SecretChat Android APK, schema snapshots, and hosting configuration.

1. Extract the ZIP.
2. Install Node.js 24 if needed.
3. Open a terminal in the extracted `kitty-corp` folder and run `npm ci`.
4. Copy `.env.example` to `.env.local` and supply your settings privately.
5. Run `npm run dev:next` and open `http://localhost:3000`.

Run `npm run build:next` for production. See `README.md` for general deployment instructions. Private environment files and credentials are excluded.

SecretChat's download page is `/secretchat`. Sign in at `/admins`, then open **Apps & launches** to upload future Android APKs, edit announcements and release notes, and publish or hide apps. These content updates require no GitHub push.

Use trusted signed APKs and keep original app signing keys backed up privately. Never put filled-in environment files, administrator passwords, signing keys, or server credentials in GitHub.

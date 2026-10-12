# Website release — 12 October 2026

The professional website update is published to https://kittycorp.vercel.app/ through the existing psychspy7/kittycorp main branch. Functional release: 26dd735cf9aed18963ed71f0c48c433d5137a86e. Vercel reports success; later documentation commits retain this implementation.

GitHub Actions passed lint, combined website/security/payment checks and the native Next.js production build. Live homepage, services, products, LISA, memberships, contact and Studio pages returned HTTP200. Anonymous Studio commerce requests returned HTTP401 with no-store. The retired /admins address returned HTTP404; Google readiness is true.

Razorpay approval was confirmed by the owner. Approval does not automatically change test keys to live keys. Enter live API credentials and the matching webhook secret privately, then activate Live in Studio. Read RAZORPAY-LIVE-ACTIVATION.md. PayPal and Cashfree remain Off. KITTY membership app provisioning and LISA preorder fulfillment are separate, and purchases remain gated.

The website-only private payment ledger was applied additively to the existing website Supabase project. No live charge, fake review, customer record or email was created by this release. Gmail alerts still require the privately configured app password.

Canonical working source remains in this project folder. The existing repository history is preserved; the isolated release worktree is ../work/website-release-2026-10-12. Start future Git publishing from current origin/main rather than the historical copied master baseline. Preserve private settings and other apps’ separate repositories.

The clean source archive is ../Source File Zip/website/SOURCE-LATEST.zip. It excludes environment files, credentials, Git data, build outputs, APK binaries and live database records. Read the continuation instructions and owner guide before restoring it.

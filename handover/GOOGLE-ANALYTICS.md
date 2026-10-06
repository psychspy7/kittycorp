# Google Analytics

The website uses GA4 property **557240548** (`kittycorp.vercel.app`) and website measurement ID **G-9V2T4Z9RJP**. The measurement ID is public, safe to commit, and is not an API key or Studio password.

## Where to view visits

Open [Google Analytics](https://analytics.google.com/), select **kittycorp.vercel.app**, and open **Reports → Realtime** for recent visitors. Standard reports need time to process new data; do not expect them to update instantly. Visitors with a saved opt-out are excluded, and blockers can prevent collection.

## Visitor choice and privacy

Analytics starts automatically on public pages after hydration, unless this browser has a saved opt-out. There is no acceptance banner. The footer's **Disable analytics** button stops collection and clears the website's GA cookies; it becomes **Enable analytics** to resume. Previous saved declines are respected. Preferences are remembered locally for 180 days. Advertising consent stays denied; Google signals are disabled. The privacy page describes this behavior.

Only known public pages send manual page views, including navigation between pages without a reload. Studio, API routes, query strings, fragments and form field contents are excluded. Studio's footer link opens a fresh document so its session does not inherit the public-page Google tag. New public routes must be added deliberately to `lib/site-analytics.ts`.

**Keep Enhanced measurement switched off** in **Admin → Data streams → the website stream**. The website sends page views itself. Automatic history and form measurement could otherwise duplicate views or capture information outside those boundaries. This integration currently measures page visits, not form conversions, clicks or APK downloads.

## Changing or disabling the connection

The public default is in `lib/analytics-config.ts`. An optional server environment variable, `GOOGLE_ANALYTICS_ID`, overrides it. Set that variable to `disabled` to turn Analytics off for a deployment, or to another valid `G-` measurement ID to change streams. Redeploy after changing hosting environment variables. Blank or absent values use the Kitty Corp stream. Keep development deployments disabled to avoid counting local tests.

Files involved: `app/layout.tsx`, `components/kitty/google-analytics.tsx`, `lib/site-analytics.ts`, `lib/analytics-config.ts`, `components/kitty/site-footer.tsx`, `app/final.css`, `app/privacy/page.tsx`, and `.env.example`.

Run `node scripts/test-analytics.mjs`, `npm run typecheck`, and `npm run build:next` after changes. Check automatic loading and the footer opt-out on mobile and desktop, and confirm public visits in Realtime. Do not add a second copy of the Google tag or store private credentials in any analytics event.

Reference: [Google's page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views), [consent guidance](https://developers.google.com/tag-platform/security/guides/consent), and [collection opt-out](https://developers.google.com/tag-platform/security/guides/privacy).

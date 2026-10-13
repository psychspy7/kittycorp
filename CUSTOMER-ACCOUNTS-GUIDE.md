# Customer accounts — 13 October 2026

Customers can choose **Sign in** in the website header, or open `/account`, and continue with Google. Use the same Google account as the KITTY AI Android app. This is the existing Firebase identity, not a new Studio administrator account.

## What customers can track

- Project requests: submitted scope, review state, agreed quote, advance/balance and verified payment progress. Open a request to see its quote and payment choices.
- KITTY AI: current free/Plus access, expiry and manual renewal. There is no automatic debit.
- LISA: reservations, payment status, early-access delivery state and eligible refund requests. Website reservations do not activate the companion app automatically.
- Website payments and voluntary contributions made while signed in, plus payments for connected projects and LISA reservations. KITTY membership access is reported by its existing backend separately.

Sign in before sending a new project brief or creating a LISA reservation. The verified Google email is filled in for tracking. Guests can still use the original forms and checkout. Older guest records can be connected in **My account → Bring it into your account**: paste the complete private quote or reservation link, and use the Google account matching its original email. Knowing an email address or project ID alone cannot connect a record. Accounts cannot reassign an existing owner's records.

## Owner workflow

Project enquiries continue to appear in Studio's inbox and **Project quotes**. Approve the actual scope and price there; set preview ready when appropriate. Customers refresh their account to see changes. LISA delivery and refund requests remain in **LISA preorders**. Actual refunds are processed through Razorpay and reconciled by the existing signed webhook. Saving a refund request does not itself move money.

Google customer sign-in uses Firebase project `kittyai-f743c`. Website and localhost are already authorized. If a new custom domain is introduced, authorize its hostname in Firebase Authentication and check the public Firebase configuration. Keep Studio's separate Supabase Google sign-in and administrator allowlist intact. A customer account never grants Studio access.

## Data and hosting

`supabase/customer-accounts.sql` has been applied to the website project `mgkghnblbisubympudaa`. Do not run it against the private-chat database. For a new database, install existing base/schema, commerce payments, project quotes and LISA preorder extensions first, then customer accounts. The customer ownership table is private, has RLS enabled and exposes no direct visitor table access. Existing project/LISA submission functions attach verified ownership atomically.

The server verifies each bearer token through the existing KITTY backend `/api/me`; that backend validates the Google Firebase session and revoked/disabled accounts. Supabase receives trusted server UID/email through the private gateway, never a user-supplied UID. Preserve existing `KITTY_MEMBERSHIP_BACKEND`, `KITTY_COMMERCE_GATEWAY_TOKEN`, website Supabase configuration and `FEEDBACK_GATEWAY_TOKEN`. No new private credentials are required.

Account API responses are private/no-store. Private pages are excluded from analytics and public sitemap, and use noindex metadata. Account switching clears detail views. Do not log bearer tokens, guest links, inbox content or payment credentials. Clean source ZIPs exclude all private configuration and live records.

## Verification

Run `npm run check:website`, `npm run lint` and `npm run build:next`. Customer tests cover invalid sessions, cross-customer access, private-link claiming, no-store responses, signed-in checkout and unchanged guest payment safeguards. Database ownership checks use transactions rolled back after the test. No test requires a real charge or customer email.

For acceptance, sign in on `/account`, submit a genuine brief and refresh. Approve it in Studio and verify the account shows the quote. Complete any real payment yourself, then refresh to confirm its captured status. Sign out and verify private detail pages require Google login. Test with a second real customer account to confirm records remain separate.

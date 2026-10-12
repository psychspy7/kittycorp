# Activate approved Razorpay payments

12 October 2026. The website integration is ready. Approval does not replace test keys with live keys automatically.

## Get the live credentials privately

1. Sign in at https://dashboard.razorpay.com/ and switch to **Live**.
2. Open **Account & Settings → API Keys → Generate Key**. Save the live Key ID (starts with `rzp_live_`) and Key Secret in your private password manager. The secret is only displayed at creation. Do not rotate an existing working key without checking pending orders.
3. Open **Account & Settings → Webhooks → Add New Webhook**.
4. URL: `https://kittycorp.vercel.app/api/payments/webhooks/razorpay`.
5. Choose a strong unique webhook secret (at least 32 random characters), save it privately and select **payment.captured**. Enable and save the webhook. This secret is separate from the API Key Secret.

## Save in KITTY Studio

1. Open https://kittycorp.vercel.app/kitten and sign in with the approved Google owner account.
2. Choose **Payments & plans**, then **Razorpay**.
3. Enter the live Key ID, live Key Secret and matching webhook secret in their password fields. Blank fields preserve saved values. Never put credentials in chat, GitHub or a clean source ZIP.
4. If a field says **Environment override**, the same named Vercel setting takes priority. Replace those production environment values with the live values, or remove only the obsolete Razorpay overrides so Studio can provide them. Relevant names: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET. Then redeploy. A legacy NEXT_PUBLIC_RAZORPAY_KEY_ID is not used by this checkout; never put a secret under a public prefix.
5. Choose **Live**, tick the account approval confirmation and save. Leave PayPal/Cashfree Off until their own accounts and credentials are ready.
6. Set an agreed INR project amount only when you have agreed a quote with a client. Zero keeps project checkout closed. Contributions can use /payments?purpose=donation.

## Verify before sharing payment links

The previous Razorpay test checkout and offline signature/security tests are complete. Verify the Live webhook in the dashboard. Complete a small payment yourself using a real account, then confirm a captured provider payment and its matching Studio record. The agent does not make or charge this real payment on your behalf. If confirmation is delayed, use **Check payment status**, and do not pay twice.

## Product memberships are separate

This Studio configuration enables service payments and voluntary contributions. KITTY AI memberships require the KITTY AI owner console's provider setup, deployed membership database migration and private website gateway. LISA remains a planned USD100 access offer until its preorder and fulfillment flow is ready. Service/contribution payments do not grant app access.

Official guides: https://razorpay.com/docs/payments/dashboard/account-settings/api-keys/ and https://razorpay.com/docs/payments/dashboard/account-settings/webhooks/.

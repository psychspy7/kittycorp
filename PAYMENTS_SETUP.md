# Razorpay checkout

This project uses Next.js App Router API routes and the pinned Razorpay Node SDK.
The payment page is `/payments`. Services links to `/payments?purpose=project`
and, below it, `/payments?purpose=donation`. No automatic project delivery or
invoice settlement has been invented. The current credentials remain test-only.

## Projects and voluntary support

Project checkout uses the server-configured amount and records a project/invoice
reference in Razorpay order notes and the signed checkout context. A reference
is required with live keys. The amount must be checked against the agreed quote;
this is not a multi-invoice billing system. Do not reuse one global amount for
different invoices. Add a private invoice lookup before automating billing.

Voluntary contributions have presets and a custom amount from ₹1 to ₹10,000.
The server validates the contribution bounds and marks its purpose separately;
it never settles a project invoice, sells a product or grants company ownership.
Both flows use the same signature/provider verification and UPI configuration.

## Local setup

1. Install with `npm ci` (or `npm install` while developing).
2. Add these variables to an ignored `.env` or `.env.local`:

   ```dotenv
   RAZORPAY_KEY_ID=rzp_test_your-key-id
   RAZORPAY_KEY_SECRET=your-test-key-secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your-key-id
   RAZORPAY_CHECKOUT_AMOUNT_PAISE=100
   ```

   The supplied test credentials have already been saved in this checkout's `.env`.
   Keep that file private. `.env.local` takes precedence over `.env`; don't leave stale
   Razorpay values there. The public ID must match the server ID. Never create a
   `NEXT_PUBLIC_RAZORPAY_KEY_SECRET` variable.

3. Keep the existing website/Supabase environment settings. If Cloudflare protection
   is enabled, its existing widget must allow your localhost hostname.
4. Run `npm run dev:next`, then open `http://localhost:3000/payments`.
5. Complete the security check and click **Pay test ₹1.00**. Razorpay opens its modal.
6. In test mode, use the supplied card `4100 2800 0000 1007`, CVV `123`, expiry `12/26`,
   where a card test is available. Use only sandbox values in test mode.
   Complete Razorpay's test authorization step. Close the modal to test cancellation,
   and choose a failed test authorization to test the failure message.
7. A captured payment shows confirmation and a payment reference. An authorized
   payment shows pending capture, with a **Check payment status** button. If server
   verification fails, check the status or contact the team; don't pay a second time.

## Endpoints and safeguards

### UPI checkout

UPI is prioritised before the default Razorpay payment methods. Cards, netbanking
and other enabled methods remain available. The checkout hides the deprecated
manual UPI-ID Collect flow and lets Razorpay select QR for desktop or supported
UPI apps for mobile web. The existing order creation and signature verification
also cover UPI payments; no separate UPI gateway or client-side paid flag is used.

UPI must be enabled for the relevant Razorpay account and mode. Checkout
configuration cannot activate a payment method that Razorpay has disabled.
UPI QR and Intent may not be available with test credentials, so a real payment
app cannot be assumed to work with a test order. The originally supplied
`test@razorpay` value is not used to reintroduce the deprecated Collect flow.

To enable live UPI, check Razorpay Dashboard payment-method settings, finish any
required account activation, and use the matching live key pair. Test on a real
mobile device for payment-app handoff and a desktop for the QR flow. Live tests
can charge real money. Keep test keys until you are ready to accept live payments.

References:
https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/configure-payment-methods/sample-code
https://razorpay.com/docs/announcements/upi-collect-migration/standard-integration

- `POST /api/create-order`: JSON `{ "amount": 100, "currency": "INR", "purpose": "project", "reference": "KITTY-01", "receipt": "optional_unique_receipt", "turnstileToken": "token_when_enabled" }`. Purpose is `checkout` (legacy default), `project` or `donation`.
  Returns `{ "order_id": "order_...", "amount": 100, "currency": "INR" }`.
- Amounts must be integer paise, at least 100. This checkout supports INR and one
  server-configured project amount. A project total that differs is rejected.
  Donation amounts are visitor-selected and capped at 1,000,000 paise.
  Optional receipt strings are 1–40 letters, numbers, underscores or hyphens;
  omitted receipts are generated uniquely by the server.
- `POST /api/verify-payment`: JSON containing `razorpay_payment_id`,
  `razorpay_order_id`, and `razorpay_signature` from Checkout.
- Both routes require a matching `Origin` and a JSON request. Creating orders also
  uses the existing Cloudflare protection when enabled. Browser requests send
  cookies automatically; command-line callers must retain the order cookie.
- A signed, HttpOnly order cookie records the server-created order for one hour.
  Up to five concurrent checkouts are supported. The verification endpoint compares
  the callback against this trusted order and uses a constant-time HMAC check.
  It then fetches the actual payment to check the amount, currency, order and capture
  status. Signatures alone do not trigger a paid result.
- Missing fields or a mismatched signature return 400. Provider authentication
  failures return 401; provider errors return 500. No private API errors are logged.
- Successful capture returns `success: true`, `verified: true`, `paid: true`.
  Pending authorization returns `success: false`, `verified: true`, `paid: false`.
  Neither route delivers a product or changes any database records.
- Verification remains available during maintenance for payments already in flight;
  maintenance still prevents new checkout pages and orders.

## Automated checks

```text
node scripts/test-razorpay.mjs
npm run typecheck
npm run build:next
```

The test script runs the real validation, signing and route code against isolated
cookie/provider adapters. It does not create orders or charge money.

## Vercel / production

Add the four environment variables above to the appropriate Vercel environment and
redeploy. Local `.env` files are not uploaded automatically. Keep the secret server-only.
Only the key ID is sent to the browser, from the server's runtime configuration.

Before accepting real payments:

1. Complete Razorpay account activation and use a matching live ID/secret pair in
   the hosting environment. Update the public ID too, then redeploy.
2. Configure automatic capture in the Razorpay Dashboard, or add a deliberate
   server-side capture workflow. This integration never calls an authorized payment
   paid until Razorpay reports it captured.
3. Agree the actual purpose and price of payments. Replace the fixed demo amount
   with a server-side invoice/product lookup before collecting variable project
   payments. Do not remove the amount check or trust a client-side cart total.
4. For order fulfilment, add durable payment records with unique payment IDs and
   signed Razorpay webhooks. Reconcile completed payments even if the visitor closes
   the browser. Browser confirmation alone is not a reliable fulfilment system.
5. If adding a Content Security Policy, allow Razorpay's documented checkout script,
   frames and network endpoints. Keep your own site on HTTPS.

The current task implements a test checkout. It does not push or deploy these changes.

## Files added or updated

| File | Change |
| --- | --- |
| `app/api/create-order/route.ts` | New order endpoint and trusted order cookie |
| `app/api/verify-payment/route.ts` | New signature and provider-status verification endpoint |
| `lib/razorpay-server.ts` | Server-only SDK, configuration, validation and signing helpers |
| `components/kitty/razorpay-checkout.tsx` | Reusable modal launcher and payment status UI |
| `app/payments/page.tsx` / `payments.css` | Responsive checkout page |
| `scripts/test-razorpay.mjs` | Isolated backend regression checks |
| `package.json` / `package-lock.json` | Pinned Razorpay SDK dependency |
| `.env` | Private local test credentials; ignored, excluded from release ZIPs |
| `.env.example` | Public placeholders only |
| `lib/maintenance.ts` | Allow in-flight payment verification during maintenance |
| `components/kitty/website-assistant.tsx` | Hide chat launcher on the payment page |
| `README.md` / `PAYMENTS_SETUP.md` | Checkout setup, testing and handover |
| `scripts/package-release.ps1` | Include this guide and scan all common private env files |

The existing `.gitignore` already excludes `.env` and `.env.local`; that rule is retained.

Official integration reference:
https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/

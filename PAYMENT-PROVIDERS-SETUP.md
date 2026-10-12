# Payment providers and product access

Updated 12 October 2026. This is the KITTY CORP website repository. Provider approval, account credentials and product fulfillment are separate from deploying source code.

## Service payments and voluntary contributions

Open `/kitten`, sign in with the existing approved Google owner account, and select **Payments & plans**. No administrator link is added to the public footer.

Razorpay, PayPal and Cashfree start **Off**. Enter credentials directly in Studio password fields, save, then select **Sandbox** to test. Blank fields preserve saved credentials; the remove checkbox removes only the Studio value. The browser never receives provider secrets. Existing private server environment values override Studio values; the panel identifies these overrides. Keys are encrypted in the existing runtime table. Keep `FEEDBACK_GATEWAY_TOKEN` unchanged: it is also used to decrypt the existing AI and Turnstile configuration.

| Provider | Required settings | Currency used here |
| --- | --- | --- |
| Razorpay | Key ID, key secret; webhook signing secret for live mode | INR |
| PayPal | REST client ID, client secret; webhook ID for live mode | USD |
| Cashfree | Payment Gateway client ID and secret | INR |

Razorpay test keys must match Sandbox, and live keys must match Live. PayPal/Cashfree environments are selected by the mode; use credentials from that environment. The website does not automatically convert quotes between currencies. Methods such as UPI depend on the merchant account and device, rather than a website setting.

Set an agreed project amount separately for each provider. Amount 0 hides project checkout. This version supports one current agreed amount per provider, not a private invoice catalogue for different clients. Only share the payment link after agreeing the scope, currency, amount and project reference with the client. Contributions are voluntary and bounded; they are separate from products and services.

Public links:

- `/payments?purpose=project`
- `/payments?purpose=donation`

### Webhooks and account approval

Configure your production HTTPS URL in each provider dashboard before enabling Live:

- `https://kittycorp.vercel.app/api/payments/webhooks/razorpay` — payment captured event, using the matching webhook secret.
- `https://kittycorp.vercel.app/api/payments/webhooks/paypal` — payment capture completed event; save that app's webhook ID in Studio.
- `https://kittycorp.vercel.app/api/payments/webhooks/cashfree` — payment success event; Cashfree verifies timestamp plus raw body with the client secret. Complete the required domain whitelist in its dashboard.

Switch to Live only after provider approval, correct live credentials, dashboard webhook setup and a successful sandbox checkout. The approval checkbox records your confirmation; it does not obtain approval from the provider. The code rejects live checkout lacking the required settings.

Orders are created on the server. Payment confirmation checks the provider's actual order/payment, currency and total. Signed callbacks, verified webhooks and a private database ledger handle confirmation and repeated deliveries. If a payment has completed but confirmation is delayed, use **Check payment status** or contact KITTY CORP with its reference; do not pay again. Turning a provider Off stops new orders while allowing already recorded payments to reconcile with the same account credentials.

Studio's recent payment records contain only service/contribution references, amounts, status and provider IDs. They are separate from product entitlements. Refunds are currently managed in the provider dashboard; these website records do not automatically process refunds, revoke app access or provide accounting reports.

## KITTY AI memberships

The integrated `/memberships` page uses the KITTY AI backend's authoritative catalogue and KITTY Firebase customer identity. Studio owner identity remains Supabase Google authentication; the two sign-in systems serve different purposes.

KITTY AI's owner console controls membership pricing, limits and purchase availability. Its app/backend setup and migration are managed in the separate KITTY AI project: `../KITTY AI/docs/MEMBERSHIPS-SETUP.md`. Read that guide before enabling purchases. Required website settings include its private commerce gateway and trusted backend address; never publish them in GitHub. The website does not activate a membership merely from a browser success callback. Provider verification and the KITTY backend's owned, idempotent entitlement reconciliation are required.

The current draft presents five elapsed free minutes per UTC day and KITTY Plus at INR99 per calendar month, with finite daily request limits. Purchases are paused until backend provisioning and merchant approval are complete. Renewals are explicit purchases; no automatic debit is promised.

The separate service/donation provider panel does not change KITTY's membership catalogue. PayPal and Cashfree are prepared for services/contributions here; they do not grant KITTY AI membership access.

## LISA planned access and real media

In Studio **Payments & plans**, edit the draft LISA price, access period, description, feature list and gift note. Publishing the draft shows information only. It never opens a preorder checkout or grants LISA access.

The requested default is USD100 once, for lifetime access to the purchased version. Major paid upgrades are separate. Preorder gift contents, eligibility and delivery details must be confirmed before preorders open; the public copy makes this clear. LISA's licensing/fulfillment and payment-enabled preorder flow still need their separate implementation.

Replace development images with real screenshots/renders through the gallery upload fields. Save captions that accurately describe the development stage. Versioned bundled images and UUID-named uploaded images prevent stale replacement icons/media. Existing Products, Team and Company & socials panels continue to manage icons, people and profile links.

## Testing and hosting

Run `npm ci`, restore private settings in `.env.local`, then `npm run check:website` and `npm run build:next`. Use `npm run dev:next` for local changes. Google callback and Turnstile host configuration must match your deployment. Do not disable production owner authentication to test a local panel.

Use native Next.js on Vercel. Keep `SITE_URL` equal to your real HTTPS origin. Provider credentials may be saved privately in Studio or server environment settings; never use a frontend public prefix for a secret. `.env.example` lists empty optional overrides. The clean source ZIP excludes private environment files, provider credentials and live records; restore configuration independently.

The verification scripts use fixtures and make no real provider charges. Before enabling a newly approved provider, perform its genuine sandbox checkout, verify the server confirmation and ledger entry, and test webhook delivery in that provider's dashboard.

Official integration references: [Razorpay](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/), [PayPal](https://developer.paypal.com/studio/checkout/standard/integrate), [Cashfree](https://www.cashfree.com/docs/payments/online/web).

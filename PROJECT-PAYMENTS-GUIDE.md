# Project payments and checkout — 12 October 2026

The homepage and `/payments` now separate product plans, client quotes and voluntary contributions. A zero legacy client amount does not disable donations. `/projects` is the short project brief and optional KITTY AI analysis flow.

## Customer and Studio flow

1. Customer submits a brief for free. The same transaction places the message in the existing Studio inbox and creates a private quote.
2. The response shows `/projects/quote#quote=...`. Keep this private access link. Tokens are random 256-bit values and only SHA-256 hashes are stored. Fragments are not sent as referrers or Analytics page URLs. Quote responses omit the name, email and token hash.
3. Studio → Project quotes shows briefs. Confirm the scope and project price in INR, then change Draft to Approved and save. No automatic AI price is invented: the owner has said they will provide pricing rules. Optional AI analysis summarizes the brief; it is not a binding quote.
4. Customer refreshes the same private quote link and chooses full advance (2.5% off), 50/50 (1.2% off the total), or review-first (no advance, no discount). Discounts are calculated on the agreed total in integer minor units, with the second installment retaining any rounding remainder.
5. Studio can mark the preview ready. This opens the remaining split balance or the review-first payment. Sending a brief does not promise a free unlimited build or transfer finished source before payment; agree the actual preview/delivery scope with the customer.
6. Captured, verified live ledger records determine paid amounts. Price and scope are locked once an order starts. The selected schedule is immutable during payment. Retries reuse the known Razorpay order; a concurrent or uncertain creation is recovered by its unique receipt rather than blindly creating another order.

`Legacy client invoice amount` in Payments & plans is only for the old one-amount invoice path. Leave it 0 for the new per-customer quote flow. It is unrelated to product prices or donations.

## Provider and product limits

- The saved website LIVE Razorpay pair was accepted by Razorpay's read-only API, and an unpaid ₹1 donation checkout opened with UPI QR/cards. One unpaid live order was created for this check; no charge was completed.
- Local preview had obsolete test keys in ignored `.env`. Empty overrides in `.env.local` allow current encrypted Studio keys to resolve without exposing them. Private files are excluded from Git and the clean ZIP.
- Website service/contribution checkout does not grant KITTY AI access. The matching KITTY membership gateway can resolve from encrypted runtime or private server environment; KITTY Plus is now enabled on its LIVE backend at ₹99 per calendar month, 100 chat requests and 10 cloud-speech requests per day. Google account identity binds ownership. Renewal is manual; no automatic debit. Native membership webhook setup and signed payload checks passed. A real paid purchase and fresh-phone acceptance test remain owner steps.
- LISA remains in development. Planned perks: early LISA updates, invitations to test future KITTY products, and team development news. The owner approved a refundable US$100 one-time preorder: no delivery date promised yet and a full refund before early access is provided. `/lisa-ai/preorder` freezes the exact INR charge using the current daily reference rate before checkout. The preorder is a website reservation; it does not activate the LISA app.
- Local currency is a daily reference estimate with a manual currency selector. ExchangeRate-API is fetched on the server and cached for 24 hours; the browser gets only a converted estimate, not a raw rate dataset. Rates are attributed on price displays. Razorpay currently charges INR; bank conversion/fees may differ. Foreign-currency charging requires merchant approval/configuration, not just changing a symbol.
- Customer quote pages, payment pages and Studio are excluded from public Analytics. The public `/projects` page is tracked without form content or fragments.

## Validation and recovery

Run `npm run check:website`, `npm run lint`, and `npm run build:next`. New quote checks cover discounts, installments, review gates, price tampering, private token hashing, authenticated Studio updates and fixed-origin currency requests. Supabase transaction-only fixtures check gateway denial, identity redaction, atomic reservation reuse and captured-ledger balance; all fixture writes roll back.

A timeout after provider creation may leave a reservation pending. Retry can recover an existing provider order using its `quote_<reservation UUID without hyphens>` receipt. If no matching order is found, keep it locked and reconcile in Razorpay before changing anything; never charge a second order to guess the first outcome.

Database security advisor reports the intended deny-all RLS design for private quote/payment tables and the existing leaked-password-protection warning. Studio remains Google-only with its existing owner identity and revocation checks. No unrelated auth setting was changed.

## LISA refundable preorder

1. Customer opens `/lisa-ai/preorder`, enters a contact name/email and accepts versioned terms. No mailing-list enrollment or charge occurs at this step.
2. The server reads the Studio USD plan price, gets the daily reference conversion and stores the exact INR charge and accepted terms in a private reservation. Only a SHA-256 hash of the random access token is stored. Keep the fragment link private.
3. Payment opens the separate LISA order endpoint. The server checks the frozen amount, mode, approval, challenge, reservation and provider receipt/notes. Retry reuses the same order, including recovery after uncertain creation; it never guesses by issuing a second order.
4. Existing signed HttpOnly order sessions, callback HMAC and fetched captured payment checks record payment. Signed webhooks recover captures and verified full refunds. Only live, matching purpose/reference/amount/currency records count.
5. Studio → LISA preorders shows the customer, accepted terms, exact charge, payment IDs and refund requests. It does not grant application entitlements. Mark early access provided only after the customer actually receives it. This is an irreversible delivery timestamp; unresolved refund requests block it.
6. Before access, customers can request a full refund from their private reservation link. The owner processes the full INR amount through the original Razorpay payment in the dashboard. The processed-refund webhook updates the status. This release does not automatically send money or refund on an anonymous button click.

The website webhook is active for `payment.captured`, `order.paid`, and `refund.processed`; its existing secret was preserved. The separate membership webhook and KITTY provider vault are distinct. Never put provider secrets into client code or source archives. Run the additional `scripts/test-lisa-preorders.mjs` check through `npm run check:website`.

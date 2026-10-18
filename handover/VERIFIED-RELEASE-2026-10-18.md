# Verified website release — 18 October 2026

Feature commit: 9ba553f649dcefada9ad0968e55415ecc67a2ebc.
Repository: https://github.com/psychspy7/kittycorp
Production: https://kittycorp.vercel.app
Vercel deployment dpl_GkngVrHzrEWYsENFT2N64JnC6Pwr was READY and assigned to the production domain.

## Verification performed
- Complete check:website suite passed: types, caching, Studio Google/security, consent, assistant, payment providers, quotes, game scoring/signatures, customer ownership, historical LISA refunds, memberships, email and hosting.
- Production build passed with all 62 static-generation tasks complete and server routes generated.
- Changed-source lint had no remaining new error. Existing unrelated warnings include image usage, an unused import/type, and the payment-checkout effect dependency. The new game test's naming issue was corrected and lint/test rerun passed.
- Mobile browser inspection verified package layout and dark-card text contrast, appointment form labels, LISA artwork and purchase copy, consent dismissal and navigation. No separate desktop viewport was available in this browser session.
- Live pricing, appointments, play, LISA, terms, refunds and homepage returned 200 with expected content. Health and Turnstile configuration returned 200; Turnstile remains enabled.
- Unauthenticated Studio reward administration returned 401.
- Website Supabase reward and optional review-rating migrations applied. New split-discount default changed to 100 only after new source was READY.
- Both existing quotes retain 120 basis points. Server totals checked: 10000 with new split = 9900; old split = 9880; 7% reward with full advance = 9300 (largest discount, no stacking).
- Reward table has RLS and no direct anon/customer SELECT grant. No reward codes were created by testing.
- Three owner-approved named reviews published with their supplied five-star ratings. No aggregate statistics or invented client details.
- No real charge, test email or appointment/project submission was created by these checks.

## Advisor observations
The security advisor reports informational RLS-without-policy notices on private tables, including rewards. Those tables intentionally have no direct browser grants and are accessed through guarded functions. Do not add broad policies to silence the notices.
A pre-existing leaked-password-protection warning remains in Supabase Auth; Studio uses its restricted Google flow. See https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection for provider guidance.

## Remaining owner steps
- LISA is a $99 assisted purchase inquiry, not instant checkout/delivery. Complete installer hosting and tested licence delivery before enabling automatic sales; see LISA-DISTRIBUTION-GUIDE.md.
- Game codes for separate app products are applied through the team/product system. Service quote redemption is supported in Studio before order locking.
- Confirm each appointment by email; this is not an automatic live calendar reservation.
- Supply actual seller, address and tax details where applicable before relying on legal pages or invoices. No details were invented.
- $200 bundle scope and access are agreed manually for 30 days and two Premium websites once; LISA is excluded.
- Source archive is credential-free and is not a live customer/database backup. Preserve private configuration and provider accounts separately.

## Final visual correction
The live mobile review also identified low contrast on the dark bundle card local-currency estimate. The final stylesheet gives that estimate light text, and service cards distinguish a quoted price from an unavailable planned product. Type checking, scoped lint and production build were repeated for the affected UI.

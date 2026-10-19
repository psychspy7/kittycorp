# Domain migration checklist — 19 October 2026

This release does not buy a domain, change DNS, move databases or rotate credentials. The live site remains on the existing Vercel project and the same backend. Add the new domain to that project when you have purchased it; a domain change does not require recreating Supabase.

## Before the switch
1. Confirm the exact owned domain and choose the primary apex or www host.
2. Add it to Vercel project kittycorp (prj_0I4OtCBgFXdZvzMgYKSQqr0iX3Nx) in the existing team. Use the actual DNS/ownership records Vercel returns; do not assume a universal A record. Preserve MX and verification TXT records. Wait for valid HTTPS on the new host.
3. Keep kittycorp.vercel.app working while checks run. Keep a known-good deployment available for rollback.
4. Add the new hostname to the existing Cloudflare Turnstile widget. Keep the same widget/keys; do not disable verification as a migration shortcut.
5. Add the new domain to Firebase Authentication authorised domains for the existing customer identity. Check any relevant Google OAuth authorised JavaScript origins and redirect URIs against the actual auth flow.
6. In the existing website Supabase project's Auth URL configuration, add the new Studio callback URL /api/admin/google/callback and other exact redirect URLs used by the code. Preserve working return URLs during the transition. Google’s Supabase provider callback stays on the same Supabase project unless that project itself changes.
7. Review the pinned Studio canonical callback/origin settings in the code and existing private configuration before editing. Preserve the approved owner identity, cookie security and PKCE checks.

## Publish and verify
1. Set production SITE_URL to the new HTTPS origin only when DNS, HTTPS and provider authorisation are ready. Set any separately configured Studio redirect origin consistently. Redeploy and verify metadataBase, canonical links, robots, sitemap, structured data and email links.
2. Confirm customer Google sign-in and Studio /kitten sign-in on the new domain. Old-domain cookies and localStorage do not migrate; visitors may need to sign in again and make a new cookie choice.
3. Test a project enquiry and its Studio/email receipt with an agreed test identity. Verify private links, account ownership and payment references remain intact.
4. Update payment-provider approved website domains and webhook destinations where required, preserving webhook secrets and signature checks. Avoid duplicating webhook processing. Keep old delivery working until new delivery is verified. Never change existing order amounts or currency while moving domains.
5. Review the existing scheduled report/recovery job and website links in Cloudflare/other services. The database-health Worker reads the same Supabase project directly; it is separate from the website hostname.
6. Update Google Analytics stream details, Search Console, AdSense review settings and official social/profile links as appropriate. Retain the existing measurement ID and opt-in controls.
7. Verify downloads, media, contact, appointments, memberships, /payments, /account, /products, /investors, /research/suvid-ai and /kitten. Use HTTPS and test a narrow screen and keyboard navigation.
8. After both sign-in flows, form receipt and provider callbacks work, configure the intended permanent redirect from the old public hostname and secondary www/apex host. Test OAuth and payment callbacks again after redirects. Keep old private project URLs and already-issued email links usable.
9. Refresh the website source archive and continuation notes. Preserve private configuration separately.

## Official references
- Vercel custom domains and project assignment: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- Supabase redirect allowlist and Site URL: https://supabase.com/docs/guides/auth/redirect-urls
- Google OAuth web client configuration: https://developers.google.com/identity/protocols/oauth2/web-server
- Cloudflare Turnstile hostname management: https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/
- Firebase Google sign-in and authorised domains: https://firebase.google.com/docs/auth/web/google-signin

No domain provider or price is assumed. Follow the dashboards' current validation instructions for the actual purchased domain.

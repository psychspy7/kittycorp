# Google-only Studio sign-in

Studio is at **https://kittycorp.vercel.app/kitten**. Choose **Sign in with Google** and use `viratanand1221@gmail.com`. The old ID/password form and `/admins` address are retired. Public pages do not link to Studio.

Access is restricted to the existing configured Auth UUID, private administrator allowlist, verified Google email and pinned immutable Google identity. A fresh server-verified Google session receives a one-hour Studio grant. Password sessions and direct OAuth sessions without that grant cannot edit website data. This is Google account sign-in, not Google Authenticator or native Supabase MFA.

## Provider configuration

The existing Google provider is enabled in website Supabase project **mgkghnblbisubympudaa**. Keep its client secret in Supabase, never in GitHub, a public ZIP or website content.

If provider configuration needs repair:

1. Open [Google Auth Platform](https://console.cloud.google.com/auth/overview) in the account owning the existing OAuth client. Use the existing KITTY CORP Studio Web application client.
2. Its authorized JavaScript origin is `https://kittycorp.vercel.app`.
3. Its authorized redirect URI remains `https://mgkghnblbisubympudaa.supabase.co/auth/v1/callback`.
4. If the Google application is in Testing, the approved owner email must be a test user. Only standard openid, email and profile scopes are needed.
5. Verify the client ID and secret in [Supabase Google provider settings](https://supabase.com/dashboard/project/mgkghnblbisubympudaa/auth/providers). Leave nonce checking enabled.
6. In [URL Configuration](https://supabase.com/dashboard/project/mgkghnblbisubympudaa/auth/url-configuration), Site URL is `https://kittycorp.vercel.app`; the application callback is `https://kittycorp.vercel.app/api/admin/google/callback`.

The callback path is unchanged by the move to `/kitten`. A random per-login flow query and a server-held PKCE verifier bind the return to the same browser. Do not add broad production host wildcards. Website `SITE_URL` must match the canonical origin.

## Session and recovery

The application uses HttpOnly, Secure, SameSite=Lax session cookies so the final navigation from Google includes the session. Sensitive API writes independently require the website origin. Tokens and provider credentials are never returned to website JavaScript.

The private `studio_google_enforced` flag is enabled. The extension in `supabase/studio-google-only.sql` documents the installed Google-only grant rule. It follows the original security schema; do not rerun first-install scripts against the existing database.

If Google becomes unavailable, sign-in fails closed. Repair the provider through the owning Supabase account. Account email, UUID, pinned Google subject and allowlist must remain consistent. Do not use a Team profile or a visitor signup to grant administrative access. Emergency maintenance recovery remains separate.

## References

- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase server-side cookie guidance](https://supabase.com/docs/guides/auth/server-side/advanced-guide)
- [Supabase redirects](https://supabase.com/docs/guides/auth/redirect-urls)

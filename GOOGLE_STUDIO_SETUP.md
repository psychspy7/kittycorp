# Enable Google verification for KITTY CORP Studio

The password-first Google flow starts whenever the Google provider is enabled. Database enforcement is activated only after a complete owner login has been verified, so setup can be checked without locking the owner out. Once enforced, password-only sessions cannot access Studio data.

Only `viratanand1221@gmail.com`, attached to the existing Studio account, can complete Google verification. This is an additional sign-in check, not Google Authenticator or native Supabase MFA.

## 1. Create a Google Web OAuth client

1. Open [Google Auth Platform](https://console.cloud.google.com/auth/overview) using the Google account that will own the website's credentials. Select or create a Google Cloud project.
2. Set the application name to **KITTY CORP Studio** under Branding. Configure the support and developer contact email. Use the real website and privacy-policy links when Google requests them.
3. For an external application in Testing, add `viratanand1221@gmail.com` as a test user under Audience.
4. Use only the standard `openid`, email and profile scopes. No Gmail, Drive or other account-data access is needed.
5. Under Clients, create an OAuth client of type **Web application**. Add this authorized JavaScript origin:

   `https://kittycorp.vercel.app`

6. Add this exact **authorized redirect URI**:

   `https://mgkghnblbisubympudaa.supabase.co/auth/v1/callback`

7. Save the client ID and client secret privately. The secret belongs in Supabase's provider settings. Do not put it in website source, Studio content, a public ZIP or GitHub.

## 2. Configure the website's Supabase project

1. Open [Google provider settings](https://supabase.com/dashboard/project/mgkghnblbisubympudaa/auth/providers) for the website project. Enable Google and enter the Web client ID and secret. Leave nonce checking enabled.
2. Open [URL Configuration](https://supabase.com/dashboard/project/mgkghnblbisubympudaa/auth/url-configuration). Set Site URL to:

   `https://kittycorp.vercel.app`

3. Add the exact application callback to the redirect list:

   `https://kittycorp.vercel.app/api/admin/google/callback`

The application appends a random per-login `flow` query value. Supabase accepts the configured Site URL's same origin; the application independently enforces the exact callback path, browser state and PKCE verifier. Do not add broad production host wildcards.

The deployed website also needs `SITE_URL=https://kittycorp.vercel.app`. Its existing Supabase URL, publishable key, admin UUID/email and server gateway secret remain server configuration. No Google client secret is required in the website itself.

## 3. Verify and enforce the complete login

After Google is enabled, sign into `/admins` with the existing admin ID and password, then choose `viratanand1221@gmail.com` at Google. Confirm the Studio opens, sign out, and confirm the session is closed. A different Google account must be rejected.

Only after this succeeds should the project owner enable the private `studio_google_enforced` security flag. That change makes password-only and direct Google sessions insufficient for every Studio database operation. Existing password-only sessions lose access. No secret or public API allows visitors to change this flag.

If Google is disabled after enforcement, Studio sign-in fails closed. The project owner can repair provider configuration or deliberately restore the private flag through Supabase; the public website remains available.

## References

- [Supabase Google sign-in setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls)
- [Google OAuth / OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)


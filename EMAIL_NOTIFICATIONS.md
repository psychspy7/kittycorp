# Website submissions → Studio + Gmail

The sender and destination are **kittycorp.info@gmail.com**. Contact messages,
project briefs, private visitor reviews and new early-access signups stay in
Studio and receive an email alert once Gmail is configured. Existing messages
are not emailed retroactively. The visitor’s email is the Reply-To address.

## Connect Gmail when ready

1. Sign in to **kittycorp.info@gmail.com** and enable Google 2-Step Verification.
2. Open [Google App Passwords](https://myaccount.google.com/apppasswords).
   Create one named “KITTY CORP website”. The account owner must complete this
   step. Do not use your normal Gmail password.
3. Add `GMAIL_APP_PASSWORD=your_generated_app_password` to the ignored
   `.env.local` file in this project root. Spaces are accepted. Restart the
   local server after changing the file.
4. In Vercel, add **GMAIL_APP_PASSWORD** to your website project’s Environment
   Variables, select the intended environments, then redeploy. Do not upload
   `.env.local` or paste the password in chat or GitHub.
5. When restoring into a new database, apply `supabase/email-notifications.sql`
   after the existing schema/security/journal setup. Use the **website**
   project, never the separate private-chat project.
6. At `/kitten` → **Email alerts**, click **Send test email**. Check inbox/spam.
   Use **Send queued alerts** to send messages received before setup completed.

[Google’s app-password instructions](https://support.google.com/accounts/answer/185833)
explain accounts where that option is unavailable. Gmail may reject server
sign-ins and has sending limits. A transactional email provider can replace
the transport later if needed.

## Delivery and retries

A database trigger queues a reference atomically with a saved submission;
there is no second stored copy of the message. Deleting the source record
deletes its queue entry. Mail received in Gmail must be removed separately.

Next.js `after()` processes up to three due alerts after a successful form
response. Missing credentials leave them pending. SMTP failures wait for a later
submission or Studio retry. Automatic attempts stop after six; Studio can reset
and retry unsent entries. There is no scheduled retry job.

Queue claims prevent concurrent sends. SMTP delivery is at-least-once: if Gmail
accepts mail but queue acknowledgement fails, a retry may duplicate it. Each
email includes a stable notification reference. “Accepted by Gmail” is not a
guarantee of inbox placement.

Credentials stay server-side. The private queue uses the existing server gateway
and Google-only Studio access. Contact values and passwords are not logged or
sent to analytics. Reviews stay private until you get permission to publish.

## Contact links

Contact shows the company email and Virat’s supplied LinkedIn profile. A company
LinkedIn URL saved under Studio → Company & socials takes precedence. The
personal profile is labelled as the founder’s.

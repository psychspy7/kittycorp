# KITTY CORP — Functionality & Regression Checklist

This checklist tracks every core user, business, and administrative capability across the KITTY CORP application and details how each feature is verified before and after the redesign.

---

## 1. Client Conversion & Inquiries

- [ ] **Project Enquiry Form (`/projects` & Home Component)**
  - *Verification Method*: Run `node scripts/test-business-conversion.mjs`
  - *Criteria*:
    - Accepts valid inputs (`name`, `email`, `service`, `message`, `organization`, `budget`, `timeline`).
    - Enforces min length (2 chars name, 20 chars message, valid email).
    - Blocks submissions under 2,000ms (bot timing test).
    - Honeypot `website` field silently short-circuits spam.
    - Turnstile token verified server-side with action `project-enquiry`.
    - Generates immutable quote token and tracking reference.
    - If customer is signed in with Google, links request to user account.
    - Form clears and transitions to success state with direct reference.

- [ ] **Contact Form (`/contact`)**
  - *Verification Method*: Run `node scripts/test-business-conversion.mjs`
  - *Criteria*:
    - Validates name, email, subject, message.
    - Submits to `/api/feedback` with action `contact`.
    - Triggers email notification to `support@thekittycorp.com`.
    - Returns structured confirmation.

- [ ] **Appointment Scheduling (`/appointments`)**
  - *Verification Method*: Test date/time validation in `components/kitty/appointment-form.tsx`
  - *Criteria*:
    - Requires date format `YYYY-MM-DD` and time `HH:mm`.
    - Blocks scheduling times earlier than 1 hour in the future.
    - Generates appointment reference prefix `A-XXXX`.

---

## 2. Authentication & Admin Authorization

- [ ] **Studio Admin Login (`/kitten`)**
  - *Verification Method*: Run `node scripts/test-studio-security.mjs`
  - *Criteria*:
    - Requires Cloudflare Turnstile token (`studio-login`).
    - Starts Google OAuth PKCE flow (`beginStudioGoogle`).
    - Rejects passwords, legacy credentials, or unapproved Google accounts.
    - Issues `kitty_studio_session` cookie (`httpOnly; secure; SameSite=Lax`).
    - Rate limits repeated failed attempts (HTTP 429).

- [ ] **Customer Portal Authentication (`/account`)**
  - *Verification Method*: Run `node scripts/test-customer-accounts.mjs`
  - *Criteria*:
    - Customer Google sign-in creates secure session.
    - Prevents cross-customer data leakage.
    - Allows linking guest quote tokens to account.

---

## 3. Commerce & Payment Ledger

- [ ] **Project Quote Settlement (`/projects/quote`)**
  - *Verification Method*: Run `node scripts/test-project-quotes.mjs`
  - *Criteria*:
    - Itemized breakdown of scope and deliverables.
    - Verifies quote HMAC signature against database.
    - Displays upfront 2.5% discount option vs installment plan.
    - Prevents double payment or altered amounts.

- [ ] **Payment Providers (Razorpay, PayPal, Cashfree)**
  - *Verification Method*: Run `node scripts/test-commerce.mjs` and `node scripts/test-razorpay.mjs`
  - *Criteria*:
    - Order creation binds `order_id`, `amount`, and `currency`.
    - Webhooks verify cryptographic provider signatures.
    - Safe idempotent retries.

- [ ] **Product Memberships (`/memberships`)**
  - *Verification Method*: Run `node scripts/test-memberships.mjs`
  - *Criteria*:
    - Validates active status and cancellation recovery.
    - Webhook integrity checks.

---

## 4. Security, SEO & Core Web Vitals

- [ ] **Turnstile Fail-Closed & Dynamic Host Validation**
  - *Verification Method*: Run `node scripts/test-studio-security.mjs`
  - *Criteria*:
    - Tokens validated against `thekittycorp.com`, `www.thekittycorp.com`, `kittycorp.vercel.app`, and `localhost`.
    - Untrusted domains (e.g., `attacker.example`) return HTTP 400.
    - Action codes mismatch returns HTTP 400.
    - Replayed tokens return HTTP 400.

- [ ] **Site Identity & Metadata**
  - *Verification Method*: Run `node scripts/test-site-identity-security.mjs`
  - *Criteria*:
    - Canonical `metadataBase` set to `https://thekittycorp.com`.
    - Robots.txt allows search engines, disallows `/kitten` and `/account`.
    - Sitemap generates clean canonical URLs.
    - HSTS headers present.

- [ ] **Full Automated Suite Verification**
  - *Verification Method*: Run `npm run check:website`
  - *Criteria*:
    - All 16 checks pass without error.

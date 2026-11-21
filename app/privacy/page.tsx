import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";

export const revalidate = 86400;

export const metadata = pageMetadata(
  "KITTY CORP | Privacy Policy",
  "Privacy information for KITTY CORP visitors, enquiries, accounts, subscriptions, analytics and payments, including how data is handled and your rights.",
  "/privacy"
);

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
            Legal &amp; Privacy
          </span>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            Website Privacy Policy
          </h1>
          <p className="text-[17px] text-[#62676D] font-light">
            How our website forms, inquiry queues, customer accounts, and analytics operate with technical rigor.
          </p>
        </div>

        <div className="space-y-10 text-[16px] leading-[1.75] text-[#292D31] font-light">
          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">The Early List</h2>
            <p>
              We save the email address and product interests you choose, along with the timestamp of enrollment. New signups receive a confirmation email and join the list only after confirmation. We send one welcome email and occasional engineering news or testing invitations. You can unsubscribe at any time using the link in those emails. We do not sell the list or use it for third-party advertising. Project and contact submissions do not subscribe you to marketing broadcasts.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Contact and Project Inquiries</h2>
            <p className="mb-4">
              We save your name, email address, and message so the engineering team can read and respond. If you send a digital solution inquiry, this includes the business name, estimated budget, timeline, and technical requirements you choose to share.
            </p>
            <p>
              Inquiry submissions are stored securely within our cloud infrastructure and delivered directly to our official corporate email system. Temporary form records remain accessible to authorized engineers to ensure no messages are lost during network interruptions. Project quotes, payments, and customer account records are managed under separate administrative protocols.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Payments and Patron Transactions</h2>
            <p>
              Payment gateways, including Razorpay and Cashfree, process payment card and banking credentials securely on their certified infrastructure. Our servers store only order identifiers, payment references, amounts, currency, and verification status in a private ledger. We never receive or store raw card numbers, CVVs, or bank login credentials.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Security and Abuse Prevention</h2>
            <p>
              Our intake forms generate a keyed cryptographic hash of request IP addresses to prevent automated denial-of-service and submission abuse. Records store this irreversible hash rather than raw IP addresses. Cloudflare Turnstile assists in verifying human interaction without invasive biometric challenges.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Analytics</h2>
            <p>
              Google Analytics runs on public web pages to help us understand aggregate traffic patterns and link utility. Analytics is strictly disabled across authenticated account portals, administration dashboards, and checkout steps. We never transmit form values, customer names, email addresses, or message content to analytics endpoints.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Data Removal Requests</h2>
            <p className="mb-4">
              You may request removal of your early-list subscription or stored inquiry records at any time by contacting our team from the email address used during submission.
            </p>
            <Link
              href="/contact?subject=Privacy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] hover:bg-[#E9E6E0] text-[#191B1D] text-[13px] font-medium transition-colors"
            >
              <span>Contact Us Regarding Privacy</span>
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CONTACT_EMAIL } from "@/lib/company-contact";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "Refunds and Cancellations",
  "Help with KITTY CORP digital project payments, patron memberships, and service cancellations.",
  "/refunds"
);

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
            Policies
          </span>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            Refunds &amp; Cancellations
          </h1>
          <p className="text-[17px] text-[#62676D] font-light">
            Clear guidelines for digital project payments, revisions, and membership accounts.
          </p>
        </div>

        <div className="space-y-10 text-[16px] leading-[1.75] text-[#292D31] font-light">
          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Direct Support Channel</h2>
            <p>
              For all payment, cancellation, or refund questions, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2457D6] underline">{CONTACT_EMAIL}</a> from the email address associated with your order. Please reference your order number or project quote. Never include card details or banking passwords in correspondence.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Commissioned Digital Projects</h2>
            <p>
              Initial consultations and project scopes are free. If you cancel a commissioned project after work has commenced, we review the milestone deliverables completed and committed third-party server costs. Unused funds from milestone advances are refunded promptly in accordance with the signed agreement.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Patron Memberships</h2>
            <p>
              If a patron membership was purchased mistakenly or duplicate charges occurred, contact our team within 14 days of the transaction for a prompt, full refund through our payment processor.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Refund Processing Timeline</h2>
            <p className="mb-4">
              Approved refunds are credited directly back to the original method of payment via Razorpay or Cashfree. Bank clearance typically takes 5 to 7 business days depending on your financial institution.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="/terms" className="text-xs font-mono text-[#2457D6] hover:underline">
                Service Terms
              </Link>
              <span className="text-xs text-[#D9D6CF]">·</span>
              <Link href="/privacy" className="text-xs font-mono text-[#2457D6] hover:underline">
                Privacy Notice
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CONTACT_EMAIL } from "@/lib/company-contact";
import { pageMetadata } from "@/lib/site-metadata";

export const revalidate = 86400;

export const metadata = pageMetadata(
  "KITTY CORP | Refunds & Cancellation Policy",
  "Clear refund and cancellation rules for KITTY CORP project work, subscriptions, digital access, memberships and purchases.",
  "/refunds"
);

const sections = [
  {
    title: "1. How to request a refund or cancellation",
    body: <>Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2457D6] underline">{CONTACT_EMAIL}</a> from the email used for the purchase. Include the order, payment or project reference, date, amount and a short explanation. Never send card numbers, CVVs or banking passwords. We will acknowledge the request and explain the review or next step.</>,
  },
  {
    title: "2. Project work and deposits",
    body: <>Enquiries, planning calls and project briefs are free. Before paid work starts, the quote states the scope and payment milestones. If you cancel before work begins, payments for work not started are refundable. After work has started, we may retain only the reasonable value of work completed and unavoidable third-party costs already committed, as permitted by law and the agreed quote. We will provide an explanation and refund any unused balance. A milestone balance is due only when the agreed milestone is reached.</>,
  },
  {
    title: "3. Digital products, access and memberships",
    body: <>If a digital product or membership has not been activated or access provided, contact us promptly to request cancellation and a refund review. Once digital access or deliverables have been provided, refunds are generally not available for change of mind or use, except where required by law or where the product is materially unavailable, defective, or the purchase was duplicated or unauthorized. Any renewal, cancellation deadline and recurring billing terms are shown before purchase; cancellation stops future renewal where applicable and does not automatically refund a completed billing period.</>,
  },
  {
    title: "4. KITTY ONE and other bundled services",
    body: <>Bundled offers may include website work, software access, updates or maintenance. The accepted offer or checkout defines which components have started or been delivered. If a bundle is cancelled, we assess delivered components and committed costs under the accepted terms and applicable law; any refundable unused portion will be calculated and explained. Maintenance does not include new features, third-party fees or work outside the written scope unless stated.</>,
  },
  {
    title: "5. Buy Us a Coffee / Fuel Us purchases",
    body: <>Fuel Us is a voluntary coffee purchase, not a donation, investment, membership or promise of a product. If you made a duplicate, incorrect or accidental payment, contact us as soon as possible. We review the transaction and can refund mistaken or duplicate payments where appropriate and legally permitted. Because the purchase is immediately completed and has no ongoing service, change-of-mind refunds are not guaranteed.</>,
  },
  {
    title: "6. Failed, duplicate or unauthorized payments",
    body: <>If a payment failed but money was debited, or you see a duplicate or unauthorized charge, send the payment reference and transaction date. We will check provider records and assist with reversal or refund where applicable. Do not share sensitive payment credentials. For an unauthorized payment, also contact your bank or payment provider promptly.</>,
  },
  {
    title: "7. Refund processing",
    body: <>Approved refunds are normally sent through the original payment method. The payment provider and bank control the final crediting time; it may take several business days after the refund is issued. Currency conversion, taxes or provider charges may affect the amount where permitted by law. We will confirm the refund amount and status by email.</>,
  },
  {
    title: "8. Your statutory rights",
    body: <>This policy does not remove or restrict any rights you have under applicable consumer law. If a term here conflicts with a mandatory legal right, that right takes precedence.</>,
  },
];

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">Customer Policy</span>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[family-name:var(--font-display)] font-normal mb-4">Refunds &amp; Cancellation Policy</h1>
          <p className="text-[17px] text-[#62676D] font-light">A clear process for project cancellations, digital purchases, memberships and payment issues.</p>
          <p className="mt-4 text-sm text-[#62676D]">Effective date: 23 November 2026</p>
        </div>
        <div className="space-y-6 text-[16px] leading-[1.75] text-[#292D31] font-light">
          {sections.map((section) => (
            <section key={section.title} className="p-7 sm:p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
              <h2 className="text-xl font-medium text-[#191B1D] mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p className="text-sm text-[#62676D]">Related: <Link href="/terms" className="text-[#2457D6] underline">Terms &amp; Conditions</Link> · <Link href="/privacy" className="text-[#2457D6] underline">Privacy Policy</Link>.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

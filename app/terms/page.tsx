import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";
import { CONTACT_EMAIL } from "@/lib/company-contact";

export const revalidate = 86400;

export const metadata = pageMetadata(
  "KITTY CORP | Terms & Conditions",
  "Terms for using KITTY CORP websites, digital services, software, subscriptions, project engagements, payments and customer responsibilities.",
  "/terms"
);

const sections = [
  {
    title: "1. About KITTY CORP",
    body: <>KITTY CORP is an independent technology venture developing software, AI tools and research projects, and providing digital services. These terms apply to this website and purchases or services offered through it. Contact <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2457D6] underline">{CONTACT_EMAIL}</a> with questions. A separate written agreement or product terms may apply to a specific engagement; where they conflict, the specific agreement governs that engagement.</>,
  },
  {
    title: "2. Website use",
    body: <>Use the website lawfully and do not interfere with its operation, attempt unauthorized access, submit malicious code, abuse forms, impersonate others, or upload content you do not have permission to share. We may restrict access where reasonably necessary to protect the site, users or our systems. Website content is provided for general information and may change as products and projects evolve.</>,
  },
  {
    title: "3. Enquiries, quotes and project agreements",
    body: <>Initial enquiries, project briefs and appointment requests are free and do not commit either party. A request is not a confirmed appointment until we confirm it in writing. Before paid work begins, we will confirm the scope, deliverables, timeline, price and currency, payment schedule, revision limits, handover and any hosting, domain, third-party or recurring charges in a written quote or agreement. We may decline work that is outside our capacity or expertise.</>,
  },
  {
    title: "4. Payments and delivery",
    body: <>Pay only through the payment instructions or checkout associated with your accepted quote or purchase. Payment-provider fees, taxes, currency conversion and bank charges will be disclosed where applicable. Delivery milestones and acceptance criteria are defined in the quote. You are responsible for providing accurate information, timely feedback and lawful materials needed for the work. Delays caused by missing inputs, third-party services or events outside our reasonable control may affect the agreed timeline.</>,
  },
  {
    title: "5. Changes, revisions and intellectual property",
    body: <>Changes outside the agreed scope may require a revised quote and timeline. Unless the agreement says otherwise, bespoke deliverables created specifically for you transfer to you after full payment. Our pre-existing tools, reusable components, know-how, libraries and third-party or open-source materials remain subject to their respective rights and licences. We will identify any material third-party dependencies or usage costs included in your scope.</>,
  },
  {
    title: "6. Products, subscriptions and digital access",
    body: <>Product features, availability, limits, price, access period and renewal or cancellation conditions are shown at the relevant checkout or product page. Access may depend on a compatible device, account, internet connection or third-party service. We do not promise that a product in development will be released on a particular date. Subscription renewal is not assumed; any recurring charge and how to cancel it will be disclosed before purchase.</>,
  },
  {
    title: "7. AI and experimental technology",
    body: <>AI outputs can be inaccurate, incomplete or unsuitable. Review outputs before relying on them, especially for financial, legal, medical, safety-critical or consequential decisions. Research prototypes and demonstrations may be unstable, incomplete or change without notice. They are not a substitute for qualified professional advice or a certified safety system.</>,
  },
  {
    title: "8. Third-party services",
    body: <>Our services may depend on hosting, payment, analytics, AI, communications or other third-party providers. Their services are subject to their own terms and availability. Unless expressly included in your quote, third-party subscriptions, usage charges, domains and hosting are your responsibility.</>,
  },
  {
    title: "9. Refunds, cancellation and liability",
    body: <>The specific Refund &amp; Cancellation Policy at <Link href="/refunds" className="text-[#2457D6] underline">/refunds</Link> forms part of these terms. Nothing here limits rights that cannot legally be excluded. To the extent permitted by law, KITTY CORP is not liable for indirect or consequential losses, loss of profits, data or business arising from use of the website or services. Any liability for a paid engagement is subject to its written agreement and applicable law.</>,
  },
  {
    title: "10. Privacy, updates and governing law",
    body: <>Our <Link href="/privacy" className="text-[#2457D6] underline">Privacy Policy</Link> explains how information is handled. We may update these terms by publishing a revised version with a new effective date; changes do not silently alter an already accepted project agreement. These terms are governed by the laws of India, subject to mandatory consumer protections and the jurisdiction of competent courts.</>,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">Legal</span>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[family-name:var(--font-display)] font-normal mb-4">Terms &amp; Conditions</h1>
          <p className="text-[17px] text-[#62676D] font-light">Clear terms for website use, project work, software, subscriptions and purchases.</p>
          <p className="mt-4 text-sm text-[#62676D]">Effective date: 23 November 2026</p>
        </div>
        <div className="space-y-6 text-[16px] leading-[1.75] text-[#292D31] font-light">
          {sections.map((section) => (
            <section key={section.title} className="p-7 sm:p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
              <h2 className="text-xl font-medium text-[#191B1D] mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p className="text-sm text-[#62676D]">Questions about these terms? Contact <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2457D6] underline">{CONTACT_EMAIL}</a>.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

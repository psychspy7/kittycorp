import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";
import { CONTACT_EMAIL } from "@/lib/company-contact";

export const revalidate = 86400;

export const metadata = pageMetadata(
  "KITTY CORP | Privacy Policy",
  "How KITTY CORP handles information from website visitors, enquiries, accounts, AI features, analytics, payments and product signups.",
  "/privacy"
);

const sections = [
  {
    title: "1. Information we collect",
    body: <>Depending on what you use, we may receive contact details (such as name and email), messages and project briefs, business details, product interests, appointment preferences, account identifiers, order and payment references, and information you choose to provide. Technical information may include browser and device data, pages visited, security signals and provider logs.</>,
  },
  {
    title: "2. Why we use information",
    body: <>We use information to respond to enquiries, assess and deliver projects, arrange appointments, administer accounts and purchases, provide support, send requested product updates, prevent abuse, maintain security, process refunds, and improve our website and products. We do not treat a project or contact enquiry as a marketing subscription.</>,
  },
  {
    title: "3. Forms, project enquiries and email",
    body: <>Website contact and project submissions are stored in our website database (including Supabase services) and routed to our team through email services such as Google. We use the details you submit to respond and manage the request. Temporary form copies may be removed after at least 72 hours once required delivery and reporting steps succeed; project, account, quote and transaction records are handled separately and may be retained for support, delivery, accounting or legal purposes.</>,
  },
  {
    title: "4. Payments",
    body: <>Payment providers such as Razorpay, Cashfree or PayPal may process payment details depending on the checkout. We keep order identifiers, payment references, amount, currency, purpose and verification status for administration; we do not store full card numbers, CVVs or banking passwords. The provider's own privacy terms apply to information it processes. Cashfree checkout may also receive the email or phone number entered there.</>,
  },
  {
    title: "5. Accounts and product access",
    body: <>Where account features are available, sign-in may use Google and Firebase identity services, with account identifiers and verified email connected to the records you choose to access. Product services may maintain separate account, usage and access records. Signing into a website account does not grant access to private administration systems or another product's private data.</>,
  },
  {
    title: "6. AI features and chat",
    body: <>The website chat assistant is provided through Thunderbolt/Spaceship services and may process messages, technical information and conversation history to provide the chat and allow our team to review or respond. Optional project-description analysis may send the description and selected service to KITTY AI; contact fields are not included in that analysis. Do not submit passwords, payment details or sensitive personal information to AI tools. AI output may be inaccurate.</>,
  },
  {
    title: "7. Analytics, cookies and local storage",
    body: <>Google Analytics 4 may operate on public pages to understand aggregate usage. We do not intentionally send names, emails, form contents or project messages to analytics. Analytics is excluded from account, administration, API and checkout areas. Browser storage may remember preferences such as display currency or a one-session announcement. You can manage cookies and storage through your browser.</>,
  },
  {
    title: "8. Security and service providers",
    body: <>We use hosting, database, email, identity, payment, analytics, AI and security providers to operate the site. These providers may process technical information under their own terms. Abuse-prevention systems may use a keyed hash derived from network information rather than storing a raw IP in our form record; hosting providers may still retain operational logs. We apply access controls and reasonable safeguards, but no online system can be guaranteed completely secure.</>,
  },
  {
    title: "9. Retention and your choices",
    body: <>We retain information for as long as reasonably needed for the purpose it was collected, including project delivery, account access, support, refunds, fraud prevention and legal or accounting obligations. You may unsubscribe from product-update emails using the link in the email. To request access, correction or deletion of information, email us from the address associated with your request. Some transaction records may need to be retained; provider backups and logs may follow their own retention schedules.</>,
  },
  {
    title: "10. Children, changes and contact",
    body: <>Our website and commercial services are not directed to children under 13, and we do not knowingly collect their personal information. We may update this policy by publishing a revised effective date. For privacy questions or requests, contact <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2457D6] underline">{CONTACT_EMAIL}</a>.</>,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">Legal &amp; Privacy</span>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[family-name:var(--font-display)] font-normal mb-4">Privacy Policy</h1>
          <p className="text-[17px] text-[#62676D] font-light">What we collect, why we use it, who helps process it, and the choices you have.</p>
          <p className="mt-4 text-sm text-[#62676D]">Effective date: 23 November 2026</p>
        </div>
        <div className="space-y-6 text-[16px] leading-[1.75] text-[#292D31] font-light">
          {sections.map((section) => (
            <section key={section.title} className="p-7 sm:p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
              <h2 className="text-xl font-medium text-[#191B1D] mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p className="text-sm text-[#62676D]">For related service terms, see <Link href="/terms" className="text-[#2457D6] underline">Terms &amp; Conditions</Link> and <Link href="/refunds" className="text-[#2457D6] underline">Refunds &amp; Cancellation Policy</Link>.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

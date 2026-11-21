import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";
import { CONTACT_EMAIL } from "@/lib/company-contact";

export const revalidate = 86400;

export const metadata = pageMetadata(
  "KITTY CORP | Terms of Service",
  "Terms for KITTY CORP website use, Digital Solutions Studio projects, quotes, software delivery, subscriptions, payments and customer responsibilities.",
  "/terms"
);

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
            Terms of Service
          </span>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            Website and Service Terms
          </h1>
          <p className="text-[17px] text-[#62676D] font-light">
            Clear expectations and engineering agreements for digital commissions and memberships.
          </p>
        </div>

        <div className="space-y-10 text-[16px] leading-[1.75] text-[#292D31] font-light">
          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Who We Are</h2>
            <p>
              KITTY CORP is an independent technology enterprise developing physical-world intelligence, autonomous robotics, clean energy systems, and commercial digital solutions. For inquiries, contact <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2457D6] underline">{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Project Requests and Briefs</h2>
            <p>
              Initial consultations, appointment requests, and project briefs are complimentary. A requested schedule is confirmed only upon written acknowledgment from our engineering team. Submitting a brief does not obligate either party to enter into a contract. We reserve the right to decline work outside our technical focus or operational capacity.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Commissioned Digital Solutions</h2>
            <p>
              Each commercial software commission receives a detailed written scope of work, confirmed deliverables, project milestones, pricing, and timeline before payment is initiated. All fees are charged in the currency confirmed at checkout.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Delivery and Intellectual Property</h2>
            <p>
              Deliverables, source code handover, revisions, and launch responsibilities are established in writing. Ownership of bespoke commissioned work transfers to the client upon full payment of the agreed project fees.
            </p>
          </section>

          <section className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
            <h2 className="text-xl font-medium text-[#191B1D] mb-3">Memberships and Patron Access</h2>
            <p className="mb-4">
              KITTY ONE is an annual patron pass designed to support our independent physical AI and robotics research. Membership does not constitute equity, securities, or financial profit-sharing. Physical metallic NFC cards ship with inaugural production batches, while digital laboratory briefings and website privileges activate upon registration.
            </p>
            <Link
              href="/contact?subject=Terms"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] hover:bg-[#E9E6E0] text-[#191B1D] text-[13px] font-medium transition-colors"
            >
              <span>Contact Us Regarding Terms</span>
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

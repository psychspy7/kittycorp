import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { ServicePricing } from "@/components/kitty/service-pricing";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata(
  "KITTY CORP | Studio Pricing",
  "Pricing for KITTY CORP Digital Solutions Studio websites, custom applications, AI automation, integrations, scoped projects and maintenance services."
  "/pricing"
);

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Digital Solutions Studio · Pricing &amp; Packages</span>
          </div>

          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            Fixed scope, transparent pricing, <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">no surprise invoices.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl">
            Our commercial studio develops high-performance web applications and workflow automation for businesses globally. Revenue directly and independently funds our physical robotics laboratory.
          </p>
        </div>

        <ServicePricing />

        <section className="mt-16 p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm" aria-labelledby="pricing-process-heading">
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2457D6] font-medium block mb-3">
              Payment Milestones
            </span>
            <h2 id="pricing-process-heading" className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
              Your brief. Our quote. Your choice.
            </h2>
            <p className="text-[#62676D] font-light text-sm mt-2 max-w-2xl">
              Submit your requirements for free. We confirm deliverables, timeline, and fixed price before any contract is signed or payment is collected.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 list-none p-0">
            <li className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA]">
              <strong className="block text-lg font-medium text-[#191B1D] mb-2">Full Advance</strong>
              <span className="text-sm text-[#62676D] font-light">2.5% discount applied across the agreed total project contract.</span>
            </li>
            <li className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA]">
              <strong className="block text-lg font-medium text-[#191B1D] mb-2">02 · 50% Milestone</strong>
              <span className="text-sm text-[#62676D] font-light">1% discount. The second half is due only upon staging preview approval.</span>
            </li>
            <li className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA]">
              <strong className="block text-lg font-medium text-[#191B1D] mb-2">Consultation First</strong>
              <span className="text-sm text-[#62676D] font-light">Request an appointment to discuss architecture before committing.</span>
            </li>
          </ol>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-[#D9D6CF]">
            <Link
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)]"
              href="/projects"
            >
              Send a project brief
            </Link>
            <Link
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[#191B1D] text-[14px] font-medium transition-colors"
              href="/appointments"
            >
              Request an appointment
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

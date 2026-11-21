import Link from "next/link";
import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Memberships } from "@/components/kitty/memberships";
import { membershipCatalog } from "@/lib/membership-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import "./memberships.css";

export const runtime = "nodejs";
export const revalidate = 3600;

export const metadata = pageMetadata(
  "KITTY ONE | Research Support Membership",
  "KITTY ONE is a voluntary annual supporter membership for KITTY CORP research, with briefings, updates and benefits. It is not equity or an investment." ,
  "/memberships"
);

export default async function MembershipsPage() {
  const catalogue = await membershipCatalog();
  let security = true;
  try {
    security = (await turnstilePublicConfig()).enabled;
  } catch {}

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="pt-24 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-8 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Patron Network · Single Annual Membership</span>
          </div>

          <h1 className="text-[clamp(30px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            KITTY ONE Membership
          </h1>

          <p className="text-[19px] sm:text-[22px] font-light leading-[1.45] text-[#62676D] max-w-2xl">
            A single, all-inclusive annual membership supporting independent physical-world intelligence, agricultural robotics, and clean energy systems.
          </p>
        </div>

        <Memberships catalog={catalogue} securityEnabled={security} />

        {/* Detailed Disclosures Section */}
        <section className="mt-16 p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7]">
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            Membership Terms &amp; Non-Equity Disclosures
          </h2>
          
          <div className="space-y-4 text-sm text-[#62676D] font-light leading-relaxed">
            <p>
              <strong className="text-[#191B1D] font-medium">Inclusions:</strong> KITTY ONE ($249 USD / year) includes: (1) Laser-etched metallic NFC card (delivered upon inaugural batch fabrication), (2) Early digital access to confidential research whitepapers and kinematics simulation datasets, (3) Private quarterly written engineering briefings from founder Virat Anand, (4) Priority allocations for future experimental hardware releases, and (5) One complimentary custom business website designed and built by our commercial Digital Solutions Studio (valued at $1,500+).
            </p>
            <p>
              <strong className="text-[#191B1D] font-medium">Strict Non-Equity Exclusions:</strong> KITTY ONE is a patron membership and scientific contribution. It does NOT constitute an investment contract, equity shares, debt security, or ownership interest in KITTY CORP or any affiliated entity. It confers zero dividend entitlements, profit participation, or corporate voting rights.
            </p>
            <p>
              <strong className="text-[#191B1D] font-medium">Commercial Services:</strong> Larger custom software contracts, enterprise mobile apps, and ongoing AI agent infrastructure are scoped and contracted independently via our{" "}
              <a
                href="https://demo.thekittycorp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2457D6] underline font-medium"
              >
                Digital Solutions Studio ↗
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-8 mt-8 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
            <Link href="/projects" className="hover:text-[#2457D6] transition-colors">
              Technology Projects →
            </Link>
            <Link href="/research" className="hover:text-[#2457D6] transition-colors">
              Research Whitepapers →
            </Link>
            <Link href="/support" className="hover:text-[#2457D6] transition-colors">
              Voluntary Research Support →
            </Link>
            <Link href="/contact" className="hover:text-[#2457D6] transition-colors">
              Contact &amp; Inquiries →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

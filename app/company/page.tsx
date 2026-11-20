import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ShieldCheck, Cpu, Leaf, Globe } from "lucide-react";
import { SiteHeader, FilmButton } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CompanyIntro, WhyKitty, TeamProfiles } from "@/components/kitty/home-sections";
import { companySettings, companyTeam } from "@/lib/company-server";
import { sitePageContent } from "@/lib/site-pages-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await sitePageContent("company");
  return pageMetadata(copy.seoTitle || "The Company • KITTY CORP", copy.seoDescription || "About KITTY CORP, our philosophy and the team building physical-world intelligence.", "/company");
}

export default async function CompanyPage() {
  const [members, settings, copy] = await Promise.all([
    companyTeam(),
    companySettings(),
    sitePageContent("company"),
  ]);

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Page Heading */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">03 · Corporate Profile &amp; Mission</span>
          </div>

          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            Building technology <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">for a world that needs more.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl mb-8">
            KITTY CORP is an emerging technology company founded in India with a global outlook. We believe intelligence must leave the confines of glass screens and step directly into the physical world where food is grown, power is balanced, and systems interact with living environments.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)]"
            >
              <span>Explore Research Areas</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            <FilmButton className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[#191B1D] text-[14px] font-medium transition-colors" />
          </div>
        </div>

        {/* Core Principles Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                Physical Over Synthetic
              </h3>
              <p className="text-[#62676D] leading-relaxed font-light text-[15px]">
                We avoid synthetic software gimmicks. Our focus is developing machines, algorithms, and sensory systems that solve concrete physical challenges in agriculture, energy, and robotics.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                India to the World
              </h3>
              <p className="text-[#62676D] leading-relaxed font-light text-[15px]">
                India offers one of the world&apos;s most demanding testing grounds — complex agricultural topographies, monsoon variables, and rapid energy transitions. What is proven here works anywhere.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                Independent Stewardship
              </h3>
              <p className="text-[#62676D] leading-relaxed font-light text-[15px]">
                By generating recurring commercial revenue through our Digital Solutions Studio, we maintain sovereign control over our long-term scientific roadmap and deep-tech prototypes.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
              Leadership &amp; Engineers
            </span>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
              The people building KITTY CORP.
            </h2>
          </div>

          <TeamProfiles members={members} />
        </section>

        {/* How We Started & Story */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
            Our Origin
          </span>
          <h3 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            How we started.
          </h3>
          <p className="text-[#62676D] text-[16px] leading-[1.75] font-light max-w-3xl mb-8">
            {settings.team_body ||
              "KITTY CORP was founded by Virat Anand alongside co-founders Sarthak and Aman. What started as an ambitious ambition to bring intelligent computing into physical machines has grown into active initiatives across agricultural robotics, solar telemetry, and high-performance commercial software."}
          </p>

          <Link
            href="/investors"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2457D6] hover:underline transition-colors"
          >
            <span>Learn about our capital strategy &amp; partnerships</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}

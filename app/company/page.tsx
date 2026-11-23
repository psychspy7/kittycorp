import type { Metadata } from "next";
import { pageMetadata, jsonLd } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ShieldCheck, Cpu, Globe } from "lucide-react";
import { SiteHeader, FilmButton } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { TeamProfiles } from "@/components/kitty/home-sections";
import { companySettings, companyTeam } from "@/lib/company-server";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "KITTY CORP | Company & Mission",
    "KITTY CORP is an Indian technology company building Physical-World Intelligence through AI robotics, AgriYaan, UrjaYaan and its Digital Solutions Studio.",
    "/company"
  );
}

export default async function CompanyPage() {
  const [members, settings] = await Promise.all([
    companyTeam(),
    companySettings(),
  ]);

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Page Heading */}
        <div className="max-w-4xl mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
            Corporate Profile &amp; Mission
          </span>

          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            Building technology <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">for a world that needs more.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl mb-8">
            KITTY CORP is an emerging technology company founded in India with a global outlook. We believe intelligence must extend beyond screens into the physical world where food is grown, power is balanced, and systems interact with living environments.
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
                Physical Engineering
              </h3>
              <p className="text-[#62676D] leading-relaxed font-light text-[15px]">
                We focus on practical engineering. Our work centers on machines, algorithms, and sensory systems that solve concrete physical challenges in agriculture, clean energy, and robotics.
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
                India offers one of the world&apos;s most demanding testing grounds, with complex agricultural topographies, monsoon variables, and rapid energy transitions. What is proven here works anywhere.
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
                By generating commercial revenue through our Digital Solutions Studio, we maintain direct stewardship over our long-term scientific roadmap and hardware prototypes.
              </p>
            </div>
          </div>
        </section>


        <section className="mb-16 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] p-8 sm:p-10" aria-labelledby="company-faq-heading">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is KITTY CORP?", acceptedAnswer: { "@type": "Answer", text: "KITTY CORP is an India-founded technology company developing Physical-World Intelligence through AI robotics, agricultural systems, clean-energy intelligence and commercial digital engineering." } },
              { "@type": "Question", name: "What is KITTY AgriYaan?", acceptedAnswer: { "@type": "Answer", text: "KITTY AgriYaan is an agricultural autonomous rover initiative exploring crop monitoring, field sensing, terrain mobility and edge computer vision. Its current stage is simulation and kinematics." } },
              { "@type": "Question", name: "What is KITTY UrjaYaan?", acceptedAnswer: { "@type": "Answer", text: "KITTY UrjaYaan is a clean-energy intelligence initiative focused on solar monitoring, energy optimisation and predictive telemetry. Its current work includes algorithmic modelling." } },
              { "@type": "Question", name: "How does KITTY CORP generate revenue?", acceptedAnswer: { "@type": "Answer", text: "KITTY CORP generates commercial revenue through its Digital Solutions Studio, which delivers websites, applications, custom software, AI workflows and integrations for clients." } }
            ]
          }) }} />
          <h2 id="company-faq-heading" className="text-2xl font-[family-name:var(--font-display)] mb-6">KITTY CORP — common questions</h2>
          <div className="space-y-5">
            <article><h3 className="font-medium text-[#191B1D] mb-2">What is KITTY CORP?</h3><p className="text-[#62676D] leading-relaxed font-light">KITTY CORP is an India-founded technology company developing Physical-World Intelligence through AI robotics, agricultural systems, clean-energy intelligence and commercial digital engineering.</p></article>
            <article><h3 className="font-medium text-[#191B1D] mb-2">What is KITTY AgriYaan?</h3><p className="text-[#62676D] leading-relaxed font-light">KITTY AgriYaan is an agricultural autonomous rover initiative exploring crop monitoring, field sensing, terrain mobility and edge computer vision. Its current stage is simulation and kinematics.</p></article>
            <article><h3 className="font-medium text-[#191B1D] mb-2">What is KITTY UrjaYaan?</h3><p className="text-[#62676D] leading-relaxed font-light">KITTY UrjaYaan is a clean-energy intelligence initiative focused on solar monitoring, energy optimisation and predictive telemetry. Its current work includes algorithmic modelling.</p></article>
            <article><h3 className="font-medium text-[#191B1D] mb-2">How does KITTY CORP generate revenue?</h3><p className="text-[#62676D] leading-relaxed font-light">KITTY CORP generates commercial revenue through its Digital Solutions Studio, which delivers websites, applications, custom software, AI workflows and integrations for clients.</p></article>
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
              "KITTY CORP was founded as a startup on 26 January 2026 by Virat Anand alongside co-founders Sarthak and Aman. Following its founding, the team began researching and building toward its vision of bringing intelligent computing into the physical world, with initiatives across agricultural robotics, solar telemetry, and high-performance commercial software."}
          </p>
          <p className="text-[#62676D] text-[16px] leading-[1.75] font-light max-w-3xl mb-8">
            KITTY CORP was founded on 26 January 2026.
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

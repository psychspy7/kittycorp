import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Shield, Layers, TrendingUp, Cpu } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { companyProducts, companyTeam } from "@/lib/company-server";
import { publishedLaunches } from "@/lib/launches-server";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "KITTY CORP | Partnerships & Research",
  "KITTY CORP develops Physical-World Intelligence through AI robotics, AgriYaan, UrjaYaan and a commercial Digital Solutions Studio based in India.",
  "/investors"
);

export default async function Investors() {
  const [products, team, launches] = await Promise.all([
    companyProducts(),
    companyTeam(),
    publishedLaunches().catch(() => []),
  ]);
  const founders = team.filter((p) => ["Founder & CEO", "Co-Founder"].includes(p.role));

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Page Heading */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Institutional Briefing</span>
          </div>

          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            Building deep technology <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">with long-term perspective.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl">
            KITTY CORP is an independent technology company founded in India with a global engineering outlook.
            {founders.length > 0 &&
              ` Founded by ${founders.map((p) => `${p.name} (${p.role})`).join(" and ")}.`}
          </p>
        </div>

        {/* Dual Engine Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Engine 01: Digital Solutions Studio */}
          <div className="p-8 sm:p-10 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">DIVISION 01</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-300 text-emerald-800 bg-emerald-50">
                  Cash-Flow Positive
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
                Digital Solutions Studio
              </h2>
              <p className="text-[#62676D] font-light leading-relaxed text-[15px] mb-6">
                Our commercial software studio delivers custom web platforms, cloud architecture, and business automation systems for global clients. This division generates recurring cash flow that independently finances our robotics engineering laboratory.
              </p>
            </div>
            <a
              href="https://demo.thekittycorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2457D6] hover:underline"
            >
              <span>Explore Commercial Studio Platform</span>
              <ArrowUpRight size={15} />
            </a>
          </div>

          {/* Engine 02: Physical-World Intelligence */}
          <div className="p-8 sm:p-10 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">DIVISION 02</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                  Fundamental Research
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
                Physical-World Intelligence
              </h2>
              <p className="text-[#62676D] font-light leading-relaxed text-[15px] mb-6">
                Pursuing long-term breakthroughs in agricultural robotics (AgriYaan) and clean energy telemetry (UrjaYaan). We maintain intellectual honesty: research prototypes are carefully benchmarked before committing to large-scale fabrication.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2457D6] hover:underline"
            >
              <span>Review Research Initiatives</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Capital Philosophy */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
            Capital Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            Honest stage, disciplined allocation.
          </h2>
          <div className="space-y-4 text-[#62676D] font-light leading-relaxed text-[16px] max-w-3xl mb-8">
            <p>
              We are an early-stage company building durable technology. Rather than seeking vanity valuation rounds that dilute focus before mechanical prototypes are validated, we prioritize capital discipline.
            </p>
            <p>
              We welcome dialogue with long-term institutional partners, university research incubators, agricultural consortiums, and strategic angels who understand that physical-world intelligence requires patient, disciplined engineering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#D9D6CF]">
            <Link
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)]"
              href="/contact?subject=Partnership"
            >
              <span>Start an Institutional Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/company"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[#191B1D] text-[14px] font-medium transition-colors"
            >
              <span>Learn About the Team</span>
            </Link>
          </div>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}

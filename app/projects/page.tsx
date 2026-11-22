import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "KITTY CORP | Robotics & Intelligence Projects",
  "Explore KITTY CORP initiatives in agricultural robotics, clean-energy systems and physical-world engineering.",
  "/projects"
);

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Page Header */}
        <div className="max-w-4xl mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
            Initiatives and Engineering
          </span>
          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            Engineering intelligence <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">for physical environments.</span>
          </h1>
          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl">
            We are pursuing systems that operate in real physical conditions, from agricultural fields to decentralized clean-energy infrastructure.
          </p>
        </div>

        {/* Primary Initiatives Showcase: 4 Core Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          
          {/* Initiative: AgriYaan */}
          <article className="rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">PRECISION AGRICULTURE</span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                  Stage: Simulation &amp; Kinematics
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-normal text-[#191B1D] mb-2">
                KITTY AgriYaan
              </h2>
              <p className="text-sm font-medium text-[#292D31] mb-4">Autonomous Field Rover &amp; Soil Diagnostics</p>
              <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                An autonomous rover platform engineered to navigate harsh agricultural topographies. Integrates multi-spectral cameras to detect crop stress, soil density probes for precision fertilization, and low-power edge computer vision algorithms.
              </p>
            </div>

            <div className="relative h-72 w-full overflow-hidden bg-[#E9E6E0]">
              <Image
                src="/photography/agriyaan-field-robot.webp"
                alt="KITTY AgriYaan autonomous rover chassis"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="p-6 border-t border-[#D9D6CF] bg-[#F5F2EA] flex items-center justify-between text-xs text-[#62676D]">
              <span className="font-mono">DOMAIN: PRECISION AGRICULTURE</span>
              <Link href="/agriyaan" className="text-[#2457D6] font-medium flex items-center gap-1 hover:translate-x-0.5 transition-transform">
                Read AgriYaan Initiative <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

          {/* Initiative: UrjaYaan */}
          <article className="rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">CLEAN ENERGY</span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                  Stage: Algorithmic Modeling
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-normal text-[#191B1D] mb-2">
                KITTY UrjaYaan
              </h2>
              <p className="text-sm font-medium text-[#292D31] mb-4">Clean Energy Management &amp; Solar Optimization</p>
              <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                Predictive telemetry software designed to monitor solar photovoltaic degradation, optimize battery charge/discharge cycles in extreme temperatures, and dynamically balance decentralized microgrids for community energy resilience.
              </p>
            </div>

            <div className="relative h-72 w-full overflow-hidden bg-[#E9E6E0]">
              <Image
                src="/photography/thermal-solar-inspection.webp"
                alt="Thermal solar inspection drone over utility photovoltaic array"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="p-6 border-t border-[#D9D6CF] bg-[#F5F2EA] flex items-center justify-between text-xs text-[#62676D]">
              <span className="font-mono">DOMAIN: CLEAN ENERGY SYSTEMS</span>
              <Link href="/urjayaan" className="text-[#2457D6] font-medium flex items-center gap-1 hover:translate-x-0.5 transition-transform">
                Read UrjaYaan Initiative <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

        </div>

        <section className="mb-20 p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">Commercial Digital Solutions</span>
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">A separate studio for business software.</h2>
            <p className="text-[#62676D] text-[15px] sm:text-[16px] leading-relaxed font-light mb-7">Our commercial digital solutions work has its own website. Visit the demo to explore services, examples and business enquiries.</p>
            <a href="https://demo.thekittycorp.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)]">Visit Digital Solutions Studio <ArrowUpRight size={16}/></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

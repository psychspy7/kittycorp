import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Compass } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "KITTY CORP | Robotics & Intelligence Projects",
  "Explore KITTY CORP initiatives in agricultural robotics, clean-energy systems, foundational AI and physical companion machines.",
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
            We are pursuing systems that operate in real physical conditions, from agricultural fields to decentralized clean-energy infrastructure and tactile companion robotics.
          </p>
        </div>

        {/* =========================================================================
            SECTION 1: PHYSICAL FIELD INITIATIVES (AgriYaan & UrjaYaan)
            ========================================================================= */}
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#73777C] font-semibold block mb-2">
            FIELD ROBOTICS &amp; ENERGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
            Autonomous Field Systems
          </h2>
        </div>

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

        {/* =========================================================================
            SECTION 2: CORE PLATFORMS (KITTY AI & KITTY BUDDY)
            Synchronized with Homepage Architectural Layouts
            ========================================================================= */}
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-semibold block mb-2">
            FOUNDATIONAL PLATFORMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
            Intelligence and Physical Interaction
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          
          {/* Platform 1: KITTY AI */}
          <div className="dark-section relative overflow-hidden rounded-3xl min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-8 sm:p-12 border border-[#292D31]/40 bg-[#0A0D12] shadow-lg group">
            {/* Background Neural Network Imagery */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="/photography/kitty-ai-neural-core.webp"
                alt="KITTY AI neural network architecture visualization"
                fill
                className="object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/80 to-[#0A0D12]/40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="font-mono text-xs text-[#D1D5DB] uppercase tracking-widest">ARCHITECTURE</span>
                <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full border border-white/20 text-[#E2E5E8] bg-white/10 backdrop-blur-sm">
                  Active Development
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#60A5FA] mb-6 border border-white/15">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-normal font-[family-name:var(--font-display)] text-white mb-2">
                KITTY AI
              </h3>
              <p className="text-sm font-medium text-[#E2E5E8] mb-3">Vision-language foundation for embodied autonomy</p>
              <p className="text-[#F3F4F6] font-normal leading-relaxed text-[15px] sm:text-[16px] max-w-lg">
                Our embedded neural software stack bridges multi-sensor spatial computer vision directly with real-time robotic actuator controllers, providing physical machines with offline edge inference, context-aware navigation and obstacle avoidance.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-8 border-t border-white/15 text-xs font-mono text-[#D1D5DB] flex items-center justify-between">
              <span>STAGE: EMBEDDED REAL-TIME INFERENCE</span>
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
            </div>
          </div>

          {/* Platform 2: KITTY BUDDY */}
          <div className="relative overflow-hidden rounded-3xl min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-8 sm:p-12 border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm group">
            {/* Background Companion Robot Imagery */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="/photography/kitty-buddy-companion.webp"
                alt="KITTY BUDDY physical desktop companion robot prototype with Kitty branding"
                fill
                className="object-cover object-[80%_center] opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FBFAF7] via-[#FBFAF7]/95 via-50% to-transparent/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FBFAF7] via-transparent to-transparent opacity-50" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="font-mono text-xs text-[#374151] uppercase tracking-widest">INTERACTION PROTOTYPE</span>
                <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full border border-[#D9D6CF] text-[#191B1D] bg-[#F5F2EA]/90 backdrop-blur-sm">
                  Concept Exploration
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6 border border-[#D9D6CF]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-2">
                KITTY Buddy
              </h3>
              <p className="text-sm font-medium text-[#191B1D] mb-3">Physical human-machine companion</p>
              <p className="text-[#191B1D] font-normal leading-relaxed text-[15px] sm:text-[16px] max-w-lg mb-6">
                An exploration into tactile collaboration, testing non-intrusive companion devices that facilitate natural physical interaction without invasive biometric surveillance or screen fatigue.
              </p>
              <Link
                href="/buddy"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#2457D6] hover:text-[#1D46B0] transition-colors"
              >
                <span>Explore KITTY Buddy Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative z-10 pt-6 mt-8 border-t border-[#D9D6CF] text-xs font-mono text-[#374151] flex items-center justify-between">
              <span>STAGE: CONCEPT EXPLORATION</span>
              <span className="w-2 h-2 rounded-full bg-[#2457D6]" />
            </div>
          </div>

        </div>

        {/* Commercial Studio Callout */}
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

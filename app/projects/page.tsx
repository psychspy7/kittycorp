import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Compass } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { ProjectEnquiry } from "@/components/kitty/project-enquiry";
import { pageMetadata } from "@/lib/site-metadata";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "KITTY CORP | Robotics & Intelligence Projects",
  "Explore KITTY CORP research in agricultural robotics, UrjaYaan clean-energy intelligence, KITTY AI perception and control, and physical AI concepts.",
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
            We are pursuing systems that operate in real physical conditions, from agricultural soil and decentralized power grids to companion robotics and commercial software platforms that independently fund our laboratory.
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

          {/* Initiative: KITTY AI */}
          <article className="rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">EMBEDDED INTELLIGENCE</span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                  Stage: Active Development
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-normal text-[#191B1D] mb-2">
                KITTY AI
              </h2>
              <p className="text-sm font-medium text-[#292D31] mb-4">Vision-Actuator Neural Controller Stack</p>
              <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                Our proprietary software stack bridging multi-sensor spatial computer vision directly with real-time robotic actuator controllers, providing physical machines with offline edge inference and context-aware navigation.
              </p>
            </div>

            <div className="relative h-72 w-full overflow-hidden bg-[#0A0D12]">
              <Image
                src="/photography/kitty-ai-neural-core.webp"
                alt="KITTY AI neural network architecture visualization"
                fill
                className="object-cover object-center opacity-85"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="p-6 border-t border-[#D9D6CF] bg-[#F5F2EA] flex items-center justify-between text-xs text-[#62676D]">
              <span className="font-mono">STACK: EMBEDDED EDGE INFERENCE</span>
              <Link href="/research" className="text-[#2457D6] font-medium flex items-center gap-1 hover:translate-x-0.5 transition-transform">
                Read Research Directions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

          {/* Initiative: KITTY Buddy */}
          <article className="rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">HUMAN-MACHINE COLLABORATION</span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                  Stage: Concept Exploration
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-normal text-[#191B1D] mb-2">
                KITTY Buddy
              </h2>
              <p className="text-sm font-medium text-[#292D31] mb-4">Physical Desktop Companion Robot</p>
              <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                An exploration into physical collaboration, testing non-intrusive companion devices that facilitate natural interaction through micro-gestures and physical articulation without surveillance or screen fatigue.
              </p>
            </div>

            <div className="relative h-72 w-full overflow-hidden bg-[#E9E6E0]">
              <Image
                src="/photography/kitty-buddy-companion.webp"
                alt="KITTY Buddy physical desktop companion robot prototype"
                fill
                className="object-cover object-[80%_center]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="p-6 border-t border-[#D9D6CF] bg-[#F5F2EA] flex items-center justify-between text-xs text-[#62676D]">
              <span className="font-mono">DOMAIN: TACTILE INTERACTION</span>
              <Link href="/buddy" className="text-[#2457D6] font-medium flex items-center gap-1 hover:translate-x-0.5 transition-transform">
                Read Buddy Concept <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

        </div>

        {/* Commercial Operations & Client Software Studio */}
        <section className="mb-20 p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12 pb-10 border-b border-[#D9D6CF]">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Commercial Engineering Arm
              </span>
              <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
                Digital Solutions Studio
              </h2>
              <p className="text-[#62676D] text-[15px] sm:text-[16px] leading-relaxed font-light">
                To independently fund our hardware research without premature dilutive capital, KITTY CORP operates a commercial digital studio building bespoke web applications, automated workflows, and digital products for businesses globally.
              </p>
            </div>
            <a
              href="https://demo.thekittycorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)]"
            >
              <span>Explore Studio Demos</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </a>
          </div>

          {/* Project Enquiry Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h3 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
                Commission a digital build.
              </h3>
              <p className="text-[#62676D] font-light text-sm leading-relaxed mb-6">
                Tell us about your organization and the digital product, customer web application, or automated workflow you require. We confirm deliverables, price, and timeline before work begins.
              </p>
              <div className="space-y-3 text-xs text-[#73777C] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
                  <span>Fixed-scope agreements &amp; milestone reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
                  <span>Direct founder &amp; engineering communication</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
                  <span>Revenue directly funds physical robotics research</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#F5F2EA] p-6 sm:p-8 rounded-2xl border border-[#D9D6CF]">
              <ProjectEnquiry />
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}

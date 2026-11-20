import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Leaf, Sun, Compass } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { ProjectEnquiry } from "@/components/kitty/project-enquiry";
import { pageMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "Initiatives & Projects • Physical-World Intelligence",
  "Explore KITTY CORP's initiatives: AgriYaan agricultural robotics, Urjaan clean energy optimization, Kitty AI embedded stack, and commercial software operations.",
  "/projects"
);

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Page Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">02 · Initiatives &amp; Engineering</span>
          </div>
          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            Engineering intelligence <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">for physical environments.</span>
          </h1>
          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl">
            We are pursuing systems that operate in real physical conditions — from agricultural soil and decentralized power grids to commercial software platforms that independently fund our laboratory.
          </p>
        </div>

        {/* Primary Initiatives Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          
          {/* Initiative 01: AgriYaan */}
          <article className="rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">INITIATIVE 01</span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                  Simulation &amp; Kinematics
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
                className="object-cover object-center cinematic-fade-edges"
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

          {/* Initiative 02: Urjaan */}
          <article className="rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">INITIATIVE 02</span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                  Algorithmic Telemetry
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-normal text-[#191B1D] mb-2">
                KITTY Urjaan
              </h2>
              <p className="text-sm font-medium text-[#292D31] mb-4">Clean Energy Management &amp; Solar Optimization</p>
              <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                Predictive telemetry software designed to monitor solar photovoltaic degradation, optimize battery charge/discharge cycles in extreme temperatures, and dynamically balance decentralized microgrids for community energy resilience.
              </p>
            </div>

            <div className="relative h-72 w-full overflow-hidden bg-[#E9E6E0]">
              <Image
                src="/photography/clean-energy-systems.webp"
                alt="Solar energy arrays and renewable microgrid telemetry"
                fill
                className="object-cover object-center cinematic-fade-edges"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="p-6 border-t border-[#D9D6CF] bg-[#F5F2EA] flex items-center justify-between text-xs text-[#62676D]">
              <span className="font-mono">DOMAIN: CLEAN ENERGY SYSTEMS</span>
              <Link href="/urjaan" className="text-[#2457D6] font-medium flex items-center gap-1 hover:translate-x-0.5 transition-transform">
                Read Urjaan Initiative <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        </div>

        {/* Secondary Technology Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">INTELLIGENCE PLATFORM</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">Active Bench Architecture</span>
            </div>
            <h3 className="text-2xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-2">KITTY AI</h3>
            <p className="text-[#62676D] text-sm leading-relaxed font-light mb-4">
              Our core software stack connecting spatial perception neural networks directly with real-time robotic actuator controllers, enabling robotic hardware to safely interpret unstructured physical obstacles.
            </p>
            <span className="text-xs font-mono text-[#2457D6]">CORE STACK · VISION-ACTUATOR CONTROL</span>
          </div>

          <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">INTERACTION PROTOTYPE</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">Concept Stage</span>
            </div>
            <h3 className="text-2xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-2">KITTY Buddy</h3>
            <p className="text-[#62676D] text-sm leading-relaxed font-light mb-4">
              An exploration into tactile human-machine collaboration. Investigating non-intrusive companion devices that give physical form to intelligent interfaces, prioritizing privacy and tactile feedback.
            </p>
            <span className="text-xs font-mono text-[#2457D6]">EXPLORATION · TACTILE INTERACTION</span>
          </div>
        </div>

        {/* Commercial Operations & Client Software Studio */}
        <section className="mb-20 p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12 pb-10 border-b border-[#D9D6CF]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] text-[11px] font-mono tracking-wider text-[#62676D] uppercase mb-4">
                <span>Self-Sustaining Commercial Operations</span>
              </div>
              <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
                Digital Solutions Studio
              </h2>
              <p className="text-[#62676D] text-[15px] sm:text-[16px] leading-relaxed font-light">
                To independently fund our hardware research without premature dilutive capital, KITTY CORP operates an elite digital studio building bespoke web applications, automated workflows, and digital products for businesses globally.
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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sun, Zap, BatteryCharging, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "KITTY Urjaan • AI-Driven Clean Energy & Solar Optimization",
  "KITTY Urjaan develops predictive software telemetry and machine learning models to monitor solar photovoltaic degradation, optimize battery lifecycle health, and balance decentralized clean energy microgrids.",
  "/urjaan"
);

export default function UrjaanPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />

      <main id="main">
        {/* =========================================================================
            HERO: KITTY URJAAN — FULL-BLEED PHOTOGRAPHIC BACKGROUND INTEGRATION
            ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-[#FBFAF7] min-h-[640px] lg:min-h-[740px] flex items-center pt-32 pb-24 px-6 sm:px-10 lg:px-16 border-b border-[#D9D6CF]">
          {/* Edge-to-Edge Background Photographic Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/photography/thermal-solar-inspection.webp"
              alt="Thermal inspection drone over utility-scale solar photovoltaic array with thermal telemetry"
              fill
              priority
              className="object-cover object-[25%_center] lg:object-[28%_center] opacity-90 lg:opacity-95"
              sizes="100vw"
            />
            {/* Seamless horizontal gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#FBFAF7] via-[#FBFAF7]/95 via-45% to-transparent/15" />
            {/* Seamless top and bottom vertical gradient fades */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBFAF7] via-transparent via-15% to-[#FBFAF7]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA]/90 backdrop-blur-sm text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-8 max-w-[94vw]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
                <span className="truncate">Flagship Initiative 02 · Clean Energy &amp; Storage</span>
              </div>

              <h1 className="text-[clamp(36px,7.5vw,78px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
                KITTY Urjaan
              </h1>

              <p className="text-[20px] sm:text-[24px] font-light leading-[1.4] text-[#292D31] mb-8 max-w-2xl">
                Predictive intelligence for photovoltaic asset health, battery longevity, and resilient microgrids.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#73777C] pb-4">
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] text-[#191B1D] font-medium">
                  STATUS: ALGORITHMIC MODELING &amp; TELEMETRY
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] text-[#191B1D] font-medium">
                  DOMAIN: SOLAR PV &amp; BESS LIFECYCLE
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] text-[#2457D6] font-medium">
                  GOAL: REAL-WORLD ENERGY INDEPENDENCE
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-8 left-10 z-10 font-mono text-[11px] text-[#191B1D] bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
            Photovoltaic Thermal Telemetry · Inverter Degradation Forecasting
          </div>
        </section>

        {/* =========================================================================
            SECTION 01: THE CLEAN ENERGY BOTTLENECK
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] text-[11px] font-mono tracking-widest text-[#62676D] uppercase mb-6">
              <span>01 · Context &amp; Purpose</span>
            </div>

            <h2 className="text-[clamp(28px,3.8vw,46px)] font-[family-name:var(--font-display)] font-normal leading-[1.15] text-[#191B1D] mb-8">
              Hardware deployment without intelligence is incomplete.
            </h2>

            <div className="space-y-6 text-[17px] sm:text-[19px] leading-[1.8] text-[#292D31] font-light">
              <p>
                Solar panels and lithium battery packs are installed at unprecedented global scale. However, physical real-world environments rapidly compromise their theoretical efficiency. In tropical and semi-arid climates like India, ambient dust accumulation, localized thermal hotspots, and PID (potential-induced degradation) can silently reduce solar farm output by 20% to 30% before operators even detect an anomaly.
              </p>
              <p>
                Simultaneously, stationary battery energy storage systems (BESS) are subjected to violent, uncontrolled charge-discharge fluctuations driven by volatile grid demands, cutting operational cell lifetimes in half and causing substantial economic loss.
              </p>
              <p>
                KITTY Urjaan develops real-time algorithmic telemetry that treats solar arrays and battery banks not as static metal and glass, but as dynamic living energy systems whose physical state must be forecasted continuously.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: CORE ARCHITECTURAL PILLARS
            ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                02 · Technological Solutions
              </span>
              <h2 className="text-[clamp(30px,4vw,48px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
                Data-driven models for physical power systems.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Sub-String PV Degradation Telemetry
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Continuous voltage-current curve monitoring analyzes micro-fluctuations to identify micro-cracks, bypass diode failures, and dust occlusion patterns across large solar arrays without manual thermal drone flights.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  MONITORING · SUB-STRING ACCURACY
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Electrochemical Cell Lifecycle Extension
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Dynamic state-of-health (SoH) algorithms adaptively throttle C-rates during high-temperature cycles, smoothing peak stress periods and extending stationary battery lifespan by an estimated 25%.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  STORAGE · ELECTROCHEMICAL HEALTH
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Decentralized Microgrid Balancing
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Predictive load-demand models forecast local agricultural and community electricity usage against real-time solar generation, autonomously balancing localized energy self-sufficiency.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  DISPATCH · AUTONOMOUS MICROGRIDS
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 03: CURRENT STAGE & TRANSPARENCY
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#F5F2EA]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[11px] font-mono tracking-wider text-[#62676D] uppercase mb-5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2457D6]" />
                <span>Development Horizon &amp; Benchmarks</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
                Current Urjaan research status.
              </h2>

              <p className="text-[16px] leading-[1.75] text-[#292D31] font-light mb-6">
                KITTY Urjaan is actively modeling synthetic irradiance curves and historical string inverter datasets. We are preparing embedded hardware interface units for pilot testing on distributed solar rooftops.
              </p>

              <div className="space-y-3 font-mono text-xs text-[#62676D] border-t border-[#D9D6CF] pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#2457D6] shrink-0" />
                  <span>Phase 1 Completed: Photovoltaic thermal drift neural forecasting models trained on open satellite irradiance data.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full border-2 border-[#2457D6] shrink-0" />
                  <span className="text-[#191B1D] font-medium">Phase 2 Active: Hardware gateway protocol mapping for MODBUS/RS485 inverter telemetry capture.</span>
                </div>
                <div className="flex items-center gap-3 text-[#73777C]">
                  <span className="w-4 h-4 rounded-full border border-[#D9D6CF] shrink-0" />
                  <span>Phase 3 Scheduled: Field pilot deployment on rooftop commercial solar arrays in North India.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 04: COLLABORATION
            ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[clamp(28px,3.8vw,46px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-5">
              Build resilient clean energy with us.
            </h2>
            <p className="text-[16px] sm:text-[18px] leading-[1.65] text-[#62676D] font-light max-w-2xl mx-auto mb-10">
              We seek pilot solar plant operators, microgrid pioneers, battery research scientists, and hardware engineers aligned with decentralized power generation.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-colors shadow-sm"
              >
                <span>Inquire About Solar Pilots</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[#191B1D] text-[14px] font-medium transition-colors"
              >
                <span>View All Technology Projects</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}

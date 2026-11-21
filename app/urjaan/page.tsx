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
            HERO: KITTY URJAAN: PHOTOGRAPHIC INTEGRATION & MOBILE-FIRST STACKING
            ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-[#FBFAF7] border-b border-[#D9D6CF]">
          {/* Mobile Viewport: Image First */}
          <div className="block lg:hidden px-6 pt-24 pb-4">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#D9D6CF]">
              <Image
                src="/photography/thermal-solar-inspection.webp"
                alt="Thermal inspection drone over utility-scale solar photovoltaic array"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="mt-2 text-[11px] font-mono text-[#73777C] uppercase tracking-wider">
              Photovoltaic Thermal Telemetry · Inverter Degradation Forecasting
            </p>
          </div>

          {/* Desktop Photographic Background Layer */}
          <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
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

          <div className="relative z-10 max-w-7xl mx-auto w-full py-12 lg:py-32 px-6 sm:px-10 lg:px-16 flex items-center justify-end min-h-[580px] lg:min-h-[720px]">
            <div className="max-w-3xl bg-[#FBFAF7]/95 lg:bg-transparent rounded-2xl p-2 lg:p-0">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Clean Energy Infrastructure
              </span>

              <h1 className="text-[clamp(36px,7.5vw,78px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
                KITTY Urjaan
              </h1>

              <p className="text-[20px] sm:text-[24px] font-light leading-[1.4] text-[#292D31] mb-8 max-w-2xl">
                Predictive intelligence for photovoltaic asset health, battery longevity, and resilient microgrids.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#73777C] pb-4">
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] text-[#191B1D] font-medium">
                  STAGE: ALGORITHMIC MODELING
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
            CONTEXT & PURPOSE: THE CLEAN ENERGY BOTTLENECK
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
              Context and Purpose
            </span>

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
            TECHNOLOGICAL SYSTEMS: CORE ARCHITECTURAL PILLARS
            ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Technological Systems
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
                    String-Level Photovoltaic Degradation
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Continuous mathematical analysis comparing localized irradiance against inverter MPPT telemetry to isolate soiling loss from irreversible micro-crack diode failures.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  ALGORITHM · DEGRADATION FORECASTING
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Adaptive C-Rate Thermal Protection
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Dynamic throttle curves that govern battery pack charging rates in ambient temperatures exceeding 42°C, preventing dangerous dendrite formation and prolonging BESS lifecycles.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  BATTERY HEALTH · THERMAL C-RATE GOVERNANCE
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
                    Predictive dispatch software coordinating localized rooftop solar arrays and backup storage reserves to guarantee uninterrupted energy access during regional grid failures.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  GRID ORCHESTRATION · AUTONOMOUS BALANCING
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            DEVELOPMENT ROADMAP & MILESTONES
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#F5F2EA]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[11px] font-mono tracking-wider text-[#62676D] uppercase mb-5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2457D6]" />
                <span>Technical Milestone Status</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
                Where Urjaan stands today.
              </h2>

              <p className="text-[16px] leading-[1.75] text-[#292D31] font-light mb-6">
                KITTY Urjaan is actively modeling synthetic inverter telemetry datasets and validating degradation prediction algorithms against empirical utility solar benchmarks.
              </p>

              <div className="space-y-3 font-mono text-xs text-[#62676D] border-t border-[#D9D6CF] pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#2457D6] shrink-0" />
                  <span>Phase 1 Completed: Mathematical degradation curve equations validated against historical PV array datasets.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full border-2 border-[#2457D6] shrink-0" />
                  <span className="text-[#191B1D] font-medium">Phase 2 Active: Edge IoT gateway prototype ingestion testing for commercial hybrid solar inverters.</span>
                </div>
                <div className="flex items-center gap-3 text-[#73777C]">
                  <span className="w-4 h-4 rounded-full border border-[#D9D6CF] shrink-0" />
                  <span>Phase 3 Scheduled: On-site commercial deployment across pilot commercial rooftop installations.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            COLLABORATION & INQUIRIES
            ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[clamp(28px,3.8vw,46px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-5">
              Collaborate on clean energy intelligence.
            </h2>
            <p className="text-[16px] sm:text-[18px] leading-[1.65] text-[#62676D] font-light max-w-2xl mx-auto mb-10">
              We welcome partnerships with solar EPC contractors, renewable developers, microgrid operators, and energy storage engineering teams.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-colors shadow-sm"
              >
                <span>Partner on Energy Telemetry</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[#191B1D] text-[14px] font-medium transition-colors"
              >
                <span>Explore Research Papers</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sun, Zap, BatteryCharging, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "KITTY UrjaYaan | Solar Intelligence",
  "KITTY UrjaYaan develops solar intelligence for monitoring, energy optimisation, predictive telemetry and clean-energy infrastructure lifecycle management."
  "/urjayaan"
);

export default function UrjaYaanPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />

      <main id="main">
        {/* =========================================================================
            HERO: KITTY URJAYAAN: PHOTOGRAPHIC INTEGRATION & MOBILE-FIRST STACKING
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
                KITTY UrjaYaan
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
                  GOAL: REAL-WORLD ENERGY RESILIENCE
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
              Why intelligent monitoring is crucial for clean energy adoption.
            </h2>

            <div className="space-y-6 text-[17px] sm:text-[19px] leading-[1.8] text-[#292D31] font-light">
              <p>
                Solar panels and decentralized batteries are transforming electrification across India and the developing world. However, operating solar infrastructure in dusty, high-heat environments reveals a major operational challenge: panels degrade unevenly, dust blankets arrays silently, and battery cells experience thermal stress that shortens their operational lifespan.
              </p>
              <p>
                KITTY UrjaYaan addresses this challenge by combining thermal computer vision, inverter telemetry, and predictive degradation modeling. Instead of reactive maintenance after power generation drops, our systems identify hotspots, cell fractures, and balance anomalies before they cause system downtime.
              </p>
              <p>
                By predicting equipment degradation accurately, clean energy systems operate longer, generate more consistent electricity, and reduce the maintenance costs that often hold back rural and community microgrids.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TECHNICAL FOCUS AREAS
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Core Capabilities
              </span>
              <h2 className="text-[clamp(28px,3.8vw,44px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
                Three pillars of the UrjaYaan energy initiative.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                  <Sun className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-[#191B1D] mb-3">Thermal Cell Inspection</h3>
                <p className="text-sm text-[#62676D] font-light leading-relaxed">
                  Automated computer vision pipelines identifying defective bypass diodes, cracked solar wafers, and localized hotspots from aerial and ground inspection telemetry.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-[#191B1D] mb-3">Battery Health Optimization</h3>
                <p className="text-sm text-[#62676D] font-light leading-relaxed">
                  Predictive battery management modeling internal cell degradation to optimize charge-discharge cycles and prolong storage life under harsh ambient temperatures.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-[#191B1D] mb-3">Decentralized Microgrid Balancing</h3>
                <p className="text-sm text-[#62676D] font-light leading-relaxed">
                  Load-matching algorithms that balance volatile renewable generation against industrial and agricultural pump demands without relying on central grid infrastructure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            DEVELOPMENT TIMELINE & STAGE
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
              Development Roadmap
            </span>

            <h2 className="text-[clamp(28px,3.8vw,44px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-8">
              Where UrjaYaan stands today.
            </h2>

            <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA] space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#2457D6] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-[#191B1D]">Current Stage: Algorithmic Modeling &amp; Telemetry Simulation</h3>
                  <p className="text-sm text-[#62676D] font-light leading-relaxed mt-1">
                    KITTY UrjaYaan is actively modeling synthetic inverter telemetry datasets and validating degradation prediction algorithms against empirical utility solar benchmarks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#D9D6CF]/70">
                <div className="w-6 h-6 rounded-full border-2 border-[#73777C] flex items-center justify-center shrink-0 mt-0.5 text-xs text-[#73777C] font-mono">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#191B1D]">Next Phase: Field Drone &amp; Rooftop Sensor Deployment</h3>
                  <p className="text-sm text-[#62676D] font-light leading-relaxed mt-1">
                    Deploying multispectral edge cameras on agricultural rooftops and microgrid solar arrays in northern India to calibrate models under real dust storm and summer monsoon cycles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CALL TO ACTION
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
              Collaborate on Clean Energy Systems
            </h2>
            <p className="text-[#62676D] font-light leading-relaxed max-w-xl mx-auto mb-8 text-[16px]">
              We welcome dialogue with solar EPC operators, battery researchers, and clean energy developers interested in testing predictive asset telemetry.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#191B1D] hover:bg-[#292D31] text-white text-[14px] font-medium transition-all shadow-sm"
              >
                <span>View All Initiatives</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#D9D6CF] text-[#191B1D] text-[14px] font-medium transition-colors"
              >
                <span>Contact Energy Team</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

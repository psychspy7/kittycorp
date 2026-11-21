"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Compass, HeartHandshake, Waves, Orbit } from "lucide-react";

export function EditorialHome() {
  return (
    <div className="w-full bg-[#F5F2EA] text-[#191B1D] selection:bg-[#2457D6]/15 selection:text-[#191B1D]">
      
      {/* =========================================================================
          SECTION A: HERO: WARM MINIMALISM & ARCHITECTURAL PRECISION
          ========================================================================= */}
      <section className="relative min-h-[75vh] flex flex-col justify-between pt-20 sm:pt-28 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-4xl pt-4 sm:pt-8">
          {/* Official Brand Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] mb-8 shadow-xs">
            <Image
              unoptimized
              src="/brand/monogram-small-v2.webp"
              alt="KITTY CORP"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#191B1D] font-semibold">
              KITTY CORP · PHYSICAL-WORLD INTELLIGENCE
            </span>
          </div>
          <h1 className="text-[clamp(36px,7.5vw,86px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-8">
            Engineering intelligence <br className="hidden sm:block" />
            <span className="font-normal text-[#191B1D]">for the physical world.</span>
          </h1>

          <p className="text-[18px] sm:text-[22px] leading-[1.65] text-[#191B1D] max-w-2xl font-normal mb-10">
            KITTY CORP develops autonomous robotics, precision agricultural systems and clean energy software from India, with a focus on practical engineering and global applications.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#agriyaan"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)] group"
            >
              <span>Explore Our Initiatives</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://demo.thekittycorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[14px] text-[#191B1D] font-medium transition-colors"
            >
              <span>Digital Solutions Studio</span>
              <ArrowUpRight className="w-4 h-4 text-[#2457D6]" />
            </a>
          </div>
        </div>

        {/* Telemetry Indicator Strip */}
        <div className="mt-16 pt-8 border-t border-[#D9D6CF] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="font-mono text-[10px] text-[#374151] uppercase tracking-wider block mb-1">CORE FOCUS</span>
            <span className="font-medium text-[#191B1D]">Autonomous Robotics &amp; Clean Energy</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#374151] uppercase tracking-wider block mb-1">FOUNDATION</span>
            <span className="font-medium text-[#191B1D]">Physical-World Intelligence</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#374151] uppercase tracking-wider block mb-1">ORIGIN</span>
            <span className="font-medium text-[#191B1D]">India to Global Frontiers</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#374151] uppercase tracking-wider block mb-1">ARCHITECTURE</span>
            <span className="font-medium text-[#2457D6]">Embedded Edge Inference</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: PHILOSOPHY : PHYSICAL-WORLD INTELLIGENCE
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-4xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
            Philosophy
          </span>

          <h2 className="text-[clamp(30px,4.5vw,54px)] font-[family-name:var(--font-display)] font-normal leading-[1.12] tracking-[-0.025em] text-[#191B1D] mb-8">
            Intelligence should extend beyond screens into the physical world.
          </h2>

          <div className="space-y-6 text-[17px] sm:text-[19px] leading-[1.8] text-[#191B1D] font-normal">
            <p>
              AI should do more than respond through a screen. It should help people understand their surroundings, operate physical systems and solve real problems in agriculture, clean energy and field operations.
            </p>
            <p>
              For decades, computing has advanced behind glass, optimizing language models, pixel rendering, and financial transactions. Yet the physical foundations that support civilization, such as food cultivation, clean electricity generation, and industrial maintenance, still rely on human labor and manual machinery.
            </p>
            <p>
              We engineer machines capable of understanding terrain, assessing soil health, balancing decentralized power grids, and operating in unstructured physical environments alongside people.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: INITIATIVE : KITTY AGRIYAAN
          Mobile-first image stacking + Desktop Photographic Background
          ========================================================================= */}
      <section id="agriyaan" className="relative w-full overflow-hidden bg-[#F5F2EA] border-t border-[#D9D6CF]">
        {/* Mobile Viewport: Image First */}
        <div className="block lg:hidden px-6 pt-12 pb-4">
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#D9D6CF]">
            <Image
              src="/photography/agriyaan-field-robot.webp"
              alt="KITTY AgriYaan autonomous agricultural field robotics platform"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <p className="mt-2 text-[11px] font-mono text-[#374151] uppercase tracking-wider">
            AgriYaan Physical Kinematics Rig · Mud &amp; Canopy Autonomy
          </p>
        </div>

        {/* Desktop Photographic Background Layer */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/photography/agriyaan-field-robot.webp"
            alt="KITTY AgriYaan autonomous agricultural field robotics platform navigating crop terrain"
            fill
            priority
            className="object-cover object-[78%_center] opacity-95"
            sizes="100vw"
          />
          {/* Smooth horizontal gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EA] via-[#F5F2EA]/95 via-45% to-transparent/15" />
          {/* Vertical fades */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2EA] via-transparent via-15% to-[#F5F2EA]" />
        </div>

        {/* Foreground Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto w-full py-12 lg:py-32 px-6 sm:px-10 lg:px-16 flex items-center min-h-[580px] lg:min-h-[720px]">
          <div className="max-w-2xl bg-[#F5F2EA]/95 lg:bg-transparent rounded-2xl p-2 lg:p-0">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
              Precision Agriculture
            </span>

            <h2 className="text-[clamp(34px,5vw,60px)] font-[family-name:var(--font-display)] font-normal leading-[1.06] tracking-[-0.03em] text-[#191B1D] mb-4">
              KITTY AgriYaan
            </h2>
            
            <p className="text-[17px] sm:text-[19px] font-medium text-[#191B1D] mb-6">
              Agricultural Robotics &amp; Autonomous Field Systems
            </p>

            <div className="space-y-4 text-[16px] leading-[1.75] text-[#191B1D] font-normal mb-8 max-w-xl">
              <p>
                Agriculture across India and developing farmlands faces an urgent convergence: climate volatility, unpredictable monsoons, soil compaction, and rural labor migration.
              </p>
              <p>
                KITTY AgriYaan explores an autonomous ground rover equipped with multi-spectral crop inspection cameras, soil compaction sensors, and low-power edge computer vision designed to navigate dense crop canopies and unpaved mud terrain without destroying delicate soil biology.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 pt-2 max-w-lg">
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#FBFAF7]/90 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#374151] uppercase block mb-1">DOMAIN</span>
                <span className="text-sm font-medium text-[#191B1D]">Precision Agriculture</span>
              </div>
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#FBFAF7]/90 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#374151] uppercase block mb-1">STAGE</span>
                <span className="text-sm font-medium text-[#2457D6]">Simulation &amp; Kinematics</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/agriyaan"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#191B1D] hover:bg-[#292D31] text-white text-[14px] font-medium transition-all shadow-sm group"
              >
                <span>Read Full AgriYaan Initiative</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Environmental Caption Tag */}
        <div className="hidden lg:block absolute bottom-8 right-10 z-10 font-mono text-[11px] text-[#191B1D] bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
          AgriYaan Physical Kinematics Rig · Mud &amp; Canopy Autonomy
        </div>
      </section>

      {/* =========================================================================
          SECTION D: INITIATIVE : KITTY URJAYAAN
          Mobile-first image stacking + Desktop Photographic Background
          ========================================================================= */}
      <section id="urjayaan" className="relative w-full overflow-hidden bg-[#FBFAF7] border-t border-[#D9D6CF]">
        {/* Mobile Viewport: Image First */}
        <div className="block lg:hidden px-6 pt-12 pb-4">
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
          <p className="mt-2 text-[11px] font-mono text-[#374151] uppercase tracking-wider">
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
            className="object-cover object-[25%_center] opacity-95"
            sizes="100vw"
          />
          {/* Smooth horizontal gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#FBFAF7] via-[#FBFAF7]/95 via-45% to-transparent/15" />
          {/* Vertical fades */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBFAF7] via-transparent via-15% to-[#FBFAF7]" />
        </div>

        {/* Foreground Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto w-full py-12 lg:py-32 px-6 sm:px-10 lg:px-16 flex items-center justify-end min-h-[580px] lg:min-h-[720px]">
          <div className="max-w-2xl bg-[#FBFAF7]/95 lg:bg-transparent rounded-2xl p-2 lg:p-0">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
              Clean Energy Infrastructure
            </span>

            <h2 className="text-[clamp(34px,5vw,60px)] font-[family-name:var(--font-display)] font-normal leading-[1.06] tracking-[-0.03em] text-[#191B1D] mb-4">
              KITTY UrjaYaan
            </h2>
            
            <p className="text-[17px] sm:text-[19px] font-medium text-[#191B1D] mb-6">
              AI-Driven Clean Energy Management &amp; Solar Optimization
            </p>

            <div className="space-y-4 text-[16px] leading-[1.75] text-[#191B1D] font-normal mb-8 max-w-xl">
              <p>
                Deploying renewable generation is only half of the energy transition. Solar panels degrade unevenly under intense heat and dust, while battery storage systems fail prematurely when subjected to volatile charging spikes.
              </p>
              <p>
                KITTY UrjaYaan is developing predictive algorithms that monitor photovoltaic cell degradation in real time, forecast localized generation against industrial loads, and balance decentralized microgrids for community energy independence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 pt-2 max-w-lg">
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#F5F2EA]/90 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#374151] uppercase block mb-1">DOMAIN</span>
                <span className="text-sm font-medium text-[#191B1D]">Clean Energy Systems</span>
              </div>
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#F5F2EA]/90 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#374151] uppercase block mb-1">STAGE</span>
                <span className="text-sm font-medium text-[#2457D6]">Algorithmic Modeling</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/urjayaan"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#191B1D] hover:bg-[#292D31] text-white text-[14px] font-medium transition-all shadow-sm group"
              >
                <span>Read Full UrjaYaan Initiative</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Environmental Caption Tag */}
        <div className="hidden lg:block absolute bottom-8 left-10 z-10 font-mono text-[11px] text-[#191B1D] bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
          Photovoltaic Thermal Telemetry · Inverter Degradation Forecasting
        </div>
      </section>

      {/* =========================================================================
          SECTION E: CORE PLATFORMS (KITTY AI & KITTY BUDDY)
          Architectural Layouts with Photography
          ========================================================================= */}
      <section id="platforms" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
              Foundational Systems
            </span>
            <h2 className="text-[clamp(30px,4vw,50px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
              Foundational intelligence and physical interaction.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Platform 1: KITTY AI */}
            <div className="dark-section relative overflow-hidden rounded-3xl min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-8 sm:p-12 border border-[#292D31]/40 bg-[#0A0D12] shadow-lg group">
              {/* Background Neural Network Imagery */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src="/photography/kitty-ai-neural-core.webp"
                  alt="KITTY AI neural network architecture visualization"
                  fill
                  className="object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
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
        </div>
      </section>

      {/* =========================================================================
          SECTION F: THE HORIZON : DUAL EXPLORATION (DEEP OCEAN & SPACE HORIZON)
          ========================================================================= */}
      <section id="horizon" className="border-t border-[#D9D6CF] bg-[#F5F2EA]">
        
        {/* Horizon Part I: Deep Ocean Exploration */}
        <div className="dark-section relative w-full overflow-hidden bg-[#071322] min-h-[540px] lg:min-h-[620px] flex items-center py-16 sm:py-24 px-6 sm:px-10 lg:px-16 text-white">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/photography/deep-ocean-exploration.webp"
              alt="Sunbeams piercing abyssal deep ocean waters"
              fill
              className="object-cover object-center opacity-85"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071322] via-[#071322]/90 via-45% to-transparent/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2EA] via-transparent via-15% to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-medium flex items-center gap-2 mb-4">
                <Waves className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Human-Machine Frontiers · Subsea</span>
              </span>

              <h2 className="text-[clamp(30px,4.5vw,54px)] font-[family-name:var(--font-display)] font-normal leading-[1.1] tracking-[-0.025em] text-white mb-6">
                From deep ocean to deep space.
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[18px] leading-[1.75] text-[#F3F4F6] font-normal mb-8">
                <p>
                  We believe that when human ingenuity and artificial intelligence work together productively, we can accomplish things that were once thought impossible. Technology reaches its highest potential not when it isolates people behind screens, but when it extends human capability into frontiers no person could navigate alone.
                </p>
                <p>
                  From the crushing hydrostatic pressures and pitch darkness of the deep ocean to the vacuum and radiation of orbital space, physical intelligence gives humanity new reach. Autonomous sensing, resilient edge compute, and kinematically adaptive robotics work hand in hand with human judgment to explore, understand, and protect what lies beyond our unaided grasp.
                </p>
              </div>

              <div className="font-mono text-xs text-[#D1D5DB] tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                <span>FRONTIER: Benthic Sensing &amp; Subsurface Robotics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizon Part II: Planetary Observation & Orbital Horizon */}
        <div className="dark-section relative w-full overflow-hidden bg-[#0A101C] min-h-[540px] lg:min-h-[620px] flex items-center py-16 sm:py-24 px-6 sm:px-10 lg:px-16 text-white border-t border-white/10">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/photography/earth-orbital-horizon.webp"
              alt="Earth atmospheric limb and daylight curved horizon viewed from orbit"
              fill
              className="object-cover object-center opacity-85"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A101C] via-[#0A101C]/90 via-45% to-transparent/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F2EA]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-medium flex items-center gap-2 mb-4">
                <Orbit className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Planetary Observation &amp; Deep Space</span>
              </span>

              <h2 className="text-[clamp(30px,4.5vw,54px)] font-[family-name:var(--font-display)] font-normal leading-[1.1] tracking-[-0.025em] text-white mb-6">
                Pushing the boundaries of what we can accomplish.
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[18px] leading-[1.75] text-[#F3F4F6] font-normal mb-8">
                <p>
                  The engineering principles that guide an autonomous rover through dense, waterlogged soil under monsoon conditions are fundamentally connected to the physical intelligence required for planetary observation and orbital exploration.
                </p>
                <p>
                  When human curiosity unites with disciplined machine autonomy, boundaries turn into milestones. By bridging physical extremes, from microbial soil analysis to orbital atmospheric sensing, we engineer tools that empower people and expand human horizons with safety, rigor, and purpose.
                </p>
              </div>

              <div className="font-mono text-xs text-[#D1D5DB] tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                <span>FRONTIER: Planetary Kinematics &amp; Autonomous Telemetry</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION G: COMMERCIAL ENGINEERING ARM : DIGITAL SOLUTIONS STUDIO
          ========================================================================= */}
      <section className="py-20 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#F5F2EA] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Commercial Engineering Arm
              </span>
              <h3 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
                Digital Solutions Studio
              </h3>
              <p className="text-[#191B1D] text-[15px] sm:text-[16px] leading-relaxed font-normal">
                To independently finance our hardware prototypes without dilutive venture cycles, KITTY CORP operates a commercial engineering arm developing high-performance web applications, enterprise software, and workflow automation for growing businesses.
              </p>
            </div>

            <div className="flex-shrink-0">
              <a
                href="https://demo.thekittycorp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)] group"
              >
                <span>Explore Studio Demos</span>
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION H: VOLUNTARY RESEARCH SUPPORT INVITATION
          ========================================================================= */}
      <section className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-10 h-10 rounded-xl bg-[#FBFAF7] flex items-center justify-center text-[#2457D6] mx-auto mb-4 border border-[#D9D6CF]">
            <HeartHandshake className="w-5 h-5" />
          </div>
          
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
            Open Exploration
          </span>

          <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            Support the research.
          </h2>

          <p className="text-[15px] sm:text-[16px] leading-[1.65] text-[#191B1D] font-normal max-w-xl mx-auto mb-8">
            Individuals who believe in our technological vision can voluntarily support our open robotics and clean energy research. Supporters receive a digital supporter badge and public recognition on our supporter roll.
          </p>

          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#D9D6CF] text-[#191B1D] text-[13px] font-medium transition-colors"
          >
            <span>Learn About Voluntary Support</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2457D6]" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION I: COLLABORATION & CONTACT : TRANSITION TO FOOTER
          ========================================================================= */}
      <section className="pt-20 pb-28 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
            Collaboration
          </span>

          <h2 className="text-[clamp(28px,4.2vw,48px)] font-[family-name:var(--font-display)] font-normal leading-[1.12] tracking-[-0.025em] text-[#191B1D] mb-5">
            Building with researchers, engineers, and partners.
          </h2>

          <p className="text-[16px] sm:text-[18px] leading-[1.65] text-[#191B1D] font-normal max-w-2xl mx-auto mb-10">
            We welcome conversations with robotics researchers, agricultural field operators, clean energy teams, and potential partners aligned with our technological direction.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-colors shadow-sm"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              href="/investors"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[#191B1D] text-[14px] font-medium transition-colors"
            >
              <span>Investors &amp; Partnerships</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

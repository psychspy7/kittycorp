"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Compass, HeartHandshake, Waves, Orbit } from "lucide-react";

export function EditorialHome() {
  return (
    <div className="w-full bg-[#F5F2EA] text-[#191B1D] selection:bg-[#2457D6]/15 selection:text-[#191B1D]">
      
      {/* =========================================================================
          SECTION A: HERO — WARM MINIMALISM & ARCHITECTURAL PRECISION
          ========================================================================= */}
      <section className="relative min-h-[82vh] flex flex-col justify-between pt-24 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-4xl pt-6 sm:pt-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#62676D] uppercase mb-8 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Emerging Technology • India to the World</span>
          </div>

          <h1 className="text-[clamp(32px,7.5vw,86px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-8">
            Engineering <br className="sm:hidden" />
            intelligence <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">for the physical world.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] max-w-2xl font-light mb-10">
            KITTY CORP develops autonomous machines, intelligent agricultural robotics, and clean energy infrastructure built to interact with living environments.
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

        {/* Architectural Telemetry Matrix */}
        <div className="mt-20 pt-8 border-t border-[#D9D6CF] grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="font-mono text-[10px] text-[#73777C] uppercase tracking-wider block mb-1">01 · CORE FOCUS</span>
            <span className="font-medium text-[#191B1D]">Autonomous Robotics &amp; Clean Energy</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#73777C] uppercase tracking-wider block mb-1">02 · MISSION</span>
            <span className="font-medium text-[#191B1D]">Physical-World Intelligence</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#73777C] uppercase tracking-wider block mb-1">03 · OUTLOOK</span>
            <span className="font-medium text-[#191B1D]">India to the World</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#73777C] uppercase tracking-wider block mb-1">04 · ARCHITECTURE</span>
            <span className="font-medium text-[#2457D6]">Embedded Edge Inference</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: OUR BELIEF — PHYSICAL-WORLD INTELLIGENCE
          ========================================================================= */}
      <section className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] text-[11px] font-mono tracking-widest text-[#62676D] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
            <span>01 · Philosophy</span>
          </div>

          <h2 className="text-[clamp(32px,4.5vw,56px)] font-[family-name:var(--font-display)] font-normal leading-[1.12] tracking-[-0.025em] text-[#191B1D] mb-8">
            Intelligence should not remain bounded by glass displays.
          </h2>

          <div className="space-y-6 text-[17px] sm:text-[19px] leading-[1.8] text-[#292D31] font-light">
            <p>
              For decades, computing has advanced behind screens — optimizing language models, pixel rendering, and financial transactions. Yet the physical foundations that support civilization — food cultivation, clean electricity generation, and industrial maintenance — still rely on fragile manual methods.
            </p>
            <p>
              We believe the defining chapter of technology will occur when artificial intelligence leaves screens and steps directly into physical reality. We engineer machines capable of understanding terrain, assessing soil health, balancing decentralized power grids, and operating in unstructured environments alongside humans.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: FLAGSHIP INITIATIVE 01 — KITTY AGRIYAAN
          Genuine Edge-to-Edge Photographic Background Integration
          ========================================================================= */}
      <section id="agriyaan" className="relative w-full overflow-hidden bg-[#F5F2EA] min-h-[680px] lg:min-h-[780px] flex items-center py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF]">
        {/* Photographic Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/photography/agriyaan-field-robot.webp"
            alt="KITTY AgriYaan autonomous agricultural field robotics platform navigating crop terrain"
            fill
            priority
            className="object-cover object-[70%_center] lg:object-[82%_center] opacity-90 lg:opacity-95"
            sizes="100vw"
          />
          {/* Smooth horizontal gradient scrim: Solid warm paper on the left behind text, fading softly across to reveal the autonomous rover on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EA] via-[#F5F2EA]/95 via-45% to-transparent/15" />
          {/* Vertical top and bottom fades: Seamless blend into neighboring sections without any hard borders */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2EA] via-transparent via-15% to-[#F5F2EA]" />
        </div>

        {/* Foreground Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7]/90 backdrop-blur-sm text-[11px] font-mono tracking-widest text-[#2457D6] uppercase mb-6">
              <span>Flagship Initiative 01 · Agriculture</span>
            </div>

            <h2 className="text-[clamp(36px,5vw,64px)] font-[family-name:var(--font-display)] font-normal leading-[1.06] tracking-[-0.03em] text-[#191B1D] mb-4">
              KITTY AgriYaan
            </h2>
            
            <p className="text-[17px] sm:text-[19px] font-medium text-[#292D31] mb-6">
              Agricultural Robotics &amp; Autonomous Field Systems
            </p>

            <div className="space-y-4 text-[16px] leading-[1.75] text-[#292D31] font-light mb-8 max-w-xl">
              <p>
                Agriculture across India and global developing farmlands faces an urgent convergence: climate volatility, unpredictable monsoons, soil compaction, and rural labor migration.
              </p>
              <p>
                KITTY AgriYaan explores an autonomous ground rover equipped with multi-spectral crop inspection cameras, soil compaction sensors, and low-power edge computer vision designed to navigate dense crop canopies and unpaved mud terrain without destroying delicate soil biology.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 pt-2 max-w-lg">
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#FBFAF7]/85 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">DOMAIN</span>
                <span className="text-sm font-medium text-[#191B1D]">Precision Agriculture</span>
              </div>
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#FBFAF7]/85 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">CURRENT STATUS</span>
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
          SECTION D: FLAGSHIP INITIATIVE 02 — KITTY URJAAN
          Genuine Edge-to-Edge Photographic Background Integration
          ========================================================================= */}
      <section id="urjaan" className="relative w-full overflow-hidden bg-[#FBFAF7] min-h-[680px] lg:min-h-[780px] flex items-center py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF]">
        {/* Photographic Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/photography/thermal-solar-inspection.webp"
            alt="Thermal inspection drone over utility-scale solar photovoltaic array with thermal telemetry"
            fill
            priority
            className="object-cover object-[25%_center] lg:object-[28%_center] opacity-90 lg:opacity-95"
            sizes="100vw"
          />
          {/* Smooth horizontal gradient scrim: Solar arrays and thermal drone on the left, fading softly into Alabaster #FBFAF7 on the right behind text */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#FBFAF7] via-[#FBFAF7]/95 via-45% to-transparent/15" />
          {/* Vertical top and bottom fades: Seamless blend into neighboring sections */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBFAF7] via-transparent via-15% to-[#FBFAF7]" />
        </div>

        {/* Foreground Content Layer */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA]/90 backdrop-blur-sm text-[11px] font-mono tracking-widest text-[#2457D6] uppercase mb-6">
              <span>Flagship Initiative 02 · Clean Energy</span>
            </div>

            <h2 className="text-[clamp(36px,5vw,64px)] font-[family-name:var(--font-display)] font-normal leading-[1.06] tracking-[-0.03em] text-[#191B1D] mb-4">
              KITTY Urjaan
            </h2>
            
            <p className="text-[17px] sm:text-[19px] font-medium text-[#292D31] mb-6">
              AI-Driven Clean Energy Management &amp; Solar Optimization
            </p>

            <div className="space-y-4 text-[16px] leading-[1.75] text-[#292D31] font-light mb-8 max-w-xl">
              <p>
                Deploying renewable generation is only half of the energy transition. Solar panels degrade unevenly under intense heat and dust, while battery storage systems fail prematurely when subjected to volatile charging spikes.
              </p>
              <p>
                KITTY Urjaan is developing predictive algorithms that monitor photovoltaic cell degradation in real time, forecast localized generation against industrial loads, and balance decentralized microgrids for community energy independence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 pt-2 max-w-lg">
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#F5F2EA]/85 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">DOMAIN</span>
                <span className="text-sm font-medium text-[#191B1D]">Clean Energy Infrastructure</span>
              </div>
              <div className="p-4 rounded-xl border border-[#D9D6CF]/80 bg-[#F5F2EA]/85 backdrop-blur-md">
                <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">CURRENT STATUS</span>
                <span className="text-sm font-medium text-[#2457D6]">Algorithmic Modeling</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/urjaan"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#191B1D] hover:bg-[#292D31] text-white text-[14px] font-medium transition-all shadow-sm group"
              >
                <span>Read Full Urjaan Initiative</span>
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
          SECTION E: TECHNOLOGY FOUNDATIONS (KITTY AI & KITTY BUDDY)
          Genuine Photographic Background Integration
          ========================================================================= */}
      <section id="platforms" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
              03 · Core Platforms
            </span>
            <h2 className="text-[clamp(30px,4vw,50px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
              Foundational intelligence &amp; physical interaction.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Platform 1: KITTY AI with Neural Core Background Integration */}
            <div className="dark-section relative overflow-hidden rounded-3xl min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-8 sm:p-12 border border-[#292D31]/40 bg-[#0A0D12] shadow-lg group">
              {/* Background Neural Network Imagery */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src="/photography/kitty-ai-neural-core.webp"
                  alt="KITTY AI neural network architecture visualization"
                  fill
                  className="object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Dark obsidian gradient overlay ensuring 100% text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/80 to-[#0A0D12]/40" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="font-mono text-xs text-[#9CA3AF] uppercase tracking-widest">ARCHITECTURE</span>
                  <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full border border-white/20 text-[#E2E5E8] bg-white/10 backdrop-blur-sm">
                    Active Development
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#60A5FA] mb-6 border border-white/15">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-normal font-[family-name:var(--font-display)] text-white mb-3">
                  KITTY AI
                </h3>
                <p className="text-sm font-medium text-[#E2E5E8] mb-3">Vision-Actuator Neural Controller Stack</p>
                <p className="text-[#D1D5DB] font-light leading-relaxed text-[15px] sm:text-[16px] max-w-lg">
                  Our proprietary software stack bridging high-frame-rate 3D spatial computer vision directly with real-time robotic actuator controllers, providing physical machines with context-aware navigation and obstacle avoidance.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-8 border-t border-white/15 text-xs font-mono text-[#9CA3AF] flex items-center justify-between">
                <span>CORE STACK · EMBEDDED REAL-TIME INFERENCE</span>
                <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
              </div>
            </div>

            {/* Platform 2: KITTY BUDDY with Desktop Companion Robot Background Integration */}
            <div className="relative overflow-hidden rounded-3xl min-h-[480px] sm:min-h-[520px] flex flex-col justify-between p-8 sm:p-12 border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm group">
              {/* Background Companion Robot Imagery */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src="/photography/kitty-buddy-companion.webp"
                  alt="KITTY BUDDY physical desktop companion robot prototype with Kitty branding"
                  fill
                  className="object-cover object-[80%_center] opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Soft warm paper gradient scrim from left to right */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FBFAF7] via-[#FBFAF7]/95 via-50% to-transparent/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FBFAF7] via-transparent to-transparent opacity-50" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">INTERACTION PROTOTYPE</span>
                  <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]/90 backdrop-blur-sm">
                    Concept Exploration
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6 border border-[#D9D6CF]">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                  KITTY Buddy
                </h3>
                <p className="text-sm font-medium text-[#292D31] mb-3">Physical Human-Machine Companion Concept</p>
                <p className="text-[#62676D] font-light leading-relaxed text-[15px] sm:text-[16px] max-w-lg">
                  An exploration into physical collaboration, testing tactile, non-intrusive companion devices that facilitate natural interaction without invasive biometric surveillance or screen fatigue.
                </p>
              </div>

              <div className="relative z-10 pt-6 mt-8 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C] flex items-center justify-between">
                <span>EXPLORATION · TACTILE INTERACTION</span>
                <span className="w-2 h-2 rounded-full bg-[#2457D6]" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: THE HORIZON — DUAL EXPLORATION (DEEP OCEAN & SPACE HORIZON)
          Genuine Full-Bleed Photographic Background Integrations
          ========================================================================= */}
      <section id="horizon" className="border-t border-[#D9D6CF] bg-[#F5F2EA]">
        
        {/* Horizon Part I: Deep Ocean Exploration */}
        <div className="dark-section relative w-full overflow-hidden bg-[#071322] min-h-[560px] lg:min-h-[640px] flex items-center py-20 sm:py-28 px-6 sm:px-10 lg:px-16 text-white">
          {/* Deep Ocean Photographic Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/photography/deep-ocean-exploration.webp"
              alt="Sunbeams piercing abyssal deep ocean waters"
              fill
              className="object-cover object-center opacity-85"
              sizes="100vw"
            />
            {/* Sapphire ocean gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#071322] via-[#071322]/90 via-45% to-transparent/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2EA] via-transparent via-15% to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-[11px] font-mono tracking-widest text-[#60A5FA] uppercase mb-6 backdrop-blur-sm">
                <Waves className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>04 · The Horizon: Part I</span>
              </div>

              <h2 className="text-[clamp(32px,4.5vw,56px)] font-[family-name:var(--font-display)] font-normal leading-[1.1] tracking-[-0.025em] text-white mb-6">
                From Indian fields to the ocean depths.
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[18px] leading-[1.75] text-[#D1D5DB] font-light mb-8">
                <p>
                  The physical world is not confined to land. From deep subsea thermal vents to ocean current monitoring, extreme underwater environments present the same fundamental engineering challenges: extreme pressure, absence of GPS, and zero direct connectivity.
                </p>
                <p>
                  We explore autonomous submersibles and acoustic sensing systems engineered to operate reliably in the unseen 70% of our planet.
                </p>
              </div>

              <div className="font-mono text-xs text-[#9CA3AF] tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                <span>FRONTIER: Abyssal Sensing &amp; Benthic Robotics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizon Part II: Planetary Observation & Orbital Horizon */}
        <div className="dark-section relative w-full overflow-hidden bg-[#0A101C] min-h-[560px] lg:min-h-[640px] flex items-center py-20 sm:py-28 px-6 sm:px-10 lg:px-16 text-white border-t border-white/10">
          {/* Orbital Earth Horizon Photographic Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/photography/earth-orbital-horizon.webp"
              alt="Earth atmospheric limb and daylight curved horizon viewed from orbit"
              fill
              className="object-cover object-center opacity-85"
              sizes="100vw"
            />
            {/* Orbital space gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A101C] via-[#0A101C]/90 via-45% to-transparent/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F2EA]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-[11px] font-mono tracking-widest text-[#60A5FA] uppercase mb-6 backdrop-blur-sm">
                <Orbit className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>04 · The Horizon: Part II</span>
              </div>

              <h2 className="text-[clamp(32px,4.5vw,56px)] font-[family-name:var(--font-display)] font-normal leading-[1.1] tracking-[-0.025em] text-white mb-6">
                To the frontiers of planetary observation.
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[18px] leading-[1.75] text-[#D1D5DB] font-light mb-8">
                <p>
                  We are building from India, but our technological outlook is universal. The kinematics and sensory perception required for an autonomous rover to navigate dense soil under monsoon heat are the very principles needed to operate machines across harsh frontiers on Earth and beyond.
                </p>
                <p>
                  Intelligent physical machines will help humanity observe and understand environments where human physiology cannot safely tread.
                </p>
              </div>

              <div className="font-mono text-xs text-[#9CA3AF] tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                <span>PERSPECTIVE: Planetary Kinematics &amp; Extreme Terrains</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION G: COMMERCIAL STUDIO — DIGITAL SOLUTIONS PLATFORM
          ========================================================================= */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#F5F2EA] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[11px] font-mono tracking-wider text-[#62676D] uppercase mb-4">
                <span>Self-Sustaining Model</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
                Digital Solutions Platform
              </h3>
              <p className="text-[#62676D] text-[15px] sm:text-[16px] leading-relaxed font-light">
                To independently finance our hardware prototypes without dilutive venture cycles, KITTY CORP operates an elite commercial studio developing high-performance web applications, business software, and workflow automation for growing enterprises.
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
      <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
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

          <p className="text-[15px] sm:text-[16px] leading-[1.65] text-[#62676D] font-light max-w-xl mx-auto mb-8">
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
          SECTION I: COLLABORATION & CONTACT — SEAMLESS TRANSITION TO ORBITAL FOOTER
          ========================================================================= */}
      <section className="pt-24 pb-32 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-gradient-to-b from-[#FBFAF7] via-[#FBFAF7] via-55% to-[#07090E] relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] text-[11px] font-mono tracking-widest text-[#62676D] uppercase mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
            <span>05 · Inquiries</span>
          </div>

          <h2 className="text-[clamp(30px,4.2vw,50px)] font-[family-name:var(--font-display)] font-normal leading-[1.12] tracking-[-0.025em] text-[#191B1D] mb-5">
            Building with researchers, engineers, and partners.
          </h2>

          <p className="text-[16px] sm:text-[18px] leading-[1.65] text-[#62676D] font-light max-w-2xl mx-auto mb-10">
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

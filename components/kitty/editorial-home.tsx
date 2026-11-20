"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Cpu, Leaf, Sun, Compass, HeartHandshake, ShieldCheck } from "lucide-react";

export function EditorialHome() {
  return (
    <div className="w-full bg-[#F5F2EA] text-[#191B1D] selection:bg-[#2457D6]/15 selection:text-[#191B1D]">
      
      {/* =========================================================================
          SECTION A: HERO — WARM MINIMALISM & ARCHITECTURAL PRECISION
          ========================================================================= */}
      <section className="relative min-h-[88vh] flex flex-col justify-between pt-24 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-4xl pt-6 sm:pt-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#62676D] uppercase mb-8 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Emerging Technology • India to the World</span>
          </div>

          <h1 className="text-[clamp(30px,7.5vw,84px)] font-[family-name:var(--font-display)] font-normal leading-[1.06] tracking-[-0.03em] text-[#191B1D] mb-8">
            Engineering <br className="sm:hidden" />
            intelligence <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">for the physical world.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.6] text-[#292D31] max-w-2xl font-normal mb-10">
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

        {/* Cinematic Blended Hero Visual: Autonomous Field Rover Chassis (Authentic Agricultural Rover) */}
        <div className="relative mt-16 w-full rounded-3xl overflow-hidden border border-[#D9D6CF] bg-[#FBFAF7] shadow-[0_4px_32px_rgba(0,0,0,0.03)] aspect-[16/9] max-h-[520px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/photography/agriyaan-field-robot.webp"
              alt="Autonomous field robotics platform navigating physical farmland terrain"
              fill
              priority
              className="object-cover object-center cinematic-fade-edges opacity-95"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Subtle atmospheric gradient overlay to blend into warm paper */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FBFAF7] via-transparent to-transparent opacity-60" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
            <div className="font-mono text-[11px] text-[#191B1D] bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] px-3.5 py-1.5 rounded-full w-fit tracking-wider uppercase flex items-center gap-2.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2457D6]" />
              <span>Autonomous Agricultural Robotics &amp; Field Kinematics Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: OUR BELIEF — PHYSICAL-WORLD INTELLIGENCE
          ========================================================================= */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] text-[11px] font-mono tracking-widest text-[#62676D] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
            <span>01 · Philosophy</span>
          </div>

          <h2 className="text-[clamp(32px,4.5vw,54px)] font-[family-name:var(--font-display)] font-normal leading-[1.12] tracking-[-0.025em] text-[#191B1D] mb-8">
            Intelligence should not remain bounded by glass displays.
          </h2>

          <div className="space-y-6 text-[17px] sm:text-[19px] leading-[1.75] text-[#292D31] font-light">
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
          ========================================================================= */}
      <section id="agriyaan" className="py-28 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[11px] font-mono tracking-widest text-[#2457D6] uppercase mb-6">
                <span>Flagship Initiative 01 · Agriculture</span>
              </div>

              <h2 className="text-[clamp(36px,4.8vw,60px)] font-[family-name:var(--font-display)] font-normal leading-[1.08] tracking-[-0.025em] text-[#191B1D] mb-4">
                KITTY AgriYaan
              </h2>
              
              <p className="text-[16px] font-medium text-[#292D31] mb-6">
                Agricultural Robotics &amp; Autonomous Field Systems
              </p>

              <div className="space-y-5 text-[16px] leading-[1.7] text-[#62676D] font-light mb-8">
                <p>
                  Agriculture in India and across the developing world faces an urgent convergence: climate volatility, unpredictable monsoons, soil compaction, and rural labor migration.
                </p>
                <p>
                  KITTY AgriYaan explores an autonomous ground rover equipped with multi-spectral crop inspection cameras, soil compaction sensors, and low-power edge computer vision designed to navigate dense crop canopies and unpaved mud terrain without destroying delicate soil biology.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 pt-2">
                <div className="p-4 rounded-xl border border-[#D9D6CF] bg-[#FBFAF7]">
                  <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">DOMAIN</span>
                  <span className="text-sm font-medium text-[#191B1D]">Precision Agriculture</span>
                </div>
                <div className="p-4 rounded-xl border border-[#D9D6CF] bg-[#FBFAF7]">
                  <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">CURRENT STATUS</span>
                  <span className="text-sm font-medium text-[#2457D6]">Simulation &amp; Kinematics</span>
                </div>
              </div>

              <Link
                href="/agriyaan"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#191B1D] hover:bg-[#292D31] text-white text-[14px] font-medium transition-all shadow-sm group"
              >
                <span>Read Full AgriYaan Initiative</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="lg:col-span-6">
              {/* Cinematic Edge-Blended Imagery */}
              <div className="relative rounded-3xl overflow-hidden border border-[#D9D6CF] bg-[#FBFAF7] aspect-[4/3] shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
                <Image
                  src="/photography/agriyaan-field-robot.webp"
                  alt="KITTY AgriYaan autonomous agricultural field rover prototype navigating soil terrain"
                  fill
                  className="object-cover object-center cinematic-fade-edges"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FBFAF7] via-transparent to-transparent opacity-40" />
                <div className="absolute bottom-5 left-6 text-[11px] font-mono text-[#191B1D] bg-[#FBFAF7]/90 px-3 py-1 rounded-full border border-[#D9D6CF]">
                  AgriYaan Autonomous Platform · Farmland Navigation Rig
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: FLAGSHIP INITIATIVE 02 — KITTY URJAAN
          ========================================================================= */}
      <section id="urjaan" className="py-28 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              {/* Cinematic Edge-Blended Solar Imagery */}
              <div className="relative rounded-3xl overflow-hidden border border-[#D9D6CF] bg-[#F5F2EA] aspect-[4/3] shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
                <Image
                  src="/photography/clean-energy-systems.webp"
                  alt="Solar photovoltaic array and intelligent clean energy microgrid infrastructure"
                  fill
                  className="object-cover object-center cinematic-fade-edges"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FBFAF7] via-transparent to-transparent opacity-40" />
                <div className="absolute bottom-5 left-6 text-[11px] font-mono text-[#191B1D] bg-[#FBFAF7]/90 px-3 py-1 rounded-full border border-[#D9D6CF]">
                  Urjaan Solar Optimization &amp; Storage Telemetry
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] text-[11px] font-mono tracking-widest text-[#2457D6] uppercase mb-6">
                <span>Flagship Initiative 02 · Clean Energy</span>
              </div>

              <h2 className="text-[clamp(36px,4.8vw,60px)] font-[family-name:var(--font-display)] font-normal leading-[1.08] tracking-[-0.025em] text-[#191B1D] mb-4">
                KITTY Urjaan
              </h2>
              
              <p className="text-[16px] font-medium text-[#292D31] mb-6">
                AI-Driven Clean Energy Management &amp; Solar Optimization
              </p>

              <div className="space-y-5 text-[16px] leading-[1.7] text-[#62676D] font-light mb-8">
                <p>
                  Deploying renewable generation is only half of the energy transition. Solar panels degrade unevenly under intense heat and dust, while battery storage systems fail prematurely when subjected to volatile charging spikes.
                </p>
                <p>
                  KITTY Urjaan is developing predictive algorithms that monitor photovoltaic cell degradation in real time, forecast localized generation against industrial loads, and balance decentralized microgrids for community energy independence.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 pt-2">
                <div className="p-4 rounded-xl border border-[#D9D6CF] bg-[#F5F2EA]">
                  <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">DOMAIN</span>
                  <span className="text-sm font-medium text-[#191B1D]">Clean Energy Infrastructure</span>
                </div>
                <div className="p-4 rounded-xl border border-[#D9D6CF] bg-[#F5F2EA]">
                  <span className="font-mono text-[10px] text-[#73777C] uppercase block mb-1">CURRENT STATUS</span>
                  <span className="text-sm font-medium text-[#2457D6]">Algorithmic Modeling</span>
                </div>
              </div>

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
      </section>

      {/* =========================================================================
          SECTION E: TECHNOLOGY FOUNDATIONS (KITTY AI & KITTY BUDDY)
          ========================================================================= */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
              03 · Core Platforms
            </span>
            <h2 className="text-[clamp(30px,4vw,48px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
              Foundational intelligence &amp; physical interaction.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">ARCHITECTURE</span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                    Active Development
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                  KITTY AI
                </h3>
                <p className="text-sm font-medium text-[#292D31] mb-2">Vision-Actuator Neural Controller Stack</p>
                <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                  Our software platform bridging 3D spatial computer vision directly with real-time robotic actuator controllers, providing physical machines with context-aware navigation and obstacle avoidance.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                CORE STACK · EMBEDDED REAL-TIME INFERENCE
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="font-mono text-xs text-[#73777C] uppercase tracking-widest">INTERACTION PROTOTYPE</span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                    Concept Exploration
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                  KITTY Buddy
                </h3>
                <p className="text-sm font-medium text-[#292D31] mb-2">Physical Human-Machine Companion Concept</p>
                <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                  An exploration into physical collaboration, testing tactile, non-intrusive companion devices that facilitate natural interaction without invasive biometric surveillance or screen fatigue.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                EXPLORATION · TACTILE INTERACTION
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: THE HORIZON — CINEMATIC BLENDED COSMIC INTEGRATION
          ========================================================================= */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[11px] font-mono tracking-widest text-[#2457D6] uppercase mb-6">
                <span>04 · The Horizon</span>
              </div>

              <h2 className="text-[clamp(32px,4.5vw,54px)] font-[family-name:var(--font-display)] font-normal leading-[1.12] tracking-[-0.025em] text-[#191B1D] mb-6">
                From Indian fields to the frontiers of exploration.
              </h2>

              <div className="space-y-6 text-[16px] sm:text-[18px] leading-[1.75] text-[#292D31] font-light">
                <p>
                  We are building from India, but our technological outlook is universal. The kinematics and sensory perception required for an autonomous rover to navigate dense soil under monsoon heat are the very principles needed to operate machines across harsh frontiers on Earth and beyond.
                </p>
                <p>
                  From monitoring deep ocean currents to exploring remote planetary surfaces, intelligent physical machines will help humanity observe environments that human physiology cannot safely enter.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              {/* Cinematic Radial Mask: Dissolves cosmos into warm paper */}
              <div className="relative rounded-3xl overflow-hidden border border-[#D9D6CF] bg-[#FBFAF7] aspect-[4/3] shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
                <Image
                  src="/photography/earth-cinematic-horizon.webp"
                  alt="Earth viewed from orbital observatory with blue atmospheric limb"
                  fill
                  className="object-cover object-center cinematic-blend-mask"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FBFAF7] via-transparent to-transparent opacity-30" />
                <div className="absolute bottom-5 left-6 text-[11px] font-mono text-[#191B1D] bg-[#FBFAF7]/90 px-3 py-1 rounded-full border border-[#D9D6CF]">
                  Orbital Perspective · Physical World Exploration
                </div>
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
          SECTION H: VOLUNTARY RESEARCH SUPPORT INVITATION (SEPARATE FROM MEMBERSHIP)
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
          SECTION I: COLLABORATION & CONTACT
          ========================================================================= */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#F5F2EA] text-[11px] font-mono tracking-widest text-[#62676D] uppercase mb-4">
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

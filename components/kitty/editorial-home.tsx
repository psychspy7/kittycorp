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
          SECTION E: ENGINEERING CAPABILITIES
          ========================================================================= */}
      <section id="engineering" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
              Engineering Capabilities
            </span>
            <h2 className="text-[clamp(30px,4vw,50px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
              From sensing to useful action.
            </h2>
            <p className="text-[16px] sm:text-[18px] leading-relaxed text-[#292D31] mt-5 max-w-2xl">
              Our work connects software, sensors and physical systems. We focus on the engineering foundations needed to make autonomous machines useful outside controlled environments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Cpu, title: "Embedded systems", body: "Hardware-aware software, edge computing and interfaces between sensors, processors and actuators." },
              { icon: Compass, title: "Autonomous operation", body: "Navigation, perception and control approaches for robots operating in changing terrain and conditions." },
              { icon: Orbit, title: "Field-ready engineering", body: "Testing, reliability and practical design constraints for agricultural and clean-energy environments." },
            ].map(({icon:Icon,title,body}) => <article key={title} className="rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] p-7 sm:p-8">
              <div className="w-11 h-11 rounded-xl bg-[#E9E6E0] border border-[#D9D6CF] flex items-center justify-center text-[#2457D6] mb-5"><Icon className="w-5 h-5" /></div>
              <h3 className="text-xl font-[family-name:var(--font-display)] text-[#191B1D] mb-3">{title}</h3>
              <p className="text-[15px] leading-relaxed text-[#292D31]">{body}</p>
            </article>)}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: RESEARCH & TESTING
          ========================================================================= */}
      <section id="research" className="py-20 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">Research &amp; Development</span>
            <h2 className="text-[clamp(30px,4.5vw,54px)] font-[family-name:var(--font-display)] font-normal leading-[1.1] tracking-[-0.025em] text-[#191B1D] mb-6">Test ideas. Build prototypes. Measure what works.</h2>
            <p className="text-[16px] sm:text-[18px] leading-[1.75] text-[#191B1D] font-normal mb-5">Our engineering process moves from models and simulations to bench testing and field evaluation. We document limitations and the stage of each initiative instead of presenting concepts as finished systems.</p>
            <Link href="/research" className="inline-flex items-center gap-2 text-[#2457D6] font-medium hover:underline">Inside the lab <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[["01","Simulation","Modeling mobility, sensing and system behavior."],["02","Prototype","Integrating hardware, firmware and software."],["03","Test","Evaluating performance under real constraints."],["04","Iterate","Publishing progress and refining the design."]].map(([n,title,body])=><div key={n} className="border-t border-[#D9D6CF] pt-4"><span className="font-mono text-xs text-[#2457D6]">{n}</span><h3 className="text-xl font-[family-name:var(--font-display)] text-[#191B1D] mt-2 mb-2">{title}</h3><p className="text-sm leading-relaxed text-[#62676D]">{body}</p></div>)}
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

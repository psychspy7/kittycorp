"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function VentureProjects() {
  return (
    <section id="projects" className="relative w-full py-24 px-6 sm:px-10 lg:px-14 border-t border-white/[0.08] bg-[#050506]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-10">
          <span>OUR RESEARCH PROJECTS</span>
          <div className="h-[1px] w-16 bg-white/[0.08] hidden sm:block ml-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 01: AGRIYAAN (col-span-5) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0c0d10] backdrop-blur-md overflow-hidden flex flex-col justify-between group hover:border-[#c5a880]/40 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            <div className="p-7">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-normal tracking-wide text-[#f8f8f9] flex items-center gap-2">
                  <span>01 AGRIYAAN</span>
                  <span className="sr-only">AgriYaan</span>
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">
                  CONCEPT EXPLORATION
                </span>
              </div>
              <p className="text-sm text-zinc-400 font-sans font-medium">AI for Smarter Agriculture</p>
              <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                Autonomous terrain-navigating rover equipped with multi-spectral vision for real-time crop disease detection and soil intelligence.
              </p>
            </div>

            {/* Authentic Planetary / Autonomous Rover Photography */}
            <div className="relative h-64 w-full overflow-hidden bg-black">
              <Image
                src="/photography/autonomous-rover.webp"
                alt="Authentic planetary autonomous rover chassis with multi-spectral sensor mast"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/[0.08] px-2.5 py-1 rounded text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                AUTONOMOUS ROVER CHASSIS
              </div>
            </div>

            <div className="p-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#a1a1aa] group-hover:text-zinc-200 transition-colors">
              <span>Autonomous field telemetry &amp; crop analytics</span>
              <span className="text-[#c5a880] group-hover:translate-x-1.5 transition-transform flex items-center gap-1 font-mono text-[11px]">
                EXPLORE <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 02: GREEN ENERGY (col-span-4) */}
          <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0c0d10] backdrop-blur-md overflow-hidden flex flex-col justify-between group hover:border-[#c5a880]/40 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            <div className="p-7">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-normal tracking-wide text-[#f8f8f9]">
                  02 GREEN ENERGY
                  <span className="sr-only">Green Energy</span>
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/30 text-amber-300 bg-amber-500/10">
                  CONCEPT EXPLORATION
                </span>
              </div>
              <p className="text-sm text-zinc-400 font-sans font-medium">AI for a Sustainable Future</p>
              <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                Algorithmic microgrid balancing, wind turbine blade pitch optimization, and predictive solar capture storage dispatch.
              </p>
            </div>

            {/* Authentic Clean Energy Systems Photography */}
            <div className="relative h-64 w-full overflow-hidden bg-black">
              <Image
                src="/photography/clean-energy-systems.webp"
                alt="Authentic modern clean energy engineering facility with wind turbines and solar arrays"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 1024px) 100vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/[0.08] px-2.5 py-1 rounded text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                RENEWABLE GRID INFRASTRUCTURE
              </div>
            </div>

            <div className="p-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#a1a1aa] group-hover:text-zinc-200 transition-colors">
              <span>Predictive grid balancing &amp; renewable optimization</span>
              <span className="text-[#c5a880] group-hover:translate-x-1.5 transition-transform flex items-center gap-1 font-mono text-[11px]">
                EXPLORE <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Membership Card Module (col-span-3) */}
          <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-[#0c0d10] backdrop-blur-md p-7 flex flex-col justify-between hover:border-white/[0.2] transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            <div>
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>OFFICIAL PATRON</span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-normal tracking-wide text-white">KITTY CORP MEMBERSHIP</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Get a verified metallic membership card &amp; access to all research updates.
              </p>

              {/* 3D Metallic Card Preview with Pedestal */}
              <div className="my-6 relative flex items-center justify-center">
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-4 border border-white/[0.1] shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative transform -rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-mono text-[10px] font-bold tracking-[0.2em]">KITTY CORP</span>
                    <span className="text-[9px] font-mono text-[#c5a880] border border-[#c5a880]/40 px-1.5 py-0.5 rounded">NFC</span>
                  </div>
                  <div className="text-center my-auto">
                    <div className="text-[11px] tracking-[0.25em] font-bold text-zinc-200 uppercase">MEMBERSHIP</div>
                    <div className="text-[9px] text-[#c5a880] font-mono tracking-wider mt-0.5">RESEARCH PATRON</div>
                  </div>
                  <div className="flex justify-between items-end text-[8px] font-mono text-zinc-500 border-t border-zinc-800 pt-2">
                    <span>VERIFIED 1-YEAR</span>
                    <span>2026-2027</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/memberships"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.15] hover:border-white/[0.3] bg-white/[0.04] hover:bg-white/[0.08] px-5 py-3 text-xs font-semibold text-white transition-all w-full shadow-sm group"
            >
              <span>Learn More</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FounderStorySection() {
  return (
    <section id="story" className="relative w-full py-28 px-6 sm:px-10 lg:px-14 border-t border-white/[0.08] overflow-hidden bg-[#050506]">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#a1a1aa] flex items-center gap-4 mb-12">
          <span>OUR STORY</span>
          <div className="h-[1px] bg-white/[0.08] w-24 inline-block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative Copy */}
          <div className="lg:col-span-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[#f8f8f9] font-normal leading-[1.12] mb-6 tracking-tight">
              <span className="sr-only">A Vision for a Smarter Tomorrow</span>
              A Vision for<br />
              <span className="italic font-light text-zinc-300">a Smarter Tomorrow.</span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed mb-6 font-[family-name:var(--font-sans)]">
              From everyday human collaboration to the deepest oceans and the furthest reaches of space, we dream bigger.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed mb-6 font-[family-name:var(--font-sans)]">
              KITTY CORP was founded on a simple conviction: artificial intelligence will reach its true zenith not when confined to glowing glass screens, but when engineered into the physical reality that sustains human civilization.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed mb-8 font-[family-name:var(--font-sans)]">
              From autonomous machinery tending agricultural harvests to intelligent controls harmonizing renewable energy grids, we dream bigger, engineering machines that navigate the complex dynamics of the physical universe.
            </p>

            <div className="border-l-2 border-[#c5a880] pl-4 py-1 mb-8">
              <div className="text-xs text-white font-mono font-semibold tracking-wider">
                VIRAT ANAND
                <span className="sr-only">Virat Anand</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-mono tracking-wide">
                FOUNDER &amp; CHIEF TECHNOLOGIST
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/company"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] hover:border-white/[0.35] bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3 text-xs font-medium text-white transition-all backdrop-blur-md"
              >
                <span>Discover Our Story</span>
                <span>→</span>
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] hover:border-white/[0.2] px-5 py-3 text-xs font-medium text-zinc-400 hover:text-white transition-all"
              >
                <span>Read Research Papers</span>
                <span className="text-[#c5a880]">↗</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Authentic Orbital ISS Cupola Earth Photography */}
          <div className="lg:col-span-6 relative h-80 sm:h-96 lg:h-[440px] rounded-2xl overflow-hidden border border-white/[0.08] bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
            <Image
              src="/photography/earth-orbit-iss.webp"
              alt="Authentic ISS Earth orbit horizon viewed through cupola observation window"
              fill
              className="object-cover object-center group-hover:scale-102 transition-transform duration-1000 opacity-95"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#a1a1aa] bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/[0.08]">
              <span className="text-[#c5a880] tracking-wider">ORBITAL OBSERVATION PLATFORM</span>
              <span className="tracking-wider">EARTH HORIZON TELEMETRY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

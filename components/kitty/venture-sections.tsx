"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function VentureProjects() {
  return (
    <section id="projects" className="relative w-full py-24 px-6 sm:px-10 lg:px-14 border-t border-white/10 bg-[#04060A]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#94a3b8] mb-10">
          <span>OUR RESEARCH PROJECTS</span>
          <div className="h-[1px] w-16 bg-white/15 hidden sm:block ml-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 01: AGRIYAAN (col-span-5) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/15 bg-zinc-950/80 backdrop-blur-md overflow-hidden flex flex-col justify-between group hover:border-[#38bdf8]/40 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="p-7">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-sans text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                  <span>01 AGRIYAAN</span>
                  <span className="sr-only">AgriYaan</span>
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">
                  CONCEPT EXPLORATION
                </span>
              </div>
              <p className="text-sm text-zinc-400 font-sans font-medium">AI for Smarter Agriculture</p>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Autonomous terrain-navigating rover equipped with multi-spectral vision for real-time crop disease detection and soil intelligence.
              </p>
            </div>

            {/* Visual Container: Rover in green crop field */}
            <div className="relative h-60 w-full overflow-hidden bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-950">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-zinc-950/60 to-zinc-950" />
              {/* High-Fidelity Futuristic Rover Vector Graphics */}
              <svg viewBox="0 0 500 240" className="w-full h-full object-cover p-4 opacity-85 group-hover:scale-105 transition-transform duration-700">
                <defs>
                  <linearGradient id="roverBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="cropField" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#052e16" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#14532d" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Farmland Horizon & Rows */}
                <rect x="0" y="160" width="500" height="80" fill="url(#cropField)" />
                <path d="M0 160 Q 250 145 500 160" stroke="#16a34a" strokeWidth="1.5" fill="none" opacity="0.6" />
                <path d="M50 175 Q 250 165 450 175" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.4" />
                <path d="M100 195 Q 250 185 400 195" stroke="#4ade80" strokeWidth="1" fill="none" opacity="0.3" />
                {/* Rover Wheels (6-wheel Rocker-Bogie) */}
                <circle cx="160" cy="180" r="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="160" cy="180" r="12" fill="#0f172a" />
                <circle cx="230" cy="180" r="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="230" cy="180" r="12" fill="#0f172a" />
                <circle cx="300" cy="180" r="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="300" cy="180" r="12" fill="#0f172a" />
                {/* Rocker-Bogie Linkage Arms */}
                <path d="M160 180 L 230 155 L 300 180" stroke="#64748b" strokeWidth="4" fill="none" />
                <path d="M230 155 L 250 130" stroke="#94a3b8" strokeWidth="5" fill="none" />
                {/* Rover Main Chassis */}
                <polygon points="180,140 310,140 330,110 200,110" fill="url(#roverBody)" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Sensor Mast & Multi-Spectral Camera */}
                <line x1="285" y1="110" x2="285" y2="70" stroke="#e2e8f0" strokeWidth="3" />
                <rect x="275" y="60" width="24" height="14" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="287" cy="67" r="4" fill="#38bdf8" />
                {/* Laser/Spectral Scanning Cones */}
                <polygon points="287,67 220,180 340,180" fill="#38bdf8" fillOpacity="0.12" />
                <line x1="287" y1="67" x2="220" y2="180" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
                <line x1="287" y1="67" x2="340" y2="180" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
                {/* Solar Panel Array on Top */}
                <polygon points="175,108 275,108 265,98 165,98" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
              </svg>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
              <span>Autonomous field telemetry &amp; crop analytics</span>
              <span className="text-[#38bdf8] group-hover:translate-x-1.5 transition-transform flex items-center gap-1 font-mono text-[11px]">
                EXPLORE <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 02: GREEN ENERGY (col-span-4) */}
          <div className="lg:col-span-4 rounded-2xl border border-white/15 bg-zinc-950/80 backdrop-blur-md overflow-hidden flex flex-col justify-between group hover:border-amber-400/40 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="p-7">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-sans text-2xl font-bold tracking-wider text-white">
                  02 GREEN ENERGY
                  <span className="sr-only">Green Energy</span>
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/30 text-amber-300 bg-amber-500/10">
                  CONCEPT EXPLORATION
                </span>
              </div>
              <p className="text-sm text-zinc-400 font-sans font-medium">AI for a Sustainable Future</p>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Algorithmic microgrid balancing, wind turbine blade pitch optimization, and predictive solar capture storage dispatch.
              </p>
            </div>

            {/* Visual Container: Wind turbines & solar arrays */}
            <div className="relative h-60 w-full overflow-hidden bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-950">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/30 via-zinc-950/60 to-zinc-950" />
              {/* High-Fidelity Renewable Landscape Graphic */}
              <svg viewBox="0 0 400 240" className="w-full h-full object-cover p-4 opacity-85 group-hover:scale-105 transition-transform duration-700">
                <defs>
                  <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#78350f" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="400" height="170" fill="url(#sunsetSky)" />
                {/* Distant Hills */}
                <path d="M0 160 Q 120 130 250 155 T 400 145 L 400 240 L 0 240 Z" fill="#18181b" />
                {/* Wind Turbines */}
                {/* Main Turbine */}
                <line x1="220" y1="165" x2="220" y2="60" stroke="#f1f5f9" strokeWidth="2.5" />
                <circle cx="220" cy="60" r="4" fill="#38bdf8" />
                {/* Rotating blades */}
                <line x1="220" y1="60" x2="220" y2="15" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                <line x1="220" y1="60" x2="260" y2="82" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                <line x1="220" y1="60" x2="180" y2="82" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                {/* Second Turbine */}
                <line x1="120" y1="165" x2="120" y2="90" stroke="#94a3b8" strokeWidth="1.8" />
                <circle cx="120" cy="90" r="3" fill="#94a3b8" />
                <line x1="120" y1="90" x2="145" y2="65" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="120" y1="90" x2="135" y2="115" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="120" y1="90" x2="95" y2="95" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                {/* Solar Arrays in Foreground */}
                <polygon points="50,195 130,195 110,215 30,215" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="1.2" />
                <polygon points="150,195 230,195 210,215 130,215" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="1.2" />
                <polygon points="250,195 330,195 310,215 230,215" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="1.2" />
                {/* Energy Flow Lines */}
                <path d="M220 60 Q 280 120 280 195" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" fill="none" opacity="0.7" />
              </svg>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
              <span>Predictive grid balancing &amp; renewable optimization</span>
              <span className="text-amber-400 group-hover:translate-x-1.5 transition-transform flex items-center gap-1 font-mono text-[11px]">
                EXPLORE <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Membership Card Module (col-span-3) */}
          <div className="lg:col-span-3 rounded-2xl border border-white/15 bg-zinc-950/80 backdrop-blur-md p-7 flex flex-col justify-between hover:border-white/30 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div>
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>OFFICIAL PATRON</span>
              </div>
              <h3 className="font-sans text-xl font-bold tracking-wide text-white">KITTY CORP MEMBERSHIP</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Get a verified metallic membership card &amp; access to all research updates.
              </p>

              {/* 3D Metallic Card Preview with Pedestal */}
              <div className="my-6 relative flex items-center justify-center">
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-4 border border-zinc-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative transform -rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-mono text-[10px] font-bold tracking-[0.2em]">KITTY CORP</span>
                    <span className="text-[9px] font-mono text-[#38bdf8] border border-[#38bdf8]/40 px-1.5 py-0.5 rounded">NFC</span>
                  </div>
                  <div className="text-center my-auto">
                    <div className="text-[11px] tracking-[0.25em] font-bold text-zinc-200 uppercase">MEMBERSHIP</div>
                    <div className="text-[9px] text-[#38bdf8] font-mono tracking-wider mt-0.5">RESEARCH PATRON</div>
                  </div>
                  <div className="flex justify-between items-end text-[8px] font-mono text-zinc-500 border-t border-zinc-800 pt-2">
                    <span>VERIFIED 1-YEAR</span>
                    <span>2026—2027</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/memberships"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 hover:border-white/50 bg-white/5 hover:bg-white/10 px-5 py-3 text-xs font-semibold text-white transition-all w-full shadow-sm group"
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
    <section id="story" className="relative w-full py-28 px-6 sm:px-10 lg:px-14 border-t border-white/10 overflow-hidden bg-gradient-to-b from-[#070911] via-[#04060A] to-[#070911]">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#94a3b8] flex items-center gap-4 mb-12">
          <span>OUR STORY</span>
          <div className="h-[1px] bg-white/15 w-24 inline-block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative Copy */}
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.12] mb-6 tracking-tight">
              <span className="sr-only">A Vision for a Smarter Tomorrow</span>
              A Vision for<br />
              <span className="italic font-light text-zinc-200">a Smarter Tomorrow.</span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed mb-6">
              From everyday human collaboration to the deepest oceans and the furthest reaches of space — we dream bigger.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed mb-6">
              KITTY CORP was founded on a simple conviction: artificial intelligence will reach its true zenith not when confined to glowing glass screens, but when engineered into the physical reality that sustains human civilization.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed mb-8">
              From autonomous machinery tending agricultural harvests to intelligent controls harmonizing renewable energy grids — we dream bigger, engineering machines that navigate the complex dynamics of the physical universe.
            </p>

            <div className="border-l-2 border-[#38bdf8] pl-4 py-1 mb-8">
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
                className="inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-medium text-white transition-all backdrop-blur-md"
              >
                <span>Discover Our Story</span>
                <span>→</span>
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-white/25 px-5 py-3 text-xs font-medium text-zinc-400 hover:text-white transition-all"
              >
                <span>Read Research Papers</span>
                <span className="text-[#38bdf8]">↗</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Orbital Observation Dome Window */}
          <div className="lg:col-span-6 relative h-80 sm:h-96 lg:h-[440px] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            {/* Visual: Orbital Cupola Dome looking out at Earth horizon */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0c4a6e]/40 via-[#0284c7]/10 to-black" />
            <svg viewBox="0 0 600 440" className="w-full h-full object-cover">
              {/* Deep Space Stars */}
              <circle cx="80" cy="50" r="1" fill="#fff" opacity="0.8" />
              <circle cx="210" cy="80" r="1.5" fill="#38bdf8" opacity="0.7" />
              <circle cx="340" cy="40" r="1" fill="#fff" opacity="0.5" />
              <circle cx="490" cy="90" r="1" fill="#fff" opacity="0.9" />
              <circle cx="150" cy="120" r="1.2" fill="#fff" opacity="0.6" />
              <circle cx="420" cy="140" r="1.5" fill="#38bdf8" opacity="0.7" />

              {/* Earth Atmospheric Rim */}
              <path d="M-100 480 Q 300 240 700 480" fill="#020617" />
              <path d="M-100 480 Q 300 240 700 480" stroke="#38bdf8" strokeWidth="4" fill="none" opacity="0.8" />
              <path d="M-100 485 Q 300 245 700 485" stroke="#60a5fa" strokeWidth="8" fill="none" opacity="0.3" filter="blur(4px)" />

              {/* Cupola Window Structural Arches & Ribs */}
              <ellipse cx="300" cy="220" rx="260" ry="190" fill="none" stroke="#334155" strokeWidth="8" />
              <ellipse cx="300" cy="220" rx="252" ry="182" fill="none" stroke="#0f172a" strokeWidth="6" />

              {/* Window mullions / dividing struts */}
              <line x1="300" y1="30" x2="300" y2="410" stroke="#1e293b" strokeWidth="6" />
              <line x1="80" y1="120" x2="520" y2="320" stroke="#1e293b" strokeWidth="5" />
              <line x1="80" y1="320" x2="520" y2="120" stroke="#1e293b" strokeWidth="5" />

              {/* Central Observation Hatch Ring */}
              <circle cx="300" cy="220" r="70" fill="none" stroke="#475569" strokeWidth="5" />
              <circle cx="300" cy="220" r="66" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

              {/* Silhouette of human technologist standing in front of window */}
              <path d="M290 380 Q 285 320 292 290 Q 296 270 300 255 Q 304 270 308 290 Q 315 320 310 380 Z" fill="#020617" />
              <circle cx="300" cy="242" r="10" fill="#020617" />
            </svg>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-[#38bdf8]">ORBITAL OBSERVATION PLATFORM</span>
              <span>EARTH HORIZON TELEMETRY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

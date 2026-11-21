import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Compass, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "KITTY AgriYaan | Agricultural Robotics",
  "KITTY AgriYaan explores crop monitoring, field sensing, terrain mobility and edge vision for Indian farming and autonomous agricultural systems." ,
  "/agriyaan"
);

export default function AgriYaanPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />

      <main id="main">
        {/* =========================================================================
            HERO: KITTY AGRIYAAN: PHOTOGRAPHIC INTEGRATION & MOBILE-FIRST STACKING
            ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-[#F5F2EA] border-b border-[#D9D6CF]">
          {/* Mobile Viewport: Image First */}
          <div className="block lg:hidden px-6 pt-24 pb-4">
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
            <p className="mt-2 text-[11px] font-mono text-[#73777C] uppercase tracking-wider">
              AgriYaan Physical Kinematics Rig · Mud &amp; Canopy Autonomy
            </p>
          </div>

          {/* Desktop Photographic Background Layer */}
          <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/photography/agriyaan-field-robot.webp"
              alt="KITTY AgriYaan agricultural rover chassis navigating rugged field topography"
              fill
              priority
              className="object-cover object-[75%_center] lg:object-[82%_center] opacity-90 lg:opacity-95"
              sizes="100vw"
            />
            {/* Seamless horizontal gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EA] via-[#F5F2EA]/95 via-45% to-transparent/15" />
            {/* Seamless top and bottom vertical gradient fades */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2EA] via-transparent via-15% to-[#F5F2EA]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full py-12 lg:py-32 px-6 sm:px-10 lg:px-16 flex items-center min-h-[580px] lg:min-h-[720px]">
            <div className="max-w-3xl bg-[#F5F2EA]/95 lg:bg-transparent rounded-2xl p-2 lg:p-0">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Precision Agriculture
              </span>

              <h1 className="text-[clamp(36px,7.5vw,78px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
                KITTY AgriYaan
              </h1>

              <p className="text-[20px] sm:text-[24px] font-light leading-[1.4] text-[#292D31] mb-8 max-w-2xl">
                Autonomous field robotics engineered for unpredictable soil, dense canopies, and living environments.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#73777C] pb-4">
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] text-[#191B1D] font-medium">
                  STAGE: SIMULATION &amp; KINEMATICS
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] text-[#191B1D] font-medium">
                  DOMAIN: SOIL &amp; CANOPY AUTONOMY
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] text-[#2457D6] font-medium">
                  ORIGIN: INDIA TO GLOBAL FARMLANDS
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-8 right-10 z-10 font-mono text-[11px] text-[#191B1D] bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
            AgriYaan Physical Chassis Rig · Multi-Terrain Articulation
          </div>
        </section>

        {/* =========================================================================
            CONTEXT & PURPOSE: THE CHALLENGE IN THE LIVING FIELD
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
              Context and Purpose
            </span>

            <h2 className="text-[clamp(28px,3.8vw,46px)] font-[family-name:var(--font-display)] font-normal leading-[1.15] text-[#191B1D] mb-8">
              Why agriculture demands physical-world intelligence.
            </h2>

            <div className="space-y-6 text-[17px] sm:text-[19px] leading-[1.8] text-[#292D31] font-light">
              <p>
                In India and agricultural economies globally, farming is caught between two unsustainable extremes: either reliance on intensive, backbreaking manual field labor during extreme heatwaves, or the deployment of heavy 3-to-5 ton diesel machinery that heavily compacts topsoil and destroys delicate microbial fungal networks.
              </p>
              <p>
                Traditional automation tools assume manicured, asphalt-paved factory floors or perfectly leveled Western mega-farms. Smallholder plots across South Asia feature unpaved mud furrows, unpredictable water channels, shifting monsoonal topography, and irregular inter-crop spacing.
              </p>
              <p>
                KITTY AgriYaan is conceived from the ground up for these exact real-world realities: lightweight robotics that tread softly, navigate autonomously through dense vegetative canopies, and assess plant health plant-by-plant without satellite latency.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ENGINEERING SYSTEMS: CORE ARCHITECTURE PILLARS
            ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Engineering Systems
              </span>
              <h2 className="text-[clamp(30px,4vw,48px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
                Engineered for mud, dust, and living ecosystems.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Low-Compaction Lightweight Chassis
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Weighing under 45 kg, the rover&apos;s articulated rocker-bogie kinematics distribute ground pressure evenly, allowing full mobility over wet mud furrows without damaging fragile rhizosphere root systems.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  KINEMATICS · SUB-45KG CLASS
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Multi-Spectral Edge Vision Stack
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Onboard low-power compute processes stereo RGB and narrow-band near-infrared (NIR) video streams directly on the rover, computing NDVI indexes and spotting early blight or pest infestations in milliseconds.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  PERCEPTION · ZERO CLOUD LATENCY
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Canopy-Level Localized Navigation
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Under thick crop canopies where GPS reception frequently degrades, the navigation stack seamlessly fuses visual inertial odometry (VIO) with wheel encoders to maintain centimeter-accurate row traversal.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  AUTONOMY · VIO + STEREO SLAM
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            CURRENT STAGE: DEVELOPMENT ROADMAP
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#F5F2EA]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[11px] font-mono tracking-wider text-[#62676D] uppercase mb-5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2457D6]" />
                <span>Technical Milestone Status</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
                Where AgriYaan stands today.
              </h2>

              <p className="text-[16px] leading-[1.75] text-[#292D31] font-light mb-6">
                AgriYaan is currently in active physical prototyping and kinematics simulation. We are not selling commercial consumer farm units today.
              </p>

              <div className="space-y-3 font-mono text-xs text-[#62676D] border-t border-[#D9D6CF] pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#2457D6] shrink-0" />
                  <span>Phase 1 Completed: Multi-terrain suspension simulation and CAD structural FEA stress models.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full border-2 border-[#2457D6] shrink-0" />
                  <span className="text-[#191B1D] font-medium">Phase 2 Active: 1:1 scale chassis fabrication, brushless hub motor telemetry, and edge vision bench testing.</span>
                </div>
                <div className="flex items-center gap-3 text-[#73777C]">
                  <span className="w-4 h-4 rounded-full border border-[#D9D6CF] shrink-0" />
                  <span>Phase 3 Scheduled: Agrarian field trials across regional partner test plots in India.</span>
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
              Collaborate on agricultural robotics.
            </h2>
            <p className="text-[16px] sm:text-[18px] leading-[1.65] text-[#62676D] font-light max-w-2xl mx-auto mb-10">
              We actively welcome agronomy researchers, roboticists, embedded systems engineers, and progressive agricultural operators interested in field test partnerships.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-colors shadow-sm"
              >
                <span>Partner on Field Trials</span>
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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Heart, Sparkles, Cpu } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "KITTY Buddy | Physical AI Companion",
  "KITTY Buddy is an exploratory physical AI companion concept for voice interaction, tactile feedback and privacy-conscious human-machine collaboration."
  "/buddy"
);

export default function BuddyPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />

      <main id="main">
        {/* =========================================================================
            HERO: KITTY BUDDY: COMPANION ROBOT PHOTOGRAPHIC INTEGRATION
            ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-[#FBFAF7] border-b border-[#D9D6CF]">
          {/* Mobile Viewport: Image First */}
          <div className="block lg:hidden px-6 pt-24 pb-4">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#D9D6CF]">
              <Image
                src="/photography/kitty-buddy-companion.webp"
                alt="KITTY Buddy physical desktop companion robot prototype"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="mt-2 text-[11px] font-mono text-[#73777C] uppercase tracking-wider">
              KITTY Buddy Concept Prototype · Tactile Head Articulation
            </p>
          </div>

          {/* Desktop Photographic Background Layer */}
          <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/photography/kitty-buddy-companion.webp"
              alt="KITTY Buddy physical desktop companion robot prototype with Kitty branding"
              fill
              priority
              className="object-cover object-[80%_center] opacity-90"
              sizes="100vw"
            />
            {/* Seamless horizontal gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FBFAF7] via-[#FBFAF7]/95 via-45% to-transparent/15" />
            {/* Seamless top and bottom vertical gradient fades */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBFAF7] via-transparent via-15% to-[#FBFAF7]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full py-12 lg:py-32 px-6 sm:px-10 lg:px-16 flex items-center min-h-[580px] lg:min-h-[720px]">
            <div className="max-w-2xl bg-[#FBFAF7]/95 lg:bg-transparent rounded-2xl p-2 lg:p-0">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Human-Machine Interaction
              </span>

              <h1 className="text-[clamp(36px,7.5vw,76px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
                KITTY Buddy
              </h1>

              <p className="text-[20px] sm:text-[23px] font-light leading-[1.4] text-[#292D31] mb-8 max-w-2xl">
                A physical desktop companion robot exploring tactile, non-intrusive human-machine collaboration.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#73777C] pb-4">
                <span className="px-3.5 py-1.5 rounded-lg bg-[#F5F2EA]/90 backdrop-blur-md border border-[#D9D6CF] text-[#191B1D] font-medium">
                  STAGE: CONCEPT EXPLORATION
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#F5F2EA]/90 backdrop-blur-md border border-[#D9D6CF] text-[#191B1D] font-medium">
                  DOMAIN: EMBODIED COMPANIONSHIP
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-[#F5F2EA]/90 backdrop-blur-md border border-[#D9D6CF] text-[#2457D6] font-medium">
                  FOCUS: NON-VERBAL PHYSICAL EXPRESSION
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-8 right-10 z-10 font-mono text-[11px] text-[#191B1D] bg-[#FBFAF7]/90 backdrop-blur-md border border-[#D9D6CF] px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
            KITTY Buddy Concept Prototype · Tactile Head Articulation
          </div>
        </section>

        {/* =========================================================================
            PURPOSE: WHY EMBODIED COMPANIONSHIP MATTERS
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
              Context and Purpose
            </span>

            <h2 className="text-[clamp(28px,3.8vw,46px)] font-[family-name:var(--font-display)] font-normal leading-[1.15] text-[#191B1D] mb-8">
              Why human-machine interaction needs physical form.
            </h2>

            <div className="space-y-6 text-[17px] sm:text-[19px] leading-[1.8] text-[#292D31] font-light">
              <p>
                Modern digital life is dominated by notification fatigue, glowing screens, and invasive biometric trackers. Conversational AI assistants have largely been confined to flat glass displays or cold, disembodied smart speakers.
              </p>
              <p>
                KITTY Buddy is an exploratory prototype testing how physical embodiment fundamentally changes how humans perceive and collaborate with machines. Through small mechanical gestures, subtle posture shifts, and calibrated gaze direction, a physical robot can communicate intention and status far more calmly than a noisy notification banner.
              </p>
              <p>
                Critically, we design for domestic and professional spaces where privacy is non-negotiable. KITTY Buddy explores on-device tactile interaction without constant audio listening or cloud video surveillance.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            DESIGN PRINCIPLES
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-14">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                Design Principles
              </span>
              <h2 className="text-[clamp(28px,3.8vw,44px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
                Calm engineering for shared human environments.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-[#191B1D] mb-3">Non-Verbal Expression</h3>
                <p className="text-sm text-[#62676D] font-light leading-relaxed">
                  Communicating status, affirmation, and focus through micro-kinematics and physical head tilts rather than synthetic voice interruptions.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-[#191B1D] mb-3">Privacy-First Architecture</h3>
                <p className="text-sm text-[#62676D] font-light leading-relaxed">
                  Operates with deterministic local control algorithms. No ambient audio logging, no facial surveillance, and no cloud biometric streaming.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7]">
                <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-6">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium text-[#191B1D] mb-3">Edge Neural Inference</h3>
                <p className="text-sm text-[#62676D] font-light leading-relaxed">
                  Taps into the low-power behavioral branch of KITTY AI for smooth kinematic response curves and responsive interaction timing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TECHNICAL SPECIFICATIONS & EXPLORATION PARAMETERS
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
              Exploration Parameters
            </span>

            <h2 className="text-[clamp(28px,3.8vw,44px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-8">
              Current prototype architecture.
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#73777C] uppercase block mb-1">Articulation &amp; Motion</span>
                  <span className="text-base font-medium text-[#191B1D]">Multi-Axis Smooth Kinematic Motion</span>
                </div>
                <span className="text-xs font-mono text-[#2457D6] sm:text-right">Silent Precision Actuation</span>
              </div>

              <div className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#73777C] uppercase block mb-1">Sensory Interaction</span>
                  <span className="text-base font-medium text-[#191B1D]">Low-Latency Tactile &amp; Proximity Awareness</span>
                </div>
                <span className="text-xs font-mono text-[#2457D6] sm:text-right">Local Surface Sensing</span>
              </div>

              <div className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#73777C] uppercase block mb-1">System Processing</span>
                  <span className="text-base font-medium text-[#191B1D]">Embedded Real-Time Control &amp; Behavioral Timing</span>
                </div>
                <span className="text-xs font-mono text-[#2457D6] sm:text-right">Fully Local Execution</span>
              </div>

              <div className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#73777C] uppercase block mb-1">Industrial Enclosure</span>
                  <span className="text-base font-medium text-[#191B1D]">Precision-Machined Desktop Shell with Anodised Accents</span>
                </div>
                <span className="text-xs font-mono text-[#2457D6] sm:text-right">Tactile Composite</span>
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
              Explore Our Broader Physical AI Systems
            </h2>
            <p className="text-[#62676D] font-light leading-relaxed max-w-xl mx-auto mb-8 text-[16px]">
              KITTY Buddy is one branch of our work exploring how intelligent systems interact with the real world, alongside our agricultural and clean energy robotics platforms.
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
                <span>Connect with the Team</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

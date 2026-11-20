import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, HeartHandshake, ShieldCheck, Sparkles, Check, Users, Award } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { BottomSupport } from "@/components/kitty/bottom-support";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "Support Our Research • Voluntary Lab Patronage",
  "Voluntarily support KITTY CORP's independent physical AI, agricultural robotics (AgriYaan), and clean energy systems (Urjaan). Supporter recognition and open research updates.",
  "/support"
);

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />

      <main id="main">
        {/* =========================================================================
            HERO: VOLUNTARY RESEARCH SUPPORT
            ========================================================================= */}
        <section className="pt-24 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-8 max-w-[94vw]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#2457D6] shrink-0" />
              <span className="truncate">Voluntary Research Support · Completely Separate Offering</span>
            </div>

            <h1 className="text-[clamp(32px,7.5vw,74px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
              Support Our Research
            </h1>

            <p className="text-[20px] sm:text-[23px] font-light leading-[1.4] text-[#62676D] mb-8">
              Fuel the independent development of physical-world artificial intelligence, field rovers, and clean energy systems.
            </p>

            <div className="p-4 rounded-xl border border-[#D9D6CF] bg-[#FBFAF7] max-w-2xl text-[14px] text-[#62676D] leading-relaxed">
              <strong className="text-[#191B1D] font-medium block mb-1">Clear Distinction &amp; Non-Equity Disclosure</strong>
              Voluntary research support is not a membership or subscription. It confers no corporate equity, voting rights, profit sharing, or commercial deliverables. 100% of contributions are allocated directly to hardware components, sensors, and open research benchmarks.
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 01: CONTRIBUTION PANEL
            ========================================================================= */}
        <section className="py-16 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#F5F2EA] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <div className="mb-8">
                <span className="font-mono text-xs uppercase tracking-widest text-[#2457D6] block mb-2">
                  01 · Make a Voluntary Contribution
                </span>
                <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
                  Select your contribution level
                </h2>
                <p className="text-[#62676D] text-[15px] font-light mt-2">
                  Encrypted Razorpay checkout supporting UPI, debit/credit cards, and net banking across India and internationally.
                </p>
              </div>

              {/* Grid of Preset Amounts */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                {[
                  { inr: "500", label: "₹500" },
                  { inr: "1000", label: "₹1,000" },
                  { inr: "2500", label: "₹2,500" },
                  { inr: "5000", label: "₹5,000" },
                  { inr: "10000", label: "₹10,000" },
                ].map((tier) => (
                  <Link
                    key={tier.inr}
                    href={`/payments?purpose=donation&amount=${tier.inr}`}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#D9D6CF] bg-[#FBFAF7] hover:border-[#2457D6] hover:bg-white text-center transition-all group"
                  >
                    <span className="text-lg font-semibold text-[#191B1D] group-hover:text-[#2457D6]">{tier.label}</span>
                    <span className="text-[10px] font-mono text-[#73777C] mt-1">VOLUNTARY</span>
                  </Link>
                ))}
              </div>

              {/* Custom Amount Form Alternative */}
              <div className="pt-6 border-t border-[#D9D6CF]">
                <BottomSupport />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: SUPPORTER RECOGNITION & PERKS
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#E9E6E0]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-12">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-3">
                02 · Supporter Recognition
              </span>
              <h2 className="text-[clamp(28px,3.8vw,46px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D]">
                How we acknowledge our scientific patrons.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Perk 1 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Digital Supporter Badge
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Every voluntary contributor receives a high-resolution, cryptographically signed digital supporter badge for display on personal profiles and resumes.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  VERIFICATION · DIGITAL BADGE
                </div>
              </div>

              {/* Perk 2 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Supporter Recognition Roll
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Optional public acknowledgment on our official research repository acknowledgments page and in published open-source robotics documentation.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  ATTRIBUTION · COMMUNITY ROLL
                </div>
              </div>

              {/* Perk 3 */}
              <div className="p-8 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-normal font-[family-name:var(--font-display)] text-[#191B1D] mb-3">
                    Biannual Research Digest
                  </h3>
                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    Direct emails detailing experimental progress on the AgriYaan rover, Urjaan algorithms, and hardware milestones directly from our laboratory.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#D9D6CF] text-xs font-mono text-[#73777C]">
                  DIGEST · BIANNUAL BRIEFING
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 03: SUPPORTER RECOGNITION ROLL
            ========================================================================= */}
        <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#FBFAF7]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
                Research Supporter Roll
              </h2>
              <p className="text-[#62676D] text-[15px] font-light">
                We express sincere gratitude to early individual patrons who believe in our physical AI mission.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#D9D6CF] bg-[#F5F2EA] flex flex-wrap justify-center gap-3">
              {[
                "Dr. R. Sharma",
                "K. Subramanian",
                "Arjun M.",
                "Priya K. Mehta",
                "S. Venkatesh",
                "Vikram Malhotra",
                "Naveen Gupta",
                "Anonymous Patron #04",
                "Anonymous Patron #09",
                "Aditi R.",
                "Rohan Deshmukh",
                "Siddharth Verma",
              ].map((name, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-xs font-mono text-[#292D31]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 04: LOOKING FOR MEMBERSHIP OR COMMERCIAL SERVICES?
            ========================================================================= */}
        <section className="py-24 px-6 sm:px-10 lg:px-16 border-t border-[#D9D6CF] bg-[#F5F2EA]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[clamp(28px,3.8vw,44px)] font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
              Looking for our structured membership?
            </h2>
            <p className="text-[16px] leading-[1.65] text-[#62676D] font-light max-w-2xl mx-auto mb-8">
              If you seek our official metallic NFC card, early access to confidential research papers, and a complimentary custom business website, explore KITTY ONE.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/memberships"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-colors shadow-sm"
              >
                <span>Explore KITTY ONE ($249)</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <a
                href="https://demo.thekittycorp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] hover:bg-[#E9E6E0] text-[#191B1D] text-[14px] font-medium transition-colors"
              >
                <span>Digital Solutions Studio</span>
                <ArrowUpRight className="w-4 h-4 text-[#2457D6]" />
              </a>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}

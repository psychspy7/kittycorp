import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { JournalCards } from "@/components/kitty/journal";
import { publicJournal } from "@/lib/journal-server";
import { Cpu, Leaf, Sun, Users, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "AI & Robotics Research • Laboratory Directions",
  "Explore KITTY CORP's research directions in physical intelligence, agricultural autonomous rovers, and intelligent clean energy management. Concepts clearly separated by development stage.",
  "/research"
);

const researchAreas = [
  {
    num: "01",
    title: "Agricultural Robotics & Autonomous Field Systems",
    icon: Leaf,
    tag: "Simulation & Kinematics",
    domain: "AGRIYAAN ROVER",
    href: "/agriyaan",
    linkText: "Explore AgriYaan Initiative",
    copy: "Investigating how low-power edge computer vision and autonomous ground mobility can support precision farming across diverse Indian topographies. Research addresses multi-spectral crop inspection, soil compaction sensors, and obstacle avoidance in unpaved mud and dense vegetation.",
  },
  {
    num: "02",
    title: "Clean Energy Microgrids & Solar Optimization",
    icon: Sun,
    tag: "Algorithmic Telemetry",
    domain: "URJAAN INTELLIGENCE",
    href: "/urjaan",
    linkText: "Explore Urjaan Initiative",
    copy: "Developing predictive telemetry software to calculate solar panel degradation rates under extreme weather, optimize battery charge/discharge cycles during peak industrial demand, and dynamically balance decentralized rural microgrids.",
  },
  {
    num: "03",
    title: "Physical Intelligence & Actuator Control",
    icon: Cpu,
    tag: "Bench Prototyping",
    domain: "KITTY AI ARCHITECTURE",
    href: "/contact?subject=KittyAI",
    linkText: "Academic Collaboration",
    copy: "Research into closed-loop neural architectures that bridge spatial 3D vision with real-time robotic motor kinematics, enabling physical machines to perceive, reason about, and adapt to unstructured real-world terrain.",
  },
  {
    num: "04",
    title: "Tactile Human-Machine Interaction",
    icon: Users,
    tag: "Form Factor Exploration",
    domain: "KITTY BUDDY",
    href: "/contact?subject=KittyBuddy",
    linkText: "Interaction Inquiries",
    copy: "Exploring non-intrusive companion devices that give physical, tangible presence to intelligent assistants, prioritizing physical privacy, tactile feedback, and natural collaboration without intrusive surveillance.",
  },
];

export default async function Research() {
  const journal = await publicJournal().catch(() => []);
  const entries = journal.filter((e) => e.kind === "article" && e.category === "Research");

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Page Heading */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">04 · Inside the Laboratory</span>
          </div>

          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            AI and robotics, <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">explored honestly.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl">
            KITTY CORP is an independent technology team pursuing physical-world intelligence. We maintain strict scientific honesty: early research directions and simulated concepts are never conflated with field-proven commercial hardware.
          </p>
        </div>

        {/* Research Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {researchAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article
                key={area.num}
                className="p-8 sm:p-10 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="font-mono text-xs text-[#73777C] font-medium tracking-widest">
                      {area.num} · {area.domain}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#D9D6CF] text-[#62676D] bg-[#F5F2EA]">
                      {area.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#E9E6E0] flex items-center justify-center text-[#2457D6] mb-5">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h2 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-3">
                    {area.title}
                  </h2>

                  <p className="text-[#62676D] font-light leading-relaxed text-[15px]">
                    {area.copy}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#D9D6CF] flex items-center justify-between text-xs text-[#73777C]">
                  <span className="font-mono">VALIDATION: ACTIVE LAB EXPERIMENT</span>
                  <Link href={area.href} className="text-[#2457D6] font-medium flex items-center gap-1 hover:underline">
                    {area.linkText} <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Ethical Transparency Note */}
        <div className="p-8 sm:p-10 rounded-2xl border border-[#D9D6CF] bg-[#FBFAF7] mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2457D6] font-medium block mb-2">
            Scientific Integrity Policy
          </span>
          <p className="text-[#292D31] font-light leading-relaxed text-[15px] max-w-3xl">
            We share build notes, simulation logs, and engineering telemetry as concrete benchmarks are reached. Physical prototypes are tested under real atmospheric and soil conditions before published claims are made.
          </p>
        </div>

        {/* Research Notes Section */}
        {entries.length > 0 && (
          <section className="product-development mb-20">
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-8">
              Research notes &amp; publication drafts
            </h2>
            <JournalCards entries={entries} />
          </section>
        )}

      </main>
      <SiteFooter />
    </div>
  );
}

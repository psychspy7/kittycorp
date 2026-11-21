import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { TeamProfiles } from "@/components/kitty/home-sections";
import { companySettings, companyTeam } from "@/lib/company-server";

export const revalidate = 86400;

export const metadata = pageMetadata(
  "KITTY CORP | Leadership",
  "The KITTY CORP team builds Physical-World Intelligence across AI robotics, agricultural systems, solar energy research and commercial digital engineering." ,
  "/team"
);

export default async function TeamPage() {
  const [members, settings] = await Promise.all([companyTeam(), companySettings()]);

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#191B1D]">
      <SiteHeader />
      <main id="main" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        
        {/* Page Heading */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[10px] sm:text-[11px] font-mono tracking-tight sm:tracking-widest text-[#2457D6] uppercase mb-6 max-w-[94vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6] shrink-0" />
            <span className="truncate">Engineering Roster</span>
          </div>

          <h1 className="text-[clamp(32px,7.5vw,72px)] font-[family-name:var(--font-display)] font-normal leading-[1.05] tracking-[-0.03em] text-[#191B1D] mb-6">
            The engineers and builders <br className="hidden sm:block" />
            <span className="font-light text-[#62676D] block sm:inline mt-1 sm:mt-0">behind KITTY CORP.</span>
          </h1>

          <p className="text-[18px] sm:text-[21px] leading-[1.65] text-[#292D31] font-light max-w-2xl">
            {settings.team_intro ||
              "An interdisciplinary team spanning mechanical design, edge computer vision, embedded firmware, and commercial software architecture."}
          </p>
        </div>

        {/* Profiles */}
        <section className="mb-20">
          {members.length ? (
            <TeamProfiles members={members} />
          ) : (
            <p className="p-8 rounded-2xl bg-[#FBFAF7] border border-[#D9D6CF] text-[#73777C]">
              Team profiles will be added here.
            </p>
          )}
        </section>

        {/* Company Story Card */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[#D9D6CF] bg-[#FBFAF7] shadow-sm mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2457D6] font-medium block mb-4">
            Our Culture
          </span>
          <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-normal text-[#191B1D] mb-4">
            How we collaborate.
          </h2>
          <p className="text-[#62676D] text-[16px] leading-[1.75] font-light max-w-3xl mb-8">
            {settings.team_body ||
              "We value physical reality over pitch decks. We measure progress by functional prototypes tested in real dirt, solar degradation simulations benchmarked against physical panels, and production code running reliably in the hands of users."}
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-medium transition-all shadow-[0_2px_12px_rgba(36,87,214,0.2)]"
          >
            <span>Inquire About Engineering Roles</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}

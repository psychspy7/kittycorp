import { CurrencySelector } from "./local-currency";
import { LiveVisitorCounter } from "./live-visitor-counter";
import Image from "next/image";
import Link from "next/link";
import { companySettings } from "@/lib/company-server";
import { socialLabels, type SocialLinks } from "@/lib/company-content";
import { CONTACT_EMAIL, FOUNDER_LINKEDIN, SOCIAL_EMAIL, SUPPORT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { canonicalSocialUrl, publicSiteHref } from "@/lib/site-metadata";

export async function SiteFooter() {
  const settings = await companySettings();
  const links = Object.entries(settings.socials).filter(([, url]) => !!url);

  return (
    <footer className="relative site-footer bg-[#07090E] border-t border-white/10 text-[#E2E5E8] py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Dark Earth & Orbital Space Background Photographic Integration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/photography/dark-earth-footer.webp"
          alt="Dark Earth orbital curvature and sunrise horizon from orbit"
          fill
          className="object-cover object-[center_bottom] opacity-45"
          sizes="100vw"
        />
        {/* Deep cosmic gradient overlay for perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/80 to-[#07090E]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Identity Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link className="brand inline-flex items-center gap-3 text-white mb-4" href="/">
              <Image
                unoptimized
                src="/brand/monogram-small-v1.webp"
                alt="KITTY CORP"
                width={32}
                height={32}
                className="object-contain brightness-110"
              />
              <span className="font-[family-name:var(--font-display)] tracking-[0.22em] font-normal uppercase text-[15px] text-white">
                KITTY CORP
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] font-light leading-relaxed max-w-sm mb-6">
              Engineering intelligence for the physical world. Autonomous robotics, agricultural automation, and clean energy infrastructure from India to the world.
            </p>
            <div className="footer-venture-pill inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-[11px] font-mono tracking-wider text-[#E2E5E8] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
              <span className="text-[#E2E5E8]">Independent Technology Venture</span>
            </div>
          </div>

          {/* Technology & Initiatives */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9CA3AF] font-medium mb-1">
              INITIATIVES
            </span>
            <Link href="/agriyaan" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              KITTY AgriYaan
            </Link>
            <Link href="/urjaan" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              KITTY Urjaan
            </Link>
            <Link href="/projects" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              All Research Projects
            </Link>
            <Link href="/research" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              Inside the Lab
            </Link>
            <Link href="/memberships" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              KITTY ONE Membership
            </Link>
            <Link href="/support" className="text-[#60A5FA] font-medium hover:underline transition-colors">
              Support Our Research
            </Link>
          </div>

          {/* Commercial & Team */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9CA3AF] font-medium mb-1">
              COMMERCIAL &amp; TEAM
            </span>
            <a
              href="https://demo.thekittycorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors"
            >
              Digital Solutions Studio ↗
            </a>
            <Link href="/company" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              Company Mission
            </Link>
            <Link href="/team" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              Engineering Team
            </Link>
            <Link href="/investors" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              Investors &amp; Partnerships
            </Link>
            <Link href="/contact" className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              Contact &amp; Inquiries
            </Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors">
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Connect Elsewhere */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9CA3AF] font-medium mb-1">
              CONNECT
            </span>
            {links.length ? (
              links.map(([key, url]) => (
                <a
                  href={canonicalSocialUrl(publicSiteHref(url!))}
                  key={key}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors"
                >
                  {key === "linkedin" && isFounderLinkedIn(url)
                    ? "Founder on LinkedIn"
                    : socialLabels[key as keyof SocialLinks]}
                </a>
              ))
            ) : (
              <span className="text-xs text-[#9CA3AF]">Profiles updating</span>
            )}
            {!settings.socials.linkedin && (
              <a
                href={FOUNDER_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9CA3AF] hover:text-[#60A5FA] transition-colors"
              >
                Founder on LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Currency & Telemetry Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-white/10 text-xs">
          <div className="footer-controls-row flex items-center gap-4">
            <CurrencySelector />
            <LiveVisitorCounter />
          </div>
          <span className="text-[#9CA3AF] font-mono text-[11px]">
            ARCHITECTURAL SYSTEM · BOM1 REGION
          </span>
        </div>

        {/* Legal & Copyright */}
        <div className="footer-bottom flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} KITTY CORP</span>
            <span>·</span>
            <span>Independent technology company</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/support" className="text-[#60A5FA] hover:underline">
              Support Our Research
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/refunds" className="hover:text-white transition-colors">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

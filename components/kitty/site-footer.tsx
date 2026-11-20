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
    <footer className="site-footer bg-[#E9E6E0] border-t border-[#D9D6CF] text-[#191B1D] py-16 px-6 sm:px-10 lg:px-16 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#D9D6CF]">
          
          {/* Identity Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link className="brand inline-flex items-center gap-3 text-[#191B1D] mb-4" href="/">
              <Image
                unoptimized
                src="/brand/monogram-small-v1.webp"
                alt="KITTY CORP"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-[family-name:var(--font-display)] tracking-[0.22em] font-normal uppercase text-[15px] text-[#191B1D]">
                KITTY CORP
              </span>
            </Link>
            <p className="text-sm text-[#62676D] font-light leading-relaxed max-w-sm mb-6">
              Engineering intelligence for the physical world. Autonomous robotics, agricultural automation, and clean energy infrastructure from India to the world.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9D6CF] bg-[#FBFAF7] text-[11px] font-mono tracking-wider text-[#62676D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
              <span>Independent Technology Venture</span>
            </div>
          </div>

          {/* Technology & Initiatives */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#73777C] font-medium mb-1">
              INITIATIVES
            </span>
            <Link href="/agriyaan" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              KITTY AgriYaan
            </Link>
            <Link href="/urjaan" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              KITTY Urjaan
            </Link>
            <Link href="/projects" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              All Research Projects
            </Link>
            <Link href="/research" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              Inside the Lab
            </Link>
            <Link href="/memberships" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              KITTY ONE Membership
            </Link>
            <Link href="/support" className="text-[#2457D6] font-medium hover:underline transition-colors">
              Support Our Research
            </Link>
          </div>

          {/* Commercial & Contact */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#73777C] font-medium mb-1">
              COMMERCIAL &amp; TEAM
            </span>
            <a
              href="https://demo.thekittycorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#62676D] hover:text-[#2457D6] transition-colors"
            >
              Digital Solutions Studio ↗
            </a>
            <Link href="/company" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              Company Mission
            </Link>
            <Link href="/team" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              Engineering Team
            </Link>
            <Link href="/investors" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              Investors &amp; Partnerships
            </Link>
            <Link href="/contact" className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              Contact &amp; Inquiries
            </Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#62676D] hover:text-[#2457D6] transition-colors">
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Connect Elsewhere */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#73777C] font-medium mb-1">
              CONNECT
            </span>
            {links.length ? (
              links.map(([key, url]) => (
                <a
                  href={canonicalSocialUrl(publicSiteHref(url!))}
                  key={key}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#62676D] hover:text-[#2457D6] transition-colors"
                >
                  {key === "linkedin" && isFounderLinkedIn(url)
                    ? "Founder on LinkedIn"
                    : socialLabels[key as keyof SocialLinks]}
                </a>
              ))
            ) : (
              <span className="text-xs text-[#73777C]">Profiles updating</span>
            )}
            {!settings.socials.linkedin && (
              <a
                href={FOUNDER_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#62676D] hover:text-[#2457D6] transition-colors"
              >
                Founder on LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Currency & Telemetry Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-[#D9D6CF] text-xs">
          <div className="footer-controls-row flex items-center gap-4">
            <CurrencySelector />
            <LiveVisitorCounter />
          </div>
          <span className="text-[#73777C] font-mono text-[11px]">
            ARCHITECTURAL SYSTEM · BOM1 REGION
          </span>
        </div>

        {/* Legal & Copyright */}
        <div className="footer-bottom flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-[#73777C]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} KITTY CORP</span>
            <span>·</span>
            <span>Independent technology company</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/support" className="text-[#2457D6] hover:underline">
              Support Our Research
            </Link>
            <Link href="/privacy" className="hover:text-[#191B1D] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#191B1D] transition-colors">
              Terms
            </Link>
            <Link href="/refunds" className="hover:text-[#191B1D] transition-colors">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

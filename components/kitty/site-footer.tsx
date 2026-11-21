import Image from "next/image";
import Link from "next/link";
import { companySettings } from "@/lib/company-server";
import { socialLabels, type SocialLinks } from "@/lib/company-content";
import { FOUNDER_LINKEDIN, SUPPORT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { canonicalSocialUrl, publicSiteHref } from "@/lib/site-metadata";
import { LiveVisitorCounter } from "@/components/kitty/live-visitor-counter";
import { FooterNewsletter } from "@/components/kitty/footer-newsletter";

export async function SiteFooter() {
  const settings = await companySettings();
  const links = Object.entries(settings.socials).filter(([, url]) => !!url);

  return (
    <footer className="relative site-footer bg-[#07090E] border-t border-white/10 text-[#E2E5E8] py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Dark Earth & Orbital Space Background Photographic Integration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/photography/dark-earth-footer.webp"
          alt="Dark Earth orbital curvature and sunrise horizon from space"
          fill
          className="object-cover object-[center_bottom] opacity-75"
          sizes="100vw"
        />
        {/* Balanced cosmic gradient overlay for contrast while preserving orbital clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/92 via-[#07090E]/45 to-[#07090E]/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Identity & Newsletter Column */}
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
            <p className="text-sm text-[#A1A1AA] font-light leading-relaxed max-w-sm mb-5">
              Engineering intelligence for the physical world. Autonomous robotics, precision agricultural systems and clean energy software from India to global frontiers.
            </p>
            <div className="footer-venture-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-[11px] font-mono tracking-wider text-[#E2E5E8] backdrop-blur-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2457D6]" />
              <span className="text-[#E2E5E8]">Independent Technology Venture</span>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="max-w-sm pt-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA] font-medium block mb-2">
                Subscribe to Updates
              </span>
              <FooterNewsletter />
            </div>
          </div>

          {/* Technology & Initiatives */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA] font-medium mb-1">
              INITIATIVES
            </span>
            <Link href="/agriyaan" className="text-[#D1D5DB] hover:text-white transition-colors">
              KITTY AgriYaan
            </Link>
            <Link href="/urjayaan" className="text-[#D1D5DB] hover:text-white transition-colors">
              KITTY UrjaYaan
            </Link>
            <Link href="/buddy" className="text-[#D1D5DB] hover:text-white transition-colors">
              KITTY Buddy
            </Link>
            <Link href="/projects" className="text-[#D1D5DB] hover:text-white transition-colors">
              All Research Projects
            </Link>
            <Link href="/research" className="text-[#D1D5DB] hover:text-white transition-colors">
              Inside the Lab
            </Link>
            <Link href="/memberships" className="text-[#D1D5DB] hover:text-white transition-colors">
              KITTY ONE Membership
            </Link>
            <Link href="/support" className="text-[#60A5FA] font-medium hover:underline transition-colors">
              Support Our Research
            </Link>
            <span className="text-xs leading-relaxed text-[#C4C9D1] max-w-[15rem]">Any contribution is entirely voluntary. It is not a purchase, investment or membership and gives no ownership or equity.</span>
            <p className="max-w-[17rem] text-xs leading-relaxed text-[#D1D5DB]">
              Contributions are entirely voluntary and help support independent research. They are not a purchase, membership, investment or ownership interest.
            </p>
          </div>

          {/* Commercial & Team */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA] font-medium mb-1">
              COMMERCIAL &amp; TEAM
            </span>
            <a
              href="https://demo.thekittycorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D1D5DB] hover:text-white transition-colors"
            >
              Digital Solutions Studio ↗
            </a>
            <Link href="/company" className="text-[#D1D5DB] hover:text-white transition-colors">
              Company Mission
            </Link>
            <Link href="/team" className="text-[#D1D5DB] hover:text-white transition-colors">
              Engineering Team
            </Link>
            <Link href="/investors" className="text-[#D1D5DB] hover:text-white transition-colors">
              Investors &amp; Partnerships
            </Link>
            <Link href="/contact" className="text-[#D1D5DB] hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="/contact?subject=Feedback" className="text-[#D1D5DB] hover:text-white transition-colors">
              Send Feedback
            </Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#D1D5DB] hover:text-white transition-colors">
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Connect Elsewhere */}
          <div className="flex flex-col space-y-2.5 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A1A1AA] font-medium mb-1">
              CONNECT
            </span>
            {links.length ? (
              links.map(([key, url]) => (
                <a
                  href={canonicalSocialUrl(publicSiteHref(url!))}
                  key={key}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D1D5DB] hover:text-white transition-colors"
                >
                  {key === "linkedin" && isFounderLinkedIn(url)
                    ? "Founder on LinkedIn"
                    : socialLabels[key as keyof SocialLinks]}
                </a>
              ))
            ) : (
              <span className="text-xs text-[#A1A1AA]">Profiles updating</span>
            )}
            {!settings.socials.linkedin && (
              <a
                href={FOUNDER_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D1D5DB] hover:text-white transition-colors"
              >
                Founder on LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Telemetry & Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <LiveVisitorCounter />
          </div>
          <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
            <Link href="/contact?subject=Feedback" className="hover:text-white transition-colors">
              Send Feedback
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Inquiries
            </Link>
            <span>·</span>
            <Link href="/support" className="text-[#60A5FA] hover:underline">
              Support Research
            </Link>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="footer-bottom flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-3">
            <span>© 2026 KITTY CORP</span>
            <span>·</span>
            <span>Independent technology company</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/refunds" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

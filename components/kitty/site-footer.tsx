import { CurrencySelector } from "./local-currency";
import Image from "next/image";
import Link from "next/link";
import { companySettings } from "@/lib/company-server";
import { socialLabels, type SocialLinks } from "@/lib/company-content";
import { AnalyticsSettingsButton } from "./google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { CONTACT_EMAIL, FOUNDER_LINKEDIN, isFounderLinkedIn } from "@/lib/company-contact";

export async function SiteFooter() {
  const settings = await companySettings();
  const links = Object.entries(settings.socials).filter(([, url]) => !!url);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-identity">
            <Link className="brand" href="/">
              <Image unoptimized src="/brand/monogram-small-v1.webp" alt="KITTY CORP" width={36} height={36} />
              <span>KITTY CORP</span>
            </Link>
            <p>
              Independent technology &amp; software engineering studio. We architect, engineer and deploy websites, applied AI agents, and business automation.
            </p>
            <div className="footer-contact-direct">
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <span className="footer-url">https://thekittycorp.com</span>
            </div>
          </div>
          <div className="footer-links">
            <span className="micro-label">CAPABILITIES</span>
            <Link href="/services/website-development">Websites &amp; Experiences</Link>
            <Link href="/services/ai-agents">Applied AI Agents</Link>
            <Link href="/services/business-automation">Business Automation</Link>
            <Link href="/services/mobile-apps">Mobile Applications</Link>
            <Link href="/services/digital-transformation">Custom Portals &amp; Systems</Link>
            <Link href="/services">All Services Overview</Link>
          </div>
          <div className="footer-links">
            <span className="micro-label">WORK &amp; CLIENTS</span>
            <Link href="/projects">Case Studies &amp; Work</Link>
            <Link href="/projects#project-enquiry">Start a Project</Link>
            <Link href="/pricing">Pricing &amp; Fixed Packages</Link>
            <Link href="/appointments">Schedule Strategy Call</Link>
            <Link href="/account">Client Portal &amp; Quotes</Link>
            <Link href="/contact">Direct Contact</Link>
          </div>
          <div className="footer-links">
            <span className="micro-label">LABS &amp; COMPANY</span>
            <Link href="/products">Proprietary Products</Link>
            <Link href="/kitty-ai">KITTY AI</Link>
            <Link href="/lisa-ai">LISA AI</Link>
            <Link href="/secretchat">SecretChat</Link>
            <Link href="/company">About Studio</Link>
            <Link href="/team">Engineering Team</Link>
            <Link href="/build-log">Build Log</Link>
            <Link href="/research">Applied Research</Link>
          </div>
          <div className="footer-links">
            <span className="micro-label">ELSEWHERE</span>
            {links.length ? (
              links.map(([key, url]) => (
                <a href={url} key={key} target="_blank" rel="noopener noreferrer">
                  {key === "linkedin" && isFounderLinkedIn(url) ? "Founder on LinkedIn" : socialLabels[key as keyof SocialLinks]}
                </a>
              ))
            ) : (
              <span className="social-pending">Official profiles to follow.</span>
            )}
            {!settings.socials.linkedin && (
              <a href={FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer">
                Founder on LinkedIn
              </a>
            )}
          </div>
        </div>
        <CurrencySelector />
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KITTY CORP. All rights reserved.</span>
          <span>Independent technology company.</span>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/refunds">Refund Guidelines</Link>
          <AnalyticsSettingsButton measurementId={googleAnalyticsId()} />
        </div>
      </div>
    </footer>
  );
}

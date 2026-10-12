import Image from "next/image";
import Link from "next/link";
import { companySettings } from "@/lib/company-server";
import { socialLabels,type SocialLinks } from "@/lib/company-content";
import { AnalyticsSettingsButton } from "./google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { TechnologyEcosystem } from "./technology-ecosystem";
import { CONTACT_EMAIL, FOUNDER_LINKEDIN } from "@/lib/company-contact";

export async function SiteFooter() {
  const settings = await companySettings();
  const links = Object.entries(settings.socials).filter(([, url]) => !!url);
  return <><TechnologyEcosystem/><footer className="site-footer"><div className="wrap">
    <div className="footer-grid">
      <div className="footer-identity"><Link className="brand" href="/"><Image unoptimized src="/brand/monogram-small-v1.webp" alt="" width={36} height={36}/><span>KITTY CORP</span></Link><p>Websites, applications and independent<br/>work in AI and autonomous systems.</p></div>
      <div className="footer-links"><span className="micro-label">EXPLORE</span><Link href="/products">All products</Link><Link href="/memberships">Product plans</Link><Link href="/team">Full team</Link><Link href="/company">Company</Link><Link href="/lisa-ai">LISA AI</Link><Link href="/build-log">Build Log</Link><Link href="/research">Research</Link></div>
      <div className="footer-links"><span className="micro-label">WORK WITH US</span><Link href="/services">Websites & applications</Link><Link href="/payments?purpose=project">Project payments</Link><Link href="/payments?purpose=donation">Support KITTY CORP</Link><Link href="/contact">Contact</Link><a href={`mailto:${CONTACT_EMAIL}`}>Email us</a><Link href="/investors">Investors & Partnerships</Link></div>
      <div className="footer-links"><span className="micro-label">ELSEWHERE</span>{links.length ? links.map(([key, url]) => <a href={url} key={key} target="_blank" rel="noopener noreferrer">{socialLabels[key as keyof SocialLinks]}</a>) : <span className="social-pending">Official profiles to follow.</span>}{!settings.socials.linkedin&&<a href={FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer">Founder on LinkedIn</a>}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} KITTY CORP</span><span>Independent technology company.</span><Link href="/privacy">Privacy</Link><AnalyticsSettingsButton measurementId={googleAnalyticsId()}/></div>
  </div></footer></>;
}

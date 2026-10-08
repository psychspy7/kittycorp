import Image from "next/image";
import Link from "next/link";
import { companySettings, companyProducts } from "@/lib/company-server";
import { publishedLaunches } from "@/lib/launches-server";
import { launchHref } from "@/lib/launches";
import { socialLabels,type SocialLinks } from "@/lib/company-content";
import { AnalyticsSettingsButton } from "./google-analytics";
import { googleAnalyticsId } from "@/lib/analytics-config";
import { TechnologyEcosystem } from "./technology-ecosystem";

export async function SiteFooter() {
  const [settings, products, launches] = await Promise.all([companySettings(), companyProducts(), publishedLaunches().catch(() => [])]);
  const links = Object.entries(settings.socials).filter(([, url]) => !!url);
  return <><TechnologyEcosystem/><footer className="site-footer"><div className="wrap">
    <div className="footer-grid">
      <div className="footer-identity"><Link className="brand" href="/"><Image unoptimized src="/brand/monogram-small-v1.webp" alt="" width={36} height={36}/><span>KITTY CORP</span></Link><p>Websites, applications and independent<br/>work in AI and autonomous systems.</p></div>
      <div className="footer-links"><span className="micro-label">EXPLORE</span><Link href="/products">All products</Link><Link href="/team">Full team</Link><Link href="/company">Company</Link>{products.map(p => <Link key={p.slug} href={`/${p.slug}`}>{p.name}</Link>)}{launches.map(l => <Link key={l.id} href={launchHref(l)}>{l.name}</Link>)}</div>
      <div className="footer-links"><span className="micro-label">WORK WITH US</span><Link href="/services">Websites & applications</Link><Link href="/build-log">Build Log</Link><Link href="/research">Research</Link><Link href="/contact">Contact</Link><Link href="/investors">Investors & Partnerships</Link></div>
      <div className="footer-links"><span className="micro-label">ELSEWHERE</span>{links.length ? links.map(([key, url]) => <a href={url} key={key} target="_blank" rel="noopener noreferrer">{socialLabels[key as keyof SocialLinks]}</a>) : <span className="social-pending">Official profiles to follow.</span>}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} KITTY CORP</span><span>Independent technology company.</span><Link href="/privacy">Privacy</Link><AnalyticsSettingsButton measurementId={googleAnalyticsId()}/><a href="/admins">Studio</a></div>
  </div></footer></>;
}

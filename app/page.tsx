import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero, SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { LaunchAnnouncement } from "@/components/kitty/launch-announcement";
import { ProductSummary, Team } from "@/components/kitty/home-sections";
import { EarlyAccess } from "@/components/kitty/early-access";
import { publishedLaunches } from "@/lib/launches-server";
import { companyProducts, companySettings, companyTeam } from "@/lib/company-server";
export const dynamic = "force-dynamic";
export default async function Home(){
  const [launches,products,members,settings]=await Promise.all([publishedLaunches().catch(()=>[]),companyProducts(),companyTeam(),companySettings()]);
  const announcement=launches.find(l=>l.show_popup);
  return <><SiteHeader/>{announcement&&<LaunchAnnouncement launch={announcement}/>}<main id="main"><Hero/><ProductSummary launches={launches} products={products}/><div className="progress-link wrap"><div><span className="eyebrow">DEVELOPMENT NOTES</span><h2>Follow the work.</h2><p>Updates, experiments and decisions from the team.</p></div><Link className="button button-outline" href="/build-log">Read the build log <ArrowUpRight size={17}/></Link></div><Team members={members} settings={settings}/><EarlyAccess/></main><SiteFooter/></>;
}

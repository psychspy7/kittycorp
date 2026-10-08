import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero, SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { LaunchAnnouncement } from "@/components/kitty/launch-announcement";
import { ProductSummary, Team } from "@/components/kitty/home-sections";
import { Reviews, ShippedWork, WorkingTogether } from "@/components/kitty/credibility-sections";
import { EarlyAccess } from "@/components/kitty/early-access";
import { publishedLaunches } from "@/lib/launches-server";
import { companyProducts, companySettings, companyTeam } from "@/lib/company-server";
import { publicTestimonials } from "@/lib/testimonials-server";
export const dynamic = "force-dynamic";
export default async function Home(){
  const [launches,products,members,settings,reviews]=await Promise.all([publishedLaunches().catch(()=>[]),companyProducts(),companyTeam(),companySettings(),publicTestimonials()]);
  const announcement=launches.find(l=>l.show_popup);
  return <><SiteHeader/>{announcement&&<LaunchAnnouncement launch={announcement}/>}<main id="main"><Hero/><ShippedWork launches={launches}/><WorkingTogether/><Reviews reviews={reviews}/><ProductSummary launches={launches} products={products}/><div className="progress-link wrap"><div><span className="eyebrow">DEVELOPMENT NOTES</span><h2>Behind the releases.</h2><p>What we’re building, testing and learning along the way.</p></div><Link className="button button-outline" href="/build-log">Read the build log <ArrowUpRight size={17}/></Link></div><Team members={members} settings={settings}/><EarlyAccess/></main><SiteFooter/></>;
}

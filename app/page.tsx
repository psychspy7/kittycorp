import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero, SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { DeliverySupport, HomeDestinations, Team } from "@/components/kitty/home-sections";
import { Reviews, WorkingTogether } from "@/components/kitty/credibility-sections";
import { EarlyAccess } from "@/components/kitty/early-access";
import { publishedLaunches } from "@/lib/launches-server";
import { companyProducts, companySettings, companyTeam } from "@/lib/company-server";
import { publicTestimonials } from "@/lib/testimonials-server";
export const dynamic = "force-dynamic";
export default async function Home(){
  const [launches,products,members,settings,reviews]=await Promise.all([publishedLaunches().catch(()=>[]),companyProducts(),companyTeam(),companySettings(),publicTestimonials()]);
  return <><SiteHeader/><main id="main" className="business-home"><Hero/><WorkingTogether/><DeliverySupport/><HomeDestinations launches={launches} products={products}/><Reviews reviews={reviews}/><Team members={members} settings={settings}/><div className="progress-link wrap"><div><span className="eyebrow">DEVELOPMENT NOTES</span><h2>From the workbench.</h2><p>Product updates, build notes and lessons from the work.</p></div><Link className="button button-outline" href="/build-log">Read the build log <ArrowUpRight size={17}/></Link></div><EarlyAccess/></main><SiteFooter/></>;
}

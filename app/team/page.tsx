import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { TeamProfiles } from "@/components/kitty/home-sections";
import { companySettings, companyTeam } from "@/lib/company-server";
export const dynamic="force-dynamic";
export const metadata=pageMetadata('The team','The people building KITTY CORP.','/team');
export default async function TeamPage(){const [members,settings]=await Promise.all([companyTeam(),companySettings()]);return <><SiteHeader/><main id="main" className="public-page wrap full-team-page"><div className="page-heading"><span className="eyebrow">THE TEAM</span><h1>The people<br/>building KITTY.</h1><p>{settings.team_intro}</p></div>{members.length?<TeamProfiles members={members}/>:<p className="quiet-empty">Team profiles will be added here.</p>}<div className="company-story"><p>{settings.team_body}</p><Link className="text-link" href="/contact">Get in touch</Link></div></main><SiteFooter/></>;}

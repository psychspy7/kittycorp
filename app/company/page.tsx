import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, FilmButton } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CompanyIntro, WhyKitty, Team } from "@/components/kitty/home-sections";
import { companySettings, companyTeam } from "@/lib/company-server";
export const dynamic="force-dynamic";
export const metadata={title:"Company",description:"Meet KITTY CORP, an independent team developing software, AI and autonomous systems."};
export default async function CompanyPage(){const [members,settings]=await Promise.all([companyTeam(),companySettings()]);return <><SiteHeader/><main id="main" className="directory-page"><div className="page-heading wrap"><span className="eyebrow">ABOUT KITTY CORP</span><h1>A company<br/>we’re building.</h1><p>Independent work in AI, robotics and intelligent software. Client projects and our own products, built by a small team.</p><div className="hero-actions"><Link href="/research" className="button button-outline">Research areas <ArrowUpRight size={16}/></Link><FilmButton/></div></div><CompanyIntro/><WhyKitty/><Team members={members} settings={settings}/><div className="company-story wrap"><span className="eyebrow">HOW WE STARTED</span><p>{settings.team_body}</p><Link className="text-link" href="/investors">Investors & Partnerships <ArrowUpRight size={16}/></Link></div></main><SiteFooter/></>;}

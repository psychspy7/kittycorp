import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, FilmButton } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { CompanyIntro, WhyKitty, Team } from "@/components/kitty/home-sections";
import { companySettings, companyTeam } from "@/lib/company-server";
import { sitePageContent } from "@/lib/site-pages-server";
export const dynamic="force-dynamic";
export async function generateMetadata():Promise<Metadata>{const copy=await sitePageContent("company");return pageMetadata(copy.seoTitle,copy.seoDescription,"/company");}
export default async function CompanyPage(){const [members,settings,copy]=await Promise.all([companyTeam(),companySettings(),sitePageContent("company")]);return <><SiteHeader/><main id="main" className="directory-page"><div className="page-heading wrap"><span className="eyebrow">{copy.pageEyebrow}</span><h1>{copy.pageTitle}<br/>{copy.pageAccent}</h1><p>{copy.pageIntro}</p><div className="hero-actions"><Link href="/research" className="button button-outline">Research areas <ArrowUpRight size={16}/></Link><FilmButton/></div></div><CompanyIntro copy={copy}/><WhyKitty/><Team members={members}/><div className="company-story wrap"><span className="eyebrow">HOW WE STARTED</span><p>{settings.team_body}</p><Link className="text-link" href="/investors">Investors & Partnerships <ArrowUpRight size={16}/></Link></div></main><SiteFooter/></>;}

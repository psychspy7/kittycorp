import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/kitty/site";
import { ProfessionalHero,ServiceOverview,HomeProcess } from "@/components/kitty/professional-home";
import { SiteFooter } from "@/components/kitty/site-footer";
import { DeliverySupport,HomeDestinations,Team } from "@/components/kitty/home-sections";
import { Reviews } from "@/components/kitty/credibility-sections";
import { EarlyAccess } from "@/components/kitty/early-access";
import { publishedLaunches } from "@/lib/launches-server";
import { companyProducts,companySettings,companyTeam } from "@/lib/company-server";
import { publicTestimonials } from "@/lib/testimonials-server";
import { pageMetadata,websiteOrigin,jsonLd } from "@/lib/site-metadata";
import { CONTACT_EMAIL } from "@/lib/company-contact";
export const dynamic="force-dynamic";
export const metadata=pageMetadata("Website & app development","KITTY CORP builds business websites, web applications and Android apps. Explore our products, meet the team and tell us what you need.","/");
export default async function Home(){const [launches,products,members,settings,reviews]=await Promise.all([publishedLaunches().catch(()=>[]),companyProducts(),companyTeam(),companySettings(),publicTestimonials()]);const organization={"@context":"https://schema.org","@type":"Organization",name:"KITTY CORP",url:websiteOrigin(),logo:`${websiteOrigin()}/brand/monogram.png`,description:"Independent technology company building websites, applications, AI and autonomous systems.",email:CONTACT_EMAIL,sameAs:Object.values(settings.socials).filter(Boolean)};return <><SiteHeader/><main id="main" className="business-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(organization)}}/><ProfessionalHero launches={launches}/><ServiceOverview/><HomeProcess/><DeliverySupport/><HomeDestinations launches={launches} products={products}/><Reviews reviews={reviews}/><Team members={members} settings={settings}/><div className="progress-link wrap"><div><span className="eyebrow">DEVELOPMENT NOTES</span><h2>Follow the work.</h2><p>Product updates, experiments and decisions from the team.</p></div><Link className="button button-outline" href="/build-log">Read the build log <ArrowUpRight size={17}/></Link></div><EarlyAccess/></main><SiteFooter/></>;}

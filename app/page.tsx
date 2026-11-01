import { HelpfulAnswers } from "@/components/kitty/final-home";
import { SiteHeader } from "@/components/kitty/site";
import { HomeProcess } from "@/components/kitty/professional-home";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Team } from "@/components/kitty/home-sections";
import { Reviews } from "@/components/kitty/credibility-sections";
import { publishedLaunches } from "@/lib/launches-server";
import { companySettings, companyTeam } from "@/lib/company-server";
import { publicTestimonials } from "@/lib/testimonials-server";
import { pageMetadata, websiteOrigin, jsonLd } from "@/lib/site-metadata";
import { CONTACT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { BusinessProof, BusinessEnquiry } from "@/components/kitty/business-conversion";
import { CompanyDivisions, CompanyHero } from "@/components/kitty/company-home";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Digital solutions & robotics", "KITTY CORP builds websites, software and practical AI systems for businesses, alongside early research in robotics and intelligent products.", "/");
export default async function Home() {
  const [launches, members, settings, reviews] = await Promise.all([publishedLaunches().catch(()=>[]),companyTeam(),companySettings(),publicTestimonials()]);
  const sameAs=Object.entries(settings.socials).filter(([key,url])=>!!url&&key!=="website"&&(key!=="linkedin"||!isFounderLinkedIn(url))).map(([,url])=>url);
  const organization={"@context":"https://schema.org","@type":"Organization",name:"KITTY CORP",url:websiteOrigin(),logo:websiteOrigin()+"/brand/monogram.png",description:"Independent Indian technology company building digital solutions and exploring intelligent systems and robotics.",email:CONTACT_EMAIL,sameAs};
  return <div className="company-theme"><SiteHeader/><main id="main" className="company-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(organization)}}/><CompanyHero/><CompanyDivisions/><BusinessProof launches={launches}/><HomeProcess/><Reviews reviews={reviews}/><Team members={members} settings={settings}/><BusinessEnquiry/><HelpfulAnswers/></main><SiteFooter/></div>;
}

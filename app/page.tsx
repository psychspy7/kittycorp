import type { Metadata } from "next";
import { HelpfulAnswers } from "@/components/kitty/final-home";
import { SiteHeader } from "@/components/kitty/site";
import { HomeProcess } from "@/components/kitty/professional-home";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Team } from "@/components/kitty/home-sections";
import { FeedbackLink } from "@/components/kitty/credibility-sections";
import { publishedLaunches } from "@/lib/launches-server";
import { companySettings, companyTeam } from "@/lib/company-server";
import { pageMetadata, websiteOrigin, jsonLd } from "@/lib/site-metadata";
import { CONTACT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { BusinessProof, BusinessEnquiry } from "@/components/kitty/business-conversion";
import { CompanyDivisions, CompanyHero } from "@/components/kitty/company-home";
export const dynamic = "force-dynamic";
const homeMetadata = pageMetadata(
  "Websites, AI & robotics",
  "Independent technology company building business websites, apps and AI automation, alongside early robotics concepts KITTY BUDDY, AGRIYAAN and URJAYAAN.",
  "/",
);
export const metadata: Metadata = {
  ...homeMetadata,
  title: "KITTY CORP | Websites, AI & robotics",
};
export default async function Home() {
  const [launches, members, settings] = await Promise.all([publishedLaunches().catch(()=>[]),companyTeam(),companySettings()]);
  const sameAs=Object.entries(settings.socials).filter(([key,url])=>!!url&&key!=="website"&&(key!=="linkedin"||!isFounderLinkedIn(url))).map(([,url])=>url);
  const organization={"@context":"https://schema.org","@type":"Organization",name:"KITTY CORP",url:websiteOrigin(),logo:websiteOrigin()+"/brand/monogram.png",description:"Independent Indian technology company building digital solutions and exploring intelligent systems and robotics.",email:CONTACT_EMAIL,sameAs};
  return <div className="company-theme"><SiteHeader/><main id="main" className="company-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(organization)}}/><CompanyHero/><CompanyDivisions/><BusinessProof launches={launches}/><HomeProcess/><FeedbackLink/><Team members={members}/><BusinessEnquiry/><HelpfulAnswers/></main><SiteFooter/></div>;
}

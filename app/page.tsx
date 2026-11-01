import type { Metadata } from "next";
import { HelpfulAnswers } from "@/components/kitty/final-home";
import { SiteHeader } from "@/components/kitty/site";
import { HomeProcess } from "@/components/kitty/professional-home";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Team } from "@/components/kitty/home-sections";
import { FeedbackLink } from "@/components/kitty/credibility-sections";
import { publishedLaunches } from "@/lib/launches-server";
import { companySettings, companyTeam } from "@/lib/company-server";
import { canonicalSocialUrl, pageMetadata, websiteOrigin, jsonLd } from "@/lib/site-metadata";
import { CONTACT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { BusinessProof, BusinessEnquiry } from "@/components/kitty/business-conversion";
import { CompanyDivisions, CompanyHero } from "@/components/kitty/company-home";
export const dynamic = "force-dynamic";
const homeMetadata = pageMetadata(
  "Indian AI, software & robotics company",
  "KITTY CORP is an independent Indian technology company building business websites, custom software and AI workflow automation, with early research in robotics and intelligent systems.",
  "/",
);
export const metadata: Metadata = {
  ...homeMetadata,
  title: "KITTY CORP | Indian AI, software & robotics company",
};
export default async function Home() {
  const [launches, members, settings] = await Promise.all([publishedLaunches().catch(()=>[]),companyTeam(),companySettings()]);
  const sameAs=Array.from(new Set([
    "https://www.instagram.com/kittycorp.ai/",
    ...Object.entries(settings.socials)
      .filter(([key,url])=>!!url&&key!=="website"&&(key!=="linkedin"||!isFounderLinkedIn(url)))
      .map(([,url])=>canonicalSocialUrl(url!)),
  ]));
  const organization={
    "@context":"https://schema.org",
    "@type":"Organization",
    "@id":websiteOrigin()+"/#organization",
    name:"KITTY CORP",
    alternateName:"Kitty Corp",
    url:websiteOrigin(),
    logo:websiteOrigin()+"/brand/monogram.png",
    description:"Independent Indian technology company building business websites, custom software and AI workflow automation, while exploring intelligent systems and robotics.",
    email:CONTACT_EMAIL,
    founder:{"@type":"Person",name:"Virat Anand",jobTitle:"Founder & CEO"},
    knowsAbout:["Business websites","Custom software development","AI workflow automation","AI agents","Robotics research","Agricultural robotics","Intelligent systems"],
    sameAs,
  };
  return <div className="company-theme"><SiteHeader/><main id="main" className="company-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(organization)}}/><CompanyHero/><CompanyDivisions/><BusinessProof launches={launches}/><HomeProcess/><FeedbackLink/><Team members={members}/><BusinessEnquiry/><HelpfulAnswers/></main><SiteFooter/></div>;
}

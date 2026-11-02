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
import { CompanyDivisions, CompanyHero, GeminiManifesto } from "@/components/kitty/company-home";
import { ElementalBackground } from "@/components/kitty/elemental-background";
import { sitePageContent } from "@/lib/site-pages-server";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const copy = await sitePageContent("home");
  return {
    ...pageMetadata(copy.seoTitle, copy.seoDescription, "/"),
    title: "KITTY CORP | " + copy.seoTitle,
  };
}
export default async function Home() {
  const [launches, members, settings, copy] = await Promise.all([publishedLaunches().catch(()=>[]),companyTeam(),companySettings(),sitePageContent("home")]);
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
    description:copy.heroDescription,
    email:CONTACT_EMAIL,
    founder:{"@type":"Person",name:"Virat Anand",jobTitle:"Founder & CEO"},
    knowsAbout:["Business websites","Custom software development","AI workflow automation","AI agents","Robotics research","Agricultural robotics","Intelligent systems"],
    sameAs,
  };
  return <div className="company-theme gemini-template"><ElementalBackground/><SiteHeader/><main id="main" className="company-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(organization)}}/><CompanyHero copy={copy}/><GeminiManifesto/><CompanyDivisions copy={copy}/><BusinessProof launches={launches}/><HomeProcess/><FeedbackLink/><Team members={members}/><BusinessEnquiry/><HelpfulAnswers/></main><SiteFooter/></div>;
}

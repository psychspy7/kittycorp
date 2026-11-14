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
import { ObsidianEcosystem, ObsidianHero, ObsidianLab, ObsidianServices } from "@/components/kitty/obsidian-home";
import { ElementalBackground } from "@/components/kitty/elemental-background";
import { sitePageContent } from "@/lib/site-pages-server";
import { BottomSupport } from "@/components/kitty/bottom-support";
import { SubscriptionModal } from "@/components/kitty/subscription-modal";
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
    subOrganization:[{"@type":"Organization",name:"CALVENTO",url:"https://calvento-vs-projects-0c743cd3.vercel.app/","description":"A contemporary fashion, accessories and lifestyle commerce brand operated as a KITTY CORP enterprise."}],
    sameAs,
  };
  return <div className="company-theme gemini-template"><ElementalBackground/><SiteHeader/><SubscriptionModal/><main id="main" className="company-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(organization)}}/><ObsidianHero copy={copy}/><ObsidianServices copy={copy}/><ObsidianLab/><ObsidianEcosystem/><BusinessProof launches={launches}/><HomeProcess/><FeedbackLink/><Team members={members}/><BusinessEnquiry/><HelpfulAnswers/><BottomSupport/></main><SiteFooter/></div>;
}

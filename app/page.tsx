import { FinalHero, HelpfulAnswers } from "@/components/kitty/final-home";
import { publicAssistantPresentation } from "@/lib/assistant-presentation";
import { SiteHeader } from "@/components/kitty/site";
import { ServiceOverview, HomeProcess } from "@/components/kitty/professional-home";
import { SiteFooter } from "@/components/kitty/site-footer";
import { DeliverySupport, Team } from "@/components/kitty/home-sections";
import { Reviews } from "@/components/kitty/credibility-sections";
import { publishedLaunches } from "@/lib/launches-server";
import { companySettings, companyTeam } from "@/lib/company-server";
import { publicTestimonials } from "@/lib/testimonials-server";
import { pageMetadata, websiteOrigin, jsonLd } from "@/lib/site-metadata";
import { CONTACT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { BusinessProof, BusinessEnquiry, LabsSummary, SuvidSummary } from "@/components/kitty/business-conversion";
import { ProductResearchShowcase } from "@/components/kitty/product-research-showcase";
import { IntelligenceRobotics } from "@/components/kitty/intelligence-robotics";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Websites, apps & business automation", "Work directly with KITTY CORP to design, build and maintain business websites, applications and practical AI workflows.", "/");
export default async function Home() {
  const [launches, members, settings, reviews, assistant] = await Promise.all([publishedLaunches().catch(()=>[]),companyTeam(),companySettings(),publicTestimonials(),publicAssistantPresentation().catch(()=>null)]);
  const sameAs=Object.entries(settings.socials).filter(([key,url])=>!!url&&key!=="website"&&(key!=="linkedin"||!isFounderLinkedIn(url))).map(([,url])=>url);
  const organization={"@context":"https://schema.org","@type":"Organization",name:"KITTY CORP",url:websiteOrigin(),logo:websiteOrigin()+"/brand/monogram.png",description:"Independent Indian technology startup building websites, applications and practical AI automation.",email:CONTACT_EMAIL,sameAs};
  return <><SiteHeader/><main id="main" className="business-home conversion-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(organization)}}/><FinalHero assistantEnabled={assistant?.settings.enabled??false}/><ServiceOverview/><BusinessProof launches={launches}/><HomeProcess/><DeliverySupport/><Reviews reviews={reviews}/><BusinessEnquiry/><LabsSummary/><ProductResearchShowcase/><IntelligenceRobotics/><SuvidSummary/><Team members={members} settings={settings}/><HelpfulAnswers/></main><SiteFooter/></>;
}

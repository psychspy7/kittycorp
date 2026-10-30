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

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "Independent Software Studio & Applied Technology",
  "Partner directly with KITTY CORP to architect, engineer and deploy modern web platforms, native applications and robust workflow automation.",
  "/"
);

export default async function Home() {
  const [launches, members, settings, reviews, assistant] = await Promise.all([
    publishedLaunches().catch(() => []),
    companyTeam(),
    companySettings(),
    publicTestimonials(),
    publicAssistantPresentation().catch(() => null)
  ]);

  const sameAs = Object.entries(settings.socials)
    .filter(([key, url]) => !!url && key !== "website" && (key !== "linkedin" || !isFounderLinkedIn(url)))
    .map(([, url]) => url);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KITTY CORP",
    url: websiteOrigin(),
    logo: websiteOrigin() + "/brand/monogram.png",
    description: "Independent technology and software engineering studio building high-performance web applications, native systems, and applied AI automation.",
    email: CONTACT_EMAIL,
    sameAs
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="business-home conversion-home">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organization) }} />
        <FinalHero assistantEnabled={assistant?.settings.enabled ?? false} />
        <ServiceOverview />
        <BusinessProof launches={launches} />
        <HomeProcess />
        <DeliverySupport />
        <Reviews reviews={reviews} />
        <BusinessEnquiry />
        <LabsSummary />
        <SuvidSummary />
        <Team members={members} settings={settings} />
        <HelpfulAnswers />
      </main>
      <SiteFooter />
    </>
  );
}

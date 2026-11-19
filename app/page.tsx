import type { Metadata } from "next";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { RoboticsHero } from "@/components/kitty/robotics-hero";
import { VentureProjects, FounderStorySection } from "@/components/kitty/venture-sections";
import { Team } from "@/components/kitty/home-sections";
import { BusinessEnquiry } from "@/components/kitty/business-conversion";
import { companyTeam, companySettings } from "@/lib/company-server";
import { pageMetadata, websiteOrigin, jsonLd, canonicalSocialUrl } from "@/lib/site-metadata";
import { CONTACT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";
import { sitePageContent } from "@/lib/site-pages-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMetadata(
      "AI Robotics • Physical-World Intelligence",
      "Exploring the future of AI robotics — building intelligent autonomous systems for the physical world, agricultural robotics (AgriYaan), and clean energy automation.",
      "/"
    ),
    title: "KITTY CORP | AI Robotics • Physical-World Intelligence",
  };
}

export default async function Home() {
  const [members, copy, settings] = await Promise.all([
    companyTeam(),
    sitePageContent("home"),
    companySettings(),
  ]);

  const origin = websiteOrigin();

  const socials = settings?.socials ? Object.entries(settings.socials) as [string, string | undefined][] : [];
  const sameAs = Array.from(new Set([
    "https://www.instagram.com/kittycorp.ai/",
    ...socials
      .filter(([key, url]) => Boolean(url && key !== "website" && (key !== "linkedin" || !isFounderLinkedIn(url as string))))
      .map(([, url]) => canonicalSocialUrl(url as string)),
  ]));

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: "KITTY CORP",
    alternateName: [
      "Kitty Corp",
      "Kitty Corporation",
      "KITTY CORP AI Robotics",
    ],
    url: origin,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/brand/monogram.png`,
      caption: "KITTY CORP Monogram",
    },
    description:
      "KITTY CORP is an AI robotics venture exploring the future of physical-world intelligence, building autonomous agricultural systems (AgriYaan) and clean energy automation.",
    founder: [
      {
        "@type": "Person",
        name: "Virat Anand",
        jobTitle: "Founder & CEO",
        sameAs: "https://www.linkedin.com/in/virat-anand-928460442/",
      },
      { "@type": "Person", name: "Sarthak", jobTitle: "Co-founder" },
      { "@type": "Person", name: "Aman", jobTitle: "Co-founder" },
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Autonomous Robotics",
      "Physical World Intelligence",
      "Agricultural Robotics",
      "AgriYaan Rover",
      "Clean Energy AI Systems",
      "Autonomous Systems Telemetry",
      "Computer Vision",
    ],
    subOrganization: [
      {
        "@type": "Organization",
        name: "CALVENTO",
        url: "https://calvento-vs-projects-0c743cd3.vercel.app/",
        description: "A contemporary fashion, accessories and lifestyle commerce brand operated as a KITTY CORP enterprise.",
      },
      {
        "@type": "Organization",
        name: "KITTY CORP Digital Solutions",
        url: "https://demo.thekittycorp.com",
        description:
          "Commercial digital studio delivering bespoke web applications, business automation, and custom AI systems.",
      },
    ],
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL || "contact@thekittycorp.com",
      contactType: "corporate inquiries",
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: "KITTY CORP",
    alternateName: "KITTY CORP Official Website",
    publisher: {
      "@id": `${origin}/#organization`,
    },
    inLanguage: "en-US",
    description:
      "Official website of KITTY CORP — AI Robotics, Physical-World Intelligence, Research & Innovation.",
  };

  return (
    <div className="company-theme gemini-template bg-[#070911] text-[#f4f3f0]">
      <SiteHeader />
      <main id="main" className="company-home">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd([organization, webSite]) }}
        />
        <RoboticsHero copy={copy} />
        <VentureProjects />
        <FounderStorySection />
        <Team members={members} />
        <BusinessEnquiry />
      </main>
      <SiteFooter />
    </div>
  );
}

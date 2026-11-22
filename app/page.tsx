import type { Metadata } from "next";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { EditorialHome } from "@/components/kitty/editorial-home";
import { BrandRevealLoader } from "@/components/kitty/brand-reveal-loader";
import { companySettings } from "@/lib/company-server";
import { pageMetadata, websiteOrigin, jsonLd, canonicalSocialUrl } from "@/lib/site-metadata";
import { CONTACT_EMAIL, isFounderLinkedIn } from "@/lib/company-contact";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMetadata(
      "KITTY CORP — Beyond Intelligence | For a Better & Safer Future",
      "KITTY CORP builds autonomous robotics, intelligent systems and digital solutions for a better and safer future.",
      "/"
    ),
    title: "KITTY CORP — Beyond Intelligence | For a Better & Safer Future",
  };
}

export default async function Home() {
  const settings = await companySettings();
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
      url: `${origin}/brand/kitty-corp-logo-transparent.png`,
      caption: "KITTY CORP Official Logo",
    },
    description:
      "KITTY CORP develops Physical-World Intelligence through AI robotics, agricultural systems, clean-energy intelligence and commercial digital engineering.",
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
      "Computer Vision",
    ],
    subOrganization: [
      {
        "@type": "Organization",
        name: "KITTY CORP Digital Solutions",
        url: "https://demo.thekittycorp.com",
        description:
          "Commercial digital studio delivering bespoke web applications, business automation, and custom digital software.",
      },
    ],
    sameAs: Array.from(new Set([
      "https://github.com/psychspy7/kittycorp",
      "https://www.instagram.com/kittycorp.ai/",
      ...sameAs,
    ])),
    address: { "@type": "PostalAddress", addressCountry: "IN" },
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
      "Official website of KITTY CORP • Physical-World Intelligence, Agricultural Robotics & Clean Energy Systems.",
  };

  return (
    <div className="bg-[#F5F2EA] text-[#191B1D] min-h-screen">
      <BrandRevealLoader />
      <SiteHeader />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd([organization, webSite]) }}
        />
        <EditorialHome />
      </main>
      <SiteFooter />
    </div>
  );
}

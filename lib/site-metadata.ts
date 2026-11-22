import type { Metadata } from "next";

const canonicalHost = "thekittycorp.com";
export const defaultSocialPreview = `https://${canonicalHost}/brand/opengraph-preview.jpg?v=20261123-future`;
export const defaultSiteTitle = "KITTY CORP | For a Better Future | Building with Purpose";
export const defaultSiteDescription =
  "Building with purpose | Thinking beyond today. Building a safer, brighter future.";

export function canonicalSiteUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase() === "kittycorp.vercel.app") url.hostname = canonicalHost;
    if (url.hostname.toLowerCase() === "www.thekittycorp.com") url.hostname = canonicalHost;
    return url.toString().replace(/\/$/, "");
  } catch {
    return `https://${canonicalHost}`;
  }
}

export const websiteOrigin = () => canonicalSiteUrl(process.env.SITE_URL || `https://${canonicalHost}`);

export function publicSiteHref(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase().replace(/^www\./, "") === "instagram.com") {
      url.protocol = "https:";
      url.hostname = "www.instagram.com";
      url.pathname = "/kittycorp.ai/";
      url.search = "";
      url.hash = "";
      return url.toString();
    }
    if (url.hostname.toLowerCase() !== "kittycorp.vercel.app") return value;
    url.hostname = canonicalHost;
    return url.toString();
  } catch {
    return value;
  }
}

export function canonicalSocialUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase().replace(/^www\./, "") === "instagram.com") {
      url.protocol = "https:";
      url.hostname = "www.instagram.com";
      url.search = "";
      url.hash = "";
      url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
    }
    return url.toString();
  } catch {
    return value;
  }
}

export function conciseDescription(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= 160 ? clean : clean.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const summary = conciseDescription(description || defaultSiteDescription);
  const origin = websiteOrigin();
  const canonicalUrl = path === "/" ? origin : `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  const previewImg = `${origin}/brand/opengraph-preview.jpg?v=20261123-future`;

  return {
    title,
    description: summary,
    alternates: { canonical: canonicalUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description: summary,
      url: canonicalUrl,
      siteName: "KITTY CORP",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: previewImg,
          secureUrl: previewImg,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: "THE KITTY CORP | For a Better Future | Building with purpose, thinking beyond today.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@KittyCorphq",
      creator: "@KittyCorphq",
      title,
      description: summary,
      images: [previewImg],
    },
    other: {
      "geo.region": "IN",
      "geo.placename": "India",
      "geo.position": "28.6139;77.2090",
      ICBM: "28.6139, 77.2090",
    },
  };
}

export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

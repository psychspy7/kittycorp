import type { MetadataRoute } from "next";
import { websiteOrigin } from "@/lib/site-metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admins",
        "/kitten",
        "/payments",
        "/account",
        "/newsletter/",
        "/projects/quote",
        "/lisa-ai/preorder",
        "/abcdefghijklmnopqrstuvwxyz",
        "/api/",
      ],
    },
    host: websiteOrigin(),
    sitemap: `${websiteOrigin()}/sitemap.xml`,
  };
}

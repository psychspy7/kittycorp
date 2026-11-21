import type { MetadataRoute } from "next";
import { websiteOrigin } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const allowedBots = ["Googlebot", "Google-Extended", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/account/", "/kitten/", "/abcdefghijklmnopqrstuvwxyz/"] },
      ...allowedBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    host: websiteOrigin(),
    sitemap: `${websiteOrigin()}/sitemap.xml`,
  };
}

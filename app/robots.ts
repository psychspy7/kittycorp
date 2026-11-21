import type { MetadataRoute } from "next";
import { websiteOrigin } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const allowedBots = ["Googlebot", "Google-Extended", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot"];
  const privatePaths = ["/api/", "/account/", "/kitten/", "/abcdefghijklmnopqrstuvwxyz/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      ...allowedBots.map((userAgent) => ({ userAgent, allow: "/", disallow: privatePaths })),
    ],
    host: websiteOrigin(),
    sitemap: `${websiteOrigin()}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { websiteOrigin } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: websiteOrigin(),
    sitemap: `${websiteOrigin()}/sitemap.xml`,
  };
}

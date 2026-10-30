import type { MetadataRoute } from "next";
import { websiteOrigin } from "@/lib/site-metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admins", "/kitten", "/payments", "/account", "/newsletter/", "/abcdefghijklmnopqrstuvwxyz", "/api/"] },
    sitemap: `${websiteOrigin()}/sitemap.xml`,
  };
}

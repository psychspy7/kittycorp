import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admins", "/kitten", "/payments", "/account", "/newsletter/", "/abcdefghijklmnopqrstuvwxyz", "/api/"] },
    sitemap: process.env.SITE_URL
      ? `${process.env.SITE_URL}/sitemap.xml`
      : undefined,
  };
}

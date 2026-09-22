import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_URL;
  if (!origin) return [];
  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];
}

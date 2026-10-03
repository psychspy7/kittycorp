import type { MetadataRoute } from "next";
import { publishedLaunches } from "@/lib/launches-server";
import { launchHref } from "@/lib/launches";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.SITE_URL;
  if (!origin) return [];
  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    ...(await publishedLaunches()).map((launch) => ({ url: `${origin}${launchHref(launch)}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${origin}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];
}

import type { MetadataRoute } from "next";
import { publishedLaunches } from "@/lib/launches-server";
import { launchHref } from "@/lib/launches";
import { publicJournal } from "@/lib/journal-server";
import { companyProducts } from "@/lib/company-server";
import { serviceSegments } from "@/lib/business-content";
import { websiteOrigin } from "@/lib/site-metadata";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = websiteOrigin();
  const [launches, products, journal] = await Promise.all([
    publishedLaunches().catch(() => []),
    companyProducts().catch(() => []),
    publicJournal().catch(() => []),
  ]);
  const staticPages = [
    "services",
    "products",
    "kitty-ai",
    "lisa-ai",
    "sentinel",
    "company",
    "team",
    "research",
    "build-log",
    "contact",
    "projects",
    "pricing",
    "appointments",
    "memberships",
    "play",
    "investors",
    "privacy",
    "terms",
    "refunds",
    "secretchat",
  ];
  const entries: MetadataRoute.Sitemap = [
    { url: origin },
    ...staticPages.map((page) => ({ url: `${origin}/${page}` })),
    ...Object.keys(serviceSegments).map((segment) => ({ url: `${origin}/services/${segment}` })),
    ...products.map((product) => ({ url: `${origin}/${product.slug}`, lastModified: product.updated_at })),
    ...launches.map((launch) => ({ url: `${origin}${launchHref(launch)}` })),
    ...journal
      .filter((entry) => entry.kind === "article")
      .map((entry) => ({ url: `${origin}/build-log/${entry.slug}`, lastModified: entry.updated_at })),
  ];
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

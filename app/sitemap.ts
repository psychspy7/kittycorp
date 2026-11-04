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

  const highPriority = new Set(["services", "products", "memberships", "projects", "pricing"]);

  const staticPages = [
    "services",
    "products",
    "memberships",
    "projects",
    "pricing",
    "company",
    "team",
    "research",
    "build-log",
    "contact",
    "appointments",
    "kitty-ai",
    "secretchat",
    "lisa-ai",
    "sentinel",
    "play",
    "investors",
    "privacy",
    "terms",
    "refunds",
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...staticPages.map((page) => ({
      url: `${origin}/${page}`,
      lastModified: now,
      changeFrequency: (highPriority.has(page) ? "daily" : "weekly") as "daily" | "weekly",
      priority: highPriority.has(page) ? 0.9 : 0.8,
    })),
    ...Object.keys(serviceSegments).map((segment) => ({
      url: `${origin}/services/${segment}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...products.map((product) => ({
      url: `${origin}/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...launches.map((launch) => ({
      url: `${origin}${launchHref(launch)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...journal
      .filter((entry) => entry.kind === "article")
      .map((entry) => ({
        url: `${origin}/build-log/${entry.slug}`,
        lastModified: entry.updated_at ? new Date(entry.updated_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

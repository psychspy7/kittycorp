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

  const highPriority = new Set(["services", "products", "memberships", "projects", "pricing", "agriyaan", "urjayaan", "buddy"]);
  const deprecatedSlugs = new Set([
    "kitty-ai",
    "play",
  ]);

  const staticPages = [
    "agriyaan",
    "urjayaan",
    "buddy",
    "projects",
    "research",
    "memberships",
    "company",
    "team",
    "contact",
    "services",
    "products",
    "pricing",
    "investors",
    "build-log",
    "appointments",
    "privacy",
    "terms",
    "refunds",
  ];

  const entries: MetadataRoute.Sitemap = [
    {
      url: origin,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...staticPages.map((page) => ({
      url: `${origin}/${page}`,
      
      changeFrequency: (highPriority.has(page) ? "daily" : "weekly") as "daily" | "weekly",
      priority: highPriority.has(page) ? 0.9 : 0.8,
    })),
    ...Object.keys(serviceSegments).map((segment) => ({
      url: `${origin}/services/${segment}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...products
      .filter((product) => !deprecatedSlugs.has(product.slug))
      .map((product) => ({
        url: `${origin}/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...launches
      .filter((launch) => !deprecatedSlugs.has(launch.slug) && !/(examify|secretchat)/i.test(`${launch.slug} ${launch.name}`))
      .map((launch) => ({
        url: `${origin}${launchHref(launch)}`,
        lastModified: launch.updated_at ? new Date(launch.updated_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...journal
      .filter((entry) => entry.kind === "article" && !["a-more-honest-home-for-kitty", "what-we-want-kitty-ai-to-remember", "privacy-needs-more-than-a-label"].includes(entry.slug))
      .map((entry) => ({
        url: `${origin}/build-log/${entry.slug}`,
        lastModified: entry.updated_at ? new Date(entry.updated_at) : undefined,
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

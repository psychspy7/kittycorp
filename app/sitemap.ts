import type { MetadataRoute } from "next";
import { publishedLaunches } from "@/lib/launches-server";
import { launchHref } from "@/lib/launches";
import { publicJournal } from "@/lib/journal-server";
import { companyProducts } from "@/lib/company-server";
import { websiteOrigin } from "@/lib/site-metadata";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = websiteOrigin();
  const [launches, products, journal] = await Promise.all([
    publishedLaunches().catch(() => []),
    companyProducts().catch(() => []),
    publicJournal().catch(() => []),
  ]);

  const highPriority = new Set(["agriyaan", "urjayaan", "buddy", "projects", "research", "services"]);

  // Clean, verified canonical public routes ONLY
  // Strictly excludes internal/secure panels: /kitten, /admins, /account, /payments, /maintenance, /projects/quote, /newsletter/*
  const staticPages = [
    "agriyaan",
    "urjayaan",
    "buddy",
    "projects",
    "research",
    "services",
    "services/agencies",
    "services/coaching-centres",
    "company",
    "team",
    "investors",
    "memberships",
    "contact",
    "build-log",
    "support",
    "privacy",
    "terms",
    "refunds",
  ];

  const deprecatedSlugs = new Set([
    "play",
    "lisa",
    "examify",
    "secretchat",
    "chat",
    "preview",
    "studio",
  ]);

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
    ...products
      .filter((product) => !deprecatedSlugs.has(product.slug) && !/(kitty-ai|buddy|secretchat|examify|chat|lisa)/i.test(`${product.slug} ${product.name}`))
      .map((product) => ({
        url: `${origin}/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...launches
      .filter((launch) => !deprecatedSlugs.has(launch.slug) && !/(examify|secretchat|kitty-ai|buddy|chat|lisa)/i.test(`${launch.slug} ${launch.name}`))
      .map((launch) => ({
        url: `${origin}${launchHref(launch)}`,
        lastModified: launch.updated_at ? new Date(launch.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...journal
      .filter((entry) => entry.kind === "article" && !["a-more-honest-home-for-kitty", "what-we-want-kitty-ai-to-remember", "privacy-needs-more-than-a-label"].includes(entry.slug))
      .map((entry) => ({
        url: `${origin}/build-log/${entry.slug}`,
        lastModified: entry.updated_at ? new Date(entry.updated_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    // Defense-in-depth: exclude all private panels, transactions, or internal paths
    if (/(kitten|admin|account|payment|quote|maintenance|abcdefghijklmnopqrstuvwxyz|private|api)/i.test(entry.url)) {
      return false;
    }
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

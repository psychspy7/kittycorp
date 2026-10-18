import type { MetadataRoute } from "next";
import { publishedLaunches } from "@/lib/launches-server";
import { launchHref } from "@/lib/launches";
import { publicJournal } from "@/lib/journal-server";
import { companyProducts } from "@/lib/company-server";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.SITE_URL;
  if (!origin) return [];
  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    ...(await publishedLaunches()).map((launch) => ({ url: `${origin}${launchHref(launch)}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${origin}/contact`, changeFrequency: "monthly", priority: 0.6 },
    ...(await companyProducts()).map(p=>({url:`${origin}/${p.slug}`,lastModified:p.updated_at,changeFrequency:"weekly" as const,priority:0.7})),
    ...["memberships","products","company","team","research","build-log","services","pricing","appointments","play","projects","investors","privacy","terms","refunds"].map(page=>({url:`${origin}/${page}`,changeFrequency:"weekly" as const,priority:0.7})),
    ...(await publicJournal()).filter(e=>e.kind==="article").map(e=>({url:`${origin}/build-log/${e.slug}`,lastModified:e.updated_at,changeFrequency:"monthly" as const,priority:0.6})),
  ];
}

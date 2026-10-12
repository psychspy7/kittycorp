import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { singleFlight } from "./single-flight";

export const PUBLIC_CONTENT_TAGS = {
  company: "kitty-public-company", launches: "kitty-public-launches",
  journal: "kitty-public-journal", testimonials: "kitty-public-testimonials",
  notices: "kitty-public-notices", assistant: "kitty-public-assistant-presentation",
} as const;
type PublicTag = typeof PUBLIC_CONTENT_TAGS[keyof typeof PUBLIC_CONTENT_TAGS];
type PublicDataset = "products" | "team" | "company" | "launches" | "journal" | "testimonials" | "notices" | "assistant-presentation";

// This project retains the non-Cache-Components Next.js model. Do not globally
// cache database(): authenticated queries, credentials and downloads stay fresh.
// The public database URL namespaces different deployments and test fixtures.
export function publicContentCache<T>(dataset: PublicDataset, tag: PublicTag, read: () => Promise<T>) {
  return singleFlight(unstable_cache(read,
    ["kitty-public-v1", process.env.SUPABASE_URL || "unconfigured", dataset],
    { tags: [tag], revalidate: 60 }));
}
export function refreshPublicContent(tag: PublicTag) {
  // Studio Route Handlers need blocking invalidation, not a stale first refresh.
  revalidateTag(tag, { expire: 0 });
}

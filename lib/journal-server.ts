import "server-only";
import { cache } from "react";
import { PUBLIC_CONTENT_TAGS, publicContentCache, refreshPublicContent } from "./public-content-cache";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { database, HttpError } from "./kitty-server";
import { journalCategories, type JournalEntry, type JournalSummary } from "./journal";
export const entrySchema = z.object({
  slug: z.string().trim().min(3).max(90).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens for the address."),
  title: z.string().trim().min(3).max(140), summary: z.string().trim().min(10).max(500), body: z.string().trim().min(10).max(20000),
  category: z.enum(journalCategories), kind: z.enum(["article", "update"]), status: z.string().trim().min(2).max(40),
  cover_url: z.string().trim().max(1000).refine(v => !v || /^https:\/\/[^\s]+$/i.test(v), "Use a public HTTPS image address."),
  cover_alt: z.string().trim().max(200), entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)), "Choose a valid date."), published: z.boolean(),
}).refine(v => !v.cover_url || v.cover_alt.length > 0, { message: "Describe the cover image for readers using a screen reader.", path: ["cover_alt"] });
const readJournal = publicContentCache("journal", PUBLIC_CONTENT_TAGS.journal, async (): Promise<JournalSummary[]> => {
  const { data, error } = await database().from("kitty_website_journal").select("id,slug,title,summary,category,kind,status,cover_url,cover_alt,entry_date,published,created_at,updated_at").eq("published", true).lte("entry_date", new Date().toISOString().slice(0,10)).order("entry_date", { ascending: false }).order("created_at", { ascending: false }).limit(100);
  if (error) throw new HttpError("The build log is temporarily unavailable.", 503);
  return data as JournalSummary[];
});
export const publicJournal = cache(readJournal);
export const publicArticle = cache(async (slug: string): Promise<JournalEntry | null> => {
  const { data, error } = await database().from("kitty_website_journal").select("*").eq("slug", slug).eq("kind", "article").eq("published", true).lte("entry_date", new Date().toISOString().slice(0,10)).maybeSingle();
  if(error) throw new HttpError("This article is temporarily unavailable.", 503);
  return data as JournalEntry | null;
});
export function refreshJournal() { refreshPublicContent(PUBLIC_CONTENT_TAGS.journal); for (const path of ["/", "/build-log", "/research", "/kitty-ai", "/sentinel", "/lisa-ai", "/sitemap.xml"]) revalidatePath(path); revalidatePath("/build-log/[slug]", "page"); }

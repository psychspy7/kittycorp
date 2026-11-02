import "server-only";
import { revalidatePath } from "next/cache";
import { database } from "./kitty-server";
import { PUBLIC_CONTENT_TAGS, publicContentCache, refreshPublicContent } from "./public-content-cache";
import { SITE_PAGE_SLUGS, sitePageContentSchemas, sitePageDefaults, sitePageInfo, type SitePageContent, type SitePageSlug } from "./site-page-content";

const readPage = Object.fromEntries(SITE_PAGE_SLUGS.map((slug) => [slug, publicContentCache("pages", PUBLIC_CONTENT_TAGS.pages, async () => {
  const { data, error } = await database()
    .from("kitty_website_pages")
    .select("content")
    .abortSignal(AbortSignal.timeout(5000))
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data?.content ?? null;
}, [slug])])) as Record<SitePageSlug, () => Promise<unknown>>;

export async function sitePageContent(slug: SitePageSlug): Promise<SitePageContent> {
  try {
    const content = await readPage[slug]();
    if (content) {
      const parsed = sitePageContentSchemas[slug].safeParse(content);
      if (parsed.success) return { ...sitePageDefaults[slug], ...parsed.data };
    }
  } catch {
    // The built-in copy keeps public pages available before the CMS migration
    // is installed or while the content database is temporarily unavailable.
  }
  return { ...sitePageDefaults[slug] };
}

export function refreshSitePage(slug: SitePageSlug) {
  refreshPublicContent(PUBLIC_CONTENT_TAGS.pages);
  revalidatePath(sitePageInfo[slug].route);
}

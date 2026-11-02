import { z } from "zod";
import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { refreshSitePage } from "@/lib/site-pages-server";
import { isSitePageSlug, parseSitePageContent, SITE_PAGE_SLUGS } from "@/lib/site-page-content";

const updateSchema = z.object({
  slug: z.enum(SITE_PAGE_SLUGS),
  content: z.unknown(),
}).strict();

function missingPagesTable(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = String(error.code);
  return code === "42P01" || code === "PGRST205";
}

export async function GET() {
  try {
    const { db } = await requireAdmin();
    const { data, error } = await db
      .from("kitty_website_pages")
      .select("slug,content,updated_at")
      .order("slug")
      .abortSignal(AbortSignal.timeout(8000));
    if (error) {
      if (missingPagesTable(error)) return privateJson({ pages: [], migrationRequired: true });
      throw error;
    }
    const pages = (data ?? []).flatMap((row) => {
      if (!isSitePageSlug(row.slug)) return [];
      const parsed = (() => {
        try {
          return parseSitePageContent(row.slug, row.content);
        } catch {
          return null;
        }
      })();
      return parsed ? [{ slug: row.slug, content: parsed, updated_at: row.updated_at }] : [];
    });
    return privateJson({ pages, migrationRequired: false });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const body = updateSchema.parse(await readBody(request));
    const content = parseSitePageContent(body.slug, body.content);
    const { data, error } = await db
      .from("kitty_website_pages")
      .upsert({ slug: body.slug, content, updated_at: new Date().toISOString() }, { onConflict: "slug" })
      .select("slug,content,updated_at")
      .single();
    if (error) {
      if (missingPagesTable(error)) {
        throw new HttpError("The page editor needs its one-time database migration before it can save.", 503);
      }
      throw error;
    }
    refreshSitePage(body.slug);
    return privateJson({ page: data });
  } catch (error) {
    return failure(error);
  }
}

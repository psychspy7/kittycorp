import "server-only";
import { cache } from "react";
import { PUBLIC_CONTENT_TAGS, publicContentCache, refreshPublicContent } from "./public-content-cache";
import { revalidatePath } from "next/cache";
import { database } from "./kitty-server";
import type { Testimonial } from "./testimonials";

const readTestimonials = publicContentCache("testimonials", PUBLIC_CONTENT_TAGS.testimonials, async (): Promise<Testimonial[]> => {
  const {data, error} = await database().from("kitty_website_testimonials")
    .select("id,reviewer_name,reviewer_role,company,quote,source_url,permission_confirmed,published,sort_order").abortSignal(AbortSignal.timeout(5000))
    .eq("published", true).eq("permission_confirmed", true)
    .order("sort_order").order("created_at", {ascending: false}).limit(6);
  if (error) throw error;
  return data as Testimonial[];
});

export const publicTestimonials = cache(async (): Promise<Testimonial[]> => {
  try { return await readTestimonials(); }
  catch { console.error("Kitty website reviews could not be loaded"); return []; }
});

export function refreshTestimonials() {
  refreshPublicContent(PUBLIC_CONTENT_TAGS.testimonials);
  revalidatePath("/");
  revalidatePath("/services");
}

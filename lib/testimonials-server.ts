import "server-only";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { database } from "./kitty-server";
import type { Testimonial } from "./testimonials";

export const publicTestimonials = cache(async (): Promise<Testimonial[]> => {
  const {data, error} = await database().from("kitty_website_testimonials")
    .select("id,reviewer_name,reviewer_role,company,quote,source_url,permission_confirmed,published,sort_order")
    .eq("published", true).eq("permission_confirmed", true)
    .order("sort_order").order("created_at", {ascending: false}).limit(6);
  if (error) {
    console.error("Kitty website reviews could not be loaded");
    return [];
  }
  return data as Testimonial[];
});

export function refreshTestimonials() {
  revalidatePath("/");
  revalidatePath("/services");
}

import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { testimonialSchema } from "@/lib/testimonials";
import { refreshTestimonials } from "@/lib/testimonials-server";

export async function GET() {
  try {
    const {db} = await requireAdmin();
    const {data, error} = await db.from("kitty_website_testimonials").select("*").order("sort_order").order("created_at", {ascending: false}).limit(100);
    if (error) throw error;
    return privateJson({testimonials: data});
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const {db} = await requireAdmin();
    const value = testimonialSchema.parse(await readBody(request));
    const {count, error: countError} = await db.from("kitty_website_testimonials").select("id", {count: "exact", head: true});
    if (countError) throw countError;
    if ((count || 0) >= 100) throw new HttpError("Remove an unused review before adding another.", 400);
    const {data, error} = await db.from("kitty_website_testimonials").insert(value).select().single();
    if (error) throw error;
    refreshTestimonials();
    return privateJson({testimonial: data});
  } catch (error) { return failure(error); }
}

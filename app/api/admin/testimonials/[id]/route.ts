import { z } from "zod";
import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { testimonialSchema } from "@/lib/testimonials";
import { refreshTestimonials } from "@/lib/testimonials-server";
type Context = {params: Promise<{id: string}>};

export async function PATCH(request: Request, context: Context) {
  try {
    verifyOrigin(request);
    const {db} = await requireAdmin();
    const {id} = await context.params;
    z.string().uuid().parse(id);
    const value = testimonialSchema.parse(await readBody(request));
    const {data, error} = await db.from("kitty_website_testimonials").update({...value, updated_at: new Date().toISOString()}).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new HttpError("Review not found.", 404);
    refreshTestimonials();
    return privateJson({testimonial: data});
  } catch (error) { return failure(error); }
}

export async function DELETE(request: Request, context: Context) {
  try {
    verifyOrigin(request);
    const {db} = await requireAdmin();
    const {id} = await context.params;
    z.string().uuid().parse(id);
    const {data, error} = await db.from("kitty_website_testimonials").delete().eq("id", id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) throw new HttpError("Review not found.", 404);
    refreshTestimonials();
    return privateJson({ok: true});
  } catch (error) { return failure(error); }
}

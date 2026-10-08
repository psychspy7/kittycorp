import { z } from "zod";

const sourceLink = z.string().trim().max(1000).refine(value => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}, "Use a complete HTTPS source link, or leave it empty.");

export const testimonialSchema = z.object({
  reviewer_name: z.string().trim().min(2).max(100),
  reviewer_role: z.string().trim().max(120),
  company: z.string().trim().max(160),
  quote: z.string().trim().min(20).max(1500),
  source_url: sourceLink,
  permission_confirmed: z.boolean(),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(1000),
}).superRefine((value, ctx) => {
  if (value.published && !value.permission_confirmed) {
    ctx.addIssue({code: z.ZodIssueCode.custom, path: ["permission_confirmed"], message: "Confirm this is a genuine quote and you have permission to publish it."});
  }
});

export type Testimonial = z.infer<typeof testimonialSchema> & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

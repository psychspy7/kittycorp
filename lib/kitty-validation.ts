import { z } from "zod";
import { categories } from "./kitty-types";
export const feedbackSchema = z.object({
  kind: z.enum(["message", "review"]).optional().default("message"),
  subject: z.string().trim().max(120).optional().default(""),
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters).")
    .max(5000),
  website: z.string().max(300).optional().default(""),
  startedAt: z.number().finite(),
}).refine(value => value.kind !== "review" || value.message.length <= 4993, { message: "Keep reviews within 4,993 characters.", path: ["message"] });
export const noticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "A title needs at least 3 characters.")
    .max(120),
  body: z.string().trim().min(10, "Write at least 10 characters.").max(4000),
  category: z.enum(categories),
  published: z.boolean(),
});

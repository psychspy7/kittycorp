import { randomBytes } from "node:crypto";
import { quoteAction } from "@/lib/project-quotes-server";
import { after } from "next/server";
import { failure, fingerprint, HttpError, privateJson, readBody, verifyOrigin } from "@/lib/kitty-server";
import { enquirySchema } from "@/lib/enquiries";
import { verifyTurnstile } from "@/lib/turnstile-server";
import { drainEmailQueue } from "@/lib/email-notifications";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const body = await readBody(request);
    const value = enquirySchema.parse(body);
    if (value.website) return privateJson({ ok: true });
    const elapsed = Date.now() - value.startedAt;
    if (elapsed < 2000 || elapsed > 86400000) throw new HttpError("Take a moment, then try sending your project again.", 400);
    await verifyTurnstile(request, (body as Record<string, unknown>).turnstileToken, "project-enquiry");
    const quoteToken = randomBytes(32).toString("hex");
    await quoteAction("submit",quoteToken,{name:value.name,email:value.email,service:value.service,organization:value.organization,budget:value.budget,timeline:value.timeline,scope:value.message,preference:value.paymentChoice,fingerprint:await fingerprint(request)});
    after(async () => { await drainEmailQueue(); });
    return privateJson({ ok: true, quoteToken });
  } catch (error) { return failure(error); }
}

import {optionalCustomer} from "@/lib/customer-account-server";
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
 const customer=await optionalCustomer(request);if(customer&&customer.email.toLowerCase()!==value.email.toLowerCase())throw new HttpError("Use your Google account email for tracking, or sign out to submit as a guest.",400);
    const quoteToken = randomBytes(32).toString("hex");
    await quoteAction("submit",quoteToken,{name:value.name,email:value.email,service:value.service,organization:value.organization,budget:value.budget,timeline:value.timeline,scope:value.message,preference:value.paymentChoice,fingerprint:await fingerprint(request),...(customer?{customer_uid:customer.uid,customer_email:customer.email}:{})});
    after(async () => { await drainEmailQueue(); });
    return privateJson({ ok: true, quoteToken, accountLinked:!!customer });
  } catch (error) { return failure(error); }
}

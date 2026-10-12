import "server-only";
import nodemailer from "nodemailer";
import { z } from "zod";
import { CONTACT_EMAIL } from "./company-contact";
import { database, setting } from "./kitty-server";

const jobSchema = z.object({
  id: z.string().uuid(), claim_token: z.string().uuid(), name: z.string().max(100),
  email: z.string().email().max(254), message: z.string().max(5000), created_at: z.string(),
  kind: z.enum(["message", "project", "review", "early-access"]),
});
const labels = { message: "Contact message", project: "Project enquiry", review: "Review / feedback", "early-access": "Early-access signup" };
export function emailConfiguration() {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "") || "";
  return { configured: /^[a-zA-Z0-9]{16}$/.test(password), password, recipient: CONTACT_EMAIL };
}
function transport() {
  const config = emailConfiguration();
  if (!config.configured) throw new Error("Email sending is not configured.");
  return nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: CONTACT_EMAIL, pass: config.password },
    connectionTimeout: 8000, greetingTimeout: 5000, socketTimeout: 10000,
    tls: { minVersion: "TLSv1.2" }, logger: false, debug: false,
  });
}
function studioLink() {
  try { return new URL("/kitten", process.env.SITE_URL || "https://kittycorp.vercel.app").href; }
  catch { return "https://kittycorp.vercel.app/kitten"; }
}
export async function sendTestEmail() {
  const result = await transport().sendMail({
    from: { name: "KITTY CORP Website", address: CONTACT_EMAIL }, to: CONTACT_EMAIL,
    subject: "KITTY CORP — website email alerts are connected",
    text: `This is a test notification from your website.\n\nContact messages, project enquiries, reviews and early-access signups will also reach this inbox.\n\nOpen Studio: ${studioLink()}`,
    disableFileAccess: true, disableUrlAccess: true,
  });
  if (!result.accepted?.length) throw new Error("Email was not accepted.");
}
// The database trigger queues a reference atomically with each saved submission.
// An email failure never turns an accepted form into a failed/duplicate message.
export async function drainEmailQueue(limit = 3) {
  if (!emailConfiguration().configured) return { sent: 0, failed: 0, configured: false };
  let sent = 0, failed = 0;
  const db = database();
  const token = setting("FEEDBACK_GATEWAY_TOKEN");
  for (let i = 0; i < Math.min(Math.max(limit, 1), 3); i++) {
    const { data, error } = await db.rpc("kitty_website_claim_email", { p_gateway_token: token });
    if (error) { console.error("[Kitty Corp] Email queue is unavailable."); break; }
    if (!data) break;
    const parsed = jobSchema.safeParse(data);
    if (!parsed.success) { console.error("[Kitty Corp] Invalid email queue entry."); break; }
    const job = parsed.data;
    let deliveryError: "mail_failed" | null = null;
    try {
      const result = await transport().sendMail({
        from: { name: "KITTY CORP Website", address: CONTACT_EMAIL }, to: CONTACT_EMAIL,
        replyTo: job.email, subject: `KITTY CORP — ${labels[job.kind]}`,
        text: `${labels[job.kind]}\n\nFrom: ${job.name}\nEmail: ${job.email}\nReceived: ${job.created_at}\n\n${job.message}\n\nOpen Studio: ${studioLink()}\nNotification reference: ${job.id}\n\nVisitor reviews stay private until you have permission to publish them.`,
        disableFileAccess: true, disableUrlAccess: true,
      });
      if (!result.accepted?.length) throw new Error("Email was not accepted.");
      sent++;
    } catch { deliveryError = "mail_failed"; failed++; }
    const acknowledgement = await db.rpc("kitty_website_finish_email", {
      p_id: job.id, p_claim_token: job.claim_token, p_error: deliveryError, p_gateway_token: token,
    });
    if (acknowledgement.error || acknowledgement.data !== true) {
      console.error("[Kitty Corp] Email queue acknowledgement failed."); break;
    }
    if (deliveryError) break;
  }
  return { sent, failed, configured: true };
}

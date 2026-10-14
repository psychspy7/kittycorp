import "server-only";
import nodemailer from "nodemailer";
import { z } from "zod";
import { CONTACT_EMAIL } from "./company-contact";
import { database, setting } from "./kitty-server";
import { renderEmail, type EmailJob } from "./email-templates";
const jobSchema = z
  .object({
    id: z.string().uuid(),
    claim_token: z.string().uuid(),
    template: z.enum([
      "admin",
      "ack",
      "review_thanks",
      "confirm",
      "welcome",
      "report",
    ]),
    name: z.string().max(100),
    email: z.string().email().max(254).optional(),
    kind: z.string().max(30),
  })
  .passthrough();
export function emailConfiguration() {
  const password = (
    process.env.SMTP_APP_PASSWORD ||
    process.env.GMAIL_APP_PASSWORD ||
    ""
  ).replace(/\s/g, "");
  const host = process.env.SMTP_HOST || "smtp.gmail.com",
    port = process.env.SMTP_PORT || "465",
    secure = process.env.SMTP_SECURE || "true",
    user = process.env.SMTP_USER || CONTACT_EMAIL;
  return {
    configured:
      /^[a-zA-Z0-9]{16}$/.test(password) &&
      host === "smtp.gmail.com" &&
      port === "465" &&
      secure === "true" &&
      user.toLowerCase() === CONTACT_EMAIL,
    password,
    recipient: CONTACT_EMAIL,
    fromName: "KITTY CORP",
  };
}
function transport() {
  const c = emailConfiguration();
  if (!c.configured) throw Error("Email sending is not configured.");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: CONTACT_EMAIL, pass: c.password },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    logger: false,
    debug: false,
  });
}
export function emailSite() {
  try {
    const url = new URL(process.env.SITE_URL || "https://kittycorp.vercel.app");
    if (
      url.protocol !== "https:" &&
      !(
        process.env.NODE_ENV !== "production" &&
        ["localhost", "127.0.0.1"].includes(url.hostname)
      )
    )
      throw Error();
    return url.origin;
  } catch {
    return "https://kittycorp.vercel.app";
  }
}
export async function automationRpc(
  action: string,
  value: Record<string, unknown> = {},
) {
  const { data, error } = await database().rpc("kitty_website_email_worker", {
    p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
    p_action: action,
    p_value: value,
  });
  if (error) throw Error("Email automation is temporarily unavailable.");
  return data;
}
export function smtpFailure(
  error: unknown,
): "transient" | "rejected" | "uncertain" {
  const e = error as { responseCode?: number; command?: string; code?: string };
  if (e.responseCode && e.responseCode >= 500) return "rejected";
  if (e.responseCode && e.responseCode >= 400) return "transient";
  if (e.command === "DATA") return "uncertain";
  if (
    e.command &&
    e.command !== "DATA" &&
    [
      "CONN",
      "EHLO",
      "HELO",
      "STARTTLS",
      "AUTH",
      "AUTH PLAIN",
      "AUTH LOGIN",
      "MAIL FROM",
      "RCPT TO",
    ].includes(e.command)
  )
    return "transient";
  if (e.code === "ECONNECTION" || e.code === "EDNS") return "transient";
  return "uncertain";
}
export async function sendTestEmail() {
  const result = await transport().sendMail({
    from: { name: "KITTY CORP", address: CONTACT_EMAIL },
    to: CONTACT_EMAIL,
    replyTo: CONTACT_EMAIL,
    subject: "KITTY CORP — email automation test",
    text: `This is a test from your website email automation.\n\nStudio: ${emailSite()}/kitten\n\nSMTP acceptance is not guaranteed inbox delivery.`,
    html: `<h1>KITTY CORP</h1><p>Your website email automation test.</p><p>SMTP acceptance is not guaranteed inbox delivery.</p>`,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  if (!result.accepted?.some((v) => String(v).toLowerCase() === CONTACT_EMAIL))
    throw Error("Email was not accepted.");
}
export async function drainEmailQueue(
  limit = 4,
  filter: Record<string, unknown> = {},
  budgetMs = 40000,
) {
  if (!emailConfiguration().configured)
    return { sent: 0, failed: 0, configured: false };
  let sent = 0,
    failed = 0,
    uncertain = 0;
  const deadline = Date.now() + Math.min(Math.max(budgetMs, 1000), 180000);
  const dailyLimit = Math.min(
    Math.max(Number(process.env.EMAIL_DAILY_LIMIT) || 200, 1),
    400,
  );
  for (
    let i = 0;
    i < Math.min(Math.max(limit, 1), 20) && Date.now() < deadline;
    i++
  ) {
    let raw;
    try {
      raw = await automationRpc("claim", {
        ...filter,
        daily_limit: dailyLimit,
      });
    } catch {
      console.error("[Kitty Corp] Email queue unavailable.");
      break;
    }
    if (!raw) break;
    if (raw.skipped) continue;
    const parsed = jobSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("[Kitty Corp] Email job requires review.");
      break;
    }
    const job = parsed.data as EmailJob;
    let outcome: "accepted" | "transient" | "rejected" | "uncertain" =
      "uncertain";
    try {
      const message = renderEmail(job, emailSite());
      if (
        !z.string().email().safeParse(message.to).success ||
        /[\r\n]/.test(message.to)
      )
        throw Error("Invalid stored recipient");
      const result = await transport().sendMail({
        ...message,
        from: { name: "KITTY CORP", address: CONTACT_EMAIL },
        messageId: `<${job.id}@${new URL(emailSite()).hostname}>`,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
      if (
        result.accepted?.some(
          (v) => String(v).toLowerCase() === message.to.toLowerCase(),
        )
      ) {
        outcome = "accepted";
        sent++;
      } else {
        outcome = "rejected";
        failed++;
      }
    } catch (error) {
      outcome = smtpFailure(error);
      failed++;
      if (outcome === "uncertain") uncertain++;
    }
    try {
      const receipt = await automationRpc("finish", {
        id: job.id,
        claim_token: job.claim_token,
        result: outcome,
      });
      if (!receipt?.ok) throw Error();
    } catch {
      console.error("[Kitty Corp] Email receipt requires review.");
      break;
    }
    if (outcome !== "accepted") break;
  }
  return { sent, failed, uncertain, configured: true };
}
export function reportDay(now = new Date()) {
  const timeZone = process.env.REPORT_TIMEZONE || "Asia/Kolkata";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => parts.find((p) => p.type === type)!.value;
  return value("year") + "-" + value("month") + "-" + value("day");
}
export async function runDailyAutomation() {
  if (!emailConfiguration().configured)
    return { configured: false, sent: 0, failed: 0 };
  const retried = await drainEmailQueue(12, {}, 100000);
  const report = await automationRpc("report", { day: reportDay() });
  const reporting = report?.id
    ? await drainEmailQueue(1, { report_id: report.id }, 25000)
    : { sent: 0, failed: 0 };
  const cleanup = await automationRpc("cleanup", {
    retention_hours: Math.min(
      Math.max(Number(process.env.TEMP_DATA_RETENTION_HOURS) || 72, 72),
      2160,
    ),
  });
  return {
    configured: true,
    sent: retried.sent + reporting.sent,
    failed: retried.failed + reporting.failed,
    cleanup,
  };
}

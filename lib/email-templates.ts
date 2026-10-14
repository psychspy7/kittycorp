import { newsletterToken } from "./newsletter-tokens";
import { CONTACT_EMAIL } from "./company-contact";
export type EmailJob = {
  id: string;
  claim_token: string;
  template:
    | "admin"
    | "ack"
    | "review_thanks"
    | "confirm"
    | "welcome"
    | "report";
  name: string;
  email?: string;
  message?: string;
  subject?: string;
  created_at?: string;
  kind: string;
  reference?: string;
  signup_id?: string | null;
  nonce?: string | null;
  report_day?: string;
  items?: Array<Record<string, unknown>>;
  totals?: Record<string, number>;
  health?: Record<string, unknown>;
  active_subscribers?: number;
  as_of?: string;
  from?: string | null;
  more_pending?: boolean;
};
export const escapeHtml = (v: unknown) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const clean = (v: string) => v.replace(/[\r\n]/g, " ").slice(0, 120);
function shell(title: string, body: string, site: string) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"/><meta charset="UTF-8"/></head><body style="margin:0;background:#f5f3ed;color:#252720;font:15px/1.7 Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffefa;border:1px solid #e2dfd5;border-radius:12px"><tr><td style="padding:28px"><img src="${escapeHtml(site)}/brand/monogram-small-v1.webp" alt="" width="28" height="28" style="vertical-align:middle;margin-right:10px"/><strong style="letter-spacing:2px">KITTY CORP</strong><h1 style="font-size:24px;line-height:1.3;font-weight:500;margin:28px 0 22px">${escapeHtml(title)}</h1>${body}<p style="border-top:1px solid #e2dfd5;padding-top:20px;margin-top:28px;font-size:12px;color:#65675f">KITTY CORP · <a href="mailto:${CONTACT_EMAIL}" style="color:#6e572e">${CONTACT_EMAIL}</a></p></td></tr></table></td></tr></table></body></html>`;
}
const paragraph = (v: unknown) =>
  `<p>${escapeHtml(v).replace(/\n/g, "<br/>")}</p>`;
const button = (label: string, url: string) =>
  `<p><a href="${escapeHtml(url)}" style="display:inline-block;background:#282a22;color:#fff;padding:12px 18px;border-radius:5px;text-decoration:none">${escapeHtml(label)}</a></p>`;
export function renderEmail(job: EmailJob, site: string) {
  let subject: string, text: string, body: string;
  const first = clean(job.name.trim().split(/\s+/)[0] || "there"),
    ref = job.reference ? `Reference: ${job.reference}` : "",
    recipient =
      job.template === "admin" || job.template === "report"
        ? CONTACT_EMAIL
        : job.email!;
  if (job.template === "admin") {
    const label =
      job.kind === "project"
        ? "New Project Enquiry"
        : job.kind === "review"
          ? "New Customer Review"
          : job.kind === "newsletter"
            ? "Early-access signup"
            : "New Contact Message";
    subject = `[KITTY CORP] ${label} | ${clean(job.name)}`;
    text = `${label}\n\nName: ${job.name}\nEmail: ${job.email}\n${job.subject ? "Subject: " + job.subject + "\n" : ""}Submitted: ${job.created_at}\n${ref}\n\n${job.message || "Early-access signup"}\n\nReply to client: mailto:${job.email}\nStudio: ${site}/kitten`;
    body =
      paragraph(
        `Name: ${job.name}\nEmail: ${job.email}\n${job.subject ? "Subject: " + job.subject + "\n" : ""}Submitted: ${job.created_at}\n${ref}`,
      ) +
      `<div style="white-space:pre-wrap;overflow-wrap:anywhere;border-top:1px solid #e2dfd5;padding-top:18px">${escapeHtml(job.message || "Early-access signup")}</div>` +
      button("Reply to client", "mailto:" + job.email) +
      button("Open Studio", site + "/kitten");
  } else if (job.template === "ack") {
    subject =
      job.kind === "project"
        ? "We've received your project enquiry | KITTY CORP"
        : "Thanks for contacting KITTY CORP";
    text =
      job.kind === "project"
        ? `Hi ${first},\n\nThanks for reaching out to KITTY CORP.\n\nWe've received your project details and will review everything you've shared. If we need any more information, we'll get in touch.\n\nWe're looking forward to hearing more about what you're building.\n\n${ref}\n\nRegards,\nTeam KITTY CORP`
        : `Hi ${first},\n\nThanks for getting in touch.\n\nYour message has reached us. We'll go through it and get back to you as soon as we can.\n\nIf there's anything else you'd like to add, feel free to reply to this email.\n\n${ref}\n\nRegards,\nTeam KITTY CORP`;
    body = paragraph(text);
  } else if (job.template === "review_thanks") {
    subject = "Thank you for your review | KITTY CORP";
    text = `Hi ${first},\n\nThanks for taking the time to share your feedback.\n\nWe're a small team, and hearing from people who use our work genuinely means a lot.\n\nYour feedback helps us understand what we can improve and what we should keep doing.\n\nThanks for supporting KITTY CORP.\n\n${ref}\n\nTeam KITTY CORP`;
    body = paragraph(text);
  } else if (job.template === "confirm" || job.template === "welcome") {
    const unsub =
      site +
      "/newsletter/unsubscribe#" +
      newsletterToken("unsubscribe", job.signup_id!, job.nonce!);
    if (job.template === "confirm") {
      subject = "Confirm your KITTY CORP updates";
      const url =
        site +
        "/newsletter/confirm#" +
        newsletterToken("confirm", job.signup_id!, job.nonce!);
      text = `Hi there,\n\nPlease confirm that you'd like occasional KITTY CORP product and development updates.\n\nConfirm your email: ${url}\n\nThis link expires after 48 hours. If you didn't request this, you can ignore it or unsubscribe: ${unsub}\n\nTeam KITTY CORP`;
      body =
        paragraph(
          "Please confirm that you'd like occasional KITTY CORP product and development updates.",
        ) +
        button("Confirm my email", url) +
        paragraph(
          "This link expires after 48 hours. If you didn't request it, you can ignore this email.",
        );
    } else {
      subject = "Welcome to KITTY CORP";
      text = `Hey there,\n\nWelcome to KITTY CORP.\n\nWe're an independent technology startup working on AI, software, applications and ideas we're genuinely excited about.\n\nYou'll occasionally hear from us about new projects, product launches and the things we're building.\n\nThanks for joining us.\n\nTeam KITTY CORP\n\nUnsubscribe: ${unsub}`;
      body = paragraph(text.split("\n\nUnsubscribe:")[0]);
    }
    body += `<p style="font-size:12px"><a href="${escapeHtml(unsub)}">Unsubscribe</a></p>`;
  } else {
    subject = `KITTY CORP | Daily Business Report | ${job.report_day}`;
    const totals = job.totals || {},
      health = job.health || {},
      items = job.items || [];
    const summary = `New project enquiries: ${totals.project || 0}\nNew contact messages: ${totals.message || 0}\nNew reviews: ${totals.review || 0}\nNew confirmed subscribers: ${totals.subscribed || 0}\nUnsubscribes: ${totals.unsubscribed || 0}\nTotal active subscribers: ${job.active_subscribers || 0}`;
    const details = items
      .filter((e) => e.kind !== "newsletter_requested")
      .map((e) =>
        e.kind === "project"
          ? `PROJECT · ${e.name}\nService: ${e.service || "Not specified"}\nBudget: ${e.budget || "Not specified"}\nTime: ${e.occurred_at}\nReference: ${e.reference}`
          : e.kind === "review"
            ? `REVIEW · ${e.name}\n${e.message}\nTime: ${e.occurred_at}\nModeration: ${e.moderation}\nReference: ${e.reference}`
            : e.kind === "subscribed" || e.kind === "unsubscribed"
              ? `${String(e.kind).toUpperCase()} · ${e.email}\nTime: ${e.occurred_at}`
              : `CONTACT · ${e.name}\nTime: ${e.occurred_at}\nReference: ${e.reference}`,
      )
      .join("\n\n");
    const automation = `Emails accepted by SMTP: ${health.accepted || 0}\nFailed attempts: ${health.failed_attempts || 0}\nPending jobs: ${health.pending || 0}\nUnresolved jobs: ${health.unresolved || 0}\nLast successful report: ${health.last_report || "This is the first report"}`;
    text = `${subject}\n\nActivity since: ${job.from || "Automation was enabled"}\nSnapshot: ${job.as_of}\n\nEXECUTIVE SUMMARY\n${summary}\n\nACTIVITY\n${details || "No new business activity in this interval."}\n\nENGAGEMENT\nProduct likes: tracking is not configured.\nVisitor analytics: not connected to this report.\n\nAUTOMATION HEALTH\n${automation}\n\nSMTP acceptance is not guaranteed inbox delivery.${job.more_pending ? " A bounded reporting batch was used; remaining activity will follow in the next successful report." : ""}`;
    body =
      paragraph(
        `Activity since: ${job.from || "Automation was enabled"}\nSnapshot: ${job.as_of}`,
      ) +
      '<h2 style="font-size:18px">Executive summary</h2>' +
      paragraph(summary) +
      '<h2 style="font-size:18px">Business activity</h2>' +
      paragraph(details || "No new business activity in this interval.") +
      '<h2 style="font-size:18px">Engagement</h2>' +
      paragraph(
        "Product likes: tracking is not configured. Visitor analytics: not connected to this report.",
      ) +
      '<h2 style="font-size:18px">Automation health</h2>' +
      paragraph(automation) +
      paragraph("SMTP acceptance is not guaranteed inbox delivery.") +
      (job.more_pending
        ? paragraph(
            "Remaining activity will follow in the next successful report.",
          )
        : "");
  }
  return {
    to: recipient,
    replyTo: job.template === "admin" ? job.email : CONTACT_EMAIL,
    subject: clean(subject),
    text,
    html: shell(subject, body, site),
  };
}

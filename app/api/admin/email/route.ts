import { z } from "zod";
import {
  failure,
  HttpError,
  privateJson,
  readBody,
  requireAdmin,
  verifyOrigin,
} from "@/lib/kitty-server";
import {
  automationRpc,
  drainEmailQueue,
  emailConfiguration,
  sendTestEmail,
  runDailyAutomation,
} from "@/lib/email-notifications";
export const runtime = "nodejs";
export const maxDuration = 300;
const command = z
  .object({
    action: z.enum([
      "test",
      "retry",
      "report",
      "cleanup-preview",
      "retry-uncertain",
    ]),
    confirmDuplicates: z.boolean().optional(),
  })
  .strict();
export async function GET() {
  try {
    const { db } = await requireAdmin();
    const { data, error } = await db.rpc("kitty_website_email_status", {
      p_retry: false,
    });
    if (error) throw error;
    const config = emailConfiguration();
    return privateJson({
      configured: config.configured,
      recipient: config.recipient,
      cronConfigured:
        !!process.env.CRON_SECRET &&
        process.env.CRON_SECRET.trim().length >= 32,
      timezone: process.env.REPORT_TIMEZONE || "Asia/Kolkata",
      retentionHours: Math.min(
        Math.max(Number(process.env.TEMP_DATA_RETENTION_HOURS) || 72, 72),
        2160,
      ),
      queue: data,
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const value = command.parse(await readBody(request));
    if (value.action === "cleanup-preview")
      return privateJson(
        await automationRpc("cleanup", {
          dry_run: true,
          retention_hours: Number(process.env.TEMP_DATA_RETENTION_HOURS) || 72,
        }),
      );
    if (!emailConfiguration().configured)
      throw new HttpError(
        "Add the Gmail app password to the private server settings first.",
        503,
      );
    if (value.action === "test") {
      try {
        await sendTestEmail();
      } catch {
        throw new HttpError(
          "Gmail did not accept the test email. Check the private app password and account settings.",
          502,
        );
      }
      return privateJson({ ok: true });
    }
    if (value.action === "report")
      return privateJson(await runDailyAutomation());
    if (value.action === "retry-uncertain") {
      if (value.confirmDuplicates !== true)
        throw new HttpError(
          "Check Sent mail first and confirm that a resend may duplicate a message.",
          400,
        );
      const { error } = await db.rpc("kitty_website_retry_uncertain_email", {
        p_confirm_duplicates: true,
      });
      if (error) throw error;
    } else {
      const { error } = await db.rpc("kitty_website_email_status", {
        p_retry: true,
      });
      if (error) throw error;
    }
    return privateJson(await drainEmailQueue(10, {}, 100000));
  } catch (error) {
    return failure(error);
  }
}

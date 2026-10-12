import { z } from "zod";
import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { drainEmailQueue, emailConfiguration, sendTestEmail } from "@/lib/email-notifications";
export const runtime = "nodejs";
export const maxDuration = 60;
const command = z.object({ action: z.enum(["test", "retry"]) }).strict();

export async function GET() {
  try {
    const { db } = await requireAdmin();
    const { data, error } = await db.rpc("kitty_website_email_status", { p_retry: false });
    if (error) throw error;
    const config = emailConfiguration();
    return privateJson({ configured: config.configured, recipient: config.recipient, queue: data });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const { action } = command.parse(await readBody(request));
    if (!emailConfiguration().configured) throw new HttpError("Add the Gmail app password to the private server settings first.", 503);
    if (action === "test") {
      try { await sendTestEmail(); }
      catch { throw new HttpError("Gmail did not accept the test email. Check the app password and account settings.", 502); }
      return privateJson({ ok: true });
    }
    const { error } = await db.rpc("kitty_website_email_status", { p_retry: true });
    if (error) throw error;
    return privateJson(await drainEmailQueue());
  } catch (error) { return failure(error); }
}

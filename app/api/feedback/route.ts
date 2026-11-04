import {
  database,
  enforceRateLimit,
  failure,
  fingerprint,
  HttpError,
  privateJson,
  readBody,
  setting,
  verifyOrigin,
} from "@/lib/kitty-server";
import { feedbackSchema } from "@/lib/kitty-validation";
import { verifyTurnstile } from "@/lib/turnstile-server";

import { drainEmailQueue } from "@/lib/email-notifications";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const fp = await fingerprint(request);
    enforceRateLimit(fp);
    const body = await readBody(request);
    const value = feedbackSchema.parse(body);
    if (value.website) return privateJson({ ok: true });
    const elapsed = Date.now() - value.startedAt;
    if (elapsed < 2000 || elapsed > 86400000)
      throw new HttpError(
        "Please take a moment, then send your message again.",
        400,
      );
    await verifyTurnstile(
      request,
      (body as Record<string, unknown>).turnstileToken,
      "contact",
    );
    const { data, error } = await database().rpc(
      "kitty_website_submit_communication",
      {
        p_kind: value.kind,
        p_subject: value.subject,
        p_name: value.name,
        p_email: value.email,
        p_message: value.message,
        p_fingerprint: fp,
        p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
      },
    );
    if (error) {
      if (error.message.includes("Rate limit"))
        throw new HttpError(
          "You’ve sent a few messages. Please try again in an hour.",
          429,
        );
      throw error;
    }
    if (
      (value.subject && /appointment/i.test(value.subject)) ||
      (value.message && /^APPOINTMENT REQUEST/i.test(value.message))
    ) {
      try {
        const ref = data ? `A-${data.slice(0, 8).toUpperCase()}` : "A-NEW";
        const dayMatch = value.message.match(/Preferred Date:\s*([^\r\n]+)/);
        const timeZoneMatch = value.message.match(/Preferred Time:\s*([^\s\r\n]+)\s*\(([^)]+)\)/);
        const topicMatch = value.message.match(/Topic:\s*([^\r\n]+)/);
        const day = dayMatch ? dayMatch[1].trim() : "";
        const time = timeZoneMatch ? timeZoneMatch[1].trim() : "";
        const zone = timeZoneMatch ? timeZoneMatch[2].trim() : "Asia/Kolkata";
        const topic = topicMatch ? topicMatch[1].trim() : value.subject || "Consultation";

        if (day && time) {
          const { stageAppointmentCalendarEvent } = await import("@/lib/calendar-server");
          await stageAppointmentCalendarEvent({
            name: value.name,
            email: value.email,
            day,
            time,
            zone,
            topic,
            reference: ref,
          });
        }
      } catch (err) {
        console.error(
          "[Kitty Corp] Calendar staging non-fatal notice:",
          err instanceof Error ? err.message : "Unknown",
        );
      }
    }
    await drainEmailQueue(2, { feedback_id: data });
    return privateJson({ ok: true, id: data });
  } catch (error) {
    return failure(error);
  }
}

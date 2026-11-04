import { z } from "zod";
import {
  database,
  enforceRateLimit,
  failure,
  fingerprint,
  privateJson,
  readBody,
  setting,
  verifyOrigin,
} from "@/lib/kitty-server";
import { recordAuditEvent } from "@/lib/audit-logger";
import type { MaintenanceReply } from "@/lib/maintenance";

const control = z
  .object({
    code: z.string().min(1, "Enter the access code.").max(72),
    enabled: z.boolean().optional(),
    revision: z.number().int().nonnegative().optional(),
  })
  .refine(
    (value) => value.enabled === undefined || value.revision !== undefined,
    "Refresh the site status first.",
  );

export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const fp = await fingerprint(request);
    enforceRateLimit(`emergency:${fp}`, 5, 60_000);

    const value = control.parse(await readBody(request));
    const { data, error } = await database().rpc("kitty_website_emergency_control", {
      p_code: value.code,
      p_enabled: value.enabled ?? null,
      p_revision: value.revision ?? null,
      p_fingerprint: fp,
      p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
    });

    if (error) {
      recordAuditEvent({
        action: "emergency.state_changed",
        severity: "error",
        status: "failed",
        ipFingerprint: fp,
        details: { message: error.message },
      });
      throw error;
    }

    const reply = data as MaintenanceReply;
    if (reply.error) {
      recordAuditEvent({
        action: value.enabled !== undefined ? "emergency.state_changed" : "emergency.status_checked",
        severity: "warn",
        status: "denied",
        ipFingerprint: fp,
        details: { error: reply.error },
      });
      return Response.json(reply, {
        status: reply.status || 400,
        headers: { "Cache-Control": "no-store" },
      });
    }

    if (value.enabled !== undefined) {
      recordAuditEvent({
        action: "emergency.state_changed",
        severity: "critical",
        status: "success",
        ipFingerprint: fp,
        details: { enabled: value.enabled, revision: value.revision },
        recordInDb: true,
      });
    } else {
      recordAuditEvent({
        action: "emergency.status_checked",
        severity: "info",
        status: "success",
        ipFingerprint: fp,
      });
    }

    return privateJson(reply);
  } catch (error) {
    return failure(error);
  }
}

import { z } from "zod";
import { database, failure, fingerprint, privateJson, readBody, setting, verifyOrigin } from "@/lib/kitty-server";
import type { MaintenanceReply } from "@/lib/maintenance";
const control = z.object({
  code: z.string().min(1, "Enter the access code.").max(72),
  enabled: z.boolean().optional(),
  revision: z.number().int().nonnegative().optional(),
}).refine(value => value.enabled === undefined || value.revision !== undefined, "Refresh the site status first.");
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = control.parse(await readBody(request));
    const { data, error } = await database().rpc("kitty_website_emergency_control", {
      p_code: value.code, p_enabled: value.enabled ?? null,
      p_revision: value.revision ?? null,
      p_fingerprint: await fingerprint(request),
      p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
    });
    if (error) throw error;
    const reply = data as MaintenanceReply;
    if (reply.error) return Response.json(reply, {
      status: reply.status || 400, headers: { "Cache-Control": "no-store" },
    });
    return privateJson(reply);
  } catch (error) { return failure(error); }
}

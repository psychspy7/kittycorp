import { z } from "zod";
import { failure, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { maintenanceState } from "@/lib/maintenance-state";
import type { MaintenanceReply } from "@/lib/maintenance";
const change = z.object({ enabled: z.boolean(), revision: z.number().int().nonnegative() });
export async function GET() {
  try {
    await requireAdmin();
    return privateJson({ state: await maintenanceState() });
  } catch (error) { return failure(error); }
}
export async function PATCH(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const value = change.parse(await readBody(request));
    const { data, error } = await db.rpc("kitty_website_admin_maintenance", {
      p_enabled: value.enabled, p_revision: value.revision,
    });
    if (error) throw error;
    const reply = data as MaintenanceReply;
    if (reply.error) return Response.json(reply, {
      status: reply.status || 400, headers: { "Cache-Control": "no-store" },
    });
    return privateJson(reply);
  } catch (error) { return failure(error); }
}

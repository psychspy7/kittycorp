import { z } from "zod";
import {
  database,
  enforceRateLimit,
  failure,
  fingerprint,
  HttpError,
  readBody,
  setting,
  verifyOrigin,
} from "@/lib/kitty-server";
import { analyticsPublicPath } from "@/lib/site-analytics";

export const runtime = "nodejs";

const pageViewSchema = z.object({
  eventId: z.string().uuid(),
  path: z.string().trim().min(1).max(300).refine(
    (value) => value.startsWith("/") && !value.includes("?") && !value.includes("#"),
    "Invalid page path.",
  ),
}).strict();

const automatedClient = /bot|crawler|spider|slurp|headless|preview|monitor|uptime|curl|wget|python-requests|node-fetch|axios/i;

function getBaselineActiveFloor(): number {
  const hour = new Date().getUTCHours();
  return Math.round(9 + 3 * Math.sin(((hour - 4) / 24) * 2 * Math.PI));
}

export async function POST(request: Request) {
  try {
    verifyOrigin(request);

    const userAgent = request.headers.get("user-agent") || "";
    if (!userAgent || automatedClient.test(userAgent)) {
      throw new HttpError("Automated requests are not counted.", 400);
    }

    const value = pageViewSchema.parse(await readBody(request));
    if (!analyticsPublicPath(value.path)) {
      throw new HttpError("This page is not counted as a public view.", 400);
    }

    const visitorFingerprint = await fingerprint(request);

    enforceRateLimit(visitorFingerprint, 30, 60_000);

    const { data, error } = await database().rpc(
      "kitty_website_record_telemetry",
      {
        p_session_id: value.eventId,
        p_fingerprint: visitorFingerprint,
        p_path: value.path,
        p_heartbeat: false,
        p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
      },
    );

    if (error) throw error;

    const rawActive = Number((data as { active?: number })?.active ?? 0);
    const rawTotal = Number((data as { total?: number })?.total ?? 10000);

    const active = Math.max(rawActive, getBaselineActiveFloor());
    const total = Math.max(rawTotal, 10000);

    return Response.json(
      {
        count: total,
        total,
        active,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}

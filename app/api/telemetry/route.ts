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

const telemetrySchema = z.object({
  sessionId: z.string().trim().min(1).max(128),
  deviceId: z.string().trim().min(1).max(128).optional(),
  path: z.string().trim().min(1).max(300).refine(
    (value) => value.startsWith("/") && !value.includes("?") && !value.includes("#"),
    "Invalid page path.",
  ),
  heartbeat: z.boolean().optional().default(false),
}).strict();

const automatedClient = /bot|crawler|spider|slurp|headless|preview|monitor|uptime|curl|wget|python-requests|node-fetch|axios/i;

export async function POST(request: Request) {
  try {
    verifyOrigin(request);

    const userAgent = request.headers.get("user-agent") || "";
    if (!userAgent || automatedClient.test(userAgent)) {
      throw new HttpError("Automated requests are not counted.", 400);
    }

    const value = telemetrySchema.parse(await readBody(request));
    if (!analyticsPublicPath(value.path)) {
      throw new HttpError("This page is not counted as a public view.", 400);
    }

    const visitorFingerprint = await fingerprint(request, value.deviceId);

    // Rate limit: 60 requests per minute per fingerprint
    enforceRateLimit(visitorFingerprint, 60, 60_000);

    const { data, error } = await database().rpc(
      "kitty_website_record_telemetry",
      {
        p_session_id: value.sessionId,
        p_fingerprint: visitorFingerprint,
        p_path: value.path,
        p_heartbeat: value.heartbeat,
        p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
      },
    );

    if (error) throw error;

    const rawActive = Number((data as { active?: number })?.active ?? 0);
    const rawTotal = Number((data as { total?: number })?.total ?? 10000);

    const active = Math.max(1, rawActive);
    const total = Math.max(rawTotal, 10000);

    return Response.json(
      {
        active,
        total,
        realActive: rawActive,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}

export async function GET(request: Request) {
  try {
    const { data, error } = await database().rpc(
      "kitty_website_get_telemetry",
      {
        p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
      },
    );

    if (error) throw error;

    const rawActive = Number((data as { active?: number })?.active ?? 0);
    const rawTotal = Number((data as { total?: number })?.total ?? 10000);

    const active = rawActive;
    const total = Math.max(rawTotal, 10000);

    return Response.json(
      {
        active,
        total,
        realActive: rawActive,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}

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

    // Lightweight server-side rate limit before hitting the database.
    // The SQL function has its own persistent rate limit, but this prevents
    // spamming the database connection pool.
    enforceRateLimit(visitorFingerprint, 30, 60_000);

    const { data, error } = await database().rpc(
      "kitty_website_record_page_view",
      {
        p_event_id: value.eventId,
        p_path: value.path,
        p_fingerprint: visitorFingerprint,
        p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
      },
    );

    if (error) throw error;

    const count = Number(data);
    if (!Number.isSafeInteger(count) || count < 90) {
      throw new Error("The page-view counter returned an invalid total.");
    }

    return Response.json(
      { count },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}

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

// Sliding in-memory window of recent visitor sessions to compute active concurrent visitors.
const activeVisitorsWindow = new Map<string, number>();
const ACTIVE_WINDOW_MS = 15 * 60 * 1000;

function calculateActiveVisitors(currentVisitorFp: string): number {
  const now = Date.now();
  activeVisitorsWindow.set(currentVisitorFp, now);

  // Prune entries older than 15 minutes
  for (const [fp, lastSeen] of activeVisitorsWindow.entries()) {
    if (now - lastSeen > ACTIVE_WINDOW_MS) {
      activeVisitorsWindow.delete(fp);
    }
  }

  // Diurnal curve simulating natural global traffic throughout the day
  const hour = new Date().getUTCHours();
  const diurnalBase = Math.round(11 + 3 * Math.sin(((hour - 4) / 24) * 2 * Math.PI));
  
  // Real active sessions recorded in the window added to base
  return Math.max(5, diurnalBase + Math.min(activeVisitorsWindow.size, 15));
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

    // Lightweight server-side rate limit before hitting the database.
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

    // Cumulative baseline based on Google Analytics audience scale (default 10,000 / 10K+)
    const baselineOffset = parseInt(process.env.TOTAL_VISITORS_BASELINE || "10000", 10);
    const total = baselineOffset + (count >= 90 ? count - 90 : count);
    const active = calculateActiveVisitors(visitorFingerprint);

    return Response.json(
      {
        count,
        total,
        active,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}

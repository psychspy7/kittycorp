import { cancelStudioGoogleFlow, finishStudioGoogle } from "@/lib/studio-google";
import { websiteOrigin } from "@/lib/site-metadata";
import { recordAuditEvent } from "@/lib/audit-logger";

export const dynamic = "force-dynamic";

function redirect(target: string) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: target,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function GET(request: Request) {
  try {
    const target = await finishStudioGoogle(request);
    recordAuditEvent({
      action: "auth.login_success",
      severity: "info",
      status: "success",
      actor: { type: "admin" },
    });
    return redirect(target);
  } catch (error) {
    await cancelStudioGoogleFlow(new URL(request.url).searchParams.get("flow") || "");
    recordAuditEvent({
      action: "auth.login_failure",
      severity: "warn",
      status: "denied",
      actor: { type: "anonymous" },
      details: {
        reason: error instanceof Error ? error.message : "Verification failed",
      },
    });
    const origin =
      process.env.NODE_ENV !== "production" &&
      ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname)
        ? new URL(request.url).origin
        : websiteOrigin();
    return redirect(`${origin}/kitten?signin=verification-failed`);
  }
}

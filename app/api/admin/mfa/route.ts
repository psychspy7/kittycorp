import { z } from "zod";
import {
  enforceRateLimit,
  failure,
  fingerprint,
  HttpError,
  privateJson,
  readBody,
  requireAdmin,
  verifyOrigin,
} from "@/lib/kitty-server";
import {
  enrollStudioMfa,
  getStudioMfaStatus,
  unenrollStudioMfa,
  verifyStudioMfa,
} from "@/lib/studio-mfa";

export const dynamic = "force-dynamic";

const mfaActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("enroll"),
    friendlyName: z.string().trim().min(1).max(64).optional(),
  }),
  z.object({
    action: z.literal("verify"),
    factorId: z.string().trim().min(1).max(128),
    code: z.string().trim().regex(/^\d{6}$/, "Code must be 6 digits"),
  }),
  z.object({
    action: z.literal("unenroll"),
    factorId: z.string().trim().min(1).max(128),
  }),
]);

export async function GET(request: Request) {
  try {
    const session = await requireAdmin();
    const fp = await fingerprint(request);
    enforceRateLimit(`admin-mfa:${fp}`, 15, 60_000);

    const status = await getStudioMfaStatus(session.token);
    return privateJson(status);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const session = await requireAdmin();
    const fp = await fingerprint(request);
    enforceRateLimit(`admin-mfa-mutate:${fp}`, 5, 60_000);

    const body = mfaActionSchema.parse(await readBody(request));

    if (body.action === "enroll") {
      const result = await enrollStudioMfa(session.token, body.friendlyName);
      return privateJson(result);
    }

    if (body.action === "verify") {
      const result = await verifyStudioMfa(session.token, body.factorId, body.code);
      return privateJson(result);
    }

    if (body.action === "unenroll") {
      const result = await unenrollStudioMfa(session.token, body.factorId);
      return privateJson(result);
    }

    throw new HttpError("Unsupported action.", 400);
  } catch (error) {
    return failure(error);
  }
}

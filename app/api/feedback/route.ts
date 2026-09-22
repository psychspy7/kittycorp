import {
  database,
  failure,
  fingerprint,
  HttpError,
  privateJson,
  readBody,
  setting,
  verifyOrigin,
} from "@/lib/kitty-server";
import { feedbackSchema } from "@/lib/kitty-validation";
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = feedbackSchema.parse(await readBody(request));
    if (value.website) return privateJson({ ok: true });
    const elapsed = Date.now() - value.startedAt;
    if (elapsed < 2000 || elapsed > 86400000)
      throw new HttpError(
        "Please take a moment, then send your message again.",
        400,
      );
    const { data, error } = await database().rpc(
      "kitty_website_submit_feedback",
      {
        p_name: value.name,
        p_email: value.email,
        p_message: value.message,
        p_fingerprint: await fingerprint(request),
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
    return privateJson({ ok: true, id: data });
  } catch (error) {
    return failure(error);
  }
}

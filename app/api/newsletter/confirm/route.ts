import { z } from "zod";
import {
  database,
  setting,
  verifyOrigin,
  readBody,
  privateJson,
  failure,
  HttpError,
} from "@/lib/kitty-server";
import { verifyNewsletterToken } from "@/lib/newsletter-tokens";
import { drainEmailQueue } from "@/lib/email-notifications";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { token } = z
      .object({ token: z.string().min(1).max(300) })
      .strict()
      .parse(await readBody(request));
    const value = verifyNewsletterToken("confirm", token);
    const { data, error } = await database().rpc(
      "kitty_website_newsletter_action",
      {
        p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
        p_action: "confirm",
        p_value: value,
      },
    );
    if (error)
      throw new HttpError(
        "This link is invalid or expired. Please request a new confirmation from the website.",
        400,
      );
    await drainEmailQueue(1, { signup_id: data.id || value.id });
    return privateJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

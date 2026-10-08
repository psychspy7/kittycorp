import { z } from "zod";
import { getAssistantSettings } from "@/lib/assistant-settings-server";
import { database, failure, fingerprint, HttpError, privateJson, readBody, setting, verifyOrigin } from "@/lib/kitty-server";
import { verifyTurnstile } from "@/lib/turnstile-server";
import { websiteAssistantContext, websiteAssistantSources } from "@/lib/website-assistant-context";
import { getRuntimeConfiguration } from "@/lib/runtime-configuration";

const requestSchema = z.object({
  question: z.string().trim().min(1).max(800, "Keep your question to 800 characters or fewer."),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1000) }).strict()).max(6),
  page: z.string().regex(/^\/(?!\/)[a-z0-9/_-]*$/i).max(120),
  turnstileToken: z.string().max(2048).default(""),
}).strict();

export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = requestSchema.parse(await readBody(request));
    const settings = await getAssistantSettings();
    if (!settings.enabled) throw new HttpError("KITTY AI is taking a break. Please contact the team for help.", 503);
    const runtime = await getRuntimeConfiguration();
    const gatewayToken = runtime.KITTY_AI_GATEWAY_TOKEN || "";
    if (gatewayToken.length < 32) throw new HttpError("KITTY AI is not configured yet.", 503);
    let endpoint: URL;
    try { endpoint = new URL(runtime.KITTY_AI_WEBSITE_URL || ""); } catch { throw new HttpError("KITTY AI is not configured yet.", 503); }
    if (endpoint.protocol !== "https:" || endpoint.hostname !== "kitty-ai-v2.kitty-ai.workers.dev" || endpoint.pathname !== "/api/website/chat" || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new HttpError("KITTY AI is not configured yet.", 503);
    await verifyTurnstile(request, value.turnstileToken, "assistant");
    const visitor = await fingerprint(request);
    const { data: reserved, error } = await database().rpc("kitty_website_reserve_assistant", { p_fingerprint: visitor, p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN") });
    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) throw new HttpError("You’ve asked a few questions. Please try again later or contact the team.", 429);
      throw new HttpError("KITTY could not reply just now. Please try again later.", 503);
    }
    if (reserved !== true) throw new HttpError("KITTY’s question limit has been reached. Please try again later or contact the team.", 429);
    const context = await websiteAssistantContext();
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        cache: "no-store",
        redirect: "error",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${gatewayToken}` },
        body: JSON.stringify({ question: value.question, history: value.history.map(message => ({ role: message.role, content: utf8Limit(message.content, 1000) })), page: value.page, context, guidance: utf8Limit(settings.guidance, 6000), fingerprint: visitor, maxOutputTokens: settings.max_output_tokens, temperature: settings.temperature }),
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(25000)]),
      });
    } catch { throw new HttpError("KITTY could not connect just now. Please try again later.", 503); }
    if (!response.ok) {
      await response.body?.cancel();
      throw new HttpError(response.status === 429 ? "KITTY’s daily question limit has been reached. Please contact the team or try again tomorrow." : "KITTY is unavailable just now. Please try again later.", response.status === 429 ? 429 : 503);
    }
    const result = await boundedJson(response);
    const parsedReply = z.object({ answer: z.string().trim().min(1).max(4000) }).safeParse(result);
    if (!parsedReply.success) throw new HttpError("KITTY returned an invalid reply. Please try again.", 502);
    const answer = parsedReply.data.answer;
    return privateJson({ answer, sources: websiteAssistantSources(value.question) });
  } catch (error) { return failure(error); }
}

function utf8Limit(text: string, bytes: number) {
  const encoder = new TextEncoder();
  let result = "", length = 0;
  for (const character of text) {
    const size = encoder.encode(character).byteLength;
    if (length + size > bytes) break;
    result += character;
    length += size;
  }
  return result;
}

async function boundedJson(response: Response): Promise<unknown> {
  if (!response.body) throw new HttpError("KITTY returned an empty reply.", 502);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "", bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 24000) throw new HttpError("KITTY returned an invalid reply.", 502);
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    try { return JSON.parse(text); } catch { throw new HttpError("KITTY returned an invalid reply.", 502); }
  } finally { await reader.cancel().catch(() => {}); }
}

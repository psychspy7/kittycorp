import "server-only";
import { cache } from "react";
import { database, setting } from "./kitty-server";
import { assistantSettingsSchema, defaultAssistantSettings, type AssistantSettings } from "./assistant-settings";
import { getRuntimeConfiguration } from "./runtime-configuration";
export const getAssistantSettings = cache(async (): Promise<AssistantSettings> => {
  try {
    const {data,error} = await database().rpc("kitty_website_assistant_settings", {p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN")});
    if (error) throw error;
    const fields = Object.fromEntries(Object.keys(defaultAssistantSettings).map(key => [key, data?.[key]]));
    return assistantSettingsSchema.parse(fields);
  } catch {
    return {...defaultAssistantSettings, enabled: false};
  }
});
export async function assistantConnectionConfigured() {
  try {
    const configuration = await getRuntimeConfiguration();
    const url = new URL(configuration.KITTY_AI_WEBSITE_URL || "");
    return url.href === "https://kitty-ai-v2.kitty-ai.workers.dev/api/website/chat" && (configuration.KITTY_AI_GATEWAY_TOKEN?.length || 0) >= 32;
  } catch { return false; }
}

import "server-only";
import { getAssistantSettings, assistantConnectionConfigured } from "./assistant-settings-server";
import { publicAssistantSettings } from "./assistant-settings";
import { turnstilePublicConfig } from "./turnstile-server";
import { PUBLIC_CONTENT_TAGS, publicContentCache } from "./public-content-cache";

// Cache only the browser-safe presentation, never credentials, owner guidance,
// authorization, bot verification or the settings used by actual chat requests.
export const publicAssistantPresentation = publicContentCache("assistant-presentation", PUBLIC_CONTENT_TAGS.assistant, async () => {
  const [settings, verification, connected] = await Promise.all([
    getAssistantSettings(), turnstilePublicConfig(), assistantConnectionConfigured(),
  ]);
  return {
    settings: publicAssistantSettings({...settings, enabled:settings.enabled && connected && verification.enabled && Boolean(verification.siteKey)}),
    siteKey: verification.siteKey,
  };
});

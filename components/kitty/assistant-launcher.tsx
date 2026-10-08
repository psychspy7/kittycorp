"use client";
import dynamic from "next/dynamic";
import type { WebsiteAssistantPublicSettings } from "@/lib/website-assistant-types";
const WebsiteAssistant = dynamic(() => import("./website-assistant").then(module => module.WebsiteAssistant));
export function AssistantLauncher({settings,siteKey}: {settings:WebsiteAssistantPublicSettings;siteKey:string}) {
  return settings.enabled ? <WebsiteAssistant settings={settings} turnstileSiteKey={siteKey}/> : null;
}

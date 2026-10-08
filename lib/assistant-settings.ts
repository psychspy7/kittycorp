import { z } from "zod";

export const assistantSettingsSchema = z.object({
  enabled: z.boolean(), title: z.string().trim().min(2).max(40),
  greeting: z.string().trim().min(10).max(400), guidance: z.string().trim().max(2500),
  max_messages: z.number().int().min(3).max(20),
  max_output_tokens: z.number().int().min(128).max(600),
  temperature: z.number().min(.1).max(.8),
}).strict();
export type AssistantSettings = z.infer<typeof assistantSettingsSchema>;
export const defaultAssistantSettings: AssistantSettings = {
  enabled: false, title: "KITTY AI",
  greeting: "Hi, I’m KITTY. Ask me about our work, our products or what you’d like us to build.",
  guidance: "Be clear, warm and concise. Explain KITTY CORP using its published website information. Help people find the right page or start a project. Never invent customers, results, prices, qualifications or partnerships. Six months of maintenance applies to agreed maintenance after launch; new features and third-party costs are separate. Don’t ask visitors for private information.",
  max_messages: 8, max_output_tokens: 384, temperature: .4,
};
export function publicAssistantSettings(settings: AssistantSettings) {
  return { enabled: settings.enabled, title: settings.title, greeting: settings.greeting, max_messages: settings.max_messages };
}

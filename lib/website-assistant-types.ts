export type WebsiteAssistantSettings = {
  enabled: boolean;
  title: string;
  greeting: string;
  guidance: string;
  max_messages: number;
  max_output_tokens: number;
  temperature: number;
};

export type WebsiteAssistantPublic = Pick<WebsiteAssistantSettings, "enabled" | "title" | "greeting" | "max_messages">;
export type WebsiteAssistantPublicSettings = WebsiteAssistantPublic;
export type WebsiteAssistantMessage = { role: "user" | "assistant"; content: string };
export type WebsiteAssistantSource = { label: string; href: string };
export type WebsiteAssistantReply = { answer: string; sources: WebsiteAssistantSource[] };

export const defaultWebsiteAssistantSettings: WebsiteAssistantSettings = {
  enabled: false,
  title: "Ask KITTY AI",
  greeting: "Hi, I’m KITTY. I can help you explore our products, understand what we build, or find the right place to start a project.",
  guidance: "Keep answers short, warm and practical. Help visitors find relevant KITTY CORP pages. Be clear about which products are released and which are experiments. Suggest the project enquiry form when a visitor wants a website or app.",
  max_messages: 12,
  max_output_tokens: 384,
  temperature: 0.35,
};

export const websiteAssistantSuggestions = [
  "Can you build a website for my business?",
  "What can I try today?",
  "What is KITTY AI?",
] as const;

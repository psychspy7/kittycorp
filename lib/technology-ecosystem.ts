export type TechnologyBrand = {
  id: string; name: string; href: string; src: string; width: number; height: number; wordmark?: boolean;
};

// Tools/platforms reported by the owner. Initiative references imply no affiliation.
export const technologyBrands: TechnologyBrand[] = [
  {id: "kitty", name: "KITTY CORP", href: "https://kittycorp.vercel.app/", src: "/brand/monogram-small-v1.webp", width: 128, height: 128},
  {id: "ibm", name: "IBM", href: "https://www.ibm.com/", src: "/ecosystem/ibm-v1.svg", width: 50, height: 21, wordmark: true},
  {id: "github", name: "GitHub", href: "https://github.com/", src: "/ecosystem/github-v1.svg", width: 98, height: 95},
  {id: "microsoft", name: "Microsoft", href: "https://www.microsoft.com/", src: "/ecosystem/microsoft-v1.svg", width: 256, height: 256},
  {id: "google", name: "Google", href: "https://www.google.com/", src: "/ecosystem/google-v1.svg", width: 268, height: 274},
  {id: "openai", name: "OpenAI", href: "https://openai.com/", src: "/ecosystem/openai-v1.svg", width: 611, height: 611},
  {id: "chatgpt", name: "ChatGPT", href: "https://chatgpt.com/", src: "/ecosystem/chatgpt-v1.svg", width: 611, height: 611},
  {id: "anthropic", name: "Anthropic", href: "https://www.anthropic.com/", src: "/ecosystem/anthropic-v1.svg", width: 92, height: 64},
  {id: "claude", name: "Claude", href: "https://claude.ai/", src: "/ecosystem/claude-v1.svg", width: 94, height: 94},
  {id: "cloudflare", name: "Cloudflare", href: "https://www.cloudflare.com/", src: "/ecosystem/cloudflare-v1.svg", width: 256, height: 116},
  {id: "linkedin", name: "LinkedIn", href: "https://www.linkedin.com/", src: "/ecosystem/linkedin-v1.svg", width: 256, height: 256},
  {id: "digital-india", name: "Digital India", href: "https://www.digitalindia.gov.in/", src: "/ecosystem/digital-india-v1.svg", width: 107, height: 41, wordmark: true},
  {id: "startup-india", name: "Startup India", href: "https://www.startupindia.gov.in/", src: "/ecosystem/startup-india-v1.svg", width: 222, height: 53, wordmark: true},
];

export const ecosystemCategories = [
  {name: "AI & Intelligence", ids: ["openai", "chatgpt", "anthropic", "claude", "ibm", "google"]},
  {name: "Development & Infrastructure", ids: ["github", "microsoft", "cloudflare", "google"]},
  {name: "Professional & Innovation Ecosystem", ids: ["linkedin", "digital-india", "startup-india"]},
];

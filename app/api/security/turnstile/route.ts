import { privateJson } from "@/lib/kitty-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
export const dynamic = "force-dynamic";
export async function GET() { return privateJson(await turnstilePublicConfig()); }

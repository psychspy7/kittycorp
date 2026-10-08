import { failure, privateJson } from "@/lib/kitty-server";
import { studioGoogleStatus } from "@/lib/studio-google";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const google = await studioGoogleStatus();
    return privateJson({ googleRequired: google.required, googleReady: google.providerReady, turnstile: await turnstilePublicConfig() });
  } catch (error) { return failure(error); }
}

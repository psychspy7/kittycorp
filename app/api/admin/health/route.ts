import { requireAdmin, privateJson, failure } from "@/lib/kitty-server";
import { websiteHealth } from "@/lib/website-health";
import { emailConfiguration } from "@/lib/email-notifications";
import { assistantConnectionConfigured } from "@/lib/assistant-settings-server";
import { paymentProviderReadiness } from "@/lib/commerce-server";
export async function GET() {
  try {
    await requireAdmin();
    const [health, assistantConfigured, payments] = await Promise.all([websiteHealth(), assistantConnectionConfigured(), paymentProviderReadiness()]);
    return privateJson({ health, assistantConfigured, emailConfigured: emailConfiguration().configured, payments });
  } catch (error) { return failure(error); }
}

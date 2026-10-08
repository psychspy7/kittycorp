import { revalidatePath } from "next/cache";
import { assistantSettingsSchema } from "@/lib/assistant-settings";
import { assistantConnectionConfigured } from "@/lib/assistant-settings-server";
import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { turnstilePublicConfig } from "@/lib/turnstile-server";
export async function GET() {
  try {
    const {db} = await requireAdmin();
    const {data,error} = await db.from("kitty_website_assistant").select("*").eq("id","assistant").single();
    if (error) throw error;
    const verification = await turnstilePublicConfig();
    return privateJson({settings:data, connectionConfigured:await assistantConnectionConfigured(), verificationConfigured:verification.enabled && Boolean(verification.siteKey)});
  } catch (error) { return failure(error); }
}
export async function PATCH(request: Request) {
  try {
    verifyOrigin(request); const {db} = await requireAdmin();
    const settings = assistantSettingsSchema.parse(await readBody(request));
    const verification = await turnstilePublicConfig();
    if (settings.enabled && (!await assistantConnectionConfigured() || !verification.enabled || !verification.siteKey))
      throw new HttpError("Complete the KITTY AI connection and security verification setup before enabling the assistant.",409);
    const {data,error} = await db.from("kitty_website_assistant").update({...settings, updated_at:new Date().toISOString()}).eq("id","assistant").select("*").single();
    if (error) throw error;
    revalidatePath("/", "layout"); return privateJson({settings:data});
  } catch (error) { return failure(error); }
}

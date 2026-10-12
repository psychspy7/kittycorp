import { z } from "zod";
import { database, failure, fingerprint, HttpError, privateJson, readBody, setting, verifyOrigin } from "@/lib/kitty-server";
import { verifyTurnstile } from "@/lib/turnstile-server";
import { after } from "next/server";
import { drainEmailQueue } from "@/lib/email-notifications";
export const runtime = "nodejs";
export const maxDuration = 60;
const signup = z.object({ email:z.string().trim().email("Enter a valid email address.").max(254), interests:z.array(z.enum(["KITTY AI","KITTY Sentinel","LISA AI","KITTY CORP updates"])).max(4), website:z.string().max(300).optional().default(""), startedAt:z.number().finite() });
export async function POST(request:Request) {
  try {
    verifyOrigin(request); const body=await readBody(request); const value=signup.parse(body);
    if(value.website) return privateJson({ok:true});
    const elapsed=Date.now()-value.startedAt;
    if(elapsed<2000 || elapsed>86400000) throw new HttpError("Please take a moment, then try again.",400);
    await verifyTurnstile(request,(body as Record<string,unknown>).turnstileToken,"early-access");
    const {error}=await database().rpc("kitty_website_join_early_access",{p_email:value.email,p_interests:value.interests.length?[...new Set(value.interests)]:["KITTY CORP updates"],p_fingerprint:await fingerprint(request),p_gateway_token:setting("FEEDBACK_GATEWAY_TOKEN")});
    if(error){if(error.message.includes("Rate limit"))throw new HttpError("Please try again in an hour.",429);throw error;}
    after(async () => { await drainEmailQueue(); });
    return privateJson({ok:true});
  }catch(e){return failure(e);}
}

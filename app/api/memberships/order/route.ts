import {failure,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {createMembership} from "@/lib/membership-server";
import {verifyTurnstile} from "@/lib/turnstile-server";
export const runtime="nodejs";
export async function POST(request:Request) {
 try {verifyOrigin(request);const body=await readBody(request);
 const {turnstileToken,...input}=body;await verifyTurnstile(request,turnstileToken,"payment-order");return privateJson(await createMembership(request,input));
 }catch(error){return failure(error);}
}

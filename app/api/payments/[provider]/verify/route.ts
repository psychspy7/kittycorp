import { storedPayment } from "@/lib/payment-ledger";
import { cookies } from "next/headers";
import { z } from "zod";
import { failure,HttpError,privateJson,readBody,verifyOrigin } from "@/lib/kitty-server";
import { providerConfiguration } from "@/lib/commerce-server";
import { alternateCookie,readAlternative,verifyAlternative } from "@/lib/alternative-payments";
export const runtime="nodejs";
export async function POST(request:Request,{params}:{params:Promise<{provider:string}>}){try{verifyOrigin(request);const provider=z.enum(["paypal","cashfree"]).parse((await params).provider);const {order_id}=z.object({order_id:z.string().regex(/^[A-Za-z0-9_-]{3,100}$/)}).strict().parse(await readBody(request));const ledger=await storedPayment(provider,order_id);if(!ledger)throw new HttpError("This order could not be found. Contact KITTY CORP if you paid.",400);const config=await providerConfiguration(provider,ledger.environment);const ctx=readAlternative((await cookies()).get(alternateCookie(provider,order_id))?.value,config);if(!ctx||ctx.orderId!==order_id)throw new HttpError("This checkout session expired or could not be verified. If you completed payment, contact KITTY CORP; do not pay again.",400);return privateJson(await verifyAlternative(config,ctx,provider==="paypal"));}catch(error){return failure(error);}}

import {optionalCustomer} from "@/lib/customer-account-server";
import {recordPayment} from "@/lib/payment-ledger";
import { cookies } from "next/headers";
import { z } from "zod";
import { failure,privateJson,readBody,verifyOrigin } from "@/lib/kitty-server";
import { providerConfiguration } from "@/lib/commerce-server";
import { alternativeOrderSchema,alternateCookie,createAlternative,sealAlternative } from "@/lib/alternative-payments";
import { verifyTurnstile } from "@/lib/turnstile-server";
export const runtime="nodejs";
export async function POST(request:Request,{params}:{params:Promise<{provider:string}>}){try{verifyOrigin(request);const provider=z.enum(["paypal","cashfree"]).parse((await params).provider);const value=alternativeOrderSchema.parse(await readBody(request));const config=await providerConfiguration(provider);await verifyTurnstile(request,value.turnstileToken,"payment-order");const customer=await optionalCustomer(request);const {ctx,sessionId}=await createAlternative(config,value);if(customer)await recordPayment({provider,order_id:ctx.orderId,environment:ctx.testMode?"sandbox":"live",purpose:ctx.purpose,reference:ctx.reference,amount_minor:ctx.amount,currency:ctx.currency,status:"created",payment_id:null},customer);const jar=await cookies();const prior=jar.getAll().filter(c=>c.name.startsWith("kitty_pay_"));for(const entry of prior.slice(0,Math.max(0,prior.length-4)))jar.set(entry.name,"",{path:"/api/payments",httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",maxAge:0});jar.set(alternateCookie(provider,ctx.orderId),sealAlternative(ctx),{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",path:"/api/payments",maxAge:3600});return privateJson({order_id:ctx.orderId,amount:ctx.amount,currency:ctx.currency,payment_session_id:sessionId,testMode:config.testMode});}catch(error){return failure(error);}}

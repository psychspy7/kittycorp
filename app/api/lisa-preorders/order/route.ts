import {optionalCustomer,customerAction} from "@/lib/customer-account-server";
import type {LisaPreorder} from "@/lib/lisa-preorders";
import {randomUUID} from "node:crypto";
import {cookies} from "next/headers";
import {z} from "zod";
import {failure,HttpError,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {verifyTurnstile} from "@/lib/turnstile-server";
import {preorderTokenSchema} from "@/lib/lisa-preorders";
import {preorderAction} from "@/lib/lisa-preorders-server";
import {getCommerce} from "@/lib/commerce-server";
import {recordPayment} from "@/lib/payment-ledger";
import {resolvedRazorpayConfiguration,razorpayClient,orderIdSchema,orderCookieName,sealOrder,providerFailure,ORDER_LIFETIME_SECONDS} from "@/lib/razorpay-server";
export const runtime="nodejs";
export async function POST(request:Request){try{
 verifyOrigin(request);const value=z.object({token:preorderTokenSchema.optional(),id:z.string().uuid().optional(),amount:z.number().int().min(100).max(100000000),turnstileToken:z.string().max(2048).optional()}).strict().refine(v=>!!v.token!==!!v.id,"Choose one reservation access method.").parse(await readBody(request));
 const customer=await optionalCustomer(request);if(value.id&&!customer)throw new HttpError("Sign in to open this reservation.",401);
 const action=async(name:string,payload:Record<string,unknown>={})=>value.id&&customer?await customerAction(customer,"preorder",{id:value.id,action:name,...payload})as LisaPreorder:preorderAction(name,value.token!,payload);
 const [config,{settings}]=await Promise.all([resolvedRazorpayConfiguration(),getCommerce()]);if(config.testMode||!settings.plans.lisa.published)throw new HttpError("LISA preorders are not available right now.",503);
 await verifyTurnstile(request,value.turnstileToken,"payment-order");
 const reservation=randomUUID();const preorder=await action("reserve",{reservation,amount:value.amount});
 if(preorder.amount_minor!==value.amount||!preorder.reservation_id)throw new HttpError("Refresh this reservation before paying.",409);
 const receipt=`lisa_${preorder.reservation_id.replaceAll("-","")}`;const reference=`LISA-${preorder.id}`;let order;
 try{
  if(preorder.order_id)order=await razorpayClient(config).orders.fetch(preorder.order_id);
  else if(preorder.reservation_id!==reservation){const previous=await razorpayClient(config).orders.all({receipt,count:2});if(previous.items.length!==1)throw new HttpError("Your checkout is still being prepared. Refresh its status in a moment; do not start a new reservation.",409);order=previous.items[0];}
  else order=await razorpayClient(config).orders.create({amount:preorder.amount_minor,currency:"INR",receipt,partial_payment:false,notes:{purpose:"lisa_preorder",preorder_reference:reference,preorder_reservation:preorder.reservation_id}});
 }catch(error){if(error instanceof HttpError)throw error;const status=error&&typeof error==="object"&&"statusCode"in error?Number(error.statusCode):0;if(!preorder.order_id&&preorder.reservation_id===reservation&&status>=400&&status<500)await action("release",{reservation});providerFailure(error);}
 if(!orderIdSchema.safeParse(order.id).success||Number(order.amount)!==preorder.amount_minor||order.currency!=="INR"||order.receipt!==receipt||order.notes?.preorder_reference!==reference||order.notes?.preorder_reservation!==preorder.reservation_id||(preorder.order_id&&preorder.order_id!==order.id))throw new HttpError("The provider order did not match this reservation. Contact KITTY CORP before paying.",409);
 await recordPayment({provider:"razorpay",order_id:order.id,environment:"live",purpose:"lisa_preorder",reference,amount_minor:preorder.amount_minor,currency:"INR",status:"created",payment_id:null},customer);
 if(!preorder.order_id)await action("attach",{reservation:preorder.reservation_id,orderId:order.id});
 (await cookies()).set(orderCookieName(order.id),sealOrder({orderId:order.id,amount:preorder.amount_minor,currency:"INR",keyId:config.keyId,purpose:"lisa_preorder",reference,expires:Date.now()+ORDER_LIFETIME_SECONDS*1000},config.keySecret),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/api",maxAge:ORDER_LIFETIME_SECONDS});
 return privateJson({order_id:order.id,amount:preorder.amount_minor,currency:"INR"});
}catch(error){return failure(error);}}

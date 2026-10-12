import "server-only";
import {createHmac} from "node:crypto";
import {z} from "zod";
import {HttpError} from "./kitty-server";
import {razorpayClient,validPaymentSignature,constantTimeHexEqual,orderIdSchema,verifyPaymentSchema,providerFailure} from "./razorpay-server";
import {draftMemberships,type MembershipCatalog} from "./membership-types";
const uuid=z.string().uuid();
const providerSchema=z.object({keyId:z.string().regex(/^rzp_(test|live)_[A-Za-z0-9]+$/),keySecret:z.string().min(8),webhookSecret:z.string().min(16),previousWebhookSecret:z.string().optional(),testMode:z.boolean(),enabled:z.boolean()});
type Intent={id:string;uid:string;product:string;plan_id:string;provider_order_id?:string;provider_key_id:string;status:string;terms:{amount:number;months:number;chatLimit:number;speechLimit:number}};
function endpoint() {
 const value=process.env.KITTY_MEMBERSHIP_BACKEND?.trim(),token=process.env.KITTY_COMMERCE_GATEWAY_TOKEN?.trim();
 if(!value||!token||token.length<32)throw new HttpError("Membership checkout is being prepared. Please try later.",503);
 const url=new URL(value);
 if(url.origin!=="https://kitty-ai-v2.kitty-ai.workers.dev"&&!(process.env.MEMBERSHIP_LOCAL_PREVIEW==="1"&&url.hostname==="127.0.0.1"&&url.protocol==="http:"))throw new HttpError("Membership connection needs setup.",503);
 return {url:url.origin,token};
}
export async function commerce<T=Record<string,unknown>>(path:string,method="GET",payload?:unknown,userToken?:string):Promise<T> {
 const {url,token}=endpoint();
 const r=await fetch(url+"/api/"+path,{method,cache:"no-store",redirect:"error",signal:AbortSignal.timeout(15000),headers:{"Content-Type":"application/json","X-Kitty-Commerce-Token":token,...(userToken?{Authorization:"Bearer "+userToken}:{})},body:payload?JSON.stringify(payload):undefined});
 const text=await r.text();if(text.length>128000)throw new HttpError("Membership response was too large.",502);
 let data;try{data=JSON.parse(text);}catch{throw new HttpError("Membership service is temporarily unavailable.",502);}
 if(!r.ok)throw new HttpError(typeof data.error==="string"?data.error:"Membership request failed.",r.status);
 return data as T;
}
export async function membershipCatalog():Promise<MembershipCatalog> {
 if(!process.env.KITTY_MEMBERSHIP_BACKEND||!process.env.KITTY_COMMERCE_GATEWAY_TOKEN)return draftMemberships;
 try {return await commerce<MembershipCatalog>("memberships/catalog");}catch{return draftMemberships;}
}
export function customerToken(request:Request) {
 const token=request.headers.get("Authorization");
 if(!token?.startsWith("Bearer ")||token.length>12000)throw new HttpError("Sign in with the Google account you use in KITTY AI.",401);
 return token.slice(7);
}
async function provider() {
 const p=providerSchema.parse(await commerce("commerce/provider"));
 const config={keyId:p.keyId,keySecret:p.keySecret,amount:100,currency:"INR" as const,testMode:p.testMode};
 return {p,client:razorpayClient(config)};
}
export async function createMembership(request:Request,value:unknown) {
 const input=z.object({id:uuid,planId:z.string().regex(/^[a-zA-Z0-9-]{1,80}$/)}).strict().parse(value),token=customerToken(request);
 const intent=await commerce<Intent>("commerce/intents","POST",input,token);
 const {p,client}=await provider();
 if(!p.enabled)throw new HttpError("Membership checkout is paused.",503);
 if(intent.provider_key_id!==p.keyId)throw new HttpError("This checkout uses an older payment configuration. Please contact KITTY CORP.",409);
 let order;
 if(intent.provider_order_id)order={id:intent.provider_order_id,amount:intent.terms.amount,currency:"INR"};
 else {
  try {order=await client.orders.create({amount:intent.terms.amount,currency:"INR",receipt:"member_"+intent.id.replaceAll("-",""),partial_payment:false,notes:{purpose:"membership",product:intent.product,intent_id:intent.id}});}catch(error){providerFailure(error);}
  if(!orderIdSchema.safeParse(order.id).success||Number(order.amount)!==intent.terms.amount||order.currency!=="INR")throw new HttpError("The provider returned an invalid membership order.",502);
  await commerce("commerce/intents/"+intent.id,"PUT",{orderId:order.id,amount:Number(order.amount),currency:"INR"},token);
 }
 return {intentId:intent.id,keyId:p.keyId,orderId:order.id,amount:Number(order.amount),currency:"INR",testMode:p.testMode};
}
type Payment={id:string;order_id?:string;amount:number|string;currency:string;status:string;captured:boolean;amount_refunded?:number|string};
function paymentMatches(payment:Payment,orderId:string,amount:number) {
 if(payment.order_id!==orderId||Number(payment.amount)!==amount||payment.currency!=="INR"||!/^pay_[A-Za-z0-9]{6,64}$/.test(payment.id))throw new HttpError("Payment does not match this membership order.",409);
}
async function record(payment:Payment,eventId?:string) {
 return commerce("commerce/reconcile","POST",{orderId:payment.order_id,paymentId:payment.id,amount:Number(payment.amount),currency:payment.currency,captured:payment.captured===true,refunded:Number(payment.amount_refunded||0),status:payment.status,...(eventId?{eventId}:{})});
}
export async function verifyMembership(request:Request,value:unknown) {
 const input=verifyPaymentSchema.extend({intentId:uuid}).strict().parse(value),token=customerToken(request);
 const intent=await commerce<Intent>("commerce/intents/"+input.intentId,"GET",undefined,token);
 if(!intent.provider_order_id||intent.provider_order_id!==input.razorpay_order_id)throw new HttpError("This payment belongs to another checkout.",409);
 const {p,client}=await provider();
 if(p.keyId!==intent.provider_key_id||!validPaymentSignature(intent.provider_order_id,input.razorpay_payment_id,input.razorpay_signature,p.keySecret))throw new HttpError("Payment signature could not be verified.",400);
 let payment;try{payment=await client.payments.fetch(input.razorpay_payment_id);}catch(error){providerFailure(error);}
 paymentMatches(payment,intent.provider_order_id,intent.terms.amount);
 return record(payment);
}
export async function membershipPaymentStatus(request:Request,value:unknown) {
 const input=z.object({intentId:uuid}).strict().parse(value),token=customerToken(request);
 const intent=await commerce<Intent>("commerce/intents/"+input.intentId,"GET",undefined,token);
 if(!intent.provider_order_id)return {status:intent.status,paid:false,active:false};
 const {client}=await provider();
 let payments;try{payments=await client.orders.fetchPayments(intent.provider_order_id);}catch(error){providerFailure(error);}
 const payment=payments.items?.find(x=>x.status==="captured"||x.status==="refunded")||payments.items?.at(-1);
 if(!payment)return {status:intent.status,paid:false,active:false};
 paymentMatches(payment,intent.provider_order_id,intent.terms.amount);
 return record(payment);
}
export async function cancelMembership(request:Request,value:unknown) {
 const input=z.object({intentId:uuid}).strict().parse(value);
 return commerce("commerce/intents/"+input.intentId,"DELETE",undefined,customerToken(request));
}
export async function webhookMembership(raw:string,signature:string,eventId:string) {
 const {p,client}=await provider();
 const valid=[p.webhookSecret,p.previousWebhookSecret].filter(Boolean).some(secret=>constantTimeHexEqual(createHmac("sha256",secret!).update(raw).digest("hex"),signature));
 if(!valid)throw new HttpError("Webhook signature could not be verified.",400);
 const event=z.object({event:z.string(),payload:z.record(z.unknown())}).passthrough().parse(JSON.parse(raw));
 if(!["payment.captured","payment.authorized","payment.failed","order.paid","refund.processed","payment.refunded"].includes(event.event))return {received:true,ignored:true};
 const payload=event.payload as {payment?:{entity?:{id?:string}};refund?:{entity?:{payment_id?:string}}};
 const paymentId=payload.payment?.entity?.id||payload.refund?.entity?.payment_id;
 if(!paymentId||!/^pay_[A-Za-z0-9]{6,64}$/.test(paymentId))throw new HttpError("Missing webhook payment.",400);
 let payment;try{payment=await client.payments.fetch(paymentId);}catch(error){providerFailure(error);}
 if(!payment.order_id)return {received:true,ignored:true};
 let order:{terms:{amount:number}};
 try{order=await commerce("commerce/order","POST",{orderId:payment.order_id});}
 catch(error){if(error instanceof HttpError&&error.status===404)return {received:true,ignored:true};throw error;}
 paymentMatches(payment,payment.order_id,order.terms.amount);
 await record(payment,eventId||undefined);
 return {received:true};
}

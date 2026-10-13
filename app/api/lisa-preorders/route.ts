import {optionalCustomer} from "@/lib/customer-account-server";
import {randomBytes} from "node:crypto";
import {failure,fingerprint,HttpError,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {getCommerce,providerConfiguration} from "@/lib/commerce-server";
import {priceEstimate} from "@/lib/currency-server";
import {preorderRequestSchema,LISA_TERMS,LISA_TERMS_VERSION} from "@/lib/lisa-preorders";
import {preorderAction} from "@/lib/lisa-preorders-server";
import {verifyTurnstile} from "@/lib/turnstile-server";
export const runtime="nodejs";
export async function POST(request:Request){try{
 verifyOrigin(request);const value=preorderRequestSchema.parse(await readBody(request));
 const [{settings},provider]=await Promise.all([getCommerce(),providerConfiguration("razorpay")]);
 if(provider.testMode||!settings.plans.lisa.published||settings.plans.lisa.currency!=="USD"||settings.plans.lisa.period!=="version_lifetime"||settings.plans.lisa.priceMinor<100)throw new HttpError("LISA preorders are not available right now.",503);
 await verifyTurnstile(request,value.turnstileToken,"lisa-preorder");
 let estimate;try{estimate=await priceEstimate({amount:settings.plans.lisa.priceMinor,base:"USD",currency:"INR"});}catch{throw new HttpError("We couldn’t obtain a current checkout exchange rate. Please try again later.",503);}
 const amount=Math.round(estimate.amount*100);if(!Number.isSafeInteger(amount)||amount<100||amount>100000000||!estimate.date)throw new HttpError("Checkout pricing is temporarily unavailable.",503);
 const customer=await optionalCustomer(request);if(customer&&customer.email.toLowerCase()!==value.email.toLowerCase())throw new HttpError("Use your Google account email for tracking, or sign out to submit as a guest.",400);
 const token=randomBytes(32).toString("hex");const preorder=await preorderAction("submit",token,{name:value.name,email:value.email,amount_minor:amount,price_usd_minor:settings.plans.lisa.priceMinor,rate_date:estimate.date,terms_version:LISA_TERMS_VERSION,terms:LISA_TERMS,fingerprint:await fingerprint(request),...(customer?{customer_uid:customer.uid,customer_email:customer.email}:{})});
 return privateJson({token,preorder});
}catch(error){return failure(error);}}

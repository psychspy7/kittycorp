import "server-only";
import { cache } from "react";
import { commerceSchema,defaultCommerce,type PaymentProvider,type PublicProvider,type ProviderReadiness } from "./commerce";
import { getRuntimeConfiguration } from "./runtime-configuration";
import { HttpError } from "./kitty-server";
export const getCommerce=cache(async()=>{const runtime=await getRuntimeConfiguration();let settings=structuredClone(defaultCommerce);if(runtime.WEBSITE_COMMERCE_SETTINGS){try{settings=commerceSchema.parse(JSON.parse(runtime.WEBSITE_COMMERCE_SETTINGS));}catch{/* Fail closed: all provider modes remain off. */}}return {settings,runtime};});
export async function providerConfiguration(provider:PaymentProvider,reconcileEnvironment?:"sandbox"|"live"){
 const {settings,runtime}=await getCommerce();const configured={...settings.providers[provider],...(reconcileEnvironment?{mode:reconcileEnvironment}: {})};
 const clientId=runtime[provider==="razorpay"?"RAZORPAY_KEY_ID":provider==="paypal"?"PAYPAL_CLIENT_ID":"CASHFREE_CLIENT_ID"]||"";
 const secret=runtime[provider==="razorpay"?"RAZORPAY_KEY_SECRET":provider==="paypal"?"PAYPAL_CLIENT_SECRET":"CASHFREE_CLIENT_SECRET"]||"";
 if(configured.mode==="off"||!clientId||!secret)throw new HttpError("This payment provider is not available yet.",503);
 if(!reconcileEnvironment&&configured.mode==="live"&&!configured.approved)throw new HttpError("Live payments are awaiting account approval.",503);
 if(provider==="razorpay"&&(!/^rzp_(test|live)_[A-Za-z0-9]+$/.test(clientId)||((configured.mode==="sandbox")!==clientId.startsWith("rzp_test_"))))throw new HttpError("The Razorpay key does not match the selected payment mode.",503);
 const webhook=provider==="razorpay"?runtime.RAZORPAY_WEBHOOK_SECRET:provider==="paypal"?runtime.PAYPAL_WEBHOOK_ID:secret;
 if(!reconcileEnvironment&&configured.mode==="live"&&!webhook)throw new HttpError("Complete webhook setup before enabling live payments.",503);
 return {provider,clientId,secret,webhook:webhook||"",testMode:configured.mode==="sandbox",currency:provider==="paypal"?"USD" as const:"INR" as const,amount:configured.projectAmountMinor,mode:configured.mode};
}
export async function publicPaymentProviders(){const options:PublicProvider[]=[];for(const provider of ["razorpay","paypal","cashfree"] as const){try{const config=await providerConfiguration(provider);options.push({provider,name:{razorpay:"Razorpay",paypal:"PayPal",cashfree:"Cashfree"}[provider],currency:config.currency,testMode:config.testMode,amount:config.amount,clientId:config.clientId});}catch{/* Only explicitly configured providers appear. */}}return options;}

export async function paymentProviderReadiness() {
 const {settings,runtime}=await getCommerce();
 const result={} as Record<PaymentProvider,ProviderReadiness>;
 for(const provider of ["razorpay","paypal","cashfree"] as const) {
  const mode=settings.providers[provider].mode;
  const names=provider==="razorpay"?["RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET"]:provider==="paypal"?["PAYPAL_CLIENT_ID","PAYPAL_CLIENT_SECRET"]:["CASHFREE_CLIENT_ID","CASHFREE_CLIENT_SECRET"];
  try {
   const config=await providerConfiguration(provider);
   result[provider]={available:true,mode,projectReady:config.amount>=100,message:config.amount>=100?"Contributions and the configured client project amount are ready.":"Contributions are ready. No client project amount is set; product pricing is separate."};
  } catch(error) {
   result[provider]={available:false,mode,projectReady:false,message:mode==="off"?"Disabled in Studio.":names.some(key=>!runtime[key as keyof typeof runtime])?"Save both the provider ID and secret, then reload this panel.":error instanceof HttpError?error.message:"Payment configuration could not be checked. Reload and try again."};
  }
 }
 return result;
}

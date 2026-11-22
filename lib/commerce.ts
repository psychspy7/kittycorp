import { z } from "zod";
import { mediaPathPattern } from "./company-content";
export const providers=["razorpay","paypal","cashfree"] as const;
export type PaymentProvider=typeof providers[number];
export const providerNames={razorpay:"Razorpay",paypal:"PayPal",cashfree:"Cashfree"};
const mode=z.enum(["off","sandbox","live"]);
const providerSchema=z.object({mode,approved:z.boolean(),projectAmountMinor:z.number().int().min(0).max(100_000_000)}).strict();
export const gallerySchema=z.object({path:z.string().max(180).refine(v=>mediaPathPattern.test(v),"Choose an uploaded image."),title:z.string().min(2).max(100),caption:z.string().min(10).max(350)}).strict();
export const commerceSchema=z.object({providers:z.object({razorpay:providerSchema,paypal:providerSchema,cashfree:providerSchema}).strict()});
export type CommerceSettings=z.infer<typeof commerceSchema>;
export const defaultCommerce:CommerceSettings={providers:{razorpay:{mode:"off",approved:false,projectAmountMinor:0},paypal:{mode:"off",approved:false,projectAmountMinor:0},cashfree:{mode:"off",approved:false,projectAmountMinor:0}}};
export const commerceCredentialFields=["RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET","RAZORPAY_WEBHOOK_SECRET","PAYPAL_CLIENT_ID","PAYPAL_CLIENT_SECRET","PAYPAL_WEBHOOK_ID","CASHFREE_CLIENT_ID","CASHFREE_CLIENT_SECRET"] as const;
export type CommerceCredential=typeof commerceCredentialFields[number];
export const credentialLabels:Record<CommerceCredential,string>={RAZORPAY_KEY_ID:"Razorpay Key ID",RAZORPAY_KEY_SECRET:"Razorpay Key Secret",RAZORPAY_WEBHOOK_SECRET:"Razorpay Webhook Secret",PAYPAL_CLIENT_ID:"PayPal Client ID",PAYPAL_CLIENT_SECRET:"PayPal Client Secret",PAYPAL_WEBHOOK_ID:"PayPal Webhook ID",CASHFREE_CLIENT_ID:"Cashfree App / Client ID",CASHFREE_CLIENT_SECRET:"Cashfree Secret Key"};
export const providerFields:Record<PaymentProvider,CommerceCredential[]>={razorpay:["RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET","RAZORPAY_WEBHOOK_SECRET"],paypal:["PAYPAL_CLIENT_ID","PAYPAL_CLIENT_SECRET","PAYPAL_WEBHOOK_ID"],cashfree:["CASHFREE_CLIENT_ID","CASHFREE_CLIENT_SECRET"]};
export type PublicProvider={provider:PaymentProvider;name:string;currency:"INR"|"USD";testMode:boolean;amount:number;clientId:string};

// A zero client quote closes only project checkout, never voluntary contributions.
export function paymentOptionsForPurpose(options: PublicProvider[], purpose: "project" | "donation) {
  return purpose === "donation" || purpose === "subscription" ? options : options.filter(option => option.amount >= 100);
}
export type ProviderReadiness = { available: boolean; mode: "off" | "sandbox" | "live"; projectReady: boolean; message: string };

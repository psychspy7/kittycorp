import "server-only";
import { cache } from "react";
import { database, setting } from "./kitty-server";
export const runtimeFields=["TURNSTILE_SITE_KEY","TURNSTILE_SECRET_KEY","KITTY_AI_WEBSITE_URL","KITTY_AI_GATEWAY_TOKEN","KITTY_MEMBERSHIP_BACKEND","KITTY_COMMERCE_GATEWAY_TOKEN","RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET","RAZORPAY_WEBHOOK_SECRET","PAYPAL_CLIENT_ID","PAYPAL_CLIENT_SECRET","PAYPAL_WEBHOOK_ID","CASHFREE_CLIENT_ID","CASHFREE_CLIENT_SECRET","WEBSITE_COMMERCE_SETTINGS"] as const;
export type RuntimeConfiguration=Partial<Record<typeof runtimeFields[number],string>>;
export async function decodeRuntimeConfiguration(ciphertext:string):Promise<RuntimeConfiguration>{
 const envelope=JSON.parse(ciphertext) as {v:number;iv:string;data:string};
 if(envelope.v!==1||!/^[a-f0-9]{24}$/.test(envelope.iv)||!/^[a-f0-9]+$/.test(envelope.data)||envelope.data.length>24000)throw Error("Invalid runtime configuration");
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(setting("FEEDBACK_GATEWAY_TOKEN")+":kitty-runtime-v1"));
 const key=await crypto.subtle.importKey("raw",digest,"AES-GCM",false,["decrypt"]);
 const bytes=(hex:string)=>new Uint8Array(hex.match(/.{2}/g)!.map(v=>parseInt(v,16)));
 const decrypted=await crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(envelope.iv),additionalData:new TextEncoder().encode("kitty-runtime-v1")},key,bytes(envelope.data));
 const parsed=JSON.parse(new TextDecoder().decode(decrypted));
 const stored:RuntimeConfiguration={};
 for(const field of runtimeFields)if(typeof parsed[field]==="string"&&parsed[field].length<=(field==="WEBSITE_COMMERCE_SETTINGS"?8000:2000))stored[field]=parsed[field];
 return stored;
}
export async function encryptRuntimeConfiguration(value:RuntimeConfiguration){
 const bytes=new TextEncoder().encode(JSON.stringify(value));if(bytes.length>11000)throw Error("Configuration is too large");
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(setting("FEEDBACK_GATEWAY_TOKEN")+":kitty-runtime-v1"));
 const key=await crypto.subtle.importKey("raw",digest,"AES-GCM",false,["encrypt"]);const iv=crypto.getRandomValues(new Uint8Array(12));
 const data=await crypto.subtle.encrypt({name:"AES-GCM",iv,additionalData:new TextEncoder().encode("kitty-runtime-v1")},key,bytes);
 const hex=(buffer:ArrayBuffer|Uint8Array)=>Array.from(new Uint8Array(buffer instanceof Uint8Array?buffer.buffer:buffer)).map(v=>v.toString(16).padStart(2,"0")).join("");
 return JSON.stringify({v:1,iv:hex(iv),data:hex(data)});
}
// Credentials remain ciphertext in the database. The decryption key is derived
// from the existing private gateway setting already present on the deployment.
export const getRuntimeConfiguration = cache(async (): Promise<RuntimeConfiguration> => {
  const stored: RuntimeConfiguration = {};
  try {
    const {data,error} = await database().rpc("kitty_website_runtime_configuration", {p_gateway_token:setting("FEEDBACK_GATEWAY_TOKEN")});
    if (error || typeof data !== "string") throw new Error("Runtime configuration unavailable");
    Object.assign(stored,await decodeRuntimeConfiguration(data));
  } catch { /* Missing configuration keeps features disabled until setup. */ }
  const resolved: RuntimeConfiguration={};
  for (const field of runtimeFields)
    resolved[field] = process.env[field]?.trim() || stored[field] || "";
  return resolved;
});

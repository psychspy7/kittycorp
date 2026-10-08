import "server-only";
import { cache } from "react";
import { database, setting } from "./kitty-server";
export type RuntimeConfiguration = {
  TURNSTILE_SITE_KEY?: string; TURNSTILE_SECRET_KEY?: string;
  KITTY_AI_WEBSITE_URL?: string; KITTY_AI_GATEWAY_TOKEN?: string;
};
// Credentials remain ciphertext in the database. The decryption key is derived
// from the existing private gateway setting already present on the deployment.
export const getRuntimeConfiguration = cache(async (): Promise<RuntimeConfiguration> => {
  const stored: RuntimeConfiguration = {};
  try {
    const {data,error} = await database().rpc("kitty_website_runtime_configuration", {p_gateway_token:setting("FEEDBACK_GATEWAY_TOKEN")});
    if (error || typeof data !== "string") throw new Error("Runtime configuration unavailable");
    const envelope = JSON.parse(data) as {v:number;iv:string;data:string};
    if (envelope.v!==1 || !/^[a-f0-9]{24}$/.test(envelope.iv) || !/^[a-f0-9]+$/.test(envelope.data) || envelope.data.length>24000) throw new Error("Invalid runtime configuration");
    const digest = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(setting("FEEDBACK_GATEWAY_TOKEN")+":kitty-runtime-v1"));
    const key = await crypto.subtle.importKey("raw",digest,"AES-GCM",false,["decrypt"]);
    const bytes = (hex:string) => new Uint8Array(hex.match(/.{2}/g)!.map(value=>parseInt(value,16)));
    const decrypted = await crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(envelope.iv),additionalData:new TextEncoder().encode("kitty-runtime-v1")},key,bytes(envelope.data));
    const parsed = JSON.parse(new TextDecoder().decode(decrypted)) as RuntimeConfiguration;
    for (const field of ["TURNSTILE_SITE_KEY","TURNSTILE_SECRET_KEY","KITTY_AI_WEBSITE_URL","KITTY_AI_GATEWAY_TOKEN"] as const)
      if (typeof parsed[field]==="string" && parsed[field]!.length<=2000) stored[field]=parsed[field];
  } catch { /* Missing configuration keeps features disabled until setup. */ }
  const resolved: RuntimeConfiguration={};
  for (const field of ["TURNSTILE_SITE_KEY","TURNSTILE_SECRET_KEY","KITTY_AI_WEBSITE_URL","KITTY_AI_GATEWAY_TOKEN"] as const)
    resolved[field] = process.env[field]?.trim() || stored[field] || "";
  return resolved;
});

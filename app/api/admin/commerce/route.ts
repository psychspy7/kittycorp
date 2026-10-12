import { revalidatePath } from "next/cache";
import { z } from "zod";
import { commerceSchema,commerceCredentialFields } from "@/lib/commerce";
import { getCommerce,paymentProviderReadiness } from "@/lib/commerce-server";
import { decodeRuntimeConfiguration,encryptRuntimeConfiguration } from "@/lib/runtime-configuration";
import { failure,HttpError,privateJson,readBody,requireAdmin,verifyOrigin } from "@/lib/kitty-server";
export const runtime="nodejs";
export async function GET(){try{const {db}=await requireAdmin();const {data,error}=await db.from("kitty_website_runtime").select("updated_at").eq("id","runtime").maybeSingle();if(error)throw error;const {settings,runtime}=await getCommerce();return privateJson({settings,readiness:await paymentProviderReadiness(),version:data?.updated_at||null,configured:Object.fromEntries(commerceCredentialFields.map(key=>[key,Boolean(runtime[key])])),overridden:commerceCredentialFields.filter(key=>Boolean(process.env[key]?.trim()))});}catch(error){return failure(error);}}
export async function PATCH(request:Request){try{
 verifyOrigin(request);const {db}=await requireAdmin();
 const value=z.object({settings:commerceSchema,version:z.string().nullable(),credentials:z.object(Object.fromEntries(commerceCredentialFields.map(key=>[key,z.string().trim().max(2000).nullable().optional()]))).strict()}).strict().parse(await readBody(request));
 const {data:row,error:readError}=await db.from("kitty_website_runtime").select("ciphertext,updated_at").eq("id","runtime").maybeSingle();if(readError)throw readError;
 if((row?.updated_at||null)!==value.version)throw new HttpError("Settings changed in another window. Reload before saving.",409);
 const stored=row?await decodeRuntimeConfiguration(row.ciphertext):{};
 for(const key of commerceCredentialFields){const input=value.credentials[key];if(input===null)delete stored[key];else if(typeof input==="string"&&input)stored[key]=input;}
 stored.WEBSITE_COMMERCE_SETTINGS=JSON.stringify(value.settings);
 const ciphertext=await encryptRuntimeConfiguration(stored);const updated_at=new Date().toISOString();
 const write=row?await db.from("kitty_website_runtime").update({ciphertext,updated_at}).eq("id","runtime").eq("updated_at",row.updated_at).select("updated_at").maybeSingle():await db.from("kitty_website_runtime").insert({id:"runtime",ciphertext,updated_at}).select("updated_at").single();
 if(write.error||!write.data)throw new HttpError("Couldn’t save. Reload the settings and try again.",409);
 revalidatePath("/");revalidatePath("/payments");revalidatePath("/memberships");revalidatePath("/lisa-ai");return privateJson({saved:true,version:write.data.updated_at});
 }catch(error){return failure(error);}}

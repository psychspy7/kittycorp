import "server-only";
import { z } from "zod";
export const priceEstimateSchema=z.object({amount:z.coerce.number().int().min(0).max(100000000),base:z.enum(["INR","USD"]),currency:z.string().regex(/^[A-Z]{3}$/)}).strict();
const rateSchema=z.object({result:z.literal("success"),base_code:z.string(),time_last_update_unix:z.number().int().positive(),rates:z.record(z.number().positive().finite())});
export async function priceEstimate(input:z.infer<typeof priceEstimateSchema>){
 if(input.currency===input.base)return {amount:input.amount/100,currency:input.currency,base:input.base,date:null};
 const response=await fetch(`https://open.er-api.com/v6/latest/${input.base}`,{next:{revalidate:86400},redirect:"error",signal:AbortSignal.timeout(4000)});
 if(!response.ok)throw Error("Reference rate unavailable");
 const data=rateSchema.parse(await response.json());const rate=data.rates[input.currency];
 if(data.base_code!==input.base||!rate||Date.now()/1000-data.time_last_update_unix>5*86400)throw Error("Reference rate unavailable");
 return {amount:input.amount/100*rate,currency:input.currency,base:input.base,date:new Date(data.time_last_update_unix*1000).toISOString().slice(0,10)};
}

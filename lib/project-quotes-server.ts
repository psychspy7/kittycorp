import "server-only";
import { createHash } from "node:crypto";
import { database, setting, HttpError } from "./kitty-server";
import { quoteTokenSchema, quoteAmountDue, type ProjectQuote, type ProjectPaymentChoice } from "./project-quotes";
export function quoteHash(token:string){return createHash("sha256").update(quoteTokenSchema.parse(token)).digest("hex");}
export async function quoteAction(action:string,token:string,value:Record<string,unknown>={}) {
 const {data,error}=await database().rpc("kitty_website_project_quote_action",{p_gateway_token:setting("FEEDBACK_GATEWAY_TOKEN"),p_action:action,p_hash:quoteHash(token),p_value:value});
 if(error?.message.toLowerCase().includes("rate limit"))throw new HttpError("You’ve sent a few briefs. Please try again in an hour.",429);
 if(error)throw new HttpError(error.message.includes("Quote busy")?"A checkout is already being prepared. Please wait a moment and reload.":error.message.includes("Quote locked")?"A payment is already in progress. Keep its payment schedule and check the status before trying again.":"This quote could not be opened. Contact KITTY CORP if you have paid.",error.message.includes("Quote busy")||error.message.includes("Quote locked")?409:400);
 return data;
}
export async function customerQuote(token:string):Promise<ProjectQuote> {const data=await quoteAction("read",token);if(!data)throw new HttpError("This quote link is invalid or no longer available.",404);return data as ProjectQuote;}
export async function reserveQuote(token:string,choice:ProjectPaymentChoice,reservation:string,expectedAmount:number){
 const quote=await customerQuote(token);let amount;try{amount=quoteAmountDue(quote,choice);}catch(error){throw new HttpError(error instanceof Error?error.message:"Quote unavailable.",409);}
 if(amount!==expectedAmount)throw new HttpError("Your quote or balance changed. Refresh before paying.",409);
 const result=await quoteAction("reserve",token,{choice,reservation,amount});
 return {quote:result as ProjectQuote,amount,reference:`Q-${quote.id}-${choice}`};
}

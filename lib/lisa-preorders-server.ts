import "server-only";
import {createHash} from "node:crypto";
import {database,setting,HttpError} from "./kitty-server";
import {preorderTokenSchema,type LisaPreorder} from "./lisa-preorders";
export async function preorderAction(action:string,token:string,value:Record<string,unknown>={}):Promise<LisaPreorder>{
 const hash=createHash("sha256").update(preorderTokenSchema.parse(token)).digest("hex");
 const {data,error}=await database().rpc("kitty_website_lisa_preorder_action",{p_gateway_token:setting("FEEDBACK_GATEWAY_TOKEN"),p_action:action,p_hash:hash,p_value:value});
 if(error)throw new HttpError(error.message.includes("Rate limit")?"Please wait before making another reservation.":error.message.includes("Preorder locked")?"This reservation has changed. Refresh its status before paying.":"The reservation could not be opened. Contact KITTY CORP if you have paid.",error.message.includes("Rate limit")?429:409);
 if(!data)throw new HttpError("This reservation link could not be found.",404);
 return data as LisaPreorder;
}

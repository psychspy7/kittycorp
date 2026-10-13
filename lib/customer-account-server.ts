import "server-only";
import {z} from "zod";
import {commerce,customerToken} from "./membership-server";
import {database,setting,HttpError} from "./kitty-server";
export type CustomerIdentity={uid:string;email:string};
const identitySchema=z.object({uid:z.string().min(1).max(128),email:z.string().email().max(254)});
export async function requireCustomer(request:Request):Promise<CustomerIdentity>{return identitySchema.parse(await commerce("me","GET",undefined,customerToken(request)));}
export async function optionalCustomer(request:Request){return request.headers.has("authorization")?requireCustomer(request):null;}
export async function customerAction(customer:CustomerIdentity,action:string,value:Record<string,unknown>={}){
 const {data,error}=await database().rpc("kitty_website_customer_action",{p_gateway_token:setting("FEEDBACK_GATEWAY_TOKEN"),p_uid:customer.uid,p_email:customer.email,p_action:action,p_value:value});
 if(error)throw new HttpError(error.message.includes("Customer access")?"This record could not be connected. Use its private link and the Google account matching the original email.":"This record is unavailable or belongs to another account.",error.message.includes("Customer access")?403:404);
 if(data===null)throw new HttpError("This record is unavailable or belongs to another account.",404);
 return data;
}

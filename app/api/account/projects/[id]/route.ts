import {z} from "zod";
import {failure,privateJson} from "@/lib/kitty-server";
import {requireCustomer,customerAction} from "@/lib/customer-account-server";
export const runtime="nodejs";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){try{const customer=await requireCustomer(request);const id=z.string().uuid().parse((await params).id);return privateJson({quote:await customerAction(customer,"project",{id,action:"read"})});}catch(error){return failure(error);}}

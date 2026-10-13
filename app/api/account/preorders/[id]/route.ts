import {z} from "zod";
import {failure,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {requireCustomer,customerAction} from "@/lib/customer-account-server";
export const runtime="nodejs";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){try{const customer=await requireCustomer(request);const id=z.string().uuid().parse((await params).id);return privateJson({preorder:await customerAction(customer,"preorder",{id,action:"read"})});}catch(error){return failure(error);}}
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){try{verifyOrigin(request);const customer=await requireCustomer(request);const id=z.string().uuid().parse((await params).id);z.object({action:z.literal("refund_request")}).strict().parse(await readBody(request));return privateJson({preorder:await customerAction(customer,"preorder",{id,action:"refund_request"})});}catch(error){return failure(error);}}

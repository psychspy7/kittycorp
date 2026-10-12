import {z} from "zod";
import {failure,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {preorderTokenSchema} from "@/lib/lisa-preorders";
import {preorderAction} from "@/lib/lisa-preorders-server";
export const runtime="nodejs";
export async function POST(request:Request){try{verifyOrigin(request);const value=z.object({token:preorderTokenSchema,action:z.enum(["read","refund_request"]).default("read")}).strict().parse(await readBody(request));return privateJson({preorder:await preorderAction(value.action,value.token)});}catch(error){return failure(error);}}

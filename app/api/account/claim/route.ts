import {createHash} from "node:crypto";
import {z} from "zod";
import {failure,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {requireCustomer,customerAction} from "@/lib/customer-account-server";
export const runtime="nodejs";
export async function POST(request:Request){try{verifyOrigin(request);const identity=await requireCustomer(request);const value=z.object({kind:z.enum(["project","preorder"]),token:z.string().regex(/^[a-f0-9]{64}$/)}).strict().parse(await readBody(request));const result=await customerAction(identity,"claim",{kind:value.kind,hash:createHash("sha256").update(value.token).digest("hex")});return privateJson({ok:true,record:result});}catch(error){return failure(error);}}

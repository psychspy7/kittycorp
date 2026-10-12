import {z} from "zod";
import {failure,HttpError,privateJson,readBody,requireAdmin,verifyOrigin} from "@/lib/kitty-server";
export const runtime="nodejs";
export async function GET(){try{const {db}=await requireAdmin();const {data,error}=await db.rpc("kitty_website_lisa_preorder_admin");if(error)throw error;return privateJson({preorders:data||[]});}catch(error){return failure(error);}}
export async function PATCH(request:Request){try{verifyOrigin(request);const {db}=await requireAdmin();const value=z.object({id:z.string().uuid(),accessProvided:z.literal(true)}).strict().parse(await readBody(request));const {data,error}=await db.rpc("kitty_website_lisa_preorder_admin",{p_value:value});if(error)throw new HttpError("This preorder has an unresolved refund request or is not paid. Refresh before changing its delivery status.",409);return privateJson({preorders:data||[]});}catch(error){return failure(error);}}

import { z } from "zod";
import { failure, HttpError, privateJson, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){try{verifyOrigin(request);const {db}=await requireAdmin();const id=z.string().uuid().parse((await params).id);const {data,error}=await db.from("kitty_website_early_access").delete().eq("id",id).select("id").maybeSingle();if(error)throw error;if(!data)throw new HttpError("Entry not found.",404);return privateJson({ok:true});}catch(e){return failure(e);}}

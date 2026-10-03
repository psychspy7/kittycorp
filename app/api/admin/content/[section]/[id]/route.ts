import { z } from "zod";
import { failure, HttpError, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { productSchema, refreshCompany, settingsSchema, teamSchema, verifyImage } from "@/lib/company-server";
type Context={params:Promise<{section:string;id:string}>};
export async function PATCH(request:Request,context:Context){try{verifyOrigin(request);const {db}=await requireAdmin();const {section,id}=await context.params;const body=await readBody(request);
  if(section==="products"){
    z.enum(["kitty-ai","sentinel","lisa-ai"]).parse(id);const value=productSchema.parse(body);const {data:old,error:lookup}=await db.from("kitty_website_products").select("icon_path").eq("slug",id).maybeSingle();if(lookup)throw lookup;if(!old)throw new HttpError("Product not found.",404);if(value.icon_path!==old.icon_path)await verifyImage(db,value.icon_path,"icons");const {data,error}=await db.from("kitty_website_products").update({...value,updated_at:new Date().toISOString()}).eq("slug",id).select().single();if(error)throw error;refreshCompany();return privateJson({product:data});
  }
  if(section==="team"){
    z.string().uuid().parse(id);const value=teamSchema.parse(body);const {data:old,error:lookup}=await db.from("kitty_website_team").select("photo_path").eq("id",id).maybeSingle();if(lookup)throw lookup;if(!old)throw new HttpError("Team member not found.",404);if(value.photo_path!==old.photo_path)await verifyImage(db,value.photo_path,"portraits");const {data,error}=await db.from("kitty_website_team").update({...value,updated_at:new Date().toISOString()}).eq("id",id).select().single();if(error)throw error;refreshCompany();return privateJson({member:data});
  }
  if(section==="company"&&id==="company"){
    const value=settingsSchema.parse(body);const {data,error}=await db.from("kitty_website_company").update({...value,updated_at:new Date().toISOString()}).eq("id","company").select().single();if(error)throw error;refreshCompany();return privateJson({settings:data});
  }
  throw new HttpError("Page not found.",404);
}catch(e){return failure(e);}}
export async function DELETE(request:Request,context:Context){try{verifyOrigin(request);const {db}=await requireAdmin();const {section,id}=await context.params;if(section!=="team")throw new HttpError("Only team profiles can be removed here.",400);z.string().uuid().parse(id);const {data,error}=await db.from("kitty_website_team").delete().eq("id",id).select("id").maybeSingle();if(error)throw error;if(!data)throw new HttpError("Team member not found.",404);refreshCompany();return privateJson({ok:true});}catch(e){return failure(e);}}

import "server-only";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { database, HttpError } from "./kitty-server";
import { defaultProducts, defaultSettings, defaultTeam, MEDIA_BUCKET, mediaPathPattern, type CompanyProduct, type CompanySettings, type TeamMember } from "./company-content";

const publicLink = z.string().trim().max(1000).refine(value => {
  if (!value) return true;
  try {const url=new URL(value);return url.protocol==="https:" && !!url.hostname && !url.username && !url.password;}catch{return false;}
}, "Use a complete HTTPS link, or leave it empty.");
export const linksSchema = z.object({github:publicLink.optional(),linkedin:publicLink.optional(),x:publicLink.optional(),instagram:publicLink.optional(),youtube:publicLink.optional(),website:publicLink.optional()}).strict();
const imagePath = z.string().regex(mediaPathPattern, "Choose an image uploaded in Studio.").nullable();
export const productSchema=z.object({name:z.string().trim().min(2).max(80),label:z.string().trim().min(2).max(100),status:z.string().trim().min(2).max(60),description:z.string().trim().min(10).max(1000),intro:z.string().trim().min(10).max(2000),category:z.enum(["AI","Robotics","Engineering","Research","Company"]),media:z.string().trim().min(3).max(120),principles:z.array(z.tuple([z.string().trim().min(3).max(100),z.string().trim().min(10).max(1000)])).length(3),icon_path:imagePath,sort_order:z.number().int().min(0).max(1000),published:z.boolean()});
export const teamSchema=z.object({name:z.string().trim().min(2).max(100),role:z.string().trim().min(2).max(100),bio:z.string().trim().max(1200),photo_path:imagePath,links:linksSchema,sort_order:z.number().int().min(0).max(1000),published:z.boolean()});
export const settingsSchema=z.object({socials:linksSchema,team_heading:z.string().trim().min(3).max(140),team_intro:z.string().trim().min(10).max(1000),team_body:z.string().trim().min(10).max(2000)});
export const companyProducts=cache(async():Promise<CompanyProduct[]>=>{
  try{const {data,error}=await database().from("kitty_website_products").select("*").eq("published",true).order("sort_order").order("slug");if(error)throw error;return data as CompanyProduct[];}catch{return defaultProducts;}
});
export const companyTeam=cache(async():Promise<TeamMember[]>=>{
  try{const {data,error}=await database().from("kitty_website_team").select("*").eq("published",true).order("sort_order").order("created_at");if(error)throw error;return data as TeamMember[];}catch{return defaultTeam;}
});
export const companySettings=cache(async():Promise<CompanySettings>=>{
  try{const {data,error}=await database().from("kitty_website_company").select("*").eq("id","company").single();if(error)throw error;return data as CompanySettings;}catch{return defaultSettings;}
});
export function refreshCompany(){for(const path of ["/","/products","/company","/team","/kitty-ai","/lisa-ai","/sentinel","/secretchat","/research","/services","/contact","/investors","/privacy","/build-log","/sitemap.xml"])revalidatePath(path);revalidatePath("/", "layout");}
export async function verifyImage(db:ReturnType<typeof database>,path:string|null,kind:"icons"|"portraits"){
  if(!path)return;
  if(!mediaPathPattern.test(path)||!path.startsWith(kind+"/"))throw new HttpError("Choose an image uploaded for this field.",400);
  const {data,error}=await db.storage.from(MEDIA_BUCKET).download(path);
  if(error||!data)throw new HttpError("That image could not be found. Please upload it again.",400);
}

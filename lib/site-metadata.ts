import type { Metadata } from "next";
export const websiteOrigin=()=>(process.env.SITE_URL||"https://kittycorp.vercel.app").replace(/\/$/,"");
export function conciseDescription(text:string){const clean=text.replace(/\s+/g," ").trim();return clean.length<=160?clean:clean.slice(0,157).replace(/\s+\S*$/,"")+"…";}
export function pageMetadata(title:string,description:string,path:string):Metadata{const summary=conciseDescription(description);return {title,description:summary,alternates:{canonical:path},openGraph:{title:`${title} · KITTY CORP`,description:summary,url:path,siteName:"KITTY CORP",type:"website",images:[{url:"/opengraph-image",width:1200,height:630,alt:"KITTY CORP — websites, applications and independent technology"}]},twitter:{card:"summary_large_image",title:`${title} · KITTY CORP`,description:summary,images:["/opengraph-image"]}};}
export const jsonLd=(value:unknown)=>JSON.stringify(value).replace(/</g,"\\u003c");

import type { Metadata } from "next";
const canonicalHost = "thekittycorp.com";
const socialPreviewImage = "/opengraph-image?v=20261103";
export function canonicalSiteUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase() === "kittycorp.vercel.app") url.hostname = canonicalHost;
    if (url.hostname.toLowerCase() === "www.thekittycorp.com") url.hostname = canonicalHost;
    return url.toString().replace(/\/$/, "");
  } catch {
    return `https://${canonicalHost}`;
  }
}
export const websiteOrigin=()=>canonicalSiteUrl(process.env.SITE_URL||`https://${canonicalHost}`);
export function publicSiteHref(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase() !== "kittycorp.vercel.app") return value;
    url.hostname = canonicalHost;
    return url.toString();
  } catch {
    return value;
  }
}
export function canonicalSocialUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.toLowerCase().replace(/^www\./, "") === "instagram.com") {
      url.protocol = "https:";
      url.hostname = "www.instagram.com";
      url.search = "";
      url.hash = "";
      url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
    }
    return url.toString();
  } catch {
    return value;
  }
}
export function conciseDescription(text:string){const clean=text.replace(/\s+/g," ").trim();return clean.length<=160?clean:clean.slice(0,157).replace(/\s+\S*$/,"")+"…";}
export function pageMetadata(title:string,description:string,path:string):Metadata{const summary=conciseDescription(description);return {title,description:summary,alternates:{canonical:path},openGraph:{title:`${title} · KITTY CORP`,description:summary,url:path,siteName:"KITTY CORP",type:"website",images:[{url:socialPreviewImage,width:1200,height:630,alt:"KITTY CORP — independent technology company building websites, software and AI workflows"}]},twitter:{card:"summary_large_image",title:`${title} · KITTY CORP`,description:summary,images:[socialPreviewImage]}};}
export const jsonLd=(value:unknown)=>JSON.stringify(value).replace(/</g,"\\u003c");

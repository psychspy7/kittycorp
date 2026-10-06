import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { failure, HttpError, privateJson, requireAdmin, verifyOrigin } from "@/lib/kitty-server";
import { MAX_IMAGE_BYTES, MEDIA_BUCKET, mediaHref } from "@/lib/company-content";
export const runtime="nodejs";
export async function POST(request:Request){try{
  verifyOrigin(request);const {db}=await requireAdmin();
  const maximum=MAX_IMAGE_BYTES+65536;
  if(!request.headers.get("content-type")?.startsWith("multipart/form-data;"))throw new HttpError("Choose an image to upload.",415);
  if(Number(request.headers.get("content-length")||0)>maximum)throw new HttpError("Choose an image up to 3 MB.",413);
  const reader=request.body?.getReader();if(!reader)throw new HttpError("Missing image.",400);const chunks:Uint8Array[]=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maximum){await reader.cancel();throw new HttpError("Choose an image up to 3 MB.",413);}chunks.push(value);}
  const bytes=Buffer.concat(chunks);const form=await new Response(bytes,{headers:{"Content-Type":request.headers.get("content-type")!}}).formData();
  const kind=form.get("kind");const file=form.get("file");
  if(kind!=="icons"&&kind!=="portraits"&&kind!=="screenshots")throw new HttpError("Choose an icon, team photograph or website screenshot.",400);
  if(!(file instanceof File)||file.size<1||file.size>MAX_IMAGE_BYTES)throw new HttpError("Choose an image up to 3 MB.",400);
  let image:Buffer;
  try{
    const source=Buffer.from(await file.arrayBuffer());const processor=sharp(source,{limitInputPixels:20000000,animated:false});const meta=await processor.metadata();if(!["jpeg","png","webp"].includes(meta.format||""))throw Error();
    image=kind==="screenshots"
      ? await processor.rotate().resize({width:1800,height:1200,fit:"inside",withoutEnlargement:true}).webp({quality:86}).toBuffer()
      : await processor.rotate().resize({width:kind==="icons"?512:1400,height:kind==="icons"?512:1400,fit:"inside",withoutEnlargement:true}).webp({quality:86}).toBuffer();
  }catch{throw new HttpError("Upload a valid PNG, JPEG or WebP image (up to 20 megapixels).",400);}
  const path=`${kind}/${randomUUID()}.webp`;
  const {error}=await db.storage.from(MEDIA_BUCKET).upload(path,image,{contentType:"image/webp",cacheControl:"31536000",upsert:false});if(error)throw error;
  return privateJson({path,url:mediaHref(path),bytes:image.byteLength});
}catch(e){return failure(e);}}

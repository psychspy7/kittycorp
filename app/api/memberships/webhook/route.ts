import {failure,HttpError,privateJson} from "@/lib/kitty-server";
import {webhookMembership} from "@/lib/membership-server";
export const runtime="nodejs";
export async function POST(request:Request) {
 try {
  if(Number(request.headers.get("content-length")||0)>131072)throw new HttpError("Webhook too large.",413);
  const reader=request.body?.getReader();if(!reader)throw new HttpError("Missing webhook.",400);
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>131072){await reader.cancel();throw new HttpError("Webhook too large.",413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  const raw=new TextDecoder("utf-8",{fatal:true}).decode(bytes);
  return privateJson(await webhookMembership(raw,request.headers.get("x-razorpay-signature")||"",request.headers.get("x-razorpay-event-id")||""));
 }catch(error){return failure(error);}
}

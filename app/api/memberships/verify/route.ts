import {failure,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {verifyMembership} from "@/lib/membership-server";

export const runtime="nodejs";
export async function POST(request:Request) {
 try {verifyOrigin(request);const body=await readBody(request);
 return privateJson(await verifyMembership(request,body));
 }catch(error){return failure(error);}
}

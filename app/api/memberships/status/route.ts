import {failure,privateJson,readBody,verifyOrigin} from "@/lib/kitty-server";
import {membershipPaymentStatus} from "@/lib/membership-server";

export const runtime="nodejs";
export async function POST(request:Request) {
 try {verifyOrigin(request);const body=await readBody(request);
 return privateJson(await membershipPaymentStatus(request,body));
 }catch(error){return failure(error);}
}

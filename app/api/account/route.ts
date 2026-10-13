import {failure,privateJson} from "@/lib/kitty-server";
import {requireCustomer,customerAction} from "@/lib/customer-account-server";
import {commerce,customerToken} from "@/lib/membership-server";
export const runtime="nodejs";
export async function GET(request:Request){try{const identity=await requireCustomer(request);const [records,membership]=await Promise.all([customerAction(identity,"list"),commerce("memberships/me","GET",undefined,customerToken(request)).then(data=>({data,error:""})).catch(()=>({data:null,error:"KITTY AI membership status is temporarily unavailable. Your website records are still shown."}))]);return privateJson({identity,records,membership:membership.data,...(membership.error?{membershipError:membership.error}:{})});}catch(error){return failure(error);}}

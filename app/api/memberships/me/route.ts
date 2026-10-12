import {failure,privateJson} from "@/lib/kitty-server";
import {commerce,customerToken} from "@/lib/membership-server";
export const runtime="nodejs";
export async function GET(request:Request) {try{return privateJson(await commerce("memberships/me","GET",undefined,customerToken(request)));}catch(error){return failure(error);}}

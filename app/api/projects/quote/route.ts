import { z } from "zod";
import { customerQuote } from "@/lib/project-quotes-server";
import { quoteTokenSchema } from "@/lib/project-quotes";
import { failure,privateJson,readBody,verifyOrigin } from "@/lib/kitty-server";
export const runtime="nodejs";
export async function POST(request:Request){try{verifyOrigin(request);const {token}=z.object({token:quoteTokenSchema}).strict().parse(await readBody(request));return privateJson({quote:await customerQuote(token)});}catch(error){return failure(error);}}

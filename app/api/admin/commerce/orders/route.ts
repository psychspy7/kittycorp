import { failure,privateJson,requireAdmin } from "@/lib/kitty-server";
export async function GET(){try{const {db}=await requireAdmin();const {data,error}=await db.rpc("kitty_website_payment_list");if(error)throw error;return privateJson({orders:data});}catch(error){return failure(error);}}

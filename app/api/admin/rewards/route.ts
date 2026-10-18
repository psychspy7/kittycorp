import { z } from "zod";
import { rewardHash } from "@/lib/discount-game-server";
import { failure, privateJson, readBody, requireAdmin, verifyOrigin } from "@/lib/kitty-server";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const { db } = await requireAdmin();
    const value = z.object({ code: z.string().max(80), redeem: z.boolean().default(false), quoteId: z.string().uuid().optional(), note: z.string().trim().max(300).default("") }).strict().parse(await readBody(request));
    const { data, error } = await db.rpc("kitty_website_reward_admin", { p_hash: rewardHash(value.code), p_value: value.redeem ? { quote_id: value.quoteId || null, note: value.note } : null });
    if (error) throw error;
    return privateJson({ reward: data });
  } catch (error) { return failure(error); }
}

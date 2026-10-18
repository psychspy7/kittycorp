import { z } from "zod";
import { circuitBoard, scoreCircuit } from "@/lib/discount-game";
import { createGameChallenge, readGameChallenge, rewardCode, rewardHash } from "@/lib/discount-game-server";
import { database, failure, fingerprint, HttpError, privateJson, readBody, setting, verifyOrigin } from "@/lib/kitty-server";
import { verifyTurnstile } from "@/lib/turnstile-server";

export const runtime = "nodejs";
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start"), turnstileToken: z.string().max(2048).optional() }).strict(),
  z.object({ action: z.literal("claim"), challenge: z.string().max(1000), moves: z.array(z.enum(["U", "D", "L", "R"])).min(1).max(600) }).strict(),
]);
export async function POST(request: Request) {
  try {
    verifyOrigin(request);
    const value = schema.parse(await readBody(request));
    const visitor = await fingerprint(request);
    if (value.action === "start") {
      await verifyTurnstile(request, value.turnstileToken, "discount-game");
      const challenge = createGameChallenge(visitor);
      return privateJson({ ...challenge, perfectMoves: circuitBoard(challenge.seed).perfectMoves });
    }
    const challenge = readGameChallenge(value.challenge, visitor);
    let score;
    try { score = scoreCircuit(challenge.seed, value.moves); }
    catch (error) { throw new HttpError(error instanceof Error ? error.message : "This route is incomplete.", 400); }
    const code = rewardCode(challenge.nonce, score.percent);
    const { data, error } = await database().rpc("kitty_website_claim_reward", {
      p_gateway_token: setting("FEEDBACK_GATEWAY_TOKEN"),
      p_value: { attempt: challenge.nonce, fingerprint: visitor, percent: score.percent, code_hash: rewardHash(code) },
    });
    if (error) throw error;
    return privateJson({ code: rewardCode(data.attempt, data.percent), percent: data.percent, expiresAt: data.expires_at, redeemed: !!data.redeemed_at });
  } catch (error) { return failure(error); }
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { circuitBoard, circuitStep, GAME_SIZE, GAME_MAX_MOVES, type Direction } from "@/lib/discount-game";
import { Turnstile } from "./turnstile";

type Reward = { code: string; percent: number; expiresAt: string; redeemed: boolean };
async function gameRequest<T>(value: unknown): Promise<T> {
  const response = await fetch("/api/rewards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value), signal: AbortSignal.timeout(20000) });
  const result = await response.json() as T & { error?: string };
  if (!response.ok) throw Error(result.error || "The circuit could not be checked. Try again.");
  return result;
}

export function DiscountGame({ securityEnabled }: { securityEnabled: boolean }) {
  const [round, setRound] = useState<{ seed: number; challenge: string } | null>(null);
  const [moves, setMoves] = useState<Direction[]>([]);
  const [reward, setReward] = useState<Reward | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [copied, setCopied] = useState(false);
  const [token, setToken] = useState(""), [attempt, setAttempt] = useState(0);
  const board = useMemo(() => round ? circuitBoard(round.seed) : null, [round]);
  const progress = useMemo(() => {
    if (!board) return { position: 0, checkpoint: 0, complete: false };
    let position = board.start, checkpoint = 0;
    for (const move of moves) { position = circuitStep(board.cells, position, move); if (position === board.checkpoints[checkpoint]) checkpoint++; }
    return { position, checkpoint, complete: position === board.finish && checkpoint === 3 };
  }, [board, moves]);

  async function start() {
    setBusy(true); setError(""); setCopied(false);
    try { const result = await gameRequest<{ seed: number; challenge: string }>({ action: "start", turnstileToken: token }); setRound(result); setMoves([]); setReward(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not start."); }
    finally { setBusy(false); setToken(""); setAttempt(value => value + 1); }
  }
  function move(direction: Direction) {
    if (!board || busy || reward || progress.complete || moves.length >= GAME_MAX_MOVES) return;
    if (circuitStep(board.cells, progress.position, direction) !== progress.position) setMoves(previous => [...previous, direction]);
  }
  async function claim() {
    if (!round || !progress.complete) return;
    setBusy(true); setError("");
    try { setReward(await gameRequest<Reward>({ action: "claim", challenge: round.challenge, moves })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not claim your reward."); }
    finally { setBusy(false); }
  }

  return <div className="circuit-game">
    {!round ? <div className="circuit-start"><span className="eyebrow">CIRCUIT COURIER</span><h2>A small puzzle.<br/>A useful reward.</h2><p>Route the signal through nodes 1, 2 and 3, then reach the exit. Finish for 5% off. Find the shortest route for 7%. There’s no speed bonus: take your time.</p><Turnstile action="discount-game" onToken={setToken} resetKey={attempt}/><button type="button" className="button button-gold" disabled={busy || (securityEnabled && !token)} onClick={() => void start()}>{busy ? "Preparing the circuit…" : "Play the circuit"}</button></div>
    : reward ? <div className="circuit-reward" role="status"><span className="eyebrow">{reward.redeemed ? "YOUR EXISTING CODE" : "CIRCUIT COMPLETE"}</span><h2>{reward.percent}% earned.</h2><p>{reward.redeemed ? "This visitor’s code has already been used." : "Keep your code and share it with the team before payment. We’ll confirm the eligible quote or product order and apply the offer."}</p><code>{reward.code}</code><button className="button button-outline" type="button" onClick={() => { void navigator.clipboard.writeText(reward.code).then(() => setCopied(true)).catch(() => setError("Select and copy the code above.")); }}>{copied ? "Copied" : "Copy code"}</button><p>Valid until {new Date(reward.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. One use; the largest eligible discount applies.</p><Link className="text-link" href="/projects">Send a project brief →</Link><Link className="text-link" href="/contact?subject=Reward%20code">Apply to a product purchase →</Link></div>
    : board && <div className="circuit-layout"><div>
      <div className="circuit-score"><span>{moves.length} moves</span><span>Perfect route: {board.perfectMoves}</span></div>
      <div className="circuit-board" role="application" aria-label="Circuit maze. Use arrow keys or the direction buttons. Collect nodes 1, 2 and 3 in order, then exit." tabIndex={0} onKeyDown={event => { const direction = ({ ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R" } as Record<string, Direction>)[event.key]; if (direction) { event.preventDefault(); move(direction); } }}>
        {board.cells.map((wall, index) => {
          const node = board.checkpoints.indexOf(index), player = progress.position === index;
          return <span aria-hidden="true" className={`circuit-cell ${wall ? "is-wall" : ""} ${player ? "is-player" : ""} ${node >= 0 && node < progress.checkpoint ? "is-collected" : ""}`} key={index}>{player ? "●" : node >= 0 ? node + 1 : index === board.finish ? "↗" : index === board.start ? "S" : ""}</span>;
        })}
      </div>
      <div className="circuit-controls" aria-label="Move the signal"><button type="button" onClick={() => move("U")} aria-label="Move up">↑</button><div><button type="button" onClick={() => move("L")} aria-label="Move left">←</button><button type="button" onClick={() => move("D")} aria-label="Move down">↓</button><button type="button" onClick={() => move("R")} aria-label="Move right">→</button></div></div>
    </div><div className="circuit-instructions"><h2>Connect the dots.<br/>Keep the route clean.</h2><p role="status">{progress.complete ? "All nodes connected. Claim your reward." : `Next: ${progress.checkpoint < 3 ? "node " + (progress.checkpoint + 1) : "the exit ↗"}. Signal at row ${Math.floor(progress.position / GAME_SIZE) + 1}, column ${progress.position % GAME_SIZE + 1}.`}</p><ol><li>Move with arrow keys after selecting the board, or use the buttons.</li><li>Visit numbered nodes in order. Walls cannot be crossed.</li><li>Finish within {GAME_MAX_MOVES} moves for 5%. Match {board.perfectMoves} moves for 7%.</li></ol>{progress.complete ? <button className="button button-gold" type="button" disabled={busy} onClick={() => void claim()}>{busy ? "Checking your route…" : "Claim my reward"}</button> : <button className="text-link" type="button" disabled={busy} onClick={() => setMoves([])}>Reset this route</button>}<p className="circuit-session-note">A circuit session lasts 20 minutes. If it expires, return and start again.</p></div></div>}
    {error && <p className="form-error" role="alert">{error}</p>}
    {reward?.percent === 5 && !reward.redeemed && <button className="text-link" type="button" onClick={() => { setRound(null); setReward(null); setMoves([]); }}>Try for 7% — a perfect result replaces your unused 5% code</button>}
  </div>;
}

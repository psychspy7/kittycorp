"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { canTurn, startSnake, stepSnake, snakeDelay, rewardTier, GAME_SIZE, GAME_MAX_MOVES, type Direction, type SnakeState } from "@/lib/discount-game";
import { Turnstile } from "./turnstile";

type Social = { id: "instagram" | "x" | "linkedin"; label: string; href: string };
type Reward = { code: string; percent: number; expiresAt: string; redeemed: boolean };
async function gameRequest<T>(value: unknown): Promise<T> {
  const response = await fetch("/api/rewards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value), signal: AbortSignal.timeout(20000) });
  const result = await response.json() as T & { error?: string };
  if (!response.ok) throw Error(result.error || "The round could not be checked. Try again.");
  return result;
}

export function DiscountGame({ securityEnabled, socials }: { securityEnabled: boolean; socials: Social[] }) {
  const [round, setRound] = useState<{ seed: number; challenge: string } | null>(null);
  const [snake, setSnake] = useState<SnakeState | null>(null);
  const [ticks, setTicks] = useState(0);
  const [paused, setPaused] = useState(true), [claiming, setClaiming] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [copied, setCopied] = useState(false);
  const [token, setToken] = useState(""), [attempt, setAttempt] = useState(0);
  const [visited, setVisited] = useState<string[]>([]), [follows, setFollows] = useState<Record<string, boolean>>({});
  const history = useRef("");
  const pending = useRef<Direction | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const tier = rewardTier(snake?.score || 0);
  const limitReached = ticks >= GAME_MAX_MOVES;

  useEffect(() => {
    const pause = () => setPaused(true);
    const visibility = () => { if (document.hidden) pause(); };
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("blur", pause); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!snake || snake.over || paused || claiming || reward || busy || limitReached) return;
    const timer = window.setTimeout(() => {
      const direction = pending.current || snake.direction;
      pending.current = null;
      history.current += direction;
      setTicks(value => value + 1);
      setSnake(stepSnake(snake, direction));
    }, snakeDelay(snake.score));
    return () => window.clearTimeout(timer);
  }, [snake, paused, claiming, reward, busy, limitReached]);

  async function start() {
    setBusy(true); setError(""); setCopied(false);
    try {
      const result = await gameRequest<{ seed: number; challenge: string }>({ action: "start", turnstileToken: token });
      history.current = ""; pending.current = null;
      setRound(result); setSnake(startSnake(result.seed)); setReward(null); setPaused(true); setClaiming(false);
      setVisited([]); setFollows({}); setTicks(0);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not start."); }
    finally { setBusy(false); setToken(""); setAttempt(value => value + 1); }
  }
  function move(direction: Direction) {
    if (!snake || snake.over || paused || claiming || busy || reward || pending.current || !canTurn(snake.direction, direction)) return;
    pending.current = direction;
  }
  function resume() { setPaused(false); board.current?.focus({ preventScroll: true }); }
  function reset() { setRound(null); setSnake(null); setReward(null); setError(""); history.current = ""; pending.current = null; }
  async function claim() {
    if (!round || !tier || !socials.every(social => follows[social.id])) return;
    setBusy(true); setError("");
    try { setReward(await gameRequest<Reward>({ action: "claim", challenge: round.challenge, moves: history.current, follows: { instagram: follows.instagram, x: follows.x, linkedin: follows.linkedin } })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not claim your reward."); }
    finally { setBusy(false); }
  }
  const cells = new Set(snake?.body);
  const stopped = snake?.over || limitReached;
  const status = !snake ? "" : snake.score >= 70 ? "70 points. The 7% reward is yours to claim." : stopped ? (tier ? "Round over. Your 5% reward is safe." : "Round over. Try again for 50 points.") : paused ? "Paused. Ready when you are." : "Keep moving. Every bite counts.";

  return <div className="snake-game">
    {!round ? <div className="snake-start"><span className="eyebrow">SNAKE / PLAY & SAVE</span><h2>Simple to learn.<br/>Harder to leave.</h2><p>Eat the gold dots. Stay clear of the walls and your own tail. One bite, one point. The snake gets faster every time.</p><div className="snake-tiers"><span><strong>50 points</strong>5% off</span><span><strong>70 points</strong>7% off</span></div><p>Earn your score first, then follow our Instagram, X and LinkedIn profiles and confirm to claim. Follows are self-confirmed. No social account access required.</p><Turnstile action="discount-game" onToken={setToken} resetKey={attempt}/><button type="button" className="button button-gold" disabled={busy || (securityEnabled && !token)} onClick={() => void start()}>{busy ? "Preparing your game…" : "Play Snake"}</button><small>A round lasts up to 20 minutes. Arrow keys / WASD or the on-screen controls. Space pauses.</small></div>
    : reward ? <div className="snake-reward" role="status"><span className="eyebrow">{reward.redeemed ? "YOUR EXISTING CODE" : "REWARD UNLOCKED"}</span><h2>{reward.percent}% earned.</h2><p>{reward.redeemed ? "This visitor’s code has already been used." : "Keep your code and share it with the team before payment. We’ll confirm the eligible quote or product order and apply the offer."}</p><code>{reward.code}</code><button className="button button-outline" type="button" onClick={() => { void navigator.clipboard.writeText(reward.code).then(() => setCopied(true)).catch(() => setError("Select and copy the code above.")); }}>{copied ? "Copied" : "Copy code"}</button><p>Valid until {new Date(reward.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. One use; the largest eligible discount applies.</p><Link className="text-link" href="/projects">Send a project brief →</Link><Link className="text-link" href="/contact?subject=Reward%20code">Apply to a product purchase →</Link></div>
    : snake && <div className="snake-layout"><div>
      <div className="snake-score"><span>SCORE <strong>{snake.score.toString().padStart(2, "0")}</strong></span><span>{tier ? `${tier}% unlocked` : `${50 - snake.score} to first reward`}<small>{Math.round(1000 / snakeDelay(snake.score) * 10) / 10} moves / sec</small></span></div>
      <div ref={board} className="snake-board" role="group" aria-label="Snake game board. Arrow keys or WASD to steer. Space to pause. Direction buttons follow the board." tabIndex={0} onKeyDown={event => {
        const direction = ({ ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R", w: "U", s: "D", a: "L", d: "R" } as Record<string, Direction>)[event.key];
        if (direction) { event.preventDefault(); move(direction); }
        if (event.code === "Space" || event.key === " ") { event.preventDefault(); if (!event.repeat && !stopped && !claiming) setPaused(value => !value); }
      }}>
        <div className="snake-grid" aria-hidden="true">{Array.from({ length: GAME_SIZE * GAME_SIZE }, (_, i) => <span key={i} className={i === snake.body[0] ? "snake-head" : cells.has(i) ? "snake-body" : i === snake.food ? "snake-food" : ""}/>)}</div>
        {(paused || stopped || claiming) && <div className="snake-overlay"><strong>{claiming ? "Reward break" : stopped ? snake.score >= 70 ? "Nicely done." : "End of the line." : ticks ? "Take a breath." : "Ready to roll?"}</strong><span>{snake.score >= 70 ? "70 points · 7% unlocked" : stopped && tier ? "Your 5% reward is safe." : "Walls are solid. Your tail is too."}</span>{!stopped && !claiming && <button type="button" className="button button-gold" onClick={resume}>{ticks ? "Resume game" : "Start moving"}</button>}</div>}
      </div>
      <div className="snake-controls" aria-label="Steer the snake"><button type="button" onClick={() => move("U")} disabled={paused || !!stopped || claiming} aria-label="Steer up">↑</button><div><button type="button" onClick={() => move("L")} disabled={paused || !!stopped || claiming} aria-label="Steer left">←</button><button type="button" onClick={() => move("D")} disabled={paused || !!stopped || claiming} aria-label="Steer down">↓</button><button type="button" onClick={() => move("R")} disabled={paused || !!stopped || claiming} aria-label="Steer right">→</button></div></div>
      {!stopped && !claiming && <button className="text-link" type="button" onClick={() => paused ? resume() : setPaused(true)}>{paused ? "Resume" : "Pause"}</button>}
    </div><div className="snake-side"><span className="eyebrow">THE LONG GAME</span><h2>Keep your nerve.<br/>Watch your tail.</h2><p role="status" aria-live="polite">{status}</p><div className="snake-progress" role="progressbar" aria-label="Points towards 7% reward" aria-valuemin={0} aria-valuemax={70} aria-valuenow={snake.score}><span style={{ width: `${snake.score / 70 * 100}%` }}/></div><div className="snake-tiers"><span className={tier ? "is-earned" : ""}><strong>50 points</strong>5% off</span><span className={tier === 7 ? "is-earned" : ""}><strong>70 points</strong>7% off</span></div>
      {tier > 0 && !claiming && <><p>{tier === 7 ? "Top tier reached. Follow and confirm to collect your code." : stopped ? "Your score still qualifies. Follow and confirm to collect your code." : "You can claim now. Or keep going for 7% — a crash won’t take your 5% away."}</p><button type="button" className="button button-gold" onClick={() => { setPaused(true); setClaiming(true); }}>{`Claim ${tier}% reward`}</button></>}
      {claiming && <fieldset className="snake-follows"><legend>Follow & claim</legend><p>Open each profile, follow, then tick to confirm. Already following? Open it and confirm below. This is self-reported; we cannot independently verify follows.</p>{socials.map(social => <div key={social.id}><a href={social.href} target="_blank" rel="noopener noreferrer" className="text-link" onClick={() => setVisited(previous => previous.includes(social.id) ? previous : [...previous, social.id])}>Open {social.label} ↗</a><label><input type="checkbox" checked={!!follows[social.id]} disabled={!visited.includes(social.id) || busy} onChange={event => setFollows(previous => ({ ...previous, [social.id]: event.target.checked }))}/>I follow {social.label}</label></div>)}<button type="button" className="button button-gold" disabled={busy || !socials.every(social => follows[social.id])} onClick={() => void claim()}>{busy ? "Checking your round…" : `Get my ${tier}% code`}</button>{!stopped && <button className="text-link" type="button" disabled={busy} onClick={() => { setClaiming(false); resume(); }}>Keep playing instead</button>}</fieldset>}
      {!tier && <p>Steer with arrow keys / WASD after selecting the board, or use the direction buttons. No reversing into your neck. Space pauses. Switching tabs pauses automatically.</p>}
      {(stopped || paused) && !claiming && <button type="button" className="text-link" onClick={reset}>{tier ? "Start over without claiming" : "New round"}</button>}
      <small>20-minute session, including pauses and follow confirmation. Keep this tab open until you have your code.</small>
    </div></div>}
    {error && <div><p className="form-error" role="alert">{error}</p>{round && !reward && <button type="button" className="text-link" disabled={busy} onClick={reset}>Start a new round</button>}</div>}
    {reward?.percent === 5 && !reward.redeemed && <button className="text-link" type="button" onClick={reset}>Try for 7% — it replaces your unused 5% code</button>}
  </div>;
}

export const GAME_SIZE = 20;
export const GAME_MAX_MOVES = 20000;
export const GAME_TARGET = 70;
export type Direction = "U" | "D" | "L" | "R";
export type SnakeState = { body: number[]; direction: Direction; food: number; random: number; score: number; over: boolean };
const offsets: Record<Direction, [number, number]> = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
const opposite: Record<Direction, Direction> = { U: "D", D: "U", L: "R", R: "L" };

function foodFor(body: number[], seed: number) {
  let random = seed >>> 0 || 1;
  random ^= random << 13; random ^= random >>> 17; random ^= random << 5;
  const occupied = new Set(body);
  const empty = Array.from({ length: GAME_SIZE * GAME_SIZE }, (_, i) => i).filter(i => !occupied.has(i));
  return { food: empty[Math.floor((random >>> 0) / 4294967296 * empty.length)], random: random >>> 0 };
}
export function startSnake(seed: number): SnakeState {
  const body = [163, 162, 161];
  return { body, direction: "R", ...foodFor(body, seed), score: 0, over: false };
}
export function canTurn(from: Direction, to: Direction) { return to !== opposite[from]; }
// Every food increases speed, including after the first reward threshold.
export function snakeDelay(score: number) { return 210 - Math.min(GAME_TARGET, Math.max(0, score)) * 2; }
export function rewardTier(score: number): 0 | 5 | 7 { return score >= 70 ? 7 : score >= 50 ? 5 : 0; }
export function stepSnake(state: SnakeState, direction: Direction): SnakeState {
  if (state.over) throw Error("The round has already ended.");
  if (!Object.hasOwn(offsets, direction) || !canTurn(state.direction, direction)) throw Error("Invalid snake turn.");
  const [dx, dy] = offsets[direction];
  const x = state.body[0] % GAME_SIZE + dx, y = Math.floor(state.body[0] / GAME_SIZE) + dy;
  const next = y * GAME_SIZE + x, eating = next === state.food;
  // The old tail vacates its cell on a non-eating move.
  const obstacle = eating ? state.body : state.body.slice(0, -1);
  if (x < 0 || x >= GAME_SIZE || y < 0 || y >= GAME_SIZE || obstacle.includes(next)) return { ...state, direction, over: true };
  const body = [next, ...state.body];
  if (!eating) body.pop();
  const score = state.score + (eating ? 1 : 0);
  return { ...state, body, direction, score, ...(eating ? foodFor(body, state.random) : {}), over: score >= GAME_TARGET };
}
// Replay server-side; neither a client score nor a claimed percentage is accepted.
export function scoreSnake(seed: number, moves: string) {
  if (!moves.length || moves.length > GAME_MAX_MOVES || /[^UDLR]/.test(moves)) throw Error("This round has an invalid move history.");
  let state = startSnake(seed);
  for (const direction of moves) state = stepSnake(state, direction as Direction);
  const percent = rewardTier(state.score);
  if (!percent) throw Error("Reach 50 points to earn a reward, or 70 for 7%.");
  return { percent, score: state.score };
}

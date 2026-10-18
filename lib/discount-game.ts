export const GAME_SIZE = 11;
export const GAME_MAX_MOVES = 600;
export type Direction = "U" | "D" | "L" | "R";
const offsets: Record<Direction, [number, number]> = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

export function circuitBoard(seed: number) {
  let state = seed >>> 0 || 1;
  const random = () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
  const cells = Array<number>(GAME_SIZE * GAME_SIZE).fill(1);
  const index = (x: number, y: number) => y * GAME_SIZE + x;
  const start = index(1, 1), finish = index(9, 9);
  cells[start] = 0;
  const stack: [number, number][] = [[1, 1]];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const choices = Object.values(offsets).filter(([dx, dy]) => {
      const nx = x + dx * 2, ny = y + dy * 2;
      return nx > 0 && ny > 0 && nx < GAME_SIZE - 1 && ny < GAME_SIZE - 1 && cells[index(nx, ny)] === 1;
    });
    if (!choices.length) { stack.pop(); continue; }
    const [dx, dy] = choices[Math.floor(random() * choices.length)];
    cells[index(x + dx, y + dy)] = 0;
    cells[index(x + dx * 2, y + dy * 2)] = 0;
    stack.push([x + dx * 2, y + dy * 2]);
  }
  const candidates = cells.map((value, i) => !value && i !== start && i !== finish && Math.floor(i / GAME_SIZE) % 2 && i % GAME_SIZE % 2 ? i : -1).filter(i => i >= 0);
  const checkpoints: number[] = [];
  while (checkpoints.length < 3) checkpoints.push(candidates.splice(Math.floor(random() * candidates.length), 1)[0]);
  function distance(from: number, to: number) {
    const queue = [from], distances = new Map([[from, 0]]);
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head];
      if (current === to) return distances.get(current)!;
      for (const direction of Object.keys(offsets) as Direction[]) {
        const next = circuitStep(cells, current, direction);
        if (next !== current && !distances.has(next)) { distances.set(next, distances.get(current)! + 1); queue.push(next); }
      }
    }
    throw Error("Circuit is not connected.");
  }
  const route = [start, ...checkpoints, finish];
  const perfectMoves = route.slice(1).reduce((sum, target, i) => sum + distance(route[i], target), 0);
  return { cells, start, finish, checkpoints, perfectMoves };
}

export function circuitStep(cells: number[], position: number, direction: Direction) {
  const [dx, dy] = offsets[direction];
  const x = position % GAME_SIZE + dx, y = Math.floor(position / GAME_SIZE) + dy;
  if (x < 0 || x >= GAME_SIZE || y < 0 || y >= GAME_SIZE) return position;
  const next = y * GAME_SIZE + x;
  return cells[next] === 0 ? next : position;
}

export function scoreCircuit(seed: number, moves: Direction[]) {
  if (!moves.length || moves.length > GAME_MAX_MOVES) throw Error("Keep the route within 600 moves.");
  const board = circuitBoard(seed);
  let position = board.start, checkpoint = 0;
  for (const move of moves) {
    if (!Object.hasOwn(offsets, move)) throw Error("Invalid move.");
    const next = circuitStep(board.cells, position, move);
    if (next === position) throw Error("The submitted route crosses a wall.");
    position = next;
    if (position === board.checkpoints[checkpoint]) checkpoint++;
  }
  if (position !== board.finish || checkpoint !== 3) throw Error("Collect nodes 1, 2 and 3 in order, then reach the exit.");
  return { percent: moves.length === board.perfectMoves ? 7 : 5, moves: moves.length, perfectMoves: board.perfectMoves };
}

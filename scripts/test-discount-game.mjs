import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, require: key => key === "server-only" ? {} : mocks[key] || require(key), Buffer, Date, Map, Set }, { filename: file });
  return loadedModule.exports;
}
const game = load("lib/discount-game.ts");
const directions = [["U", 0, -1], ["D", 0, 1], ["L", -1, 0], ["R", 1, 0]];
function route(board, from, to) {
  const queue = [from], previous = new Map([[from, null]]);
  for (let head = 0; head < queue.length && !previous.has(to); head++) {
    const current = queue[head], x = current % 11, y = Math.floor(current / 11);
    for (const [move, dx, dy] of directions) {
      const nx = x + dx, ny = y + dy, next = ny * 11 + nx;
      if (nx < 0 || nx >= 11 || ny < 0 || ny >= 11 || board.cells[next] || previous.has(next)) continue;
      previous.set(next, [current, move]); queue.push(next);
    }
  }
  assert(previous.has(to), "Every checkpoint is reachable");
  const result = [];
  for (let current = to; current !== from;) { const [parent, move] = previous.get(current); result.push(move); current = parent; }
  return result.reverse();
}
for (const seed of [0, 1, 42, 4294967295, ...Array.from({ length: 30 }, (_, i) => i * 1931)]) {
  const board = game.circuitBoard(seed);
  assert.equal(board.cells.length, 121);
  assert.equal(new Set(board.checkpoints).size, 3);
  let from = board.start;
  const perfect = [];
  for (const target of [...board.checkpoints, board.finish]) { perfect.push(...route(board, from, target)); from = target; }
  assert.equal(game.scoreCircuit(seed, perfect).percent, 7);
  const first = perfect[0], reverse = { U: "D", D: "U", L: "R", R: "L" }[first];
  assert.equal(game.scoreCircuit(seed, [first, reverse, ...perfect]).percent, 5);
  assert.throws(() => game.scoreCircuit(seed, ["U"]), /wall/);
  assert.throws(() => game.scoreCircuit(seed, []));
  assert.throws(() => game.scoreCircuit(seed, Array(601).fill("R")));
}
class HttpError extends Error { constructor(message, status) { super(message); this.status = status; } }
const secure = load("lib/discount-game-server.ts", { "./kitty-server": { HttpError, setting: () => "isolated-test-secret" } });
const challenge = secure.createGameChallenge("visitor-test");
assert.equal(secure.readGameChallenge(challenge.challenge, "visitor-test").seed, challenge.seed);
assert.throws(() => secure.readGameChallenge(challenge.challenge, "another-visitor"));
const [encoded, sig] = challenge.challenge.split(".");
assert.throws(() => secure.readGameChallenge(encoded + "." + (sig[0] === "A" ? "B" : "A") + sig.slice(1), "visitor-test"));
const code = secure.rewardCode("a".repeat(32), 7);
assert.match(code, /^KITTY-7-[A-F0-9]{16}$/);
assert.equal(secure.rewardHash(code.toLowerCase()), secure.rewardHash(code));
assert.notEqual(secure.rewardHash(code), secure.rewardHash(secure.rewardCode("a".repeat(32), 5)));
assert.throws(() => secure.rewardHash("KITTY-7-fake"));
console.log("PASS: reachable circuits, server-computed 5/7 tiers, illegal routes, move limits, signed challenge tampering, visitor binding and reward-code validation. No real rewards or payments created.");

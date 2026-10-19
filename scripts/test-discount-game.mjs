import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createHmac } from "node:crypto";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, require: key => key === "server-only" ? {} : mocks[key] || require(key), Buffer, Date, Map, Set, Request, Response }, { filename: file });
  return loadedModule.exports;
}
const game = load("lib/discount-game.ts");
// Independent Hamiltonian route provides a long, legal test round without trusting a client score.
const cycle=[];
for(let x=0;x<20;x++)cycle.push(x);
for(let y=1;y<20;y++)for(let i=0;i<19;i++)cycle.push(y*20+(y%2 ? 19-i : 1+i));
for(let y=19;y>0;y--)cycle.push(y*20);
assert.equal(new Set(cycle).size,400);
function trace(seed){
  let state=game.startSnake(seed), moves="";
  const tiers={};
  while(!state.over && moves.length<game.GAME_MAX_MOVES){
    const head=state.body[0],next=cycle[(cycle.indexOf(head)+1)%cycle.length];
    const direction=next%20>head%20 ? "R" : next%20<head%20 ? "L" : next>head ? "D" : "U";
    moves+=direction;state=game.stepSnake(state,direction);
    if([49,50,69,70].includes(state.score))tiers[state.score]??=moves;
  }
  assert.equal(state.score,70,"Legal reference path reaches the higher tier within the move cap");
  return tiers;
}
let sample;
for(const seed of [0,1,42,4294967295]){
  assert.deepEqual(game.startSnake(seed),game.startSnake(seed));
  assert(!game.startSnake(seed).body.includes(game.startSnake(seed).food));
  const tiers=trace(seed);
  assert.throws(()=>game.scoreSnake(seed,tiers[49]),/50 points/);
  assert.equal(game.scoreSnake(seed,tiers[50]).percent,5);
  assert.equal(game.scoreSnake(seed,tiers[69]).percent,5);
  assert.equal(game.scoreSnake(seed,tiers[70]).percent,7);
  assert.throws(()=>game.scoreSnake(seed,tiers[70]+"R"),/ended/);
  if(seed===42)sample=tiers;
}
for(let score=0;score<70;score++)assert(game.snakeDelay(score+1)<game.snakeDelay(score));
assert.equal(game.rewardTier(49),0);assert.equal(game.rewardTier(50),5);assert.equal(game.rewardTier(69),5);assert.equal(game.rewardTier(70),7);
assert.throws(()=>game.stepSnake(game.startSnake(42),"L"),/turn/);
assert.throws(()=>game.scoreSnake(42,"X"));assert.throws(()=>game.scoreSnake(42,""));assert.throws(()=>game.scoreSnake(42,"R".repeat(20001)));
let state=game.startSnake(42);while(!state.over)state=game.stepSnake(state,"R");assert.equal(state.score,0);
const shape={body:[21,22,42,41],direction:"L",food:100,random:42,score:2,over:false};
assert.equal(game.stepSnake(shape,"D").over,false,"Old tail cell vacates on a non-eating move");
assert.equal(game.stepSnake({...shape,body:[21,22,42,41,40]},"D").over,true,"Body collision ends the round");
// Crash after earning 50 preserves the earned score and server-calculated reward.
let after=game.startSnake(42);for(const move of sample[50])after=game.stepSnake(after,move);
let crashed=sample[50];while(!after.over){crashed+=after.direction;after=game.stepSnake(after,after.direction);}
assert.equal(game.scoreSnake(42,crashed).percent,5);

class HttpError extends Error { constructor(message, status) { super(message); this.status = status; } }
const secure = load("lib/discount-game-server.ts", { "./kitty-server": { HttpError, setting: () => "isolated-test-secret" } });
const challenge = secure.createGameChallenge("visitor-test");
assert.equal(secure.readGameChallenge(challenge.challenge, "visitor-test").seed, challenge.seed);
assert.throws(() => secure.readGameChallenge(challenge.challenge, "another-visitor"));
const [encoded, sig] = challenge.challenge.split(".");
assert.throws(() => secure.readGameChallenge(encoded + "." + (sig[0] === "A" ? "B" : "A") + sig.slice(1), "visitor-test"));
const old=Buffer.from(JSON.stringify({v:1,seed:42,nonce:"a".repeat(32),issuedAt:Date.now(),visitor:"visitor-test"})).toString("base64url");
assert.throws(()=>secure.readGameChallenge(old+"."+createHmac("sha256","isolated-test-secret").update("kitty-circuit-v1:"+old).digest("base64url"),"visitor-test"));
const code = secure.rewardCode("a".repeat(32), 7);
assert.match(code, /^KITTY-7-[A-F0-9]{16}$/);
assert.equal(secure.rewardHash(code.toLowerCase()), secure.rewardHash(code));
assert.notEqual(secure.rewardHash(code), secure.rewardHash(secure.rewardCode("a".repeat(32), 5)));
assert.throws(() => secure.rewardHash("KITTY-7-fake"));
let writes=0,lastPercent=0,botChecks=0;
const api=load("app/api/rewards/route.ts",{
 "@/lib/discount-game":game,
 "@/lib/discount-game-server":{...secure,createGameChallenge:()=>({seed:42,challenge:"fixture-round"}),readGameChallenge:token=>{if(token!=="fixture-round")throw new HttpError("Invalid round",400);return {seed:42,nonce:"a".repeat(32)};}},
 "@/lib/turnstile-server":{verifyTurnstile:async()=>{botChecks++;}},
 "@/lib/kitty-server":{
   HttpError,setting:()=>"isolated-test-secret",fingerprint:async()=>"visitor-test",readBody:request=>request.json(),
   verifyOrigin:request=>{if(request.headers.get("origin")!=="https://test.invalid")throw new HttpError("Origin",403);},
   privateJson:value=>Response.json(value),failure:error=>Response.json({error:error.message},{status:error.status||400}),
   database:()=>({rpc:async(name,args)=>{assert.equal(name,"kitty_website_claim_reward");writes++;lastPercent=args.p_value.percent;return {data:{attempt:args.p_value.attempt,percent:lastPercent,expires_at:"2026-12-01T00:00:00Z"},error:null};}})
 }
});
const post=(value,origin="https://test.invalid")=>api.POST(new Request("https://test.invalid/api/rewards",{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify(value)}));
assert.equal((await post({action:"start"})).status,200);assert.equal(botChecks,1);
const valid={action:"claim",challenge:"fixture-round",moves:sample[50],follows:{instagram:true,x:true,linkedin:true}};
for(const bad of [{...valid,follows:undefined},{...valid,follows:{...valid.follows,x:false}},{...valid,score:70},{...valid,moves:sample[49]},{...valid,challenge:"tampered"},{...valid,moves:"R".repeat(20001)}])assert.equal((await post(bad)).status,400);
assert.equal((await post(valid,"https://foreign.invalid")).status,403);assert.equal(writes,0);
assert.equal((await post(valid)).status,200);assert.equal(lastPercent,5);
assert.equal((await post({...valid,moves:sample[70]})).status,200);assert.equal(lastPercent,7);assert.equal(writes,2);
console.log("PASS: seeded Snake, food placement, 49/50/69/70 thresholds, increasing speed, reversal/wall/body/tail rules, crash reward, replay limits, signed versioned challenges, origin and required self-confirmed follows. No real rewards or payments created.");

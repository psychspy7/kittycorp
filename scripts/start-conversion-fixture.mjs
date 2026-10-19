import {readFileSync} from "node:fs";
import {spawn} from "node:child_process";
// Loopback fixture only. Deliberately clear every application config name so private .env.local cannot supply credentials.
const env={...process.env};
for(const line of readFileSync(".env.example","utf8").split(/\r?\n/)){const match=/^([A-Z0-9_]+)=/.exec(line);if(match)env[match[1]]="";}
Object.assign(env,{SUPABASE_URL:"http://127.0.0.1:3103",SUPABASE_PUBLISHABLE_KEY:"fixture-publishable-key",FEEDBACK_GATEWAY_TOKEN:"conversion-fixture-gateway",TURNSTILE_ENABLED:"false",SITE_URL:"http://127.0.0.1:3086",GOOGLE_ANALYTICS_ID:"disabled",SMTP_APP_PASSWORD:"",GMAIL_APP_PASSWORD:"",PERF_FIXTURE_PORT:"3103"});
const children=[];
function run(args){const child=spawn(process.execPath,args,{env,stdio:"inherit",windowsHide:true});children.push(child);child.on("error",()=>stop());return child;}
function stop(){for(const child of children)child.kill();}
process.on("SIGINT",()=>{stop();process.exit(0);});process.on("SIGTERM",()=>{stop();process.exit(0);});
run(["scripts/conversion-fixture.mjs"]);
run(["node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3086"]);

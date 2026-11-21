import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgeExe = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const tempDir = "C:\\Users\\HP\\AppData\\Local\\Temp\\edge_live_inspect";
const outDir = "C:\\Users\\HP\\Downloads\\inspect_screens";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Launching Edge headless to inspect https://thekittycorp.com...");
  const proc = spawn(edgeExe, [
    "--headless=new",
    `--user-data-dir=${tempDir}`,
    "--remote-debugging-port=9222",
    "--window-size=1440,1080",
    "--disable-gpu",
    "about:blank",
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch("http://localhost:9222/json");
    const targets = await listRes.json();
    const ws = new WebSocket(targets[0].webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const { resolve, reject } = callbacks.get(data.id);
        callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send("Page.enable");
    console.log("Navigating to https://thekittycorp.com...");
    await send("Page.navigate", { url: "https://thekittycorp.com" });
    await sleep(4000);

    // 1. Live Hero
    let shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(outDir, "live_01_hero.png"), Buffer.from(shot.data, "base64"));
    console.log("Captured live_01_hero.png");

    // 2. Live AgriYaan
    await send("Runtime.evaluate", {
      expression: 'document.querySelector("#agriyaan")?.scrollIntoView({ behavior: "instant", block: "center" })',
    });
    await sleep(1500);
    shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(outDir, "live_02_agriyaan.png"), Buffer.from(shot.data, "base64"));
    console.log("Captured live_02_agriyaan.png");

    // 3. Live Urjaan
    await send("Runtime.evaluate", {
      expression: 'document.querySelector("#urjaan")?.scrollIntoView({ behavior: "instant", block: "center" })',
    });
    await sleep(1500);
    shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(outDir, "live_03_urjaan.png"), Buffer.from(shot.data, "base64"));
    console.log("Captured live_03_urjaan.png");

    // 4. Live Footer
    await send("Runtime.evaluate", {
      expression: 'document.querySelector("footer")?.scrollIntoView({ behavior: "instant", block: "center" })',
    });
    await sleep(1500);
    shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(outDir, "live_06_footer.png"), Buffer.from(shot.data, "base64"));
    console.log("Captured live_06_footer.png");

    ws.close();
  } finally {
    proc.kill();
  }
}

run().catch(console.error);

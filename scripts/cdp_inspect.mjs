import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgeExe = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const tempDir = "C:\\Users\\HP\\AppData\\Local\\Temp\\edge_cdp_inspect";
const outDir = "C:\\Users\\HP\\Downloads\\inspect_screens";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Launching Edge headless with debugging port 9222...");
  const proc = spawn(edgeExe, [
    "--headless=new",
    `--user-data-dir=${tempDir}`,
    "--remote-debugging-port=9222",
    "--window-size=1440,1080",
    "--disable-gpu",
    "about:blank",
  ]);

  proc.on("error", (err) => console.error("Proc error:", err));

  await sleep(1500);

  try {
    const listRes = await fetch("http://localhost:9222/json");
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === "page") || targets[0];
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error("No page target found");
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

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
    await send("DOM.enable");
    await send("Runtime.enable");

    console.log("Navigating to http://localhost:3000...");
    await send("Page.navigate", { url: "http://localhost:3000" });
    await sleep(2500);

    const sections = [
      { name: "01_home_hero", selector: "h1" },
      { name: "02_home_agriyaan", selector: "#agriyaan" },
      { name: "03_home_urjaan", selector: "#urjaan" },
      { name: "04_home_platforms", selector: "#platforms" },
      { name: "05_home_horizon_ocean", selector: "#horizon" },
      { name: "05b_home_horizon_space", selector: "h2:has-text('planetary')" },
      { name: "06_home_footer", selector: "footer" },
    ];

    for (const sec of sections) {
      console.log(`Scrolling to ${sec.name}...`);
      await send("Runtime.evaluate", {
        expression: `
          (function() {
            var el = null;
            if ("${sec.selector}".includes("has-text")) {
              var allH2 = Array.from(document.querySelectorAll("h2, h3"));
              el = allH2.find(h => h.textContent.toLowerCase().includes("planetary"));
            } else {
              el = document.querySelector("${sec.selector}");
            }
            if (el) {
              el.scrollIntoView({ behavior: 'instant', block: 'center' });
            }
          })()
        `,
      });
      await sleep(1000);

      const shot = await send("Page.captureScreenshot", { format: "png" });
      const buf = Buffer.from(shot.data, "base64");
      const outPath = path.join(outDir, `${sec.name}.png`);
      fs.writeFileSync(outPath, buf);
      console.log(`Captured ${outPath} (${buf.length} bytes)`);
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

run().catch((err) => console.error("CDP run error:", err));

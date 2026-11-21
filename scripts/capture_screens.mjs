import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const edgeExe = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const tempDir = "C:\\Users\\HP\\AppData\\Local\\Temp\\edge_headless_screens";
const outDir = "C:\\Users\\HP\\Downloads\\inspect_screens";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function capture(url, outFile, width = 1440, height = 3000) {
  const fullOut = path.join(outDir, outFile);
  if (fs.existsSync(fullOut)) {
    fs.unlinkSync(fullOut);
  }
  const cmd = `"${edgeExe}" --headless=new --user-data-dir="${tempDir}" --disable-gpu --window-size=${width},${height} --screenshot="${fullOut}" "${url}"`;
  console.log(`Capturing ${outFile} (${width}x${height})...`);
  try {
    execSync(cmd, { stdio: "ignore", timeout: 15000 });
  } catch (err) {
    // Edge may exit 0 or emit warning
  }
  if (fs.existsSync(fullOut)) {
    console.log(`Saved: ${fullOut} (${fs.statSync(fullOut).size} bytes)`);
  } else {
    console.error(`Failed to capture: ${fullOut}`);
  }
}

// 1. Homepage upper/middle (Hero + AgriYaan + Urjaan)
capture("http://localhost:3000/#agriyaan", "home_agriyaan_desktop.png", 1440, 2600);

// 2. Homepage middle/lower (Urjaan + Core Platforms KITTY AI/Buddy + Horizon)
capture("http://localhost:3000/#urjaan", "home_urjaan_desktop.png", 1440, 2600);

// 3. Homepage Horizon & Footer
capture("http://localhost:3000/#horizon", "home_horizon_footer_desktop.png", 1440, 2600);

// 4. AgriYaan Dedicated Page
capture("http://localhost:3000/agriyaan", "page_agriyaan_desktop.png", 1440, 2400);

// 5. Urjaan Dedicated Page
capture("http://localhost:3000/urjaan", "page_urjaan_desktop.png", 1440, 2400);

// 6. Mobile Homepage
capture("http://localhost:3000", "home_mobile.png", 390, 4000);

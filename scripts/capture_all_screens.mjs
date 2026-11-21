import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = "C:\\Users\\HP\\Downloads\\Project (Kitty-Corp)\\KITTY CORP STARTUP WEBSITE\\test-screenshots";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targets = [
  // 1440px Desktop
  { name: "home_desktop_1440", url: "http://localhost:3000/", size: "1440,1080" },
  { name: "buddy_desktop_1440", url: "http://localhost:3000/buddy", size: "1440,1080" },
  { name: "agriyaan_desktop_1440", url: "http://localhost:3000/agriyaan", size: "1440,1080" },
  { name: "urjaan_desktop_1440", url: "http://localhost:3000/urjaan", size: "1440,1080" },
  { name: "projects_desktop_1440", url: "http://localhost:3000/projects", size: "1440,1080" },
  { name: "research_desktop_1440", url: "http://localhost:3000/research", size: "1440,1080" },
  { name: "company_desktop_1440", url: "http://localhost:3000/company", size: "1440,1080" },
  { name: "memberships_desktop_1440", url: "http://localhost:3000/memberships", size: "1440,1080" },
  { name: "privacy_desktop_1440", url: "http://localhost:3000/privacy", size: "1440,1080" },

  // Tablet 768px
  { name: "home_tablet_768", url: "http://localhost:3000/", size: "768,1024" },
  { name: "buddy_tablet_768", url: "http://localhost:3000/buddy", size: "768,1024" },

  // Mobile 375px
  { name: "home_mobile_375", url: "http://localhost:3000/", size: "375,812" },
  { name: "buddy_mobile_375", url: "http://localhost:3000/buddy", size: "375,812" },
  { name: "agriyaan_mobile_375", url: "http://localhost:3000/agriyaan", size: "375,812" },
  { name: "urjaan_mobile_375", url: "http://localhost:3000/urjaan", size: "375,812" },

  // Mobile 390px
  { name: "home_mobile_390", url: "http://localhost:3000/", size: "390,844" },
  { name: "projects_mobile_390", url: "http://localhost:3000/projects", size: "390,844" },
  { name: "research_mobile_390", url: "http://localhost:3000/research", size: "390,844" },

  // Mobile 430px
  { name: "home_mobile_430", url: "http://localhost:3000/", size: "430,932" },
];

async function capture() {
  console.log(`Starting captures to ${outDir}...`);
  for (const t of targets) {
    const outFile = path.join(outDir, `${t.name}.png`);
    const cmd = `"${chrome}" --headless=new --disable-gpu --window-size=${t.size} --screenshot="${outFile}" "${t.url}"`;
    try {
      execSync(cmd, { stdio: "ignore", timeout: 20000 });
      console.log(`Captured: ${t.name} (${t.size})`);
    } catch (err) {
      console.error(`Failed to capture ${t.name}:`, err.message);
    }
  }
  console.log("All captures completed successfully.");
}

capture();

import { execSync } from "child_process";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const pages = [
  { name: "home_desktop", url: "http://localhost:3000", size: "1280,900" },
  { name: "home_mobile", url: "http://localhost:3000", size: "390,844" },
  { name: "agriyaan_desktop", url: "http://localhost:3000/agriyaan", size: "1280,900" },
  { name: "agriyaan_mobile", url: "http://localhost:3000/agriyaan", size: "390,844" },
  { name: "urjaan_desktop", url: "http://localhost:3000/urjaan", size: "1280,900" },
  { name: "urjaan_mobile", url: "http://localhost:3000/urjaan", size: "390,844" },
  { name: "memberships_desktop", url: "http://localhost:3000/memberships", size: "1280,900" },
  { name: "memberships_mobile", url: "http://localhost:3000/memberships", size: "390,844" },
  { name: "support_desktop", url: "http://localhost:3000/support", size: "1280,900" },
  { name: "support_mobile", url: "http://localhost:3000/support", size: "390,844" },
  { name: "contact_desktop", url: "http://localhost:3000/contact", size: "1280,900" },
  { name: "contact_mobile", url: "http://localhost:3000/contact", size: "390,844" },
];

for (const p of pages) {
  const out = `C:\\Users\\HP\\Downloads\\screenshot_${p.name}.png`;
  const cmd = `"${chrome}" --headless=new --disable-gpu --window-size=${p.size} --screenshot="${out}" "${p.url}"`;
  console.log(`Capturing ${p.name}...`);
  try {
    execSync(cmd, { stdio: "ignore", timeout: 15000 });
  } catch (err) {
    console.error(`Error capturing ${p.name}:`, err.message);
  }
}

console.log("Screenshot run complete.");

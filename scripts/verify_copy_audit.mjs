import fs from "fs";
import path from "path";

const prohibitedPhrases = [
  "bounded by glass displays",
  "synthetic software gimmicks",
  "explored honestly",
  "strict scientific honesty",
  "Honest Physical Delivery Disclosure",
  "sovereign control",
  "delve",
  "unleash",
  "transformative paradigm",
  "elite commercial studio",
];

const prohibitedPatterns = [
  /\b0[1-9]\s*[·•—–-]\s*[A-Z]/,
  /FLAGSHIP INITIATIVE\s*0[1-9]/i,
  /ARCHITECTURAL SYSTEM\s*[·•]\s*BOM1/i,
  /EMERGING TECHNOLOGY\s*[·•]\s*INDIA/i,
];

const publicDirs = ["app", "components/kitty"];

let errors = [];

function checkFile(filePath) {
  // Exclude admin-only studio panels or third-party libraries if any
  if (filePath.includes("admin-") || filePath.includes("studio-")) return;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    // Check for dashes in public copy (excluding node imports or comments)
    if (
      /[\u2014\u2013]/.test(line) &&
      !line.trim().startsWith("//") &&
      !line.trim().startsWith("/*") &&
      !line.trim().startsWith("*")
    ) {
      errors.push(`[DASH] ${filePath}:${idx + 1} -> ${line.trim()}`);
    }

    // Check prohibited phrases
    for (const p of prohibitedPhrases) {
      if (line.toLowerCase().includes(p.toLowerCase())) {
        errors.push(`[PROHIBITED_PHRASE: "${p}"] ${filePath}:${idx + 1} -> ${line.trim()}`);
      }
    }

    // Check prohibited numbered/decorative patterns
    for (const pat of prohibitedPatterns) {
      if (
        pat.test(line) &&
        !line.trim().startsWith("//") &&
        !line.trim().startsWith("/*")
      ) {
        errors.push(`[PROHIBITED_PATTERN: ${pat}] ${filePath}:${idx + 1} -> ${line.trim()}`);
      }
    }
  });
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git", "dist"].includes(entry.name)) continue;
      walk(full);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      checkFile(full);
    }
  }
}

for (const d of publicDirs) {
  if (fs.existsSync(d)) walk(d);
}

console.log(`Scan completed. Found ${errors.length} issues.`);
if (errors.length > 0) {
  console.log("Issues details:");
  errors.slice(0, 30).forEach((e) => console.log(e));
} else {
  console.log("PASSED: Zero dashes, zero prohibited phrases, zero forbidden numbered patterns!");
}

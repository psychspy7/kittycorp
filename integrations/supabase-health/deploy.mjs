import { mkdtemp, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!key || !/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key) || process.env.SUPABASE_URL !== "https://mgkghnblbisubympudaa.supabase.co") {
  throw Error("Load the existing website's publishable-key configuration privately before deploying.");
}
const folder = await mkdtemp(join(tmpdir(), "kitty-corp-health-"));
const secrets = join(folder, "secrets.json");
try {
  await writeFile(secrets, JSON.stringify({ SUPABASE_PUBLISHABLE_KEY: key }), { mode: 0o600 });
  const result = spawnSync(process.execPath, [join(root, "node_modules/wrangler/bin/wrangler.js"), "deploy", "--config", join(root, "integrations/supabase-health/wrangler.jsonc"), "--secrets-file", secrets], { cwd: join(root, "integrations/supabase-health"), stdio: "inherit" });
  if (result.error || result.status !== 0) process.exitCode = result.status || 1;
} finally {
  await unlink(secrets); await rmdir(folder);
}

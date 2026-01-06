import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function stripQuotes(v) {
  const s = v.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function loadEnvFile(envFilePath) {
  const abs = resolve(process.cwd(), envFilePath);
  const raw = readFileSync(abs, "utf8");
  const out = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = stripQuotes(trimmed.slice(eq + 1));
    if (key) out[key] = value;
  }

  return out;
}

function platformCmd(cmd) {
  if (process.platform === "win32") {
    if (cmd === "npm") return "npm.cmd";
    if (cmd === "npx") return "npx.cmd";
  }
  return cmd;
}

// Usage:
//   node scripts/with-env.mjs <envFile> -- <command> [...args]
const argv = process.argv.slice(2);
const sep = argv.indexOf("--");
if (sep === -1 || sep === 0 || sep === argv.length - 1) {
  console.error(
    "Usage: node scripts/with-env.mjs <envFile> -- <command> [...args]"
  );
  process.exit(2);
}

const envFile = argv[0];
const cmd = argv[sep + 1];
const cmdArgs = argv.slice(sep + 2);

let loaded = {};
try {
  loaded = loadEnvFile(envFile);
} catch (e) {
  console.error(`[with-env] Failed to read env file: ${envFile}`);
  console.error(e?.message ?? e);
  process.exit(2);
}

const child = spawn(platformCmd(cmd), cmdArgs, {
  stdio: "inherit",
  env: { ...process.env, ...loaded },
});

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});


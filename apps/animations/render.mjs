import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(appDir, "../..");
const defaultOutputDir = path.join(repoDir, "apps/blog/public/r2/animations");
const requireFromBlog = createRequire(
  path.join(repoDir, "apps/blog/package.json"),
);
const compositions = {
  JevGithubWorkflow: "jev-github-workflow",
  CheckRefsWorkflow: "check-refs-workflow",
};

const options = {};
for (const arg of process.argv.slice(2)) {
  const match = arg.match(/^--([^=]+)(?:=(.*))?$/);
  if (!match) {
    throw new Error(`Unknown argument: ${arg}`);
  }
  options[match[1]] = match[2] ?? "true";
}

const allowedOptions = new Set(["only", "format", "out"]);
for (const option of Object.keys(options)) {
  if (!allowedOptions.has(option)) {
    throw new Error(`Unknown option: --${option}`);
  }
}

const format = options.format ?? "gif";
if (!["gif", "mp4"].includes(format)) {
  throw new Error("--format must be gif or mp4");
}

const selected = options.only
  ? options.only.split(",").map((id) => id.trim())
  : Object.keys(compositions);
const unknown = selected.filter((id) => !Object.hasOwn(compositions, id));
if (unknown.length > 0) {
  throw new Error(
    `Unknown composition(s): ${unknown.join(", ")}. Available: ${Object.keys(compositions).join(", ")}`,
  );
}
if (selected.length === 0) {
  throw new Error("Select at least one composition with --only");
}

const outputDir = path.resolve(appDir, options.out ?? defaultOutputDir);
mkdirSync(outputDir, { recursive: true });
const browserExecutable =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
  process.env.PLAYWRIGHT_MCP_EXECUTABLE ??
  requireFromBlog("@playwright/test").chromium.executablePath();
if (!existsSync(browserExecutable)) {
  throw new Error(
    `Playwright Chromium was not found at ${browserExecutable}. Install it with: pnpm --filter blog exec playwright install chromium`,
  );
}

for (const id of selected) {
  const outputPath = path.join(outputDir, `${compositions[id]}.${format}`);
  const args = [
    path.join(appDir, "node_modules/@remotion/cli/remotion-cli.js"),
    "render",
    "src/index.ts",
    id,
    outputPath,
    `--codec=${format === "gif" ? "gif" : "h264"}`,
    "--chrome-mode=chrome-for-testing",
    `--browser-executable=${browserExecutable}`,
  ];
  console.log(`Rendering ${id} → ${outputPath}`);
  const result = spawnSync(process.execPath, args, {
    cwd: appDir,
    stdio: "inherit",
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

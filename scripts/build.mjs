import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");

async function clean(target) {
  await fs.rm(target, { recursive: true, force: true });
}

// One app, one docs tree. `nest-static-export.mjs` moves the export under the
// deployed /docs/synth base path.
await clean(".next");
await clean(outDir);
execSync("next build", { stdio: "inherit" });
execSync("node scripts/nest-static-export.mjs", { stdio: "inherit" });

console.log("Built docs (out/docs/synth)");

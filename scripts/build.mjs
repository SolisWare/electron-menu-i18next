/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const watch = process.argv.includes("--watch");
const compilerPath = new URL("../node_modules/typescript/bin/tsc", import.meta.url);
const configurations = ["tsconfig.build.esm.json", "tsconfig.build.cjs.json"];

await rm(new URL("../dist", import.meta.url), { recursive: true, force: true });
await mkdir(new URL("../dist/cjs", import.meta.url), { recursive: true });
await writeFile(
  new URL("../dist/cjs/package.json", import.meta.url),
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
);

const compilers = configurations.map((configuration) => {
  const arguments_ = [fileURLToPath(compilerPath), "--project", configuration];

  if (watch) {
    arguments_.push("--watch", "--preserveWatchOutput");
  }

  return spawn(process.execPath, arguments_, { stdio: "inherit" });
});

const exitCodes = await Promise.all(
  compilers.map(
    (compiler) =>
      new Promise((resolve, reject) => {
        compiler.on("error", reject);
        compiler.on("exit", (code) => resolve(code ?? 1));
      }),
  ),
);

if (exitCodes.some((exitCode) => exitCode !== 0)) {
  process.exitCode = 1;
}

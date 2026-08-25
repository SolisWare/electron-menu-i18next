/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
const { readdirSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const { resolve } = require("node:path");

const sourceDirectory = resolve("src/javascript");
const sourceFiles = readdirSync(sourceDirectory)
  .filter((fileName) => fileName.endsWith(".cjs"))
  .sort();

for (const sourceFile of sourceFiles) {
  const result = spawnSync(
    process.execPath,
    ["--check", resolve(sourceDirectory, sourceFile)],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    break;
  }
}

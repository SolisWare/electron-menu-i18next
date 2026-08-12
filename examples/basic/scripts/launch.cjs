/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
const minimumNodeVersion = [22, 12, 0];
const currentNodeVersion = process.versions.node.split(".").map(Number);

for (let index = 0; index < minimumNodeVersion.length; index += 1) {
  if (currentNodeVersion[index] > minimumNodeVersion[index]) {
    break;
  }

  if (currentNodeVersion[index] < minimumNodeVersion[index]) {
    console.error(
      `The Electron example requires Node.js 22.12.0 or newer; current version: ${process.versions.node}.`,
    );
    console.error("Switch Node.js versions, delete node_modules, and run npm ci.");
    process.exit(1);
  }
}

const { spawn } = require("node:child_process");
const electronPath = require("electron");

const variant = process.argv[2] ?? "typescript";
const entryPoints = {
  javascript: "src/javascript/main.js",
  typescript: "dist/typescript/main.js",
};
const entryPoint = entryPoints[variant];

if (!entryPoint) {
  throw new Error(`Unknown example variant: ${variant}`);
}

// Some editor terminals export ELECTRON_RUN_AS_NODE for their own Electron
// tooling. Passing it to the child would run this application as plain Node.js
// instead of starting the Electron runtime.
const childEnvironment = { ...process.env };
delete childEnvironment.ELECTRON_RUN_AS_NODE;

const child = spawn(electronPath, [entryPoint], {
  env: childEnvironment,
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error("Failed to start Electron:", error);
  process.exitCode = 1;
});

child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});

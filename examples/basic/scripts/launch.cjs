/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
const { spawn } = require("node:child_process");
const electronPath = require("electron");

// Some editor terminals export ELECTRON_RUN_AS_NODE for their own Electron
// tooling. Passing it to the child would run this application as plain Node.js
// instead of starting the Electron runtime.
const childEnvironment = { ...process.env };
delete childEnvironment.ELECTRON_RUN_AS_NODE;

const child = spawn(electronPath, ["dist/main.js"], {
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

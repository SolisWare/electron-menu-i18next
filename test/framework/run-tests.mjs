/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import { readdir } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

import { run, setTestContext } from "./test-framework.mjs";

const testDirectoryArgument = process.argv[2];

if (!testDirectoryArgument) {
  throw new Error("A test directory is required");
}

const testDirectory = resolve(testDirectoryArgument);
const testFiles = await findTestFiles(testDirectory);

for (const testFile of testFiles) {
  const context = relative(testDirectory, testFile)
    .replaceAll(sep, " / ")
    .replace(/\.test\.mjs$/, "");

  setTestContext(context);
  await import(pathToFileURL(testFile));
}

await run();

async function findTestFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findTestFiles(entryPath)));
    } else if (entry.name.endsWith(".test.mjs")) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

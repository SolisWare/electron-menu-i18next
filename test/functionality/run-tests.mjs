/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import { readdir } from "node:fs/promises";

const testDirectory = new URL("./", import.meta.url);
const testFiles = (await readdir(testDirectory))
  .filter((fileName) => fileName.endsWith(".test.mjs"))
  .sort();

for (const testFile of testFiles) {
  await import(new URL(testFile, testDirectory));
}

/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import { readdir } from "node:fs/promises";

const fixturesDirectory = new URL("./", import.meta.url);
const fixtureDirectories = (await readdir(fixturesDirectory, {
  withFileTypes: true,
}))
  .filter(
    (entry) =>
      entry.isDirectory() &&
      entry.name.startsWith("javascript-") &&
      entry.name.endsWith("-consumer"),
  )
  .sort((left, right) => left.name.localeCompare(right.name));

for (const fixtureDirectory of fixtureDirectories) {
  const fixtureUrl = new URL(`${fixtureDirectory.name}/`, fixturesDirectory);
  const files = await readdir(fixtureUrl);
  const entryFile = files.find((fileName) => /^index\.(cjs|mjs)$/.test(fileName));

  if (!entryFile) {
    throw new Error(`No JavaScript entry file found in ${fixtureDirectory.name}`);
  }

  await import(new URL(entryFile, fixtureUrl));
  console.log(`pass: ${fixtureDirectory.name}`);
}

/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
const tests = [];
let testContext = "";

export function setTestContext(context) {
  testContext = context;
}

export function test(name, callback) {
  tests.push({
    name: testContext ? `${testContext} > ${name}` : name,
    callback,
  });
}

export async function run() {
  const failures = [];

  for (const test of tests) {
    try {
      await test.callback();
      console.log(`pass: ${test.name}`);
    } catch (error) {
      failures.push({ name: test.name, error });
      console.error(`fail: ${test.name}`);
      console.error(error);
    }
  }

  if (failures.length > 0) {
    throw new Error(`${failures.length} test(s) failed`);
  }
}

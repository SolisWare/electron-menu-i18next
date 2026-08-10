/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
function test(name, callback) {
  try {
    callback();
    console.log(`pass: ${name}`);
  } catch (error) {
    console.error(`fail: ${name}`);
    throw error;
  }
}

module.exports = { test };

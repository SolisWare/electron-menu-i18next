/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
const assert = require("node:assert/strict");

const packageExports = require("electron-menu-i18next");
const { test } = require("../test-utils.cjs");

test("requires the package through CommonJS", () => {
  assert.equal(typeof packageExports, "object");
});

test("exposes the public API through CommonJS", () => {
  assert.equal(typeof packageExports.localizeMenuTemplate, "function");
  assert.equal(typeof packageExports.getRoleLabel, "function");
  assert.equal(typeof packageExports.DEFAULT_ROLE_LABELS, "object");
});

/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

import { test } from "../framework/test-framework.mjs";

const require = createRequire(import.meta.url);
const packageExports = require("electron-menu-i18next");

test("requires the package", () => {
  assert.equal(typeof packageExports, "object");
});

test("exposes the public API", () => {
  assert.equal(typeof packageExports.localizeMenuTemplate, "function");
  assert.equal(typeof packageExports.getRoleLabel, "function");
  assert.equal(typeof packageExports.DEFAULT_ROLE_LABELS, "object");
});

/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import * as packageExports from "electron-menu-i18next";
import { test } from "../framework/test-framework.mjs";

test("imports the package", () => {
  assert.equal(typeof packageExports, "object");
});

test("exposes the public API", () => {
  assert.equal(typeof packageExports.localizeMenuTemplate, "function");
  assert.equal(typeof packageExports.getRoleLabel, "function");
  assert.equal(typeof packageExports.DEFAULT_ROLE_LABELS, "object");
});

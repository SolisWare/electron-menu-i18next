/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import * as packageExports from "electron-menu-i18next";
import testUtilities from "../test-utils.cjs";

const { test } = testUtilities;

test("imports the package through ECMAScript modules", () => {
  assert.equal(typeof packageExports, "object");
});

test("exposes the public API through ECMAScript modules", () => {
  assert.equal(typeof packageExports.localizeMenuTemplate, "function");
  assert.equal(typeof packageExports.getRoleLabel, "function");
  assert.equal(typeof packageExports.DEFAULT_ROLE_LABELS, "object");
});

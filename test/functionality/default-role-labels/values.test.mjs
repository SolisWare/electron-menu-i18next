/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { DEFAULT_ROLE_LABELS } from "electron-menu-i18next";
import { test } from "../../framework/test-framework.mjs";

test("provides a non-empty string for every role", () => {
  for (const [role, label] of Object.entries(DEFAULT_ROLE_LABELS)) {
    assert.equal(typeof label, "string", `${role} must have a string label`);
    assert.notEqual(label.length, 0, `${role} must not have an empty label`);
  }
});

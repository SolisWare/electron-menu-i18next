/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { getRoleLabel } from "electron-menu-i18next";
import { test } from "../../framework/test-framework.mjs";
import { createTranslator } from "../../utils/translator.mjs";

test("returns a built-in English fallback", () => {
  const label = getRoleLabel("copy", { t: createTranslator() });

  assert.equal(label, "Copy");
});

test("returns a custom fallback override", () => {
  const label = getRoleLabel("copy", {
    t: createTranslator(),
    fallbackLabels: { copy: "Duplicate" },
  });

  assert.equal(label, "Duplicate");
});

test("prefers a translation over a custom fallback override", () => {
  const label = getRoleLabel("copy", {
    t: createTranslator({ "menu.roles.copy": "Kopiuj" }),
    fallbackLabels: { copy: "Duplicate" },
  });

  assert.equal(label, "Kopiuj");
});

test("returns an unknown role when no translation or fallback exists", () => {
  const label = getRoleLabel("customRole", { t: createTranslator() });

  assert.equal(label, "customRole");
});

test("translates an unknown role", () => {
  const label = getRoleLabel("customRole", {
    t: createTranslator({ "menu.roles.customRole": "Custom action" }),
  });

  assert.equal(label, "Custom action");
});

/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { getRoleLabel } from "electron-menu-i18next";
import { test } from "../../framework/test-framework.mjs";
import { createTranslator } from "../../utils/translator.mjs";

test("returns a translated role label", () => {
  const label = getRoleLabel("copy", {
    t: createTranslator({ "menu.roles.copy": "Kopiuj" }),
  });

  assert.equal(label, "Kopiuj");
});

test("uses a custom key prefix", () => {
  const label = getRoleLabel("copy", {
    t: createTranslator({ "nativeMenu.copy": "Kopiuj" }),
    keyPrefix: "nativeMenu",
  });

  assert.equal(label, "Kopiuj");
});

test("passes the expected key and fallback to the translator", () => {
  const calls = [];
  const t = (key, options) => {
    calls.push({ key, options });
    return options.defaultValue;
  };

  getRoleLabel("copy", { t });

  assert.deepEqual(calls, [
    {
      key: "menu.roles.copy",
      options: { defaultValue: "Copy", appName: "" },
    },
  ]);
});

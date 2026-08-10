/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { localizeMenuTemplate } from "electron-menu-i18next";
import { test } from "../../framework/test-framework.mjs";
import { createTranslator } from "../../utils/translator.mjs";

test("localizes an item with a missing label", () => {
  const template = [{ role: "copy" }];
  const t = createTranslator({ "menu.roles.copy": "Kopiuj" });

  const localizedTemplate = localizeMenuTemplate(template, { t });

  assert.equal(localizedTemplate[0].label, "Kopiuj");
});

test("localizes an item with an undefined label", () => {
  const template = [{ role: "copy", label: undefined }];
  const t = createTranslator({ "menu.roles.copy": "Kopiuj" });

  const localizedTemplate = localizeMenuTemplate(template, { t });

  assert.equal(localizedTemplate[0].label, "Kopiuj");
});

test("uses a custom key prefix", () => {
  const template = [{ role: "copy" }];
  const t = createTranslator({ "nativeMenu.copy": "Kopiuj" });

  const localizedTemplate = localizeMenuTemplate(template, {
    t,
    keyPrefix: "nativeMenu",
  });

  assert.equal(localizedTemplate[0].label, "Kopiuj");
});

test("passes the expected key and interpolation options to the translator", () => {
  const calls = [];
  const t = (key, options) => {
    calls.push({ key, options });
    return options.defaultValue;
  };

  localizeMenuTemplate([{ role: "quit" }], {
    t,
    appName: "Notes",
  });

  assert.deepEqual(calls, [
    {
      key: "menu.roles.quit",
      options: {
        defaultValue: "Quit {{appName}}",
        appName: "Notes",
      },
    },
  ]);
});

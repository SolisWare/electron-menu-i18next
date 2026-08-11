/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { localizeMenuTemplate } from "electron-menu-i18next";
import { test } from "../../framework/test-framework.mjs";
import { createTranslator } from "../../utils/translator.mjs";

test("returns a new top-level array and new menu-item objects", () => {
  const template = [{ role: "copy" }];

  const localizedTemplate = localizeMenuTemplate(template, {
    t: createTranslator(),
  });

  assert.notEqual(localizedTemplate, template);
  assert.notEqual(localizedTemplate[0], template[0]);
});

test("returns new nested submenu arrays and menu-item objects", () => {
  const template = [{ submenu: [{ role: "copy" }] }];

  const localizedTemplate = localizeMenuTemplate(template, {
    t: createTranslator(),
  });

  assert.notEqual(localizedTemplate[0].submenu, template[0].submenu);
  assert.notEqual(localizedTemplate[0].submenu[0], template[0].submenu[0]);
});

test("leaves the original template unchanged", () => {
  const template = [{ submenu: [{ role: "copy" }] }];
  const originalSnapshot = JSON.parse(JSON.stringify(template));

  localizeMenuTemplate(template, { t: createTranslator() });

  assert.deepEqual(template, originalSnapshot);
});

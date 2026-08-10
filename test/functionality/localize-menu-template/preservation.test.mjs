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

test("preserves an explicitly empty label", () => {
  const localizedTemplate = localizeMenuTemplate(
    [{ role: "copy", label: "" }],
    { t: createTranslator({ "menu.roles.copy": "Kopiuj" }) },
  );

  assert.equal(localizedTemplate[0].label, "");
});

test("preserves a custom explicit label", () => {
  const localizedTemplate = localizeMenuTemplate(
    [{ role: "copy", label: "Duplicate" }],
    { t: createTranslator({ "menu.roles.copy": "Kopiuj" }) },
  );

  assert.equal(localizedTemplate[0].label, "Duplicate");
});

test("does not call the translator for an explicitly labeled item", () => {
  let callCount = 0;
  const t = () => {
    callCount += 1;
    return "Unexpected";
  };

  localizeMenuTemplate([{ role: "copy", label: "Duplicate" }], { t });

  assert.equal(callCount, 0);
});

test("preserves items without roles", () => {
  const click = () => {};
  const template = [{ label: "Preferences", enabled: false, click }];

  const localizedTemplate = localizeMenuTemplate(template, {
    t: createTranslator(),
  });

  assert.deepEqual(localizedTemplate[0], template[0]);
  assert.equal(localizedTemplate[0].click, click);
});

test("preserves a non-array submenu", () => {
  const submenu = { kind: "ElectronMenu" };
  const template = [{ label: "Window", submenu }];

  const localizedTemplate = localizeMenuTemplate(template, {
    t: createTranslator(),
  });

  assert.equal(localizedTemplate[0].submenu, submenu);
});

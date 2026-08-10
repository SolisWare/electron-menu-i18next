/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { localizeMenuTemplate } from "electron-menu-i18next";
import testUtilities from "../test-utils.cjs";

const { test } = testUtilities;

const polishTranslations = {
  "menu.roles.copy": "Kopiuj",
};

const polishT = (key, options) => polishTranslations[key] ?? options.defaultValue;
const untranslatedT = (_key, options) => options.defaultValue;

test("localizes an item with a missing label using the selected language", () => {
  const template = [{ role: "copy" }];

  const localizedTemplate = localizeMenuTemplate(template, { t: polishT });

  assert.equal(localizedTemplate[0].label, "Kopiuj");
});

test("localizes an item with an undefined label using the selected language", () => {
  const template = [{ role: "copy", label: undefined }];

  const localizedTemplate = localizeMenuTemplate(template, { t: polishT });

  assert.equal(localizedTemplate[0].label, "Kopiuj");
});

test("preserves an explicitly empty label", () => {
  const template = [{ role: "copy", label: "" }];

  const localizedTemplate = localizeMenuTemplate(template, { t: polishT });

  assert.equal(localizedTemplate[0].label, "");
});

test("uses the English fallback when the selected language has no translation", () => {
  const template = [{ role: "copy" }];

  const localizedTemplate = localizeMenuTemplate(template, {
    t: untranslatedT,
  });

  assert.equal(localizedTemplate[0].label, "Copy");
});

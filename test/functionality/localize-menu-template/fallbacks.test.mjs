/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { localizeMenuTemplate } from "@solisware/electron-menu-i18next";
import { test } from "../../framework/test-framework.mjs";
import { createTranslator } from "../../utils/translator.mjs";

test("uses the built-in English label when a translation is missing", () => {
  const localizedTemplate = localizeMenuTemplate([{ role: "copy" }], {
    t: createTranslator(),
  });

  assert.equal(localizedTemplate[0].label, "Copy");
});

test("uses a custom fallback label when a translation is missing", () => {
  const localizedTemplate = localizeMenuTemplate([{ role: "copy" }], {
    t: createTranslator(),
    fallbackLabels: { copy: "Duplicate" },
  });

  assert.equal(localizedTemplate[0].label, "Duplicate");
});

test("prefers a translation over a custom fallback label", () => {
  const localizedTemplate = localizeMenuTemplate([{ role: "copy" }], {
    t: createTranslator({ "menu.roles.copy": "Kopiuj" }),
    fallbackLabels: { copy: "Duplicate" },
  });

  assert.equal(localizedTemplate[0].label, "Kopiuj");
});

test("uses the role string when an unknown role has no translation", () => {
  const localizedTemplate = localizeMenuTemplate([{ role: "customRole" }], {
    t: createTranslator(),
  });

  assert.equal(localizedTemplate[0].label, "customRole");
});

test("localizes an unknown role when a translation exists", () => {
  const localizedTemplate = localizeMenuTemplate([{ role: "customRole" }], {
    t: createTranslator({ "menu.roles.customRole": "Custom action" }),
  });

  assert.equal(localizedTemplate[0].label, "Custom action");
});

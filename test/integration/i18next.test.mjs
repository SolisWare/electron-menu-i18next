/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import assert from "node:assert/strict";

import i18next from "i18next";

import {
  getRoleLabel,
  localizeMenuTemplate,
} from "@solisware/electron-menu-i18next";
import { test } from "../framework/test-framework.mjs";

async function createPolishTranslator() {
  const instance = i18next.createInstance();
  await instance.init({
    lng: "pl",
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          menu: { roles: { copy: "Copy translated in English" } },
        },
      },
      pl: {
        translation: {
          menu: {
            roles: {
              paste: "Wklej",
              quit: "Zakończ {{appName}}",
            },
          },
        },
      },
    },
  });

  return instance.getFixedT("pl");
}

test("resolves translations and language fallbacks with getRoleLabel", async () => {
  const t = await createPolishTranslator();

  assert.equal(getRoleLabel("quit", { t, appName: "Notes" }), "Zakończ Notes");
  assert.equal(getRoleLabel("copy", { t }), "Copy translated in English");
  assert.equal(getRoleLabel("undo", { t }), "Undo");
});

test("localizes a nested menu template with a real translator", async () => {
  const t = await createPolishTranslator();
  const template = [
    {
      label: "Edit",
      submenu: [{ role: "copy" }, { role: "paste" }],
    },
  ];

  const localizedTemplate = localizeMenuTemplate(template, { t });

  assert.equal(localizedTemplate[0].submenu[0].label, "Copy translated in English");
  assert.equal(localizedTemplate[0].submenu[1].label, "Wklej");
});

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

test("localizes roles at every nested submenu level", () => {
  const template = [
    {
      label: "Edit",
      submenu: [
        { role: "copy" },
        {
          label: "More",
          submenu: [{ role: "paste" }],
        },
      ],
    },
  ];
  const t = createTranslator({
    "menu.roles.copy": "Kopiuj",
    "menu.roles.paste": "Wklej",
  });

  const localizedTemplate = localizeMenuTemplate(template, { t });

  assert.equal(localizedTemplate[0].submenu[0].label, "Kopiuj");
  assert.equal(localizedTemplate[0].submenu[1].submenu[0].label, "Wklej");
});

test("localizes sibling items independently", () => {
  const template = [{ role: "copy" }, { role: "paste" }];
  const t = createTranslator({
    "menu.roles.copy": "Kopiuj",
    "menu.roles.paste": "Wklej",
  });

  const localizedTemplate = localizeMenuTemplate(template, { t });

  assert.deepEqual(
    localizedTemplate.map((item) => item.label),
    ["Kopiuj", "Wklej"],
  );
});

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

test("localizes recursively generated submenu roles when given a menu builder", () => {
  const builtMenu = {
    items: [
      {
        role: "windowMenu",
        label: "Window",
        submenu: {
          items: [
            {
              role: "close",
              label: "Close",
              submenu: {
                items: [{ role: "copy", label: "Copy" }],
              },
            },
          ],
        },
      },
    ],
  };
  const t = createTranslator({
    "menu.roles.close": "Cerrar",
    "menu.roles.copy": "Copiar",
    "menu.roles.windowMenu": "Ventana",
  });

  const menu = localizeMenuTemplate(
    [{ role: "windowMenu" }],
    { t },
    (template) => {
      assert.equal(template[0].label, "Ventana");
      return builtMenu;
    },
  );

  assert.equal(menu, builtMenu);
  assert.equal(menu.items[0].submenu.items[0].label, "Cerrar");
  assert.equal(menu.items[0].submenu.items[0].submenu.items[0].label, "Copiar");
});

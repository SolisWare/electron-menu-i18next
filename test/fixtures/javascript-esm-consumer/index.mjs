/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import assert from "node:assert/strict";

import {
  DEFAULT_ROLE_LABELS,
  getRoleLabel,
  localizeMenuTemplate,
} from "@solisware/electron-menu-i18next";

const translations = {
  "menu.roles.copy": "Kopiuj",
};
const t = (key, options) => translations[key] ?? options.defaultValue;
const template = [
  {
    label: "Edit",
    submenu: [{ role: "copy" }, { role: "paste" }],
  },
];

const localizedTemplate = localizeMenuTemplate(template, { t });

assert.equal(localizedTemplate[0].submenu[0].label, "Kopiuj");
assert.equal(localizedTemplate[0].submenu[1].label, "Paste");
assert.equal(getRoleLabel("undo", { t }), "Undo");
assert.equal(DEFAULT_ROLE_LABELS.copy, "Copy");

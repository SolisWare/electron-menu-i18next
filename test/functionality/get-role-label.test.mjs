/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { getRoleLabel } from "electron-menu-i18next";
import testUtilities from "../test-utils.cjs";

const { test } = testUtilities;

const translations = {
  "menu.roles.quit": "Zakończ {{appName}}",
};
const t = (key, options) => {
  const label = translations[key] ?? options.defaultValue;
  return label.replace("{{appName}}", options.appName);
};

test("uses the application name when provided", () => {
  const label = getRoleLabel("quit", { t, appName: "Notes" });

  assert.equal(label, "Zakończ Notes");
});

test("uses a generic translated label when the application name is omitted", () => {
  const label = getRoleLabel("quit", { t });

  assert.equal(label, "Zakończ");
});

test("uses generic English labels when the application name is omitted", () => {
  const untranslatedT = (_key, options) => options.defaultValue;

  assert.equal(getRoleLabel("about", { t: untranslatedT }), "About");
  assert.equal(getRoleLabel("hide", { t: untranslatedT }), "Hide");
  assert.equal(getRoleLabel("quit", { t: untranslatedT }), "Quit");
  assert.equal(getRoleLabel("appMenu", { t: untranslatedT }), "Application");
});

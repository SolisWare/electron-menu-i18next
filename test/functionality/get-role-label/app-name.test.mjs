/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { getRoleLabel } from "electron-menu-i18next";
import { test } from "../../framework/test-framework.mjs";
import { createTranslator } from "../../utils/translator.mjs";

test("interpolates the application name into a translation", () => {
  const label = getRoleLabel("quit", {
    t: createTranslator({ "menu.roles.quit": "Zakończ {{appName}}" }),
    appName: "Notes",
  });

  assert.equal(label, "Zakończ Notes");
});

test("interpolates the application name into an English fallback", () => {
  const label = getRoleLabel("about", {
    t: createTranslator(),
    appName: "Notes",
  });

  assert.equal(label, "About Notes");
});

test("uses a generic translated label when the application name is omitted", () => {
  const label = getRoleLabel("quit", {
    t: createTranslator({ "menu.roles.quit": "Zakończ {{appName}}" }),
  });

  assert.equal(label, "Zakończ");
});

test("uses generic English labels when the application name is omitted", () => {
  const t = createTranslator();

  assert.equal(getRoleLabel("about", { t }), "About");
  assert.equal(getRoleLabel("hide", { t }), "Hide");
  assert.equal(getRoleLabel("quit", { t }), "Quit");
  assert.equal(getRoleLabel("appMenu", { t }), "Application");
});

test("removes an unresolved application-name placeholder", () => {
  const t = (_key, options) => options.defaultValue;

  assert.equal(getRoleLabel("quit", { t }), "Quit");
});

test("uses a generic custom fallback when the application name is omitted", () => {
  const label = getRoleLabel("quit", {
    t: createTranslator(),
    fallbackLabels: { quit: "Exit {{appName}}" },
  });

  assert.equal(label, "Exit");
});

test("treats an explicitly empty application name as provided", () => {
  const label = getRoleLabel("appMenu", {
    t: createTranslator(),
    appName: "",
  });

  assert.equal(label, "");
});

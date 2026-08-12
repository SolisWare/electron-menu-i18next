/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import { app, BrowserWindow } from "electron";

import { initializeI18n } from "./i18n.js";
import { installApplicationMenu } from "./menu.js";

let mainWindow = null;

async function startApplication() {
  await app.whenReady();

  // Application-specific language selection belongs here. Electron exposes its
  // locale after `ready`; an app with a language setting would read it here.
  const electronLocale = app.getLocale();
  const language = electronLocale.startsWith("en") ? "en" : "pl";

  // Initialize main-process translations before constructing any native menus.
  await initializeI18n(language);

  // Native menu labels are fixed when the menu is built, so install the menu
  // only after i18next has loaded the selected language.
  installApplicationMenu();

  // Keep application ownership of the window in a module-level reference.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
  });

  await mainWindow.loadURL(
    "data:text/html,<h1>Localized Electron menu JavaScript example</h1>",
  );
}

// An async startup function lets this ESM entry module finish evaluating while
// Electron completes its ready lifecycle, avoiding startup-order issues caused
// by awaiting `app.whenReady()` at the module's top level.
void startApplication().catch((error) => {
  console.error("Failed to start the Electron example:", error);
  app.quit();
});

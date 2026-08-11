/**
 * Copyright (c) 2026 SolisWare.
 * 
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import { app, BrowserWindow } from "electron";

import { initializeI18n } from "./i18n.js";
import { installApplicationMenu } from "./menu.js";

let mainWindow: BrowserWindow | null = null;

async function startApplication(): Promise<void> {
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

  // Keep a module-level reference so the BrowserWindow is not garbage-collected.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
  });

  await mainWindow.loadURL(
    "data:text/html,<h1>Localized Electron menu example</h1>",
  );
}

// Do not use top-level `await app.whenReady()` in an ESM Electron entry file.
// Invoking an async startup function lets the module finish evaluating so
// Electron can complete its own ready lifecycle.
void startApplication().catch((error: unknown) => {
  console.error("Failed to start the Electron example:", error);
  app.quit();
});

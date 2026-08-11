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

  const electronLocale = app.getLocale();
  const language = electronLocale.startsWith("en") ? "en" : "pl";

  await initializeI18n(language);
  installApplicationMenu();

  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
  });

  await mainWindow.loadURL(
    "data:text/html,<h1>Localized Electron menu JavaScript example</h1>",
  );
}

void startApplication().catch((error) => {
  console.error("Failed to start the Electron example:", error);
  app.quit();
});

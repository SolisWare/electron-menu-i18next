/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import { app, BrowserWindow } from "electron";

import { initializeI18n } from "./i18n.mjs";
import { installApplicationMenu } from "./menu.mjs";

let mainWindow: BrowserWindow | null = null;

async function startApplication(): Promise<void> {
  await app.whenReady();

  const language = app.getLocale().startsWith("en") ? "en" : "pl";
  await initializeI18n(language);
  installApplicationMenu();

  // Keep a reference for the lifetime of the native window.
  mainWindow = new BrowserWindow({ height: 500, width: 800 });
  await mainWindow.loadURL(
    "data:text/html,<h1>Generated submenu localization example</h1>",
  );
}

void startApplication().catch((error: unknown) => {
  console.error("Failed to start the Electron example:", error);
  app.quit();
});

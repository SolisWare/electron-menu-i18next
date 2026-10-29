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

  // Application-specific language selection belongs here. Electron exposes its
  // locale after `ready`; an app with a language setting would read it here.
  const electronLocale = app.getLocale();
  const language = electronLocale.startsWith("en") ? "en" : "pl";

  // Initialize the application-owned i18next instance before passing its
  // translator into electron-menu-i18next during menu construction.
  await initializeI18n(language);

  // Package integration happens inside installApplicationMenu(): the helper
  // localizes the template before Electron builds the native menu instances.
  installApplicationMenu();

  // Keep application ownership of the window in a module-level reference.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
  });

  await mainWindow.loadURL(
    "data:text/html,<h1>Localized Electron menu example</h1>",
  );
}

// An async startup function lets this ESM entry module finish evaluating while
// Electron completes its ready lifecycle, avoiding startup-order issues caused
// by awaiting `app.whenReady()` at the module's top level.
void startApplication().catch((error: unknown) => {
  console.error("Failed to start the Electron example:", error);
  app.quit();
});

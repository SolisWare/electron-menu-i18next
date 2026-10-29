/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
const { app, BrowserWindow } = require("electron");
const { initializeI18n } = require("./i18n.cjs");
const { installApplicationMenu } = require("./menu.cjs");

let mainWindow = null;

async function startApplication() {
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
    "data:text/html,<h1>Localized Electron menu JavaScript example</h1>",
  );
}

// Keep asynchronous startup errors visible instead of leaving a rejected promise.
void startApplication().catch((error) => {
  console.error("Failed to start the Electron example:", error);
  app.quit();
});

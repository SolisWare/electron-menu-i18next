/**
 * Copyright (c) 2026 SolisWare.
 * 
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import { app, BrowserWindow } from "electron";

import { initializeI18n } from "./i18n.js";
import { installApplicationMenu } from "./menu.js";

await app.whenReady();

// Electron exposes the application locale after `ready`. If your application
// stores a user-selected language, read that setting here instead.
const electronLocale = app.getLocale();
const language = electronLocale.startsWith("en") ? "en" : "pl";

// Initialize main-process translations before constructing any native menus.
await initializeI18n(language);

// Native menu labels are fixed when the menu is built, so install the menu only
// after i18next has loaded the selected language.
installApplicationMenu();

const window = new BrowserWindow({
  width: 900,
  height: 600,
});

await window.loadURL("data:text/html,<h1>Localized Electron menu example</h1>");

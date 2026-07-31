/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import {
  app,
  Menu,
  type MenuItemConstructorOptions,
} from "electron";
import { localizeMenuTemplate } from "electron-menu-i18next";

import { translate } from "./i18n.js";

export function installApplicationMenu(): void {
  const isMac = process.platform === "darwin";

  // This is a standard Electron template. Explicit labels are application
  // translations; role items intentionally have no label yet.
  const template: MenuItemConstructorOptions[] = [
    // macOS applications conventionally start with an application menu.
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          } satisfies MenuItemConstructorOptions,
        ]
      : []),
    {
      // Custom headings are translated directly by the application.
      label: translate("menu.file"),
      submenu: [
        {
          label: translate("menu.exportNotes"),
          click: () => {
            // Replace this with the application's export command.
            console.log("Export notes");
          },
        },
        { type: "separator" },
        // Keep native platform conventions: Close on macOS, Quit elsewhere.
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: translate("menu.edit"),
      submenu: [
        // Electron supplies behavior and accelerators; the helper supplies
        // labels from `menu.roles.undo`, `menu.roles.redo`, and so on.
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
        { type: "separator" },
        { role: "toggleSpellChecker" },
      ],
    },
    {
      label: translate("menu.view"),
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      // This menu has no special Electron role. It demonstrates that custom
      // menu items continue to work alongside localized role items.
      label: translate("menu.tools"),
      submenu: [
        {
          label: translate("menu.preferences"),
          click: () => {
            // Open the application's preferences window here.
            console.log("Open preferences");
          },
        },
      ],
    },
  ];

  // electron-menu-i18next belongs at this boundary: after the template is
  // defined, but before Electron turns it into native MenuItem instances.
  const localizedTemplate = localizeMenuTemplate(template, {
    t: translate,

    // Used by translations such as "About {{appName}}" and
    // "Quit {{appName}}".
    appName: app.name,
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(localizedTemplate));
}

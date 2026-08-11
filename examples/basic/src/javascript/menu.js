/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import { app, Menu } from "electron";
import { localizeMenuTemplate } from "electron-menu-i18next";

import { translate } from "./i18n.js";

export function installApplicationMenu() {
  const isMac = process.platform === "darwin";
  const template = [
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
          },
        ]
      : []),
    {
      label: translate("menu.file"),
      submenu: [
        {
          label: translate("menu.exportNotes"),
          click: () => console.log("Export notes"),
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: translate("menu.edit"),
      submenu: [
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
    { role: "windowMenu" },
    {
      label: translate("menu.tools"),
      submenu: [
        {
          label: translate("menu.preferences"),
          click: () => console.log("Open preferences"),
        },
      ],
    },
  ];

  const localizedTemplate = localizeMenuTemplate(template, {
    t: translate,
    appName: app.name,
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(localizedTemplate));
}

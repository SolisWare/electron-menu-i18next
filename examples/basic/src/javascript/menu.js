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

  // Electron offers `fileMenu`, `editMenu`, and `viewMenu` roles, but those
  // roles generate complete default submenus; they are not label-only roles.
  // This example expands those menus so the app can add commands and control
  // every child item. As a result, their top-level labels are app-owned
  // translations, while native child commands retain their Electron roles.
  const template = [
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
          },
        ]
      : []),
    {
      // Although "File" is a familiar Electron heading, this is a custom File
      // menu because the app defines its submenu and adds "Export notes."
      // Using `{ role: "fileMenu" }` here would ask Electron to generate the
      // entire default File submenu instead. Since we own this menu structure,
      // we also own and translate its heading.
      label: translate("menu.file"),
      submenu: [
        {
          label: translate("menu.exportNotes"),
          click: () => {
            // Your export implementation goes here.
            console.log("Export notes");
          },
        },
        { type: "separator" },
        // Keep native platform conventions: Close on macOS, Quit elsewhere.
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      // The same applies to Edit: expanding the submenu exposes each role to
      // the localizer and allows the app to choose exactly which items appear.
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
      // This is an expanded View menu rather than Electron's generated
      // `{ role: "viewMenu" }`, so its heading is translated by the app.
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
      // This top-level menu is fully standard, so Electron can generate it.
      // No custom `label` or `submenu` is needed: the helper translates
      // `menu.roles.windowMenu`, and Electron supplies the complete Window
      // submenu and its native behavior.
      role: "windowMenu",
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

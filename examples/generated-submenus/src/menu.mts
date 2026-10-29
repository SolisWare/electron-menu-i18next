/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import {
  app,
  Menu,
  type MenuItemConstructorOptions,
} from "electron";
import { localizeMenuTemplate } from "@solisware/electron-menu-i18next";

import { translate } from "./i18n.mjs";

export function installApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    // These roles ask Electron to create their complete default submenus.
    // Their generated child items do not exist in this template.
    ...(process.platform === "darwin"
      ? [{ role: "appMenu" } satisfies MenuItemConstructorOptions]
      : []),
    { role: "windowMenu" },
  ];

  // Pass the builder into the helper so it can localize the explicit template,
  // let Electron generate the submenus, and then localize their child roles.
  const menu = localizeMenuTemplate(
    template,
    {
      t: translate,
      appName: app.name,
    },
    Menu.buildFromTemplate,
  );

  Menu.setApplicationMenu(menu);
}

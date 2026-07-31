/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import i18next from "i18next";

// The package resource contains the complete English `menu.roles.*` template.
// Applications can use it as their English base and translate only the locales
// they actually support.
import packageMenuEn from "electron-menu-i18next/locales/en/menu.json" with {
  type: "json",
};

// These resources belong to the consuming application. They contain custom
// menu headings and, for Polish, translated role labels.
import appEn from "./locales/en.json" with { type: "json" };
import appPl from "./locales/pl.json" with { type: "json" };

export async function initializeI18n(language: string): Promise<void> {
  await i18next.init({
    lng: language,

    // A missing Polish key falls back to the complete English template.
    fallbackLng: "en",

    resources: {
      en: {
        translation: {
          ...packageMenuEn,
          menu: {
            // Preserve the package-owned `roles` object.
            ...packageMenuEn.menu,

            // Add application-owned labels such as `menu.file`.
            ...appEn.menu,
          },
        },
      },
      pl: {
        // i18next recursively falls back to English for keys absent here.
        translation: appPl,
      },
    },
  });
}

// Export one main-process translator for menu construction. Binding preserves
// the i18next instance when it is passed into electron-menu-i18next.
export const translate = i18next.t.bind(i18next);

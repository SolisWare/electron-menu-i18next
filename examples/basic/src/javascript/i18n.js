/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import i18next from "i18next";
import { createRequire } from "node:module";

// Load the same application-owned JSON resources as the TypeScript variant.
// English only needs custom app labels because DEFAULT_ROLE_LABELS supplies
// missing English roles. Polish translates the roles used by this example.
const require = createRequire(import.meta.url);
const appEn = require("../locales/en.json");
const appPl = require("../locales/pl.json");

export async function initializeI18n(language) {
  await i18next.init({
    lng: language,

    // Normal application keys use English as their i18next fallback language.
    // If a role key is absent from both locales, electron-menu-i18next supplies
    // its English DEFAULT_ROLE_LABELS value through i18next's `defaultValue`.
    fallbackLng: "en",

    resources: {
      en: { translation: appEn },
      // i18next recursively falls back to English for keys absent from Polish.
      pl: { translation: appPl },
    },
  });
}

// Export one main-process translator for menu construction. Binding preserves
// the i18next instance when it is passed into electron-menu-i18next.
export const translate = i18next.t.bind(i18next);

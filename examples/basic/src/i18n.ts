/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import i18next from "i18next";

// These resources belong entirely to the consuming application. English only
// needs custom app labels; DEFAULT_ROLE_LABELS supplies missing English roles.
// Polish adds translations for the role labels used by this example.
import appEn from "./locales/en.json" with { type: "json" };
import appPl from "./locales/pl.json" with { type: "json" };

export async function initializeI18n(language: string): Promise<void> {
  await i18next.init({
    lng: language,

    // Normal application keys use English as their i18next fallback language.
    // If a role key is absent from both locales, electron-menu-i18next supplies
    // its English DEFAULT_ROLE_LABELS value through i18next's `defaultValue`.
    fallbackLng: "en",

    resources: {
      en: {
        translation: appEn,
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

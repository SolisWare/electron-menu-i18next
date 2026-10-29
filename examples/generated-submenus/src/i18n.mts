/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import i18next from "i18next";

import appEn from "./locales/en.json" with { type: "json" };
import appPl from "./locales/pl.json" with { type: "json" };

export type Language = "en" | "pl";

export async function initializeI18n(language: Language): Promise<void> {
  await i18next.init({
    fallbackLng: "en",
    lng: language,
    resources: {
      en: { translation: appEn },
      pl: { translation: appPl },
    },
  });
}

export const translate = i18next.t.bind(i18next);

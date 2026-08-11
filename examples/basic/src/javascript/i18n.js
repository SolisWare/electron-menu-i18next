/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import i18next from "i18next";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const appEn = require("../locales/en.json");
const appPl = require("../locales/pl.json");

export async function initializeI18n(language) {
  await i18next.init({
    lng: language,
    fallbackLng: "en",
    resources: {
      en: { translation: appEn },
      pl: { translation: appPl },
    },
  });
}

export const translate = i18next.t.bind(i18next);

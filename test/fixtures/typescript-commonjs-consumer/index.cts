/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import i18next, { type TFunction } from "i18next";

import {
  localizeMenuTemplate,
  type LocalizeMenuOptions,
} from "@solisware/electron-menu-i18next";

const options = {
  t: i18next.getFixedT("en") as TFunction,
} satisfies LocalizeMenuOptions;

const template = localizeMenuTemplate([{ role: "copy" }], options);

void template;

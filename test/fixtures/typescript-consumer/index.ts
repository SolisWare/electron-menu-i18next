/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import i18next, { type TFunction } from "i18next";

import {
  DEFAULT_ROLE_LABELS,
  getRoleLabel,
  localizeMenuTemplate,
  type LocalizeMenuOptions,
  type MenuTemplateItem,
} from "electron-menu-i18next";

interface ConsumerMenuItem extends MenuTemplateItem {
  id?: string;
  enabled?: boolean;
  click?: () => void;
  submenu?: ConsumerMenuItem[];
}

const t: TFunction = i18next.getFixedT("en");
const options = {
  t,
  appName: "Notes",
  fallbackLabels: { copy: "Duplicate" },
} satisfies LocalizeMenuOptions;

const menuTemplate: ConsumerMenuItem[] = [
  {
    id: "edit",
    enabled: true,
    submenu: [
      { role: "copy" },
      { role: "paste", click: () => undefined },
    ],
  },
];

const localizedTemplate: ConsumerMenuItem[] = localizeMenuTemplate(
  menuTemplate,
  options,
);
const copyLabel: string = getRoleLabel("copy", options);
const fallbackLabels: Record<string, string> = DEFAULT_ROLE_LABELS;

void localizedTemplate;
void copyLabel;
void fallbackLabels;

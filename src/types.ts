/*
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
import type { TFunction } from "i18next";

/**
 * A structural subset of Electron.MenuItemConstructorOptions. We don't
 * import the `electron` package (it's not needed at runtime, and pulling
 * its types in would force a hard peer dependency), so this package works
 * against any object shaped like a menu item — including Electron's own
 * MenuItemConstructorOptions, which satisfies this interface.
 */
export interface MenuTemplateItem {
  /** Electron's built-in behavior identifier, such as `copy` or `fileMenu`. */
  role?: string;
  /** An explicit label. When present, it is preserved without translation. */
  label?: string;
  /** A nested menu template, or another submenu value understood by Electron. */
  submenu?: MenuTemplateItem[] | unknown;
}

/** Configuration used to translate role-based menu labels. */
export interface LocalizeMenuOptions {
  /** i18next `t` function (or `i18next.getFixedT(lng)`, or `useTranslation().t`). */
  t: TFunction;
  /**
   * Namespace/key prefix used to look up role labels.
   * Default: "menu.roles" — e.g. role "quit" looks up "menu.roles.quit".
   */
  keyPrefix?: string;
  /**
   * Interpolated into labels that reference it, e.g. "About {{appName}}",
   * "Quit {{appName}}". Uses a generic label such as "About" or "Quit"
   * when omitted.
   */
  appName?: string;
  /**
   * Per-role English fallback overrides, resolved before the built-in
   * `DEFAULT_ROLE_LABELS`. Used when a translation key is missing.
   */
  fallbackLabels?: Partial<Record<string, string>>;
}

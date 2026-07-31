/**
 * Copyright (c) 2026 SolisWare.
 * 
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import { DEFAULT_ROLE_LABELS } from "./defaultLabels";
import type { LocalizeMenuOptions, MenuTemplateItem } from "./types";

export { DEFAULT_ROLE_LABELS } from "./defaultLabels";
export type { LocalizeMenuOptions, MenuTemplateItem } from "./types";

const DEFAULT_KEY_PREFIX = "menu.roles";

/**
 * Recursively walks a Menu template and fills in `label` for any item that
 * has a `role` but no explicit `label`, using i18next translations with an
 * English fallback. Items that already set `label` are left untouched, so
 * you can mix manually-labeled and role-based items freely.
 *
 * Does not mutate the input template — returns a new array/tree.
 */
export function localizeMenuTemplate<T extends MenuTemplateItem>(
  template: T[],
  options: LocalizeMenuOptions
): T[] {
  return template.map((item) => {
    const next: T = { ...item };

    if (next.role && !next.label) {
      next.label = resolveLabel(String(next.role), options);
    }

    if (Array.isArray(next.submenu)) {
      next.submenu = localizeMenuTemplate(next.submenu as MenuTemplateItem[], options) as unknown as T["submenu"];
    }

    return next;
  });
}

/**
 * Looks up the localized label for a single role, without a full template.
 * Useful for tray menus, context menus, or one-off items built by hand.
 */
export function getRoleLabel(role: string, options: LocalizeMenuOptions): string {
  return resolveLabel(role, options);
}

function resolveLabel(role: string, options: LocalizeMenuOptions): string {
  const { t, keyPrefix = DEFAULT_KEY_PREFIX, appName, fallbackLabels } = options;
  const key = `${keyPrefix}.${role}`;
  const fallback = fallbackLabels?.[role] ?? DEFAULT_ROLE_LABELS[role] ?? role;
  return t(key, { defaultValue: fallback, appName });
}

/*
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */

/**
 * Translate Electron role-based native application menu labels with i18next
 * in the main process while preserving native actions and accelerators.
 *
 * @author Michael Polowczuk
 * @packageDocumentation
 */
import { DEFAULT_ROLE_LABELS } from "./defaultLabels.js";
import type { BuiltMenu, BuiltMenuItem, LocalizeMenuOptions, MenuBuilder, MenuTemplateItem } from "./types.js";

export { DEFAULT_ROLE_LABELS } from "./defaultLabels.js";
export type { BuiltMenu, BuiltMenuItem, LocalizeMenuOptions, MenuBuilder, MenuTemplateItem } from "./types.js";

const DEFAULT_KEY_PREFIX = "menu.roles";
const GENERIC_APP_ROLE_LABELS: Record<string, string> = {
  about: "About",
  hide: "Hide",
  quit: "Quit",
  appMenu: "Application",
};

/**
 * Returns a localized copy of an Electron-compatible menu template.
 * Recursively fills in `label` for every item that has a `role` but no
 * explicit label. Existing labels are preserved, and the input template is
 * not mutated.
 *
 * @typeParam T - The application's menu-item type.
 * @param template - The Electron-compatible menu template to localize.
 * @param options - The translator, key prefix, and fallback configuration.
 * @returns A localized copy of the complete menu tree.
 */
export function localizeMenuTemplate<T extends MenuTemplateItem>(
  template: T[],
  options: LocalizeMenuOptions
): T[];

/**
 * Builds and localizes an Electron-compatible menu template.
 *
 * The template is localized before it is passed to the menu builder. Role
 * items generated implicitly by the builder are then localized recursively,
 * including descendants of parent roles such as `windowMenu`. Explicit
 * labels from the original template are preserved.
 *
 * @typeParam T - The application's menu-item type.
 * @typeParam TMenu - The native menu type returned by the menu builder.
 * @param template - The Electron-compatible menu template to localize.
 * @param options - The translator, key prefix, and fallback configuration.
 * @param buildMenu - Builds the localized template into a native menu.
 * @returns The built native menu with generated role labels localized.
 */
export function localizeMenuTemplate<T extends MenuTemplateItem, TMenu extends BuiltMenu>(
  template: T[],
  options: LocalizeMenuOptions,
  buildMenu: MenuBuilder<T, TMenu>
): TMenu;

export function localizeMenuTemplate<T extends MenuTemplateItem, TMenu extends BuiltMenu>(
  template: T[],
  options: LocalizeMenuOptions,
  buildMenu?: MenuBuilder<T, TMenu>
): T[] | TMenu {
  const localizedTemplate = localizeTemplate(template, options);

  if (!buildMenu) {
    return localizedTemplate;
  }

  const menu = buildMenu(localizedTemplate);
  localizeImplicitMenuItems(menu.items, localizedTemplate, options);

  return menu;
}

/**
 * Looks up the localized label for a single role, without a full template.
 * Useful for tray menus, context menus, or one-off items built by hand.
 *
 * @param role - The Electron menu role, such as `copy` or `quit`.
 * @param options - The translator, key prefix, and fallback configuration.
 * @returns The translated label, its configured fallback, or the role itself.
 */
export function getRoleLabel(role: string, options: LocalizeMenuOptions): string {
  return resolveLabel(role, options);
}

/**
 * Creates a localized copy of an Electron-compatible menu template.
 *
 * @internal
 */
function localizeTemplate<T extends MenuTemplateItem>(
  template: T[],
  options: LocalizeMenuOptions
): T[] {
  return template.map((item) => {
    const next: T = { ...item };

    if (next.role && next.label === undefined) {
      next.label = resolveLabel(String(next.role), options);
    }

    if (Array.isArray(next.submenu)) {
      next.submenu = localizeTemplate(next.submenu as MenuTemplateItem[], options) as unknown as T["submenu"];
    }

    return next;
  });
}

/**
 * Localizes role items generated while building a menu without overwriting
 * labels that originated in the template.
 *
 * @internal
 */
function localizeImplicitMenuItems(
  menuItems: readonly BuiltMenuItem[],
  templateItems: readonly MenuTemplateItem[],
  options: LocalizeMenuOptions
): void {
  for (let index = 0; index < menuItems.length; index += 1) {
    const menuItem = menuItems[index];
    const templateItem = templateItems[index];

    if (!templateItem) {
      localizeGeneratedMenuItem(menuItem, options);
      continue;
    }

    const templateSubmenu = Array.isArray(templateItem.submenu)
      ? templateItem.submenu
      : undefined;
    const builtSubmenu = menuItem.submenu;

    if (!builtSubmenu) {
      continue;
    }

    if (templateSubmenu) {
      localizeImplicitMenuItems(builtSubmenu.items, templateSubmenu, options);
      continue;
    }

    localizeGeneratedMenuItems(builtSubmenu.items, options);
  }
}

/**
 * Recursively localizes a collection of generated menu items.
 *
 * @internal
 */
function localizeGeneratedMenuItems(
  menuItems: readonly BuiltMenuItem[],
  options: LocalizeMenuOptions
): void {
  menuItems.forEach((menuItem) => localizeGeneratedMenuItem(menuItem, options));
}

/**
 * Localizes one generated menu item and all of its descendants.
 *
 * @internal
 */
function localizeGeneratedMenuItem(menuItem: BuiltMenuItem, options: LocalizeMenuOptions): void {
  if (menuItem.role) {
    menuItem.label = resolveLabel(menuItem.role, options);
  }

  if (menuItem.submenu) {
    localizeGeneratedMenuItems(menuItem.submenu.items, options);
  }
}

/**
 * Resolves one role label through i18next and the configured fallbacks.
 *
 * @internal
 */
function resolveLabel(role: string, options: LocalizeMenuOptions): string {
  const { t, keyPrefix = DEFAULT_KEY_PREFIX, appName, fallbackLabels } = options;
  const key = `${keyPrefix}.${role}`;
  const fallback = fallbackLabels?.[role] ?? DEFAULT_ROLE_LABELS[role] ?? role;
  const label = t(key, { defaultValue: fallback, appName: appName ?? "" });

  if (appName !== undefined) {
    return label;
  }

  const genericLabel = label.replace(/\{\{\s*appName\s*\}\}/g, "").trim();
  return genericLabel || GENERIC_APP_ROLE_LABELS[role] || role;
}

<!--
Copyright (c) 2026 SolisWare and contributors.

All rights reserved. Licensed under the MIT license.
See the LICENSE file in the project root directory for details.
-->

# @solisware/electron-menu-i18next

Localize Electron's role-based native menu labels with [i18next](https://www.i18next.com/) in the main process.

Electron's role-based menu items such as `undo`, `about`, `quit`, and others render with hardcoded English labels by default, and there is no built-in way to hook them into an i18next instance running in the main process. This package fills that gap. Give it a menu template and a `t` function, and it fills in `label` for every role-based item while falling back to English if a translation key is missing.

## Install

```bash
npm install @solisware/electron-menu-i18next i18next
```

`i18next` is a peer dependency — bring your own instance.

## Quick start

Given an initialized i18next instance and translation keys such as
`menu.roles.undo`, localize the template before passing it to Electron:

```ts
import { app, Menu, type MenuItemConstructorOptions } from "electron";
import i18next from "i18next";
import { localizeMenuTemplate } from "@solisware/electron-menu-i18next";

const template: MenuItemConstructorOptions[] = [
  {
    role: "editMenu",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
];

const localizedTemplate = localizeMenuTemplate(template, {
  t: i18next.t.bind(i18next),
  appName: app.name,
});

Menu.setApplicationMenu(Menu.buildFromTemplate(localizedTemplate));
```

## Features

- Translates Electron role labels through your existing i18next instance.
- Runs in Electron's main process without importing Electron at runtime.
- Covers every role currently listed in Electron's `MenuItem` documentation.
- Preserves native role behavior, keyboard accelerators, and explicit labels.
- Handles nested submenus without mutating the source menu template.
- Supports custom translation prefixes and per-role fallback overrides.
- Ships TypeScript declarations plus ESM and CommonJS builds.
- Provides English fallbacks, including application-name interpolation for
  About, Hide, and Quit.

## Compatibility

- Node.js 16 and newer
- ECMAScript modules and CommonJS
- i18next 21 and newer

Compatibility is tested in CI on every Node.js major release from version 16
through the latest release.

## Complete Electron integration

This example uses TypeScript and ECMAScript modules. Create these four files in
your Electron main-process source directory:

```text
src/
├── main.ts
├── i18n.ts
├── menu.ts
└── locales/
    ├── en.json
    └── pl.json
```

### 1. Add translations

Create `src/locales/en.json`:

```json
{
  "menu": {
    "edit": "Edit"
  }
}
```

Create `src/locales/pl.json`:

```json
{
  "menu": {
    "edit": "Edycja",
    "roles": {
      "undo": "Cofnij",
      "redo": "Ponów",
      "copy": "Kopiuj",
      "paste": "Wklej",
      "quit": "Zakończ {{appName}}"
    }
  }
}
```

`menu.edit` belongs to your application because you create that menu heading.
Entries under `menu.roles` translate Electron role items. English role entries
are optional because this package supplies built-in English fallbacks.

### 2. Configure i18next

Create `src/i18n.ts`:

```ts
import i18next from "i18next";
import en from "./locales/en.json" with { type: "json" };
import pl from "./locales/pl.json" with { type: "json" };

export async function initializeI18n(language: string): Promise<void> {
  await i18next.init({
    lng: language,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
  });
}

export const translate = i18next.t.bind(i18next);
```

Initialize i18next in Electron's main process, not in the renderer process that
displays your application UI.

### 3. Build and localize the menu

Create `src/menu.ts`:

```ts
import { app, Menu, type MenuItemConstructorOptions } from "electron";
import { localizeMenuTemplate } from "@solisware/electron-menu-i18next";
import { translate } from "./i18n.js";

export function installApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      // Your application owns this heading, so translate it directly.
      label: translate("menu.edit"),
      submenu: [
        // Leave labels off role items. Electron supplies their native actions;
        // electron-menu-i18next supplies their localized labels.
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "copy" },
        { role: "paste" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
  ];

  const localizedTemplate = localizeMenuTemplate(template, {
    t: translate,
    appName: app.name,
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(localizedTemplate));
}
```

The important boundary is:

```text
normal Electron template
→ localizeMenuTemplate(...)
→ Menu.buildFromTemplate(...)
→ native application menu
```

For example, `{ role: "copy" }` keeps Electron's native Copy behavior and
accelerator. With Polish selected, the package adds `label: "Kopiuj"` before
Electron builds the menu.

### 4. Initialize everything at startup

Create or update `src/main.ts`:

```ts
import { app } from "electron";
import { initializeI18n } from "./i18n.js";
import { installApplicationMenu } from "./menu.js";

async function startApplication(): Promise<void> {
  await app.whenReady();

  // Replace "pl" with the user's saved language or your locale-selection logic.
  await initializeI18n("pl");
  installApplicationMenu();

  // Create your BrowserWindow here.
}

void startApplication().catch((error: unknown) => {
  console.error("Failed to start the application:", error);
  app.quit();
});
```

The menu is now built with Polish role labels. When the language changes, call
`i18next.changeLanguage(...)` and run `installApplicationMenu()` again because
native menus must be rebuilt to display new labels.

### Using JavaScript instead

The API is the same in plain JavaScript:

- Remove TypeScript annotations such as `: string` and
  `MenuItemConstructorOptions[]`.
- Use `.js` files with `"type": "module"`, or use `.mjs`.
- For CommonJS, load the package with
  `require("@solisware/electron-menu-i18next")`.

## Translation keys

Add translated `menu.roles.*` keys directly to each application locale. You do
not need to provide English role translations: any missing role automatically
uses its English value from `DEFAULT_ROLE_LABELS`.

The `menu` resource is also yours to extend with labels for custom items. The
helper only reads `menu.roles.*`; other keys continue to work with i18next
normally:

```json
{
  "menu": {
    "tools": "Narzędzia",
    "exportNotes": "Eksportuj notatki…",
    "roles": {
      "copy": "Kopiuj",
      "quit": "Zakończ {{appName}}"
    }
  }
}
```

```ts
const toolsLabel = t("menu.tools");
```

## API

### `localizeMenuTemplate(template, options)`

Recursively walks a `MenuItemConstructorOptions[]` tree (including nested `submenu` arrays) and sets `label` for any item that has a `role` but no `label`. Items with an explicit `label` are left untouched, including `label: ""`; localization and fallback labels apply only when `label` is missing or `undefined`. Returns a localized copy; the original template remains unchanged.

### `getRoleLabel(role, options)`

Looks up the localized label for a single role — useful for tray menus or context menus built by hand instead of a full template.

### `options`

| Option | Type | Default | Description |
|---|---|---|---|
| `t` | `TFunction` | required | An i18next translator, such as `i18next.t` or the result of `i18next.getFixedT(...)` |
| `keyPrefix` | `string` | `"menu.roles"` | Namespace prefix used to build lookup keys |
| `appName` | `string` | — | Interpolated into labels like `"About {{appName}}"`; when omitted, app-name roles use generic labels such as `"About"` and `"Quit"` |
| `fallbackLabels` | `Partial<Record<string, string>>` | — | Per-role overrides used when a translation key is missing, merged over the built-in defaults |

### `DEFAULT_ROLE_LABELS`

The built-in English fallback map, exported in case you want to seed your own locale files from it.

### Generated API reference

To build browsable TypeDoc API documentation locally, use Node.js 20 or newer
and run:

```bash
npm run docs
```

Open `docs/index.html` in a browser to browse the exported functions,
interfaces, configuration properties, parameters, return types, and constants.
The generated directory is intentionally not committed; CI rebuilds it to keep
the public API documentation valid and uploads the complete static site as a
versioned workflow artifact.

## Fully working Electron example

The repository includes a complete, runnable
[Electron example](./examples/basic/README.md) with equivalent JavaScript/CommonJS and
TypeScript/ESM implementations. It demonstrates full application startup,
window creation, platform-specific menus, shared JSON locale files, and
switching languages at runtime.

## Why not just use Electron's OS-level localization?

On macOS, some role labels are localized automatically by the OS. On Windows and Linux, none are — and even on macOS, `about`/`hide`/`quit` need the app name injected, which Electron doesn't do for you outside the default App menu. This package gives you one consistent behavior across all three platforms, driven by the same i18next instance as the rest of your app.

## Frequently asked questions

### How do I translate Electron menu roles with i18next?

Initialize i18next in the main process, pass its `t` function and your Electron
menu template to `localizeMenuTemplate`, then pass the returned template to
`Menu.buildFromTemplate`. Translation keys default to `menu.roles.<role>`.

### Does this replace Electron's native menu roles?

No. Items retain their `role`, so Electron still provides the native command,
platform integration, and accelerator. The package only supplies the visible
`label` before Electron builds the menu.

### Can it translate custom Electron menu items?

Use i18next directly for custom items, such as
`{ label: t("menu.export"), click: exportData }`. The helper preserves every
explicit label and only fills in labels missing from role-based items.

### Can it localize tray menus and context menus?

Yes. Use `localizeMenuTemplate` for a complete nested template or
`getRoleLabel` when constructing an individual tray or context-menu item.

### How do I update the menu after changing language?

Call `i18next.changeLanguage(...)`, localize the original template again, and
rebuild the native menu. Electron menus do not automatically react to an
i18next language change.

### Does the package depend on Electron?

No. It uses a structural `MenuTemplateItem` type, so Electron is not a runtime
or peer dependency. Your Electron `MenuItemConstructorOptions[]` template is
compatible with the helper.

## Contributing

Development setup, commands, test organization, and pull-request guidance are
documented in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

Security policy and vulnerability-reporting guidance are documented in
[SECURITY.md](./SECURITY.md).

## License

MIT © [SolisWare](https://github.com/SolisWare) and contributors.
See the [LICENSE](./LICENSE) file in the project root directory for details.

<!--
Copyright (c) 2026 SolisWare and contributors.

All rights reserved. Licensed under the MIT license.
See the LICENSE file in the project root directory for details.
-->

# electron-menu-i18next

Localize Electron's role-based native menu labels with [i18next](https://www.i18next.com/), in the main process.

Electron's `role`-based menu items (`role: 'undo'`, `'about'`, `'quit'`, etc.) render with hardcoded English labels by default, and there's no built-in way to hook them into an i18next instance running in the main process. This package fills that gap: give it a menu template and a `t` function, and it fills in `label` for every role-based item — falling back to correct English if a translation key is missing.

## Install

```bash
npm install electron-menu-i18next
```

`i18next` is a peer dependency — bring your own instance.

### Install a GitHub Actions artifact

Successful CI runs provide an installable prerelease artifact for manual
testing before the package is published to npm:

1. Open the repository's **Actions** page.
2. Open a successful **SolisWare electron-menu-i18next CI** run.
3. Download the `solisware-electron-menu-i18next-v<version>-b<build>` artifact.
4. Extract the downloaded ZIP file.
5. Install the `.tgz` file contained inside it:

```bash
npm install ./solisware-electron-menu-i18next-v0.1.0-b123.tgz
```

Replace `v0.1.0` and `b123` with the version and build number in the downloaded
filename. The `.tgz` is a standard npm package, so it can also be referenced
from another project's `package.json`:

```json
{
  "dependencies": {
    "electron-menu-i18next": "file:../packages/solisware-electron-menu-i18next-v0.1.0-b123.tgz"
  }
}
```

The consuming project must also have a compatible version of `i18next`
installed. Modern npm versions normally install peer dependencies
automatically; it can also be installed explicitly with `npm install i18next`.

## Compatibility

- Node.js 16 and newer
- ECMAScript modules and CommonJS
- i18next 21 and newer

Compatibility is tested in CI on every Node.js major release from version 16
through the latest release.

## Usage

### TypeScript

```ts
import { app, Menu, type MenuItemConstructorOptions } from "electron";
import i18next from "i18next";
import { localizeMenuTemplate } from "electron-menu-i18next";

const t = i18next.getFixedT(i18next.language);

const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: t("menu.edit"),
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
];

const localizedTemplate = localizeMenuTemplate(menuTemplate, {
  t,
  appName: app.name,
});

Menu.setApplicationMenu(Menu.buildFromTemplate(localizedTemplate));
```

### JavaScript with ECMAScript modules

Use this form in an `.mjs` file or a project whose `package.json` contains
`"type": "module"`:

```js
import { app, Menu } from "electron";
import i18next from "i18next";
import { localizeMenuTemplate } from "electron-menu-i18next";

const t = i18next.getFixedT(i18next.language);
const menuTemplate = [
  {
    label: t("menu.edit"),
    submenu: [{ role: "copy" }, { role: "paste" }],
  },
];

const localizedTemplate = localizeMenuTemplate(menuTemplate, {
  t,
  appName: app.name,
});

Menu.setApplicationMenu(Menu.buildFromTemplate(localizedTemplate));
```

### JavaScript with CommonJS

Use this form in a `.cjs` file or a CommonJS project:

```js
const { app, Menu } = require("electron");
const i18next = require("i18next");
const {
  localizeMenuTemplate,
} = require("electron-menu-i18next");

const t = i18next.getFixedT(i18next.language);
const menuTemplate = [
  {
    label: t("menu.edit"),
    submenu: [{ role: "copy" }, { role: "paste" }],
  },
];

const localizedTemplate = localizeMenuTemplate(menuTemplate, {
  t,
  appName: app.name,
});

Menu.setApplicationMenu(Menu.buildFromTemplate(localizedTemplate));
```

For a complete main-process setup with Electron startup, i18next resources,
and menu construction in separate files, see the
[`examples/basic`](./examples/basic) project.

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

## Why not just use Electron's OS-level localization?

On macOS, some role labels are localized automatically by the OS. On Windows and Linux, none are — and even on macOS, `about`/`hide`/`quit` need the app name injected, which Electron doesn't do for you outside the default App menu. This package gives you one consistent behavior across all three platforms, driven by the same i18next instance as the rest of your app.

## License

MIT © [SolisWare](https://github.com/SolisWare) and contributors

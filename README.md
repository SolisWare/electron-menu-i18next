# electron-menu-i18next

Localize Electron's role-based native menu labels with [i18next](https://www.i18next.com/), in the main process.

Electron's `role`-based menu items (`role: 'undo'`, `'about'`, `'quit'`, etc.) render with hardcoded English labels by default, and there's no built-in way to hook them into an i18next instance running in the main process. This package fills that gap: give it a menu template and a `t` function, and it fills in `label` for every role-based item — falling back to correct English if a translation key is missing.

## Install

```bash
npm install electron-menu-i18next
```

`i18next` is a peer dependency — bring your own instance.

## Usage

```ts
import { Menu } from "electron";
import i18next from "i18next";
import { localizeMenuTemplate } from "electron-menu-i18next";

const t = i18next.getFixedT(i18next.language);

const template = localizeMenuTemplate(
  [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: t("menu.edit"), // manually-labeled items pass through untouched
      submenu: [{ role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }],
    },
  ],
  { t, appName: app.name }
);

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

For a complete main-process setup with Electron startup, i18next resources,
and menu construction in separate files, see the
[`examples/basic`](./examples/basic) project.

Merge the bundled English resource into your i18next config (or use it as the shape to translate into other locales):

```ts
import menuEn from "electron-menu-i18next/locales/en/menu.json";

i18next.init({
  resources: {
    en: { translation: menuEn },
  },
});
```

Then provide `menu.roles.*` keys for each locale you support — any role without a matching key falls back to the built-in English default, so partial translations never break your menu.

The `menu` resource is also yours to extend with labels for custom items. The
helper only reads `menu.roles.*`; other keys continue to work with i18next
normally:

```json
{
  "menu": {
    "tools": "Tools",
    "exportNotes": "Export notes…",
    "roles": {
      "copy": "Copy"
    }
  }
}
```

```ts
const toolsLabel = t("menu.tools");
```

## API

### `localizeMenuTemplate(template, options)`

Recursively walks a `MenuItemConstructorOptions[]` tree (including nested `submenu` arrays) and sets `label` for any item that has a `role` but no `label`. Items with an explicit `label` are left untouched. Does not mutate the input.

### `getRoleLabel(role, options)`

Looks up the localized label for a single role — useful for tray menus or context menus built by hand instead of a full template.

### `options`

| Option | Type | Default | Description |
|---|---|---|---|
| `t` | `TFunction` | required | An i18next translator, such as `i18next.t` or the result of `i18next.getFixedT(...)` |
| `keyPrefix` | `string` | `"menu.roles"` | Namespace prefix used to build lookup keys |
| `appName` | `string` | — | Interpolated into labels like `"About {{appName}}"` |
| `fallbackLabels` | `Partial<Record<string, string>>` | — | Per-role overrides used when a translation key is missing, merged over the built-in defaults |

### `DEFAULT_ROLE_LABELS`

The built-in English fallback map, exported in case you want to seed your own locale files from it.

## Why not just use Electron's OS-level localization?

On macOS, some role labels are localized automatically by the OS. On Windows and Linux, none are — and even on macOS, `about`/`hide`/`quit` need the app name injected, which Electron doesn't do for you outside the default App menu. This package gives you one consistent behavior across all three platforms, driven by the same i18next instance as the rest of your app.

## License

MIT © [SolisWare](https://github.com/soliswaredev)

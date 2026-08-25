<!--
Copyright (c) 2026 SolisWare and contributors.

All rights reserved. Licensed under the MIT license.
See the LICENSE file in the project root directory for details.
-->

# Basic Electron example

This is a small but complete Electron main-process integration with equivalent
JavaScript and TypeScript implementations. Both variants share the same locale
resources and build the same native application menu. The window displays only
a small inline page because renderer-process setup is outside this package's
scope.

The JavaScript variant demonstrates the package's CommonJS export. The
TypeScript variant compiles to ESM and demonstrates its ESM export.

The example uses Electron 43 and requires Node.js 22.12 or newer. This does not
change the library's Node.js 16 runtime compatibility.

Confirm the active Node.js version before installing the example:

```bash
node --version
```

If the example was installed with an older Node.js version or with
`--ignore-scripts`, switch to Node.js 22.12 or newer, remove its `node_modules`
directory, and run `npm ci` again. Electron's install script must run so its
desktop binary is downloaded.

## How the pieces fit together

```text
src/
├── javascript/
│   ├── main.cjs
│   ├── i18n.cjs
│   └── menu.cjs
├── typescript/
│   ├── main.mts
│   ├── i18n.mts
│   └── menu.mts
└── locales/
    ├── en.json
    └── pl.json
```

In either implementation:

1. `main` waits for Electron, selects a language, and creates a window.
2. `i18n` initializes i18next with the shared English and Polish resources.
3. `menu` creates a normal Electron menu template.
4. `localizeMenuTemplate` returns a localized copy of that template.
5. Electron builds and installs the native menu.

The package does not create your menu and it does not replace Electron roles.
You continue to define a regular Electron menu template. The TypeScript variant
types it as `MenuItemConstructorOptions[]`; the JavaScript variant uses the
equivalent plain array:

- Translate application-owned labels with `t("menu.file")` as usual.
- Leave the `label` off items such as `{ role: "copy" }`.
- Pass the completed template through `localizeMenuTemplate`.
- Give the returned template to `Menu.buildFromTemplate`.

Keeping the `role` is important because Electron still provides its native
behavior, enabled state, and keyboard accelerator.

### Why are File, Edit, and View translated manually?

Electron's `fileMenu`, `editMenu`, and `viewMenu` roles generate complete
default submenus. They do not only provide a standard label. For example:

```ts
{ role: "fileMenu" }
```

asks Electron to create the File heading and its default child items. That is
useful when the entire generated menu is suitable for the application.

This example adds an “Export notes” command and explicitly chooses the contents
of its File, Edit, and View menus. It therefore supplies those submenu arrays
itself:

```ts
{
  label: translate("menu.file"),
  submenu: [
    { label: translate("menu.exportNotes"), click: exportNotes },
    { type: "separator" },
    { role: "quit" },
  ],
}
```

Once the application owns the submenu structure, it also owns the top-level
label. Native child commands should still keep their roles: the application
translates `menu.file`, while this package translates `menu.roles.quit` and
Electron supplies Quit's native behavior.

The same template also includes a fully standard top-level Window menu:

```ts
{ role: "windowMenu" }
```

Here the application does not need a custom `label` or `submenu`. The helper
uses `menu.roles.windowMenu` for the translated heading, and Electron generates
the standard Window submenu and native behavior. Use this shorter form whenever
Electron's complete role-generated menu already matches what the application
needs.

## Translation resources

Your application locale files contain custom labels such as `menu.file` and
translations for whichever `menu.roles.*` entries you support. The Polish
resource intentionally contains only the role translations used by this
example. Any missing role is supplied automatically in English by the
package's `DEFAULT_ROLE_LABELS`, so an English `menu.roles` resource is not
required.

Adding a translation does not create an Electron menu item. For example, adding
`"tools": "Tools"` to the resource must be paired with a corresponding item in
the Electron template:

```ts
{
  label: translate("menu.tools"),
  submenu: [/* your menu items */],
}
```

## Install and build

The example uses `file:../..` while it is inside this repository, so build the
library before installing the example:

```bash
# From the repository root
npm ci
npm run build

cd examples/basic
npm ci
npm run build
```

The build compiles the TypeScript implementation and syntax-checks every
JavaScript source file. It does not launch Electron.

## Run a variant

```bash
# TypeScript implementation
npm run start:typescript

# JavaScript implementation
npm run start:javascript
```

`npm start` runs the TypeScript variant by default. The launcher removes an
inherited `ELECTRON_RUN_AS_NODE` variable because that variable would make
Electron run the example as plain Node.js in some editor terminals.

These commands open a desktop window and install the localized native menu, so
run them in a graphical desktop session.

A normal application using the published package would instead run:

```bash
npm install @solisware/electron-menu-i18next i18next
```

For demonstration purposes, both variants select English when Electron's
application locale begins with `en` and Polish for every other locale. A real
application should replace this simple choice with its supported-locale logic
or the user's saved language preference.

When the language changes at runtime, call `i18next.changeLanguage(...)` and
run `installApplicationMenu()` again. Native Electron menus must be rebuilt for
their visible labels to change.

## Package validation in CI

The repository's CI does not validate this example against the `file:../..`
development link. After all tests, compatibility matrices, and consumer checks
pass, CI creates the npm `.tgz`, installs that generated package into a clean
example workspace in place of the repository link, and builds both variants.
This verifies the same package contents that are preserved as the downloadable
workflow artifact.

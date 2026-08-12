# Basic Electron example

This is a small but complete Electron main-process integration with equivalent
JavaScript and TypeScript implementations. Both variants share the same locale
resources and demonstrate the same application menu.

The example uses Electron 43 and requires Node.js 22.12 or newer. This does not
change the library's Node.js 16 runtime compatibility.

## How the pieces fit together

```text
src/
├── javascript/
│   ├── main.js
│   ├── i18n.js
│   └── menu.js
├── typescript/
│   ├── main.ts
│   ├── i18n.ts
│   └── menu.ts
└── locales/
    ├── en.json
    └── pl.json
```

In either implementation, `main` waits for Electron and chooses the language,
`i18n` initializes i18next, and `menu` builds and localizes a normal Electron
menu template.

The package does not create your menu and it does not replace Electron roles.
You continue to define a regular `MenuItemConstructorOptions[]` template:

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
of its Edit and View menus. It therefore supplies those submenu arrays itself:

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

## Build both variants

Build the local package before installing its `file:../..` dependency:

```bash
# From the repository root
npm install
npm run build

cd examples/basic
npm install
npm run build
```

The build compiles the TypeScript implementation and syntax-checks every
JavaScript source file.

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

A normal application using the published package would instead run:

```bash
npm install electron-menu-i18next i18next
```

Both variants select English when Electron's application locale begins with
`en`; otherwise they select Polish. Replace that decision in the relevant
`main` file with your saved language preference if users can choose a language.

When the language changes at runtime, call `i18next.changeLanguage(...)` and
run `installApplicationMenu()` again. Native Electron menus must be rebuilt for
their visible labels to change.

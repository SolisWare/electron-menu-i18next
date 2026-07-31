# Basic Electron example

This is a small but complete Electron main-process integration. It separates
application startup, i18next configuration, menu construction, and translation
resources so you can copy the same structure into an existing application.

## How the pieces fit together

```text
main.ts
  └─ waits for Electron and chooses the application language
      └─ i18n.ts initializes i18next and loads translation resources
          └─ menu.ts creates a normal Electron menu template
              └─ localizeMenuTemplate fills labels on role-based items
                  └─ Electron builds and installs the native menu
```

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

## Run this repository example

Build the local package before installing its `file:../..` dependency:

```bash
# From the repository root
npm install
npm run build

cd examples/basic
npm install
npm start
```

A normal application using the published package would instead run:

```bash
npm install electron-menu-i18next i18next
```

The example selects English when Electron's application locale begins with
`en`; otherwise it selects Polish. Replace that decision in `main.ts` with
your saved language preference if the user can choose a language in your app.

When the language changes at runtime, call `i18next.changeLanguage(...)` and
run `installApplicationMenu()` again. Native Electron menus must be rebuilt for
their visible labels to change.

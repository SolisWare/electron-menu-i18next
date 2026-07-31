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

## Translation resources

[`src/i18n.ts`](./src/i18n.ts) demonstrates the two resource owners:

- `electron-menu-i18next/locales/en/menu.json` supplies the package's English
  `menu.roles.*` template.
- Your application locale files supply custom labels such as `menu.file` and
  translations for whichever `menu.roles.*` entries you support.

The Polish resource intentionally contains only the role translations used by
this example. `fallbackLng: "en"` makes missing Polish entries fall back to the
package's English resource.

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

The example selects Polish when Electron's application locale begins with
`pl`; otherwise it selects English. Replace that decision in `main.ts` with
your saved language preference if the user can choose a language in your app.

When the language changes at runtime, call `i18next.changeLanguage(...)` and
run `installApplicationMenu()` again. Native Electron menus must be rebuilt for
their visible labels to change.

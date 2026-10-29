<!--
Copyright (c) 2026 SolisWare and contributors.

All rights reserved. Licensed under the MIT license.
See the LICENSE file in the project root directory for details.
-->

# Electron-generated submenus example

This runnable TypeScript example demonstrates the three-argument
`localizeMenuTemplate` overload. It is intended for Electron roles such as
`appMenu`, `fileMenu`, `editMenu`, `viewMenu`, and `windowMenu` that can generate
their own submenu items during `Menu.buildFromTemplate`.

The entire menu template is intentionally short:

```ts
const template: MenuItemConstructorOptions[] = [
  ...(process.platform === "darwin" ? [{ role: "appMenu" }] : []),
  { role: "windowMenu" },
];
```

Those generated child items are absent from the template. Passing Electron's
builder as the third argument lets the package localize them after Electron
creates them:

```ts
const menu = localizeMenuTemplate(
  template,
  {
    t: translate,
    appName: app.name,
  },
  Menu.buildFromTemplate,
);
```

Use the [basic example](../basic/README.md) instead when all role items are
explicitly present in the template and you only need the two-argument overload.

## Run the example

The example uses Electron 43 and requires Node.js 22.12 or newer.

```bash
# From the repository root
npm ci
npm run build

cd examples/generated-submenus
npm ci
npm start
```

For demonstration purposes, the example selects English when Electron's locale
begins with `en` and Polish otherwise. Replace that line in `src/main.mts` with
your application's own supported-locale logic or saved language preference.

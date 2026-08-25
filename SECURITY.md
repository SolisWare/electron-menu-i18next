<!--
Copyright (c) 2026 SolisWare and contributors.

All rights reserved. Licensed under the MIT license.
See the LICENSE file in the project root directory for details.
-->

# Security Policy

## Supported versions

Security updates are provided for the latest published version of
`@solisware/electron-menu-i18next`.

| Version | Supported |
|---|---|
| Latest published version | Yes |
| Older versions | No |

## Report a vulnerability

Do not disclose suspected vulnerabilities in a public issue, discussion, or
pull request.

Report them privately through one of these channels:

- [GitHub private vulnerability reporting](https://github.com/SolisWare/electron-menu-i18next/security/advisories/new)
- Email [solisware@mail.com](mailto:solisware@mail.com)

Include as much of the following information as possible:

- A description of the vulnerability and its potential impact
- The affected package, i18next, Node.js, and Electron versions
- Steps or a minimal project that reproduces the issue
- A sanitized menu template, localization options, and relevant translation
  resources
- The resulting localized template or native-menu behavior
- Any known mitigations or suggested fixes
- Whether the vulnerability has been disclosed elsewhere

Do not include secrets, credentials, unpublished translations, or personal
information that are not required to reproduce the issue. Remove unrelated
application data before sharing templates or translation resources.

## Security-sensitive areas

Reports are particularly useful when they involve:

- Crafted roles or `keyPrefix` values accessing translation resources outside
  the intended menu namespace
- Prototype pollution, input mutation, or modification of objects outside the
  returned menu-template copy
- Cyclic or deeply nested submenus causing a meaningful denial of service
- Malformed translator results or fallback labels causing code execution,
  unintended native-menu behavior, or disclosure of unrelated data
- Package imports that execute Electron, i18next, or application behavior
- Type declarations that conceal a runtime trust-boundary violation

This package does not import Electron or register IPC. An incorrect or missing
menu label is normally a regular bug. Treat it as a security report when it
crosses a data or process trust boundary, mutates unintended state, exposes
unrelated translation data, enables code execution, or can be abused for a
meaningful denial of service.

## What to expect

SolisWare will review the report, confirm receipt, investigate the affected
versions, and coordinate remediation and disclosure with the reporter. Please
allow time for a fix to be prepared and released before publicly disclosing the
vulnerability.

If an issue originates in Electron, i18next, Node.js, npm, or another
dependency, report it to that project's security team when the source is clear.
If the source is uncertain or the issue involves this package's integration
with a dependency, report it to SolisWare first.

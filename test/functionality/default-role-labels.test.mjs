/**
 * Copyright (c) 2026 SolisWare.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 */
import assert from "node:assert/strict";

import { DEFAULT_ROLE_LABELS } from "electron-menu-i18next";
import testUtilities from "../test-utils.cjs";

const { test } = testUtilities;

// Source: https://www.electronjs.org/docs/latest/api/menu-item#new-menuitemoptions
const electronRoles = [
  "undo",
  "redo",
  "cut",
  "copy",
  "paste",
  "pasteAndMatchStyle",
  "delete",
  "selectAll",
  "reload",
  "forceReload",
  "toggleDevTools",
  "resetZoom",
  "zoomIn",
  "zoomOut",
  "toggleSpellChecker",
  "togglefullscreen",
  "window",
  "minimize",
  "close",
  "help",
  "about",
  "services",
  "hide",
  "hideOthers",
  "unhide",
  "quit",
  "showSubstitutions",
  "toggleSmartQuotes",
  "toggleSmartDashes",
  "toggleTextReplacement",
  "startSpeaking",
  "stopSpeaking",
  "zoom",
  "front",
  "appMenu",
  "fileMenu",
  "editMenu",
  "viewMenu",
  "shareMenu",
  "recentDocuments",
  "toggleTabBar",
  "selectNextTab",
  "selectPreviousTab",
  "showAllTabs",
  "mergeAllWindows",
  "clearRecentDocuments",
  "moveTabToNewWindow",
  "windowMenu",
];

test("provides a fallback label for every documented Electron role", () => {
  const fallbackRoles = Object.keys(DEFAULT_ROLE_LABELS).sort();

  assert.deepEqual(fallbackRoles, electronRoles.sort());
});

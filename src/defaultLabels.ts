/**
 * Copyright (c) 2026 SolisWare.
 * 
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE.txt file in the project root directory for details.
 *
 * Electron's own default English labels for role-based menu items, so a
 * missing translation key degrades to correct English rather than a raw
 * role string like "toggleDevTools". Roles that embed the app name use
 * the {{appName}} interpolation token.
 *
 * Source of truth: Electron's MenuItem role docs.
 * https://www.electronjs.org/docs/latest/api/menu-item#roles
 */
export const DEFAULT_ROLE_LABELS: Record<string, string> = {
  undo: "Undo",
  redo: "Redo",
  cut: "Cut",
  copy: "Copy",
  paste: "Paste",
  pasteAndMatchStyle: "Paste and Match Style",
  delete: "Delete",
  selectAll: "Select All",
  toggleSpellChecker: "Check Spelling While Typing",

  reload: "Reload",
  forceReload: "Force Reload",
  toggleDevTools: "Toggle Developer Tools",

  resetZoom: "Actual Size",
  zoomIn: "Zoom In",
  zoomOut: "Zoom Out",
  togglefullscreen: "Toggle Full Screen",

  window: "Window",
  minimize: "Minimize",
  close: "Close",
  zoom: "Zoom",
  front: "Bring All to Front",

  help: "Help",
  about: "About {{appName}}",
  services: "Services",
  hide: "Hide {{appName}}",
  hideOthers: "Hide Others",
  unhide: "Show All",
  quit: "Quit {{appName}}",

  showSubstitutions: "Show Substitutions",
  toggleSmartQuotes: "Smart Quotes",
  toggleSmartDashes: "Smart Dashes",
  toggleTextReplacement: "Text Replacement",

  startSpeaking: "Start Speaking",
  stopSpeaking: "Stop Speaking",

  appMenu: "{{appName}}",
  fileMenu: "File",
  editMenu: "Edit",
  viewMenu: "View",
  windowMenu: "Window",
  shareMenu: "Share",
  recentDocuments: "Open Recent",
  clearRecentDocuments: "Clear Menu",

  toggleTabBar: "Show Tab Bar",
  selectNextTab: "Select Next Tab",
  selectPreviousTab: "Select Previous Tab",
  showAllTabs: "Show All Tabs",
  mergeAllWindows: "Merge All Windows",
  moveTabToNewWindow: "Move Tab to New Window",
};

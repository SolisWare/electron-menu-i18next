/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */
export function createTranslator(translations = {}) {
  return (key, options) => {
    const label = translations[key] ?? options.defaultValue;

    return label.replace(/\{\{\s*(\w+)\s*\}\}/g, (placeholder, variable) => {
      const value = options[variable];
      return value === undefined ? placeholder : String(value);
    });
  };
}

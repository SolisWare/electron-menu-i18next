/**
 * Copyright (c) 2026 SolisWare and contributors.
 *
 * All rights reserved. Licensed under the MIT license.
 * See the LICENSE file in the project root directory for details.
 */

const { rmSync } = require("node:fs");
const { resolve } = require("node:path");

rmSync(resolve(__dirname, "../dist"), { force: true, recursive: true });

#!/usr/bin/env node

import { execSync } from "child_process"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const auditScript = resolve(__dirname, "..", "scripts", "token-audit.js")

try {
  execSync(`node "${auditScript}" ${process.argv.slice(2).join(" ")}`, {
    cwd: process.cwd(),
    stdio: "inherit",
  })
} catch (e) {
  process.exit(e.status || 1)
}

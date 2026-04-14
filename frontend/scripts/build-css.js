import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const distStyles = resolve(root, "dist/styles")

// Ensure output directory exists
mkdirSync(distStyles, { recursive: true })

// Read source files
const globals = readFileSync(resolve(root, "src/app/globals.css"), "utf-8")
const tokens = readFileSync(resolve(root, "src/app/tokens.css"), "utf-8")

// Strip framework-specific imports that consumers provide themselves
const stripped = globals
  .replace(/^@import\s+"tailwindcss";\n?/m, "")
  .replace(/^@import\s+"tw-animate-css";\n?/m, "")
  .replace(/^@import\s+"shadcn\/tailwind\.css";\n?/m, "")
  .replace(/^@import\s+"\.\/tokens\.css";\n?/m, "")

// Combined entry point for consumers
const combined = `/* @paids/ui — Design System Tokens & Theme
 * Consumer setup:
 *   @import "tailwindcss";
 *   @import "tw-animate-css";
 *   @import "@paids/ui/styles.css";
 *   @source "../node_modules/@paids/ui/dist";
 */

${stripped.trim()}

/* ============================================================================
   Tokens — Spacing, Typography, Radius, Z-Index, Motion, Focus, Borders, Layout
   ============================================================================ */

${tokens.trim()}
`

writeFileSync(resolve(distStyles, "paids.css"), combined)
console.log("✓ dist/styles/paids.css")

// Also copy individual files for granular imports
writeFileSync(resolve(distStyles, "globals.css"), stripped)
console.log("✓ dist/styles/globals.css")

writeFileSync(resolve(distStyles, "tokens.css"), tokens)
console.log("✓ dist/styles/tokens.css")

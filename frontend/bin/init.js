#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const cwd = process.cwd()

const CLAUDE_MD_CONTENT = `
## PAIDS Design System (@paids/ui)

When working with UI components from \`@paids/ui\`, **read the relevant spec file before implementing or changing a component**.

### Spec Locations (in node_modules)

- **Foundation specs:** \`node_modules/@paids/ui/specs/foundations/\` (color, spacing, typography, radius, elevation, motion)
- **Component specs:** \`node_modules/@paids/ui/specs/components/\` (one file per component)
- **Token reference:** \`node_modules/@paids/ui/specs/tokens/token-reference.md\` (master map of every CSS variable)

### Token Rules

Use only design tokens — **never hardcode** hex colors, rgba values, pixel spacing, font sizes, border radii, z-index values, or transition durations.

| Layer | Prefix | Rule |
|-------|--------|------|
| 1 — Palette | \`--paids-*\` | Raw values. Never use directly in components. |
| 2 — Semantic | \`--bg-*\`, \`--text-*\`, \`--border-*\`, \`--shadow-*\` | Meaningful aliases. Switch in dark mode. |
| 3 — Components | Tailwind utilities | Reference Layer 2 via \`bg-bg-brand\`, \`text-text-primary\`, etc. |

### Common Token Mappings

| Instead of... | Use... |
|---|---|
| \`ring-[3px]\` | \`ring-[length:var(--focus-ring-width)]\` |
| \`text-[10px]\` | \`text-[length:var(--text-2xs)]\` |
| \`rounded-[2px]\` | \`rounded-[var(--radius-xs)]\` |
| \`rounded-[4px]\` | \`rounded-[var(--radius-checkbox)]\` |
| \`bg-[#hexcolor]\` | Semantic token: \`bg-bg-brand\`, \`bg-bg-danger\`, etc. |
| \`border-[1.5px]\` | \`border-[length:var(--border-width-thick)]\` |
| \`leading-[1.43]\` | \`leading-[var(--leading-body)]\` |

### Token Audit

Run before committing to verify token compliance:
\`\`\`bash
npx @paids/ui audit
\`\`\`
`

// --- Update or create CLAUDE.md ---
const claudePath = resolve(cwd, "CLAUDE.md")
const marker = "## PAIDS Design System (@paids/ui)"

if (existsSync(claudePath)) {
  const existing = readFileSync(claudePath, "utf-8")
  if (existing.includes(marker)) {
    console.log("✓ CLAUDE.md already contains PAIDS instructions — skipped")
  } else {
    writeFileSync(claudePath, existing.trimEnd() + "\n" + CLAUDE_MD_CONTENT)
    console.log("✓ Appended PAIDS instructions to CLAUDE.md")
  }
} else {
  writeFileSync(claudePath, "# Project AI Guide\n" + CLAUDE_MD_CONTENT)
  console.log("✓ Created CLAUDE.md with PAIDS instructions")
}

// --- Add audit script to package.json ---
const pkgPath = resolve(cwd, "package.json")
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  if (!pkg.scripts) pkg.scripts = {}

  if (!pkg.scripts["paids:audit"]) {
    pkg.scripts["paids:audit"] = "node node_modules/@paids/ui/scripts/token-audit.js"
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
    console.log('✓ Added "paids:audit" script to package.json')
  } else {
    console.log('✓ "paids:audit" script already exists — skipped')
  }
}

console.log(`
Setup complete! Next steps:

1. Add to your main CSS file:
   @import "tailwindcss";
   @import "tw-animate-css";
   @import "@paids/ui/styles.css";
   @source "../node_modules/@paids/ui/dist";

2. Import components:
   import { Button, Card } from '@paids/ui'

3. For dark mode, add className="dark" to <html> (or use next-themes)
`)

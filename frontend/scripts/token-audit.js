#!/usr/bin/env node

/**
 * PAIDS Token Audit Script
 *
 * Scans CSS and TSX files for hardcoded visual values that should use
 * design tokens from tokens.css / globals.css.
 *
 * Exit codes:
 *   0 — No errors (warnings may exist)
 *   1 — Errors found (hardcoded colors, spacing, etc.)
 *
 * Usage:
 *   node scripts/token-audit.js            # scan default paths
 *   node scripts/token-audit.js --fix      # show suggestions only (no auto-fix)
 *   node scripts/token-audit.js --quiet    # errors only, no warnings
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..");
const SCAN_DIRS = [
  path.join(ROOT, "src/components/ui"),
  path.join(ROOT, "src/components/docs"),
  path.join(ROOT, "src/app"),
];
const EXTENSIONS = [".tsx", ".ts", ".css"];

// Files/patterns to skip
const SKIP_PATTERNS = [
  /globals\.css$/, // Token definitions live here
  /tokens\.css$/,  // Token definitions live here
  /theme-presets\.ts$/, // Theme preset definitions
  /node_modules/,
];

const QUIET = process.argv.includes("--quiet");

// ---------------------------------------------------------------------------
// Token suggestion maps
// ---------------------------------------------------------------------------

const HEX_TO_TOKEN = {
  "#ff5500": "--bg-brand / --text-brand",
  "#ffeee5": "--bg-brand-inverted (light)",
  "#f94777": "Add to palette or use --bg-danger",
  "#ffffff": "--bg-primary / --text-white / --paids-bw-white",
  "#000000": "--bg-primary-inverted / --paids-bw-black",
  "#ccc": "--border-secondary",
  "#fff": "--text-white",
};

const ARBITRARY_SUGGESTIONS = {
  // Focus rings
  "ring-[3px]": "ring-[length:var(--focus-ring-width)]",
  // Font sizes
  "text-[10px]": "text-[length:var(--text-2xs)]",
  "text-[8px]": "text-[length:var(--text-2xs)] (or smaller custom token)",
  "text-[9px]": "text-[length:var(--text-2xs)]",
  "text-[0.8rem]": "text-[length:var(--text-sm)]",
  "text-[14px]": "text-sm (Tailwind default)",
  // Border radius
  "rounded-[2px]": "rounded-[var(--radius-xs)]",
  "rounded-[4px]": "rounded-[var(--radius-checkbox)]",
  "rounded-[5px]": "rounded-[var(--radius-logo)]",
  "rounded-[10px]": "rounded-[var(--radius-card)]",
  // Min widths
  "min-w-[8rem]": "min-w-[var(--popover-min-width)]",
  "min-w-[12rem]": "min-w-[var(--popover-min-width-lg)]",
  // Dimensions
  "max-h-[300px]": "max-h-[var(--command-list-max-height)]",
  "max-h-[80vh]": "max-h-[var(--drawer-max-height)]",
  "w-[100px]": "w-[var(--drawer-handle-width)]",
  "w-[52px]": "w-[var(--sidebar-width-collapsed)]",
  "w-[260px]": "w-[var(--sidebar-width-expanded)]",
  "w-[2px]": "w-[var(--sidebar-resize-handle)]",
  // Line heights
  "leading-[1.43]": "leading-[var(--leading-body)]",
  "leading-[1.33]": "leading-[var(--leading-snug)]",
  "leading-[1.3]": "leading-[var(--leading-heading)]",
  // Tracking
  "tracking-[-0.24px]": "tracking-[var(--tracking-tight)]",
  // Border widths
  "border-[1.5px]": "border-[length:var(--border-width-thick)]",
  // Durations
  "duration-100": "duration-[var(--duration-fast)]",
  "duration-200": "duration-[var(--duration-normal)]",
  "duration-300": "duration-[var(--duration-slow)]",
  "duration-500": "duration-[var(--duration-slower)]",
  "duration-1000": "duration-[var(--duration-slowest)]",
};

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/**
 * @typedef {{ severity: 'error' | 'warning', pattern: RegExp, category: string, suggest: (match: string) => string }} Rule
 */

/** @type {Rule[]} */
const RULES = [
  // ERRORS — must be fixed
  {
    severity: "error",
    category: "Hardcoded hex color",
    pattern: /(?:bg|text|border|from|via|to|fill|stroke|ring|outline|shadow|decoration)-\[#[0-9a-fA-F]{3,8}\]/g,
    suggest: (match) => {
      const hex = match.match(/#[0-9a-fA-F]{3,8}/)?.[0]?.toLowerCase() || "";
      return HEX_TO_TOKEN[hex] || `Replace with semantic token from globals.css`;
    },
  },
  {
    severity: "error",
    category: "Hardcoded rgba/rgb color",
    pattern: /(?:bg|text|border|from|via|to|shadow)-\[rgba?\([^)]+\)\]/g,
    suggest: () => "Replace with semantic color token (--bg-*, --text-*, --border-*)",
  },
  {
    severity: "error",
    category: "Hardcoded hex in attribute selector",
    pattern: /\[(?:stroke|fill|color)='#[0-9a-fA-F]{3,8}'\]/g,
    suggest: () => "Use CSS custom property or semantic token",
    // Skip Recharts CSS selectors — they match library-rendered SVG attributes
    skipLine: (line) => line.includes("recharts"),
  },
  {
    severity: "error",
    category: "Hardcoded focus ring width",
    pattern: /ring-\[3px\]/g,
    suggest: () => ARBITRARY_SUGGESTIONS["ring-[3px]"],
  },
  {
    severity: "error",
    category: "Hardcoded font size",
    pattern: /text-\[\d+(?:\.\d+)?(?:px|rem)\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Use typography token (--text-2xs through --text-4xl)",
  },
  {
    severity: "error",
    category: "Hardcoded border radius",
    pattern: /rounded-\[\d+(?:\.\d+)?px\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Use radius token (--radius-xs through --radius-4xl)",
  },
  {
    severity: "error",
    category: "Hardcoded line height",
    pattern: /leading-\[\d+(?:\.\d+)?\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Use line-height token (--leading-*)",
  },
  {
    severity: "error",
    category: "Hardcoded letter spacing",
    pattern: /tracking-\[-?\d+(?:\.\d+)?(?:px|em)\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Use tracking token (--tracking-*)",
  },
  {
    severity: "error",
    category: "Hardcoded min-width (popover)",
    pattern: /min-w-\[(?:8|12)rem\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Use --popover-min-width token",
  },

  // WARNINGS — should be fixed but lower priority
  {
    severity: "warning",
    category: "Hardcoded duration",
    pattern: /\bduration-(?:100|200|300|500|1000)\b/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Use duration token (--duration-*)",
  },
  {
    severity: "warning",
    category: "Hardcoded border width",
    pattern: /border-\[\d+(?:\.\d+)?px\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Use border-width token (--border-width-*)",
  },
  {
    severity: "warning",
    category: "Hardcoded max-height",
    pattern: /max-h-\[\d+(?:px|vh)\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Consider extracting to a layout token",
  },
  {
    severity: "warning",
    category: "Hardcoded component dimension",
    pattern: /(?:w|h|size)-\[\d+px\]/g,
    suggest: (match) => ARBITRARY_SUGGESTIONS[match] || "Consider using a layout token or Tailwind default",
    // Demo files use fixed dimensions intentionally for component previews
    skipFile: (filePath) => filePath.includes("/demos/"),
  },
  {
    severity: "warning",
    category: "Hardcoded z-index",
    pattern: /z-\[\d+\]/g,
    suggest: () => "Use z-index token (--z-base through --z-max)",
  },
];

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------

function getFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (SKIP_PATTERNS.some((p) => p.test(fullPath))) continue;
    if (entry.isDirectory()) {
      results.push(...getFiles(fullPath));
    } else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip lines that are CSS variable declarations (Layer 1/2 definitions)
    if (/^\s*--[\w-]+\s*:/.test(line)) continue;
    // Skip comment lines
    if (/^\s*\/[/*]/.test(line)) continue;
    // Skip lines inside @theme blocks (token definitions)
    // (simple heuristic — if line contains only a CSS variable assignment, skip)
    if (/^\s*--[\w-]+:/.test(line)) continue;

    for (const rule of RULES) {
      if (QUIET && rule.severity === "warning") continue;
      if (rule.skipLine && rule.skipLine(line)) continue;
      if (rule.skipFile && rule.skipFile(path.relative(ROOT, filePath))) continue;

      // Reset lastIndex for global regexps
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(line)) !== null) {
        violations.push({
          file: path.relative(ROOT, filePath),
          line: lineNum,
          column: match.index + 1,
          severity: rule.severity,
          category: rule.category,
          value: match[0],
          suggestion: rule.suggest(match[0]),
        });
      }
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const files = SCAN_DIRS.flatMap(getFiles);
  const allViolations = [];

  for (const file of files) {
    const violations = auditFile(file);
    allViolations.push(...violations);
  }

  const errors = allViolations.filter((v) => v.severity === "error");
  const warnings = allViolations.filter((v) => v.severity === "warning");

  // Print results
  if (allViolations.length === 0) {
    console.log("\x1b[32m✓ No token violations found.\x1b[0m");
    process.exit(0);
  }

  // Group by file
  const byFile = {};
  for (const v of allViolations) {
    if (!byFile[v.file]) byFile[v.file] = [];
    byFile[v.file].push(v);
  }

  for (const [file, violations] of Object.entries(byFile)) {
    console.log(`\n\x1b[1m${file}\x1b[0m`);
    for (const v of violations) {
      const icon = v.severity === "error" ? "\x1b[31m✗\x1b[0m" : "\x1b[33m⚠\x1b[0m";
      console.log(
        `  ${icon} Line ${v.line}: ${v.category} → \x1b[36m${v.value}\x1b[0m`
      );
      console.log(`    Suggestion: ${v.suggestion}`);
    }
  }

  // Summary
  console.log(`\n${"─".repeat(60)}`);
  console.log(
    `\x1b[31m${errors.length} error(s)\x1b[0m, \x1b[33m${warnings.length} warning(s)\x1b[0m across ${Object.keys(byFile).length} file(s)`
  );
  console.log(`Scanned ${files.length} files total.\n`);

  if (errors.length > 0) {
    console.log("\x1b[31mAudit failed. Fix errors before committing.\x1b[0m");
    process.exit(1);
  } else {
    console.log(
      "\x1b[33mWarnings found but no errors. Consider fixing warnings.\x1b[0m"
    );
    process.exit(0);
  }
}

main();

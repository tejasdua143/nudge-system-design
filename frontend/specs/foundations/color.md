# Color

## Metadata
- **Category:** Foundation
- **Status:** Stable

## Architecture

PAIDS uses a three-layer color token architecture:

| Layer | Prefix | Purpose | Example |
|-------|--------|---------|---------|
| 1 — Palette | `--paids-*` | Raw hex/rgba from Figma. Never changes between modes. | `--paids-brand-500: #ff5500` |
| 2 — Semantic | `--bg-*`, `--text-*`, `--border-*`, `--shadow-*` | Assigns meaning. Switches in `.dark`. | `--bg-brand: var(--paids-brand-500)` |
| 3 — Tailwind | `--color-*` | Exposes Layer 2 as utility classes. | `bg-bg-brand` |

## Source Palette (Layer 1)

### Brand
| Token | Value | Swatch |
|-------|-------|--------|
| `--paids-brand-50` | `#ffeee5` | Light tint |
| `--paids-brand-100` | `#ffd1ba` | |
| `--paids-brand-200` | `#ffb48f` | |
| `--paids-brand-300` | `#ff9766` | |
| `--paids-brand-400` | `#ff783b` | |
| `--paids-brand-500` | `#ff5500` | Primary brand |
| `--paids-brand-600` | `#cb4609` | |
| `--paids-brand-700` | `#9a380d` | |
| `--paids-brand-800` | `#6b290d` | |
| `--paids-brand-900` | `#401b09` | |
| `--paids-brand-950` | `#1a0900` | Darkest |

### Neutral
| Token | Value |
|-------|-------|
| `--paids-neutral-50` | `#fafafa` |
| `--paids-neutral-100` | `#f5f5f5` |
| `--paids-neutral-200` | `#e5e5e5` |
| `--paids-neutral-300` | `#d4d4d4` |
| `--paids-neutral-400` | `#a3a3a3` |
| `--paids-neutral-500` | `#737373` |
| `--paids-neutral-600` | `#525252` |
| `--paids-neutral-700` | `#404040` |
| `--paids-neutral-800` | `#262626` |
| `--paids-neutral-900` | `#171717` |
| `--paids-neutral-950` | `#0a0a0a` |

### Status Colors
Each status scale (Red, Green, Blue, Yellow) has shades 50–950. See `tokens.css` and `globals.css` for full values.

- **Red** — Danger / destructive actions
- **Green** — Success / confirmation
- **Blue** — Info / links
- **Yellow** — Warning / caution

### Alpha Scales
- **Alpha Light** (`--paids-alpha-light-*`) — `rgba(26,26,26,opacity)` for light mode overlays
- **Alpha Dark** (`--paids-alpha-dark-*`) — `rgba(255,255,255,opacity)` for dark mode overlays

## Semantic Tokens (Layer 2)

### Background
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg-primary` | white | neutral-900 | Page background |
| `--bg-secondary` | neutral-50 | near-black | Section backgrounds |
| `--bg-tertiary` | neutral-100 | darkest | Inset areas, muted |
| `--bg-quaternary` | neutral-200 | black | Deepest inset |
| `--bg-elevated` | white | neutral-800 | Cards, popovers |
| `--bg-elevated-hover` | alpha-light | alpha-dark | Elevated hover state |
| `--bg-brand` | brand-500 | brand-500 | Primary action fills |
| `--bg-brand-hover` | brand-600 | brand-600 | Primary hover |
| `--bg-brand-pressed` | brand-700 | brand-700 | Primary pressed |
| `--bg-brand-selected` | brand @ 12% | brand @ 10% | Selected state |
| `--bg-brand-inverted` | brand-50 | brand-900 | Soft brand background |
| `--bg-danger` | red-600 | red-500 | Error/destructive fills |
| `--bg-warning` | yellow-500 | yellow-400 | Warning fills |
| `--bg-success` | green-600 | green-500 | Success fills |
| `--bg-info` | blue-600 | blue-500 | Informational fills |

### Text
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--text-primary` | neutral-900 | neutral-50 | Body text |
| `--text-secondary` | neutral-600 | neutral-400 | Secondary/muted text |
| `--text-tertiary` | neutral-400 | neutral-600 | Placeholder, disabled |
| `--text-brand` | brand-500 | brand-400 | Links, brand text |
| `--text-danger-primary` | red-700 | red-400 | Error messages |
| `--text-warning-primary` | yellow-700 | yellow-400 | Warning messages |
| `--text-success-primary` | green-700 | green-400 | Success messages |
| `--text-info-primary` | blue-700 | blue-400 | Info messages |
| `--text-white` | white | white | Text on filled backgrounds |

### Border
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--border-tertiary` | alpha-light 6% | alpha-dark 4% | Subtle dividers |
| `--border-secondary` | alpha-light 9% | alpha-dark 9% | Default borders |
| `--border-primary` | alpha-light 20% | alpha-dark 18% | Prominent borders |
| `--border-brand` | brand-500 | brand-500 | Focus/selected borders |
| `--border-danger` | red-600 | red-400 | Error borders |

## Usage Rules

1. **Never use Layer 1 tokens directly in components.** Always go through Layer 2.
2. **Never hardcode hex/rgba in component files.** Use `var(--token)` or Tailwind utility classes.
3. **Use Tailwind utilities** like `bg-bg-brand`, `text-text-primary`, `border-border-secondary`.
4. **Status colors** should use semantic tokens, not palette shades — e.g. `text-text-danger-primary`, not `text-paids-red-700`.

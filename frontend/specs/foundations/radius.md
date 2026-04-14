# Border Radius

## Metadata
- **Category:** Foundation
- **Status:** Stable

## Overview

Radius values are derived from the `--radius` base variable (default `0.5rem`). The base can be changed via theme presets to create different visual styles (none, small, medium, large, full).

## Scale

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--radius-none` | `0px` | `rounded-none` | No rounding |
| `--radius-xs` | `2px` | `rounded-[var(--radius-xs)]` | Tiny indicators, tooltip arrows |
| `--radius-sm` | `calc(--radius - 4px)` | `rounded-sm` | Inner nested elements |
| `--radius-md` | `calc(--radius - 2px)` | `rounded-md` | Buttons, inputs, badges |
| `--radius-default` | `var(--radius)` | `rounded` | Default component radius |
| `--radius-lg` | `var(--radius)` | `rounded-lg` | Cards, dialogs |
| `--radius-xl` | `calc(--radius + 4px)` | `rounded-xl` | Large containers |
| `--radius-2xl` | `calc(--radius + 8px)` | `rounded-2xl` | Modals, sheets |
| `--radius-3xl` | `calc(--radius + 12px)` | `rounded-3xl` | Hero sections |
| `--radius-4xl` | `calc(--radius + 16px)` | `rounded-4xl` | Full-width banners |
| `--radius-full` | `9999px` | `rounded-full` | Circles, pills |

## Semantic Aliases

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-checkbox` | `4px` | Checkbox indicator |
| `--radius-card` | `10px` | Card containers |
| `--radius-logo` | `5px` | Logo/brand mark containers |

## Usage Rules

1. **Prefer Tailwind `rounded-*` utilities** which use the theme radius scale.
2. **Avoid arbitrary radius values** like `rounded-[10px]` — use the nearest token.
3. **Nested elements** should use a smaller radius than their parent (e.g., parent `rounded-lg`, child `rounded-md`).
4. **Themed radius** — the `--radius` base changes with theme presets. All calc-based tokens update automatically.

# PAIDS Design System — AI Development Guide

## Before Writing or Modifying Any UI Code

1. **Read the relevant spec file** in `specs/` before implementing or changing a component.
   - Foundation specs: `specs/foundations/` (color, spacing, typography, radius, elevation, motion)
   - Component specs: `specs/components/` (one file per component)
   - Token reference: `specs/tokens/token-reference.md` (master map of every CSS variable)

2. **Use only tokens from `tokens.css` and `globals.css`.**
   Never hardcode hex colors, rgba values, pixel spacing, font sizes, border radii, z-index values, or transition durations directly in component code.

3. **Run the token audit script before committing.** Zero errors required.
   ```bash
   node scripts/token-audit.js
   ```

## Token Architecture

The design system uses a three-layer token architecture:

| Layer | Location | Prefix | Rule |
|-------|----------|--------|------|
| 1 — Palette | `globals.css` `:root` | `--paids-*` | Raw hex/rgba values. Never use directly in components. |
| 2 — Semantic | `globals.css` `:root` / `.dark` | `--bg-*`, `--text-*`, `--border-*`, `--shadow-*` | Meaningful aliases. Switch automatically in dark mode. |
| 3 — Components | Component files | Tailwind utilities | Only reference Layer 2 via utility classes like `bg-bg-brand`, `text-text-primary`. |

Additional tokens in `tokens.css`: spacing, typography, radius, z-index, motion, focus, borders, component layout, gradients.

## Common Token Mappings

| Instead of... | Use... |
|---------------|--------|
| `ring-[3px]` | `ring-[length:var(--focus-ring-width)]` |
| `text-xs` | `text-[length:var(--text-xs)]` (12px — body-sm) |
| `text-sm` | `text-[length:var(--text-base)]` (14px — body-base) |
| `text-base` | `text-[length:var(--text-md)]` (16px — body-lg) |
| `text-lg` | `text-[length:var(--text-lg)]` (18px — body-xl) |
| `text-xl` | `text-[length:var(--text-xl)]` (20px — heading-xl) |
| `text-2xl` | `text-[length:var(--text-2xl)]` (24px — heading-2xl) |
| `text-[8px]` | `text-[length:var(--text-3xs)]` (body-xxs) |
| `text-[10px]` | `text-[length:var(--text-2xs)]` (body-xs) |
| `rounded-[2px]` | `rounded-[var(--radius-xs)]` |
| `rounded-[4px]` | `rounded-[var(--radius-checkbox)]` |
| `min-w-[8rem]` | `min-w-[var(--popover-min-width)]` |
| `leading-[1.43]` | `leading-[var(--leading-body)]` |
| `leading-[1.33]` | `leading-[var(--leading-snug)]` |
| `leading-[1.3]` | `leading-[var(--leading-heading)]` |
| `tracking-[-0.24px]` | `tracking-[var(--tracking-tight)]` |
| `bg-[#hexcolor]` | Semantic token: `bg-bg-brand`, `bg-bg-danger`, etc. |
| `border-[1.5px]` | `border-[length:var(--border-width-thick)]` |

## Project Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **Components:** shadcn/ui (customized) + Radix UI + Base UI
- **Animation:** Motion library (motion/react) + Rive
- **Dark mode:** CSS custom properties in `.dark` selector via next-themes
- **Icons:** Phosphor Icons + Lucide

## File Structure

```
src/
  app/
    globals.css      ← Layer 1 & 2 tokens, dark mode, shadcn compat
    tokens.css       ← Spacing, typography, radius, z-index, motion, focus, layout tokens
  components/
    ui/              ← 56 design system components (Layer 3)
    docs/            ← Documentation components and demos
specs/
  foundations/       ← Color, spacing, typography, radius, elevation, motion specs
  tokens/            ← Master token reference
  components/        ← Per-component specs with anatomy, tokens, states, examples
scripts/
  token-audit.js     ← CI-ready audit script (exit 1 on errors)
```

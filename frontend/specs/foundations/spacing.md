# Spacing

## Metadata
- **Category:** Foundation
- **Status:** Stable

## Overview

PAIDS uses an 8-point grid with micro steps for fine adjustments. All spacing values are defined as CSS custom properties in `tokens.css`.

## Scale

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--space-0` | `0px` | `p-0`, `m-0`, `gap-0` | Reset |
| `--space-px` | `1px` | `p-px` | Hairline offsets |
| `--space-0-5` | `2px` | `p-0.5` | Micro adjustments |
| `--space-1` | `4px` | `p-1` | Tight padding (icons, badges) |
| `--space-1-5` | `6px` | `p-1.5` | Compact element padding |
| `--space-2` | `8px` | `p-2` | Default inline padding |
| `--space-2-5` | `10px` | `p-2.5` | Slightly larger padding |
| `--space-3` | `12px` | `p-3` | Content padding |
| `--space-4` | `16px` | `p-4` | Section padding |
| `--space-5` | `20px` | `p-5` | Card padding |
| `--space-6` | `24px` | `p-6` | Large section padding |
| `--space-8` | `32px` | `p-8` | Page margin |
| `--space-10` | `40px` | `p-10` | Large gap |
| `--space-12` | `48px` | `p-12` | Section separator |
| `--space-16` | `64px` | `p-16` | Page section |
| `--space-20` | `80px` | `p-20` | Hero spacing |
| `--space-24` | `96px` | `p-24` | Maximum spacing |

## Usage Rules

1. **Prefer Tailwind spacing utilities** (`p-4`, `gap-2`, `m-6`) which map to the same 4px grid.
2. **Avoid arbitrary pixel values** like `p-[12px]`. Use the closest standard step instead.
3. **Use `gap` over `margin`** for layout spacing between sibling elements.
4. **Consistent padding** — cards use `p-4` to `p-6`, inline elements use `p-1` to `p-2`.

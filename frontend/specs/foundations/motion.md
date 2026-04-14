# Motion & Transitions

## Metadata
- **Category:** Foundation
- **Status:** Stable

## Overview

Motion in PAIDS uses CSS transitions for simple state changes and the Motion library (framer-motion alternative) for complex animations. All durations are tokenized.

## Duration Scale

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--duration-instant` | `0ms` | — | No transition |
| `--duration-fast` | `100ms` | `duration-100` | Micro-interactions (hover color) |
| `--duration-normal` | `200ms` | `duration-200` | Default transitions (opacity, transform) |
| `--duration-slow` | `300ms` | `duration-300` | Panels, drawers, sheets |
| `--duration-slower` | `500ms` | `duration-500` | Large surface transitions |
| `--duration-slowest` | `1000ms` | `duration-1000` | Background ambient effects |

## Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Element entering view |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Element leaving view |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful motion |

## Motion Library (JS animations)

For complex entrance/exit animations, use the `motion` library:

```tsx
import { motion } from "motion/react"

<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
/>
```

**Duration mapping for JS animations:**
- `--duration-fast` → `0.1`
- `--duration-normal` → `0.2`
- `--duration-slow` → `0.3`
- `--duration-slower` → `0.5`

## Usage Rules

1. **Use Tailwind `duration-*` classes** with standard values (100, 200, 300, 500).
2. **Avoid arbitrary duration values** like `duration-[150ms]`.
3. **Pair transitions** with `transition-colors`, `transition-opacity`, or `transition-all`.
4. **Respect reduced motion** — complex animations should respect `prefers-reduced-motion`.
5. **Keep it subtle** — UI transitions should feel instant. Reserve slow durations for emphasis.

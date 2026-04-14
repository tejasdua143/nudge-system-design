# Elevation & Shadow

## Metadata
- **Category:** Foundation
- **Status:** Stable

## Overview

PAIDS uses a 4-level elevation system. Each level adds progressively stronger drop shadows. Levels 2–4 include an `::after` pseudo-element for inner shadow effects (since `inset box-shadow` renders below children).

## Shadow Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--shadow-drop-1` | `alpha-light-50` (6%) | `rgba(0,0,0,0.1)` | Subtle outer shadow |
| `--shadow-drop-2` | `alpha-light-100` (9%) | `rgba(0,0,0,0.2)` | Primary outer shadow |
| `--shadow-drop-3` | `alpha-light-200` (20%) | `rgba(0,0,0,0.3)` | Heavy outer shadow |
| `--shadow-inner-1` | `alpha-dark-900` (80% white) | `alpha-dark-50` (6% white) | Inner highlight border |
| `--shadow-inner-2` | transparent | `alpha-dark-100` | Secondary inner shadow |

## Elevation Levels

### Level 1 — `shadow-elevation-1`
Flat card with subtle border and tiny drop shadow.
```
box-shadow: 0 0 0 1px var(--shadow-drop-1), 0 1px 2px 0 var(--shadow-drop-2);
```
**Use for:** List items, static containers.

### Level 2 — `shadow-elevation-2`
Slightly raised with inner highlight.
```
box-shadow: 0 0 0 1px var(--shadow-drop-2), 0 1px 2px 0 var(--shadow-drop-2);
::after: inset 0 0 0 1px var(--shadow-inner-1);
```
**Use for:** Cards, selected items.

### Level 3 — `shadow-elevation-3`
Floating element with multiple shadow layers.
```
box-shadow: 0 0 0 1px var(--shadow-drop-2), 0 1px 2px 0, 0 4px 6px 0, 0 24px 40px -16px;
::after: inset 0 0 0 1px var(--shadow-inner-1);
```
**Use for:** Cards on hover, dropdowns, popovers, tooltips.

### Level 4 — `shadow-elevation-4`
Maximum depth with thicker inner border.
```
box-shadow: Multi-layer with drop-2 and drop-3 colors;
::after: inset 0 0 0 1.5px var(--shadow-inner-1);
```
**Use for:** Modals, dialogs, command palette.

## Component Shadow Tokens

| Token | Usage |
|-------|-------|
| `--shadow-button-rest` | Default button shadow |
| `--shadow-button-selected` | Selected/active button |
| `--shadow-button-focused` | Focused button state |
| `--shadow-text-field-rest` | Input/textarea default |
| `--shadow-text-field-focused` | Input focus state |
| `--shadow-text-field-danger` | Input error state |
| `--shadow-prompt-focused` | Search/command prompt focus |

## Usage Rules

1. **Use the Tailwind utilities** `shadow-elevation-1` through `shadow-elevation-4`.
2. **Use component shadow tokens** for specific component states (button, text-field).
3. **Never hardcode shadow values** in components — reference the token variables.
4. **Elevation 2–4 require `position: relative`** on the element (the utility adds this).
5. **Inner shadow elements** get `pointer-events: none` and `z-index: 10` automatically.

# Button

## Metadata
- **Name:** button
- **Category:** Form
- **Status:** Stable
- **File:** `src/components/ui/button.tsx`

## Overview
**When to use:** Primary actions, form submissions, navigation triggers, and interactive controls.
**When not to use:** For navigation links (use anchor tags), or for non-interactive labels (use Badge).

## Anatomy
1. **Root** — `<button>` or `<Slot>` (when `asChild`)
2. **Icon** (optional) — Leading/trailing SVG icon
3. **Label** — Text content

## Variants
| Variant | Description |
|---------|-------------|
| `default` | Solid brand background, white text |
| `destructive` | Red/danger background |
| `outline` | Bordered, transparent background |
| `secondary` | Muted background |
| `ghost` | No background, text only |
| `link` | Underlined text, no padding |
| `rainbow` | Gradient fill using brand gradient tokens |

## Sizes
`default` (h-9), `sm` (h-8), `lg` (h-10), `icon` (size-9)

## Tokens Used
- **Background:** `--bg-brand`, `--bg-danger`, `--bg-secondary`, `--bg-tertiary`
- **Text:** `--text-white`, `--text-primary`, `--text-danger-primary`, `--text-brand`
- **Shadow:** `--shadow-button-rest`, `--shadow-button-focused`
- **Focus:** `--focus-ring-width`
- **Gradient:** `--gradient-brand-start`, `--gradient-brand-mid`, `--gradient-brand-end`

## States
| State | Visual Change |
|-------|--------------|
| Default | Solid fill or outlined |
| Hover | Darker background shade |
| Focus | Focus ring via `--focus-ring-width` |
| Active/Pressed | Slight scale or darker shade |
| Disabled | 50% opacity, no pointer events |

## Code Example
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="default">Save Changes</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive" size="sm">Delete</Button>
```

## Cross-references
- Related: ButtonGroup, Item, Badge

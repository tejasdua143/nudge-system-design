# Token Reference

Master map of every CSS custom property in the PAIDS design system.

## Source Palette (Layer 1)

> Never use these directly in components. Always go through Layer 2 semantic tokens.

### Brand (`--paids-brand-*`)
| Token | Value | Usage |
|-------|-------|-------|
| `--paids-brand-50` | `#ffeee5` | Lightest brand tint |
| `--paids-brand-100` | `#ffd1ba` | Light brand |
| `--paids-brand-200` | `#ffb48f` | Brand highlight |
| `--paids-brand-300` | `#ff9766` | Brand accent light |
| `--paids-brand-400` | `#ff783b` | Brand accent |
| `--paids-brand-500` | `#ff5500` | Primary brand color |
| `--paids-brand-600` | `#cb4609` | Brand hover |
| `--paids-brand-700` | `#9a380d` | Brand pressed |
| `--paids-brand-800` | `#6b290d` | Brand dark |
| `--paids-brand-900` | `#401b09` | Brand darker |
| `--paids-brand-950` | `#1a0900` | Darkest brand |

### Neutral (`--paids-neutral-*`)
| Token | Value | Usage |
|-------|-------|-------|
| `--paids-neutral-50` | `#fafafa` | Near-white background |
| `--paids-neutral-100` | `#f5f5f5` | Light gray |
| `--paids-neutral-200` | `#e5e5e5` | Border gray |
| `--paids-neutral-300` | `#d4d4d4` | Divider gray |
| `--paids-neutral-400` | `#a3a3a3` | Placeholder text |
| `--paids-neutral-500` | `#737373` | Muted text |
| `--paids-neutral-600` | `#525252` | Secondary text |
| `--paids-neutral-700` | `#404040` | Strong secondary |
| `--paids-neutral-800` | `#262626` | Dark background |
| `--paids-neutral-900` | `#171717` | Primary text (light mode) |
| `--paids-neutral-950` | `#0a0a0a` | Near-black |

### Status Colors
Red (`--paids-red-50` to `--paids-red-950`), Green (`--paids-green-*`), Blue (`--paids-blue-*`), Yellow (`--paids-yellow-*`) — each with 11 shades following the same 50–950 scale. See `globals.css` for exact values.

### Alpha Scales
- **Alpha Light** (`--paids-alpha-light-0` to `-1000`) — `rgba(26,26,26,opacity)` for light mode
- **Alpha Dark** (`--paids-alpha-dark-0` to `-1000`) — `rgba(255,255,255,opacity)` for dark mode

### Black & White
| Token | Value |
|-------|-------|
| `--paids-bw-white` | `#ffffff` |
| `--paids-bw-black` | `#000000` |

---

## Semantic Colors (Layer 2)

### Background (`--bg-*`)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg-primary` | white | `rgba(23,23,23,1)` | Page background |
| `--bg-primary-inverted` | black | white | Inverted surfaces |
| `--bg-secondary` | neutral-50 | `rgba(15,15,15,1)` | Section backgrounds |
| `--bg-tertiary` | neutral-100 | `rgba(10,10,10,1)` | Inset/muted areas |
| `--bg-quaternary` | neutral-200 | black | Deepest inset |
| `--bg-elevated` | white | `rgba(31,31,31,1)` | Cards, popovers |
| `--bg-elevated-hover` | alpha 12% | alpha-dark 6% | Hover on elevated |
| `--bg-brand` | brand-500 | brand-500 | Primary action fills |
| `--bg-brand-hover` | brand-600 | brand-600 | Hover on brand |
| `--bg-brand-pressed` | brand-700 | brand-700 | Pressed on brand |
| `--bg-brand-selected` | brand 12% | brand 10% | Selected highlight |
| `--bg-brand-inverted` | brand-50 | brand-900 | Soft brand surface |
| `--bg-danger` | red-600 | red-500 | Error/destructive |
| `--bg-danger-hover` | red-700 | red-400 | Danger hover |
| `--bg-warning` | yellow-500 | yellow-400 | Warning fills |
| `--bg-success` | green-600 | green-500 | Success fills |
| `--bg-info` | blue-600 | blue-500 | Info fills |

### Text (`--text-*`)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--text-primary` | neutral-900 | neutral-50 | Body text |
| `--text-secondary` | neutral-600 | neutral-400 | Muted text |
| `--text-tertiary` | neutral-400 | neutral-600 | Placeholder/disabled |
| `--text-brand` | brand-500 | brand-400 | Links, brand accent |
| `--text-brand-hover` | brand-700 | brand-300 | Brand hover |
| `--text-danger-primary` | red-700 | red-400 | Error messages |
| `--text-warning-primary` | yellow-700 | yellow-400 | Warning text |
| `--text-success-primary` | green-700 | green-400 | Success text |
| `--text-info-primary` | blue-700 | blue-400 | Info text |
| `--text-white` | white | white | Text on filled bg |

### Border (`--border-*`)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--border-tertiary` | 6% alpha | 4% alpha | Subtle dividers |
| `--border-secondary` | 9% alpha | 9% alpha | Default borders |
| `--border-primary` | 20% alpha | 18% alpha | Prominent borders |
| `--border-brand` | brand-500 | brand-500 | Focus/selected |
| `--border-brand-secondary` | brand-200 | brand-700 | Focus ring color |
| `--border-danger` | red-600 | red-400 | Error borders |

### Shadow Colors (`--shadow-*`)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--shadow-drop-1` | alpha 6% | `rgba(0,0,0,0.1)` | Subtle outer |
| `--shadow-drop-2` | alpha 9% | `rgba(0,0,0,0.2)` | Primary outer |
| `--shadow-drop-3` | alpha 20% | `rgba(0,0,0,0.3)` | Heavy outer |
| `--shadow-inner-1` | alpha-dark 80% | alpha-dark 6% | Inner highlight |
| `--shadow-inner-2` | transparent | alpha-dark 9% | Secondary inner |

---

## Component Shadows
| Token | Usage |
|-------|-------|
| `--shadow-button-rest` | Default button shadow |
| `--shadow-button-selected` | Selected button ring |
| `--shadow-button-focused` | Focused button ring |
| `--shadow-text-field-rest` | Input default shadow |
| `--shadow-text-field-focused` | Input focus ring |
| `--shadow-text-field-danger` | Input error ring |
| `--shadow-prompt-focused` | Command prompt focus |
| `--shadow-elevation-1` | Level 1 card shadow |

## Elevation Utilities
| Class | Usage |
|-------|-------|
| `shadow-elevation-1` | Flat cards, list items |
| `shadow-elevation-2` | Interactive cards, hover state |
| `shadow-elevation-3` | Dropdowns, popovers, tooltips |
| `shadow-elevation-4` | Modals, dialogs, command palette |

---

## Spacing (`--space-*`)
| Token | Value | Tailwind |
|-------|-------|----------|
| `--space-0` | `0px` | `p-0` |
| `--space-px` | `1px` | `p-px` |
| `--space-0-5` | `2px` | `p-0.5` |
| `--space-1` | `4px` | `p-1` |
| `--space-1-5` | `6px` | `p-1.5` |
| `--space-2` | `8px` | `p-2` |
| `--space-2-5` | `10px` | `p-2.5` |
| `--space-3` | `12px` | `p-3` |
| `--space-4` | `16px` | `p-4` |
| `--space-5` | `20px` | `p-5` |
| `--space-6` | `24px` | `p-6` |
| `--space-8` | `32px` | `p-8` |
| `--space-10` | `40px` | `p-10` |
| `--space-12` | `48px` | `p-12` |
| `--space-16` | `64px` | `p-16` |
| `--space-20` | `80px` | `p-20` |
| `--space-24` | `96px` | `p-24` |

---

## Typography

### Font Sizes
| Token | Value | Figma style | Usage |
|-------|-------|-------------|-------|
| `--text-3xs` | `0.5rem` (8px) | body-xxs | Micro UI elements |
| `--text-2xs` | `0.625rem` (10px) | body-xs | Micro labels, badges |
| `--text-xs` | `0.75rem` (12px) | body-sm | Small labels |
| `--text-base` | `0.875rem` (14px) | body-base | Default body |
| `--text-md` | `1rem` (16px) | body-lg | Large body |
| `--text-lg` | `1.125rem` (18px) | body-xl / heading-lg | Section headings |
| `--text-xl` | `1.25rem` (20px) | heading-xl | Page headings |
| `--text-2xl` | `1.5rem` (24px) | heading-2xl | Large headings |
| `--text-3xl` | `1.875rem` (30px) | — | Display headings |
| `--text-4xl` | `2.25rem` (36px) | heading-4xl | Hero text |

### Font Weights
| Token | Value | Tailwind |
|-------|-------|----------|
| `--font-weight-regular` | `400` | `font-normal` |
| `--font-weight-medium` | `500` | `font-medium` |
| `--font-weight-semibold` | `600` | `font-semibold` |
| `--font-weight-bold` | `700` | `font-bold` |

### Line Heights
| Token | Value | Usage |
|-------|-------|-------|
| `--leading-none` | `1` | Single-line elements |
| `--leading-tight` | `1.25` | Compact headings |
| `--leading-heading` | `1.3` | Display headings |
| `--leading-snug` | `1.33` | Subheadings |
| `--leading-body` | `1.43` | Body text |
| `--leading-normal` | `1.5` | Default |
| `--leading-relaxed` | `1.625` | Long-form reading |

### Letter Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | `-0.24px` | Headings |
| `--tracking-normal` | `0` | Body text |
| `--tracking-wide` | `0.025em` | Uppercase labels |

---

## Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | `0px` | No rounding |
| `--radius-xs` | `2px` | Tiny indicators |
| `--radius-sm` | `calc(--radius - 4px)` | Inner elements |
| `--radius-md` | `calc(--radius - 2px)` | Buttons, inputs |
| `--radius-lg` | `var(--radius)` | Cards, dialogs |
| `--radius-xl` | `calc(--radius + 4px)` | Large containers |
| `--radius-2xl` | `calc(--radius + 8px)` | Modals |
| `--radius-full` | `9999px` | Circles, pills |
| `--radius-checkbox` | `4px` | Checkbox indicator |
| `--radius-card` | `10px` | Card containers |
| `--radius-logo` | `5px` | Logo containers |

---

## Z-Index
| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default stacking |
| `--z-raised` | `1` | Slightly raised |
| `--z-dropdown` | `10` | Dropdown menus |
| `--z-sticky` | `20` | Sticky headers |
| `--z-overlay` | `30` | Overlay backgrounds |
| `--z-modal` | `40` | Modal dialogs |
| `--z-popover` | `50` | Popovers |
| `--z-toast` | `60` | Toast notifications |
| `--z-tooltip` | `70` | Tooltips |
| `--z-max` | `9999` | Maximum z-index |

---

## Motion
### Durations
| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--duration-instant` | `0ms` | — | No transition |
| `--duration-fast` | `100ms` | `duration-100` | Micro-interactions |
| `--duration-normal` | `200ms` | `duration-200` | Default transitions |
| `--duration-slow` | `300ms` | `duration-300` | Panels, drawers |
| `--duration-slower` | `500ms` | `duration-500` | Large surfaces |
| `--duration-slowest` | `1000ms` | `duration-1000` | Ambient effects |

### Easing
| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entering |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Leaving |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy |

---

## Focus
| Token | Value | Usage |
|-------|-------|-------|
| `--focus-ring-width` | `3px` | Focus ring width |
| `--focus-ring-color` | `var(--border-brand-secondary)` | Focus ring color |
| `--focus-ring-offset` | `0px` | Focus ring offset |

## Border Widths
| Token | Value | Usage |
|-------|-------|-------|
| `--border-width-thin` | `1px` | Subtle borders |
| `--border-width-default` | `1px` | Standard borders |
| `--border-width-thick` | `1.5px` | Emphasized borders |
| `--border-width-heavy` | `2px` | Heavy borders |

## Component Layout
| Token | Value | Usage |
|-------|-------|-------|
| `--popover-min-width` | `8rem` | Dropdown/popover min-width |
| `--popover-min-width-lg` | `12rem` | Large popover min-width |
| `--command-list-max-height` | `300px` | Command palette list height |
| `--drawer-max-height` | `80vh` | Drawer max-height |
| `--drawer-handle-width` | `100px` | Drawer handle bar width |
| `--sidebar-width-collapsed` | `52px` | Sidebar collapsed width |
| `--sidebar-width-expanded` | `260px` | Sidebar expanded width |
| `--sidebar-resize-handle` | `2px` | Sidebar resize handle |
| `--dialog-width-sm` | `380px` | Small dialog width |
| `--dialog-width-md` | `620px` | Medium dialog width |
| `--dialog-width-lg` | `980px` | Large dialog width |

## Gradients
| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-brand-start` | `#FF6B35` | Brand gradient start |
| `--gradient-brand-mid` | `#E84393` | Brand gradient middle |
| `--gradient-brand-end` | `#A855F7` | Brand gradient end |
| `--gradient-accent` | `#f94777` | Decorative accent |
| `--gradient-slide-1a` through `8b` | Various | Presentation slide gradients |

## Scrollbar
| Token | Value | Usage |
|-------|-------|-------|
| `--scrollbar-size` | `6px` | Scrollbar width/height |
| `--scrollbar-thumb-radius` | `3px` | Scrollbar thumb radius |
| `--scrollbar-thumb-light` | `rgba(0,0,0,0.15)` | Light mode thumb |
| `--scrollbar-thumb-dark` | `rgba(255,255,255,0.15)` | Dark mode thumb |

---

## shadcn Compatibility (Layer Compat)

These aliases reference Layer 2 semantic tokens for backward compatibility with shadcn/ui components:

| Token | Maps to |
|-------|---------|
| `--background` | `--bg-primary` |
| `--foreground` | `--text-primary` |
| `--card` | `--bg-elevated` |
| `--primary` | `--bg-brand` |
| `--primary-foreground` | `--text-white` |
| `--secondary` | `--bg-secondary` |
| `--muted` | `--bg-tertiary` |
| `--muted-foreground` | `--text-secondary` |
| `--accent` | `--bg-tertiary` |
| `--destructive` | `--bg-danger` |
| `--border` | `--border-secondary` |
| `--input` | `--border-secondary` |
| `--ring` | `--border-brand` |
| `--chart-1` through `--chart-5` | Brand, green, blue, yellow, red |
| `--sidebar` | `--bg-secondary` |
| `--radius` | `0.5rem` (base for radius calc) |

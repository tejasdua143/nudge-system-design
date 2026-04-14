# Typography

## Metadata
- **Category:** Foundation
- **Status:** Stable

## Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-sans` | Inter | Body text, UI elements |
| `--font-family-mono` | Geist Mono | Code, technical data |

## Font Sizes

| Token | Value | Tailwind | Figma style | Usage |
|-------|-------|----------|-------------|-------|
| `--text-3xs` | `0.5rem` (8px) | `text-[length:var(--text-3xs)]` | body-xxs | Micro UI elements |
| `--text-2xs` | `0.625rem` (10px) | `text-[length:var(--text-2xs)]` | body-xs | Micro labels, badges, captions |
| `--text-xs` | `0.75rem` (12px) | `text-[length:var(--text-xs)]` | body-sm | Small labels, helper text |
| `--text-base` | `0.875rem` (14px) | `text-[length:var(--text-base)]` | body-base | Default body text |
| `--text-md` | `1rem` (16px) | `text-[length:var(--text-md)]` | body-lg | Large body text |
| `--text-lg` | `1.125rem` (18px) | `text-[length:var(--text-lg)]` | body-xl / heading-lg | Section headings |
| `--text-xl` | `1.25rem` (20px) | `text-[length:var(--text-xl)]` | heading-xl | Page headings |
| `--text-2xl` | `1.5rem` (24px) | `text-[length:var(--text-2xl)]` | heading-2xl | Large headings |
| `--text-3xl` | `1.875rem` (30px) | `text-[length:var(--text-3xl)]` | — | Display headings |
| `--text-4xl` | `2.25rem` (36px) | `text-[length:var(--text-4xl)]` | heading-4xl | Hero text |

## Font Weights

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--font-weight-regular` | `400` | `font-normal` | Body text |
| `--font-weight-medium` | `500` | `font-medium` | Labels, buttons |
| `--font-weight-semibold` | `600` | `font-semibold` | Headings, emphasis |
| `--font-weight-bold` | `700` | `font-bold` | Strong emphasis |

## Line Heights

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--leading-none` | `1` | `leading-none` | Single-line icons/buttons |
| `--leading-tight` | `1.25` | `leading-tight` | Compact headings |
| `--leading-heading` | `1.3` | `leading-[var(--leading-heading)]` | Display headings |
| `--leading-snug` | `1.33` | `leading-[var(--leading-snug)]` | Subheadings |
| `--leading-body` | `1.43` | `leading-[var(--leading-body)]` | Body text, paragraphs |
| `--leading-normal` | `1.5` | `leading-normal` | Default line height |
| `--leading-relaxed` | `1.625` | `leading-relaxed` | Long-form reading |

## Letter Spacing

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--tracking-tight` | `-0.24px` | `tracking-[var(--tracking-tight)]` | Headings, display text |
| `--tracking-normal` | `0` | `tracking-normal` | Body text |
| `--tracking-wide` | `0.025em` | `tracking-wide` | Uppercase labels |

## Usage Rules

1. **Always use token variables** for font sizes — e.g., `text-[length:var(--text-base)]`. Never use bare Tailwind utilities like `text-sm` or `text-base` (they clash with CSS custom property names in `tokens.css`).
2. **Never hardcode** `text-[10px]`, `leading-[1.43]`, or `tracking-[-0.24px]` — use the token.
3. **Headings** pair `--leading-heading` or `--leading-snug` with `--tracking-tight`.
4. **Body text** uses `--leading-body` (1.43) for optimal readability.

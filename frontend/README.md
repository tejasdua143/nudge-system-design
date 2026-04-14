# PAIDS Design System

A prototyping base built on Next.js, Tailwind CSS v4, and Radix UI. Ships 56 components, a three-layer token system, dark mode, and LLM-readable specs so AI coding assistants can build with you.

> **Note:** This repo is meant to be cloned and used directly as a starter project — not installed as an npm package.

## Quick Start

```bash
git clone <repo-url>
cd port-louis
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the root index — a directory of every prototype page in the project.

## How This Project Is Built

### Component Specs

Every component has a spec file in `specs/components/` (e.g. `button.md`, `dialog.md`, `table.md`). These specs define:

- **Anatomy** — the parts that make up a component
- **Tokens** — which design tokens the component uses
- **States** — interactive states, variants, and tones
- **Examples** — code snippets showing proper usage

Foundation specs live in `specs/foundations/` covering color, spacing, typography, radius, elevation, and motion. A master token reference lives at `specs/tokens/token-reference.md`.

### Token Architecture

The system uses three layers. Never hardcode colors, spacing, or typography — always use tokens.

| Layer | Location | Prefix | Rule |
|-------|----------|--------|------|
| 1 — Palette | `globals.css` `:root` | `--paids-*` | Raw hex values. Never use directly in components. |
| 2 — Semantic | `globals.css` `:root` / `.dark` | `--bg-*`, `--text-*`, `--border-*`, `--shadow-*` | Meaningful aliases. Switch automatically in dark mode. |
| 3 — Components | Component files | Tailwind utilities | Reference Layer 2 via `bg-bg-brand`, `text-text-primary`, etc. |

### Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **Components:** shadcn/ui (customized) + Radix UI + Base UI
- **Animation:** Motion (motion/react) + Rive
- **Dark mode:** CSS custom properties in `.dark` selector via next-themes
- **Icons:** Phosphor Icons + Lucide

## How to Use This Repo

### Creating a New Prototype Page

Every prototype lives as a route under `src/app/`. To add a new page:

1. Create a folder in `src/app/` with your page name:

```bash
mkdir src/app/my-prototype
```

2. Add a `page.tsx` inside it:

```tsx
export default function MyPrototypePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <h1 className="text-2xl font-medium text-text-primary">
        My Prototype
      </h1>
    </div>
  );
}
```

3. Register it in the root page (`src/app/page.tsx`) so it appears in the index:

```tsx
const pages = [
  // ... existing pages
  { href: "/my-prototype", label: "my-prototype", description: "what it does" },
];
```

4. Visit [http://localhost:3000/my-prototype](http://localhost:3000/my-prototype) — or click the link from the root index.

### Using Components

All 56 components live in `src/components/ui/`. Import them directly:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary" tone="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

Check the component spec in `specs/components/` for available variants, tones, and props.

### Using Tokens

Reference tokens through Tailwind utilities — never hardcode values:

| Instead of | Use |
|---|---|
| `bg-[#ff5500]` | `bg-bg-brand` |
| `text-[10px]` | `text-[length:var(--text-2xs)]` |
| `rounded-[4px]` | `rounded-[var(--radius-checkbox)]` |
| `ring-[3px]` | `ring-[length:var(--focus-ring-width)]` |
| `border-[1.5px]` | `border-[length:var(--border-width-thick)]` |
| `leading-[1.43]` | `leading-[var(--leading-body)]` |

### Token Audit

Run before committing to catch hardcoded values:

```bash
node scripts/token-audit.js
```

Zero errors required.

## Project Structure

```
src/
  app/
    page.tsx         ← Root index (links to all prototype pages)
    globals.css      ← Layer 1 & 2 tokens, dark mode
    tokens.css       ← Spacing, typography, radius, z-index, motion tokens
    dashboard/       ← Dashboard prototype
    docs/            ← Component documentation
    developer/       ← API dashboard prototype
    login/           ← Auth prototype
    new-editor/      ← Editor prototype
  components/
    ui/              ← 56 design system components
    docs/            ← Documentation components
specs/
  foundations/       ← Color, spacing, typography, radius, elevation, motion specs
  components/        ← Per-component specs (anatomy, tokens, states, examples)
  tokens/            ← Master token reference
scripts/
  token-audit.js     ← Audit script for token compliance
```

## AI-Assisted Development

This project includes LLM-readable specs so AI assistants (Claude Code, Cursor, etc.) can understand the design system. The `CLAUDE.md` file at the root configures assistants to:

- Read the relevant spec before implementing or changing a component
- Use only tokens from `tokens.css` and `globals.css`
- Run the token audit before committing

Point your AI assistant to `specs/` for full context on any component or foundation.

## License

Private — internal use only.

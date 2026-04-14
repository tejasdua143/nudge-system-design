# New Editor — Component Spec & Engineering Handoff

> Route: `/new-editor`
> Full-screen slide editor with floating UI panels, filmstrip sidebar, and modal workflows.

---

## Page Layout

- **Root container**: `h-screen w-full`, `bg-bg-quaternary`, `position: relative`
- All UI is **absolutely positioned** over a full-bleed scrollable canvas
- No traditional page chrome — everything floats

### Z-index layering (back → front)

| Layer | Z | Element |
|-------|---|---------|
| Canvas | 0 | Scrollable slide area |
| Filmstrip | auto | Left sidebar |
| Top bar | auto | Top toolbar |
| Zoom panel | auto | Bottom-right zoom |
| Right panels (Remix/Theme) | 40 | Side panels |
| Bottom bar | auto | Bottom toolbar |
| Generating bar | 50 | Generating overlay |
| Modals (Object Selector, Prompt) | 50 | Centered modals |

---

## 1. EditorTopBar

**Position**: `absolute inset-x-0 top-0`, `px-3 pt-3`
**Layout**: `flex justify-between`

### Left toolbar
- **Container**: `rounded-[var(--radius-md)]`, `bg-bg-elevated`, `shadow-elevation-2`
- **Structure**: Horizontal group of icon buttons separated by `1px` vertical dividers (`bg-border-secondary`)
- **Each cell**: `p-1` wrapper → 28px icon button inside (`size-7`, `p-[6px]`)

| Cell | Content | Behaviour |
|------|---------|-----------|
| Home | `HouseSimple` icon | Links to `/dashboard` |
| Title | Editable text (click to edit) | Inline `<input>` on focus, Enter to save, Escape to cancel, blur saves |
| Undo | `ArrowUUpLeft` icon | — |
| Redo | `ArrowUUpRight` icon | — |

#### EditableTitle
- **Read mode**: `text-[length:var(--text-base)] text-text-primary`, hover `bg-bg-elevated-hover`, cursor-text
- **Edit mode**: `<input>` with `shadow-[var(--shadow-text-field-focused)]`, auto-focus + select all
- **Keyboard**: `Enter` → save, `Escape` → cancel (revert draft)

### Right toolbar group
- **Gap**: `gap-2` between right toolbar and its container
- **Container**: `rounded-[var(--radius-md)]`, `bg-bg-elevated`, `shadow-elevation-2`
- Cells separated by `1px` dividers

| Cell | Content | Behaviour |
|------|---------|-----------|
| Avatars | `AvatarGroup` (first 3 + overflow badge `+N`) | Opens collaborator popover |
| Share | Text button "Share" | — |
| Present | Text button "Present" | — |
| Upgrade | `ShinyText` shimmer button with `border-border-brand` | Animated text shimmer effect |
| Export | Primary button "Export as PPT" with `MicrosoftPowerpointLogo` icon | — |
| 3-dot menu | `DotsThreeVertical` icon | Opens settings dropdown |

#### Upgrade button
- **Height**: `h-7`
- **Border**: `border border-border-brand`
- **Corner radius**: `rounded-[var(--radius-sm)]`
- **Hover**: `bg-bg-brand/5`
- **ShinyText props**: `speed=1, delay=2, spread=100, direction="left"`, `color="var(--text-brand)"`, `shineColor="var(--text-primary-inverted)"`

#### Upgrade + Export group
- **Gap**: `gap-1` (4px) between Upgrade and Export buttons
- No divider between them

#### Collaborator Avatar Popover
- **Trigger**: Click on avatar group
- **Popover**: `side="bottom"`, `sideOffset={12}`, `align="end"`, `w-[220px]`
- **Structure**:
  1. Current user row with avatar + name + "(you)" label
  2. "Spotlight me" tertiary button (`h-7`, `rounded-[var(--radius-sm)]`)
  3. `1px` horizontal divider
  4. Other collaborators list, each row: avatar (20px) + name, hover `bg-bg-elevated-hover`, `rounded-[var(--radius-sm)]`
- **Avatars**: 20px (`size-5`), Unsplash portrait URLs with `w=80&h=80&fit=crop&crop=face`

#### 3-dot Settings Dropdown
- **Trigger**: `sideOffset={12}`, `alignOffset={-4}`, `align="end"`, `w-[232px]`
- **Groups** (separated by `DropdownMenuSeparator`):
  1. **Presentation settings** — icon + title + subtitle layout (2-line item)
  2. **Refresh Data**, **Analytics** (Pro badge), **Comments** (Pro badge)
  3. **Publish**, **Meet & present**, **Duplicate**, **Save as template**, **Add to favourites**, **Move to folder**
  4. **Delete presentation** — destructive variant
- **Pro badge**: `rounded-full bg-bg-brand px-1.5 py-0.5 text-[length:var(--text-xs)] text-white`

---

## 2. Filmstrip Sidebar

**Position**: `absolute left-3 top-[60px] bottom-3`, centered vertically with `items-center`
**Container**: `rounded-[var(--radius-md)]`, `bg-bg-elevated`, `shadow-elevation-2`

### Three modes

#### Collapsed mode
- **Width**: Measured dynamically via ref (`collapsedRef.scrollWidth`), animated with `motion`
- **Content**: Film strip icon (`-rotate-90`) + slide counter `<current>/<total>`
- **Counter**: Current slide number in `text-text-brand`, total in `text-text-tertiary`
- **Padding**: `px-2 py-2`, horizontal layout, `gap-1.5`
- **Click**: Expands to filmstrip mode

#### Filmstrip (thumbnail) mode
- **Width**: `180px`
- **Top controls**: List/Thumbnail toggle icons + collapse button (`ArrowsInSimple`)
  - Active mode icon uses `text-text-brand`
  - Toggle buttons: `size-5`, separated by `3px h-divider`
- **New Slide button**: Tertiary `h-7`, full width, triggers dropdown
  - Dropdown: `side="right"`, `sideOffset={12}`, `w-[200px]`
  - Items: "New slide with a prompt" (`MagicWand`), "New slide from template" (`CardsThree`)
- **Slide thumbnails**: `aspect-[16/9]`, `w-full`, `gap-3`, `px-3 py-3`
  - Active: brand selection ring (`0.75px border-brand + 2px border-brand-secondary`)
  - Inactive: `shadow-drop-2` border
  - **Slide number badge**: `absolute left-1 top-1`, `size-5`, `bg-black/40 backdrop-blur-[2px]`, white text
  - **Generating slide**: Shows `SlideSkeletonLoading` instead of label, with `rounded-sm` override via `[&_.rounded-lg]:rounded-sm`
- **Scrollable**: `overflow-y-auto`, `border-t border-border-secondary`

#### List mode
- **Width**: `180px` (same as filmstrip)
- **Slide rows** (`ListSlideRow`):
  - **Left cell**: Slide number / drag handle / generating spinner
    - Default: Slide number (`text-[length:var(--text-xs)] font-medium`)
    - Hover: `DotsSixVertical` drag handle
    - Generating: Rotating circle (`border-[1.5px] border-border-brand border-t-transparent`, spin `0.8s linear infinite`)
  - **Right cell**: Slide label or `ShinyText "Generating..."` shimmer
  - Active row: `text-text-brand` number, `font-medium` label, `bg-bg-brand-inverted` left cell
  - Selection ring: Same brand ring pattern as thumbnails

### Mode transitions
- **Expand/collapse**: `motion` width animation, `duration: 0.35`, `ease: [0.77, 0, 0.175, 1]` (ease-in-out-quart)
- **Content fade**: `duration: 0.15`, `ease: [0.19, 1, 0.22, 1]` (ease-out-expo)
- **List ↔ Thumbnail**: `AnimatePresence mode="wait"`, opacity crossfade `duration: 0.1`

---

## 3. Slide Canvas

**Container**: `absolute inset-0`, `snap-y snap-mandatory`, `overflow-y-auto scroll-smooth`, hidden scrollbar
**Padding**: `py-6` on scroll container

### Slide sizing
- **Height**: `calc(100vh - 64px)` per slide slot
- **Aspect ratio**: `16 / 9`
- **Max width**: `calc(100vw - 144px)`
- **Corner radius**: `rounded-[var(--radius-md)]`
- **Background**: `bg-white`
- **Shadow**: `shadow-elevation-1`

### Active/inactive opacity
- **Active slide**: opacity `1.0` (configurable via `CANVAS_ACTIVE_OPACITY`)
- **Inactive slides**: opacity `0.4` (configurable via `CANVAS_INACTIVE_OPACITY`)
- **Transition**: `transition-opacity duration-300`

### Scroll-to-slide sync
- Scroll position determines active slide: `scrollTop + slideH/2` mapped to slide index
- Filmstrip click → smooth scroll to target slide
- Debounced scroll detection (150ms) prevents feedback loops between scroll and filmstrip click

### Generating slide state
- Shows `SlideSkeletonLoading` instead of slide content
- 4 skeleton layouts that cycle randomly every 1s with crossfade (`opacity, duration: 0.3`)
- Shimmer sweep: `160px` wide linear gradient, animates `left: -20% → 120%`, `1.5s linear infinite`
- Skeleton element corner radius: `rounded-lg` (8px on canvas, overridden to `rounded-sm` in filmstrip)

---

## 4. Bottom Bar

**Position**: `absolute inset-x-0 bottom-3`, `flex justify-center`
**Container**: `rounded-[var(--radius-md)]`, `bg-bg-elevated`, `shadow-elevation-3`

### Toolbar cells
All cells: `p-1` wrapper, separated by `1px` dividers

| Cell | Type | Content |
|------|------|---------|
| Insert | Dropdown trigger | `Plus` icon + "Insert" text |
| Remix | Toggle button | `ArrowsClockwise` icon + "Remix" text |
| Theme | Toggle button | `Palette` icon + "Theme" text |
| 3-dot | Dropdown trigger | `DotsThreeVertical` icon only |

#### Insert Dropdown
- `side="top"`, `sideOffset={12}`, `w-[200px]`
- **Object section** (labeled): List, Diagram, Chart, Table, Concept, Media, Text, People, Quote
- **Slide section** (labeled): "Insert with a prompt" (`MagicWand`), "Insert from template" (`CardsThree`)
- Each object item opens the Object Selector with that category pre-selected

#### 3-dot Slide Menu
- `side="top"`, `sideOffset={12}`, `alignOffset={-4}`, `align="start"`, `w-52`
- **Group 1**: Duplicate slide, Add slide below, Move up, Move down
- **Group 2**: Slide colors, Reaction, Add sticker, Status, Assign slide, Speaker notes
- **Group 3**: Hide slide, Delete slide (destructive)

### Generating bar (replaces Bottom Bar)
- **Condition**: `generatingSlideId !== null && activeSlide === generatingSlideId`
- **Transition**: `AnimatePresence mode="wait"`, slide up `y: 10 → 0`, `duration: 0.2`
- **Content**: `ShinyText "Generating slides..."` with brand border glow
- **Glow effect**: Two overlapping `motion.div` with `border: var(--bg-brand)`, `blur(3px)`, pulsing `opacity: [0.3, 0.7, 0.3]` at `1.5s`
- When navigating away from the generating slide, the normal BottomBar reappears

---

## 5. Remix Panel (Right Side)

**Position**: `absolute right-3 top-3 bottom-3`, `z-40`
**Size**: `w-[320px]`, full height
**Container**: `rounded-[var(--radius-md)]`, `bg-bg-elevated`, `shadow-elevation-3`
**Animation**: Slide in from right `x: 20 → 0`, `opacity: 0 → 1`, `duration: 0.2`, ease-out-expo

### Structure
1. **Header**: "Remix" title + close (X) button, `border-b border-border-secondary`, `p-3`
2. **Variations list**: Scrollable (`overflow-y-auto`), `gap-3`, `p-3`
   - Each card: `h-[172px]`, `rounded-[var(--radius-sm)]`, `bg-white`
   - Selected: brand selection ring
   - Unselected: `shadow-elevation-1`, hover `shadow-elevation-2`
   - "Current" badge: `rounded-full bg-bg-brand`, `CheckCircle` icon + "Current" text

---

## 6. Theme Panel (Right Side)

**Position**: Same as Remix — `absolute right-3 top-3 bottom-3`, `z-40`, `w-[320px]`
**Mutual exclusion**: Only one right panel (Remix or Theme) can be open at a time

### Panel switching behaviour
- Clicking Theme while Remix is open: Remix slides out → `onExitComplete` fires → Theme slides in
- Uses `pendingPanelRef` to queue the next panel during exit animation
- No overlap — sequential dismiss → show

### Structure
1. **Header**: "Theme" title + close button, `p-3` (no bottom border)
2. **Tab bar**: Design | Color | Font, `border-b border-t border-border-secondary`
   - Active tab: `border-b-2 border-border-brand`, `font-medium`, `text-text-primary`
   - Inactive: `text-text-secondary`
3. **Content area**: `overflow-y-auto`, `gap-3`, `p-3`

#### Design tab
- Theme cards: `h-[172px]`, `rounded-[var(--radius-sm)]`
- 4 themes: Graphite (dark), Canvas (gradient), Pastel (soft), Midnight (dark gradient)
- Each shows name + description, bottom-left aligned
- Dark themes: white text; light themes: `text-text-primary`/`text-text-tertiary`
- Selected: brand ring; Current badge same as Remix

#### Color tab
- **Sections**: "Workspace" and "All", each with section label (`text-[length:var(--text-xs)] font-medium text-text-tertiary`)
- **ColorPaletteCard**:
  - Uses `<div role="button">` (not `<button>` — buttons collapse empty flex children)
  - `rounded-[var(--radius-sm)]`, `bg-white`, `p-3`
  - Header: palette name + "Current" badge (if selected) + 3-dot menu
  - Color swatches: `h-[40px]`, `rounded: 4px`, horizontal strip with equal-width divs
    - Uses **inline styles** (`flexGrow: 1, flexShrink: 0, flexBasis: 0, height: "100%"`) — Tailwind flex classes don't work inside `role="button"` divs
  - Selected: brand selection ring; Unselected: `shadow-elevation-1`

#### Font tab
- Placeholder: "Font options coming soon"

---

## 7. Object Selector Modal

**Position**: `fixed inset-x-0 bottom-[52px]`, `flex justify-center`, `z-50`
**Backdrop**: `fixed inset-0 z-50` click-to-close overlay (transparent)

### Two views with morphing transition

#### Selector view
- **Size**: `780px × 476px`
- **Outer**: `rounded-lg`, `bg-bg-secondary`, `p-1`, `shadow-elevation-3`
- **Search bar**: `MagnifyingGlass` icon + text input + close (X) button
- **Inner content**: `rounded-[var(--radius-md)]`, `bg-bg-elevated`, `shadow-elevation-2`
  - **Left sidebar**: `w-[160px]`, 9 categories (Text, List, Diagram, Chart, Table, Concept, Media, People, Quote)
  - **Right content**: Scrollable grid of variant thumbnails
    - Each thumbnail: `w-[131px]`, `h-[80px]`, `rounded-[var(--radius-md)]`, `bg-bg-secondary`
    - Hover/selected: brand ring
    - Click → transitions to "describe" view

#### Describe view
- **Size**: `600px × 280px` (morphs from selector size)
- **Header**: Back arrow + "Describe object content" title + close
- **Content**: Selected thumbnail preview + textarea + Attach/Insert buttons
- **Morph**: `duration: 0.35`, ease-in-out-quart for size change
- **Content slide**: Forward `x: 25px`, back `x: -25px`, `duration: 0.15`

---

## 8. Insert Prompt Modal

**Position**: `absolute inset-x-0 bottom-[52px]`, `flex justify-center`, `z-50`
**Size**: `w-[580px]`
**Container**: `rounded-[var(--radius-md)]`, `bg-bg-secondary`, `p-1`, `shadow-elevation-3`

### Structure
1. **Title bar**: Dynamic title + close button, `h-9`, `pl-3 pr-2.5`
2. **Content area**: `rounded-[var(--radius-sm)]`, `bg-bg-elevated`, `shadow-elevation-2`
   - `min-h-[200px]`, `max-h-[600px]`
   - **Textarea**: Auto-growing (resets height to `auto` then sets to `scrollHeight`)
   - **Suggestion chips**: Horizontal scroll (`overflow-x-auto`, hidden scrollbar), `gap-2`
     - Each chip: `w-[256px]`, `rounded-[var(--radius-sm)]`, `bg-bg-elevated`, `shadow-elevation-2`
     - Displays short label, on click inserts full 40-60 word prompt into textarea
     - Overflows container: `-mx-3 -mb-3 mt-4`, with `px-3 py-3` padding
   - **Bottom actions**: `absolute inset-x-3 bottom-3`
     - Left: Attach button (tertiary, `h-7`, `Paperclip` icon)
     - Right: "Insert slide" button (primary, `h-7`, disabled when empty)

### Slide generation flow
1. User writes/selects prompt → clicks "Insert slide"
2. New slide inserted after current active slide in `slides` array
3. Active slide switches to new slide
4. `generatingSlideId` set → triggers skeleton loading on canvas + filmstrip
5. After **10 seconds**: generation completes
   - Plays audio notification (volume 0.3)
   - Shows toast: "Slide generated successfully" with "Go to slide" action button
   - If user is on a different slide, toast lets them navigate to it

---

## 9. Zoom Panel

**Position**: `absolute bottom-3 right-3`
**Size**: `w-9` (36px)
**Container**: `rounded-[var(--radius-md)]`, `bg-bg-elevated`, `shadow-elevation-2`

### Structure
1. **Help button**: `Question` icon, square padding (`p-2.5`), full width
2. `1px` divider
3. **Zoom button**: `MagnifyingGlass` icon + "100%" label, `p-0.5` outer, `py-1.5` inner

---

## 10. Toast Notifications

- Uses `sonner` library
- **Styling**: Custom via `src/components/ui/sonner.tsx`
  - `shadow-elevation-3`, `rounded-[6px]`
- **Slide generation toast**: "Slide generated successfully" with "Go to slide" action

---

## Animation Constants

| Name | Value | Usage |
|------|-------|-------|
| `FILMSTRIP_EASE_IN_OUT` | `[0.77, 0, 0.175, 1]` | Filmstrip width morph |
| `FILMSTRIP_EASE_OUT` | `[0.19, 1, 0.22, 1]` | Filmstrip content fade |
| `FILMSTRIP_MORPH` | `duration: 0.35` | Filmstrip expand/collapse |
| `FILMSTRIP_CONTENT` | `duration: 0.15` | Filmstrip content crossfade |
| Ease-out-expo | `[0.19, 1, 0.22, 1]` | Most UI enter animations |
| Panel slide | `duration: 0.2` | Right panels enter/exit |
| Object selector morph | `duration: 0.35` | View size transition |
| Object selector content | `duration: 0.15` | Content slide |

---

## Shared Patterns

### Selection ring (brand)
```
shadow-[0px_0px_0px_0.75px_var(--border-brand),0px_0px_0px_2px_var(--border-brand-secondary),0px_1px_2px_0px_rgba(16,24,40,0.05)]
```

### Inactive card ring
```
shadow-[0px_0px_0px_1px_var(--shadow-drop-2),0px_1px_2px_0px_var(--shadow-drop-2)]
```

### "Current" badge
```
rounded-full bg-bg-brand px-1.5 py-0.5 pr-2
CheckCircle weight="fill" size-[13px] text-white
text-[length:var(--text-xs)] text-white
```

### Toolbar icon button
- `size-7` (28px), `rounded`, `text-text-secondary`
- Hover: `bg-bg-elevated-hover`, `text-text-primary`

### Dropdown sideOffset
- All dropdowns and popovers use `sideOffset={12}`

---

## Dependencies

| Package | Usage |
|---------|-------|
| `motion/react` | All animations (`motion.div`, `AnimatePresence`) |
| `@phosphor-icons/react` | All icons |
| `@radix-ui/react-*` | Dropdown, Popover, Dialog, Avatar primitives |
| `sonner` | Toast notifications |
| `@/components/ShinyText` | Animated shimmer text (react-bits) |
| `next-themes` | Dark mode (not directly used in editor, but available) |

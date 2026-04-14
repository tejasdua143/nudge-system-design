# Nudge Engine Frontend Integration — Design Spec

> Integrate the nudge scoring engine into the presentations.ai editor so that real user actions trigger nudges organically during the creation flow.

## Goal

Wire the nudge decision engine (currently a standalone simulator) into the existing Next.js editor frontend. Users go through the create flow (name, email, role, prompt, optional file upload), enter the editor, and receive contextual Pro nudges based on their actual interactions — no simulator controls, no manual signal toggling.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Create Flow (existing)                         │
│  /create → name, email, role                    │
│  /create/input → prompt, file upload            │
│  CreateFlowProvider carries data forward        │
└──────────────────┬──────────────────────────────┘
                   │ React context
                   ▼
┌─────────────────────────────────────────────────┐
│  Editor (/create/editor)                        │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  useNudgeEngine(userContext)               │  │
│  │                                           │  │
│  │  Exposes:                                 │  │
│  │  - fireSignal(signalName)                 │  │
│  │  - state (scores, signals, guardrails)    │  │
│  │  - dismissNudge() / upgradeNudge()        │  │
│  │  - activeMilestone (or null)              │  │
│  └───────────┬───────────────────────────────┘  │
│              │                                  │
│  ┌───────────▼──────┐  ┌────────────────────┐  │
│  │  NudgeModal       │  │  NudgeDebugPanel   │  │
│  │  (full overlay)   │  │  (collapsible)     │  │
│  └──────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────┘
```

All scoring logic, signal maps, mindset vectors, guardrails, and copy engine are ported from the simulator as pure TypeScript — no DOM dependencies, no inline HTML.

---

## User Context Hydration

On editor mount, build the nudge user context from two sources:

### From CreateFlowProvider (real data)
| Field | Source |
|-------|--------|
| `name` | create flow input |
| `email` | create flow input |
| `role` | create flow select |
| `topic` | prompt from create flow |
| `fileName` | file upload (null if none) |
| `isCompanyDomain` | derived: `!/@gmail\.com|@outlook\.com|@yahoo\.com|@hotmail\.com/.test(email)` |

### Randomized (same pools as simulator)
| Field | Method |
|-------|--------|
| `audience` | Pick from archetype's audience pool (role → archetype mapping) |
| `country` / `countryTier` | Random from TIER_1 + TIER_2 (weighted 1:2 toward Tier 2) |
| `credits` | Pick from [100, 85, 72, 55, 42, 30, 18, 8, 0] |
| `sessionNum` | Pick from [1, 1, 1, 2, 2, 3] |
| `boughtExport` | Pick from [false, false, false, false, true] |
| `dismissals` | Pick from [0, 0, 0, 1, 2] |
| `decksCompleted/Shared/Published` | Correlated with sessionNum (same logic as simulator) |
| `acqChannel` | Pick from weighted pool (50% organic, 30% paid, 20% referral) |

### Direct navigation fallback
If user navigates to `/create/editor` without going through the flow, ALL fields are randomized (same as simulator's `generateUser()`).

### Initial signals on mount
After hydration, run:
1. 3-layer context profiling (mindset vector, audience stakes, prompt synthesis)
2. State signals (credits, session, domain, deck history, acquisition)
3. If `fileName` is set → add `doc-uploaded` signal
4. Calculate initial scores (no nudge fires — need user actions first)

---

## Signal Wiring — Editor Actions to Nudge Signals

Each editor interaction fires one or more signals through `fireSignal()`. The engine uses the same 3s activity debounce as the simulator — signals accumulate, scores update, but nudges only evaluate after 3s of idle.

### Action → Signal Mapping

| Editor Action | Signals Fired | Trigger |
|--------------|---------------|---------|
| Edit slide text | `manual-edit` | onClick on any slide content area |
| Edit same slide 3+ times | `manual-edit`, `re-edit-3x` | Counter per slide, fires on 3rd edit |
| 5+ total edits | `manual-edit`, `edits-5plus` | Global edit counter, fires at 5 |
| Format/resize element | `format-edits`, `manual-edit` | Toolbar formatting buttons |
| Undo/redo | `undo-redo`, `manual-edit` | Undo/redo buttons or Ctrl+Z/Y |
| Change font/style | `style-change`, `manual-edit` | Font picker, style buttons |
| Delete a slide | `slide-delete`, `manual-edit` | Delete slide from filmstrip |
| Add chart/graph | `data-content` | Insert chart from toolbar |
| Add image/media | `media-added` | Insert image from toolbar |
| Duplicate slide | `slide-duplicate` | Duplicate button in filmstrip |
| Add new slide | `manual-slide-add` | "+" button in filmstrip |
| Reorder slides | `slide-reorder` | Drag-drop in filmstrip |
| Generate 15+ slides | `slides-15plus` | After generation if count >= 15 |
| Play slideshow | `slideshow` | Present/play button |
| Edit after preview | `slideshow-then-edit`, `manual-edit` | Any edit after playing slideshow |
| Idle 30s on a slide | `idle-on-slide` | setTimeout watching active slide |
| Change template | `template-switch` | Template picker |
| Click share | `share-clicked` | Share button |
| Copy link | `link-copied`, `share-clicked` | Copy link button |
| Try to download | `export-attempt` | Download/export button (hits paywall) |
| 15 min in editor | `time-15` | setTimeout from mount |
| 20 min in editor | `time-20`, `time-15` | setTimeout from mount |

### Tracking Counters

The hook maintains internal counters for:
- `editCountPerSlide: Map<slideId, number>` — for `re-edit-3x`
- `totalEdits: number` — for `edits-5plus`
- `hasPlayedSlideshow: boolean` — for `slideshow-then-edit`
- `mountTime: number` — for `time-15`, `time-20`

---

## Nudge Modal

Full-screen overlay matching the simulator design. Two variants:

### Pro Feature
```
┌──────────────────────────────────────────┐
│ [icon]  Milestone                   PRO  │
│                                          │
│  Title: personalized copy                │
│  Body: topic + audience + tier           │
│                                          │
│  [Upgrade to Pro]  [Not now]             │
│                                          │
│  PRO · Feature Name                      │
└──────────────────────────────────────────┘
```

### Service (hire-team)
Same layout, orange accent, "Talk to our team" CTA, "SERVICE" badge.

### Behavior
- Appears when a milestone fires (score >= 14, guardrails pass, 3s idle)
- **"Not now"** → dismisses, increments `dismissals`, removes `zero-dismissals` signal
- **"Upgrade to Pro"** → sets `isProUser`, kills all future nudges, shows toast
- **"Talk to our team"** → closes, shows toast about service booking
- **Auto-dismiss after 10s** if user ignores
- Editor actions are blocked while modal is open (overlay covers editor)
- Modal-open guard: `evaluateAndFire` does not fire while modal is active

---

## Debug Panel

Floating collapsible panel for demo/testing purposes.

### Toggle
Small floating button bottom-left: "Debug" label. Click expands the panel.

### Panel Contents (when expanded)
- **User Context** — name, role, audience, topic, country, tier, credits, session
- **Active Signals** — list with DIR/UNI/D+U badges
- **Feature Scores** — 9-row table: feature, direct, universal, total, bar
- **Guardrails** — Pro user, milestones fired, cooldown, features shown, intent floor, activity state
- **Milestone Log** — reverse-chronological list of fired nudges

### Styling
- Semi-transparent dark background
- Monospace font for scores
- Max-height with scroll
- Does not interfere with nudge modal (lower z-index)

---

## Nudge Engine Hook — `useNudgeEngine`

### Interface

```typescript
interface UseNudgeEngineOptions {
  userContext: Partial<CreateFlowData>;  // from CreateFlowProvider
}

interface UseNudgeEngineReturn {
  // Fire a signal (called by editor action handlers)
  fireSignal: (signal: string) => void;

  // Current state (for debug panel)
  state: NudgeState;

  // Active milestone (for modal)
  activeMilestone: Milestone | null;

  // Modal actions
  dismissNudge: () => void;
  upgradeNudge: () => void;
}
```

### Internal Flow
1. On mount: hydrate user context, run profiling, calculate initial scores
2. `fireSignal(name)` → add to activeSignals → set isUserActive → reset 3s timer
3. After 3s idle → clear isUserActive → calculateScores → evaluateAndFire
4. If milestone fires → set `activeMilestone` → modal renders
5. On dismiss/upgrade → clear `activeMilestone` → update state

### Config
All config (DIRECT_MAP, UNIVERSAL_MAP, MINDSET_VECTORS, PROMPT_SYNTHESIS, FEATURES, guardrail values) lives in `nudge-config.ts` — a direct port of the simulator's inline config as typed TypeScript objects.

---

## File Structure

```
frontend/                              ← cloned from nudge-system-design-base
  src/
    app/create/
      create-flow-context.tsx          ← existing (no changes needed)
      editor/
        page.tsx                       ← modified: wire signals + render modal/debug
    hooks/
      use-nudge-engine.ts              ← core engine: scoring, guardrails, milestones
    components/
      nudge-modal.tsx                  ← full overlay nudge card (Pro + Service variants)
      nudge-debug-panel.tsx            ← collapsible floating debug panel
    lib/
      nudge-config.ts                  ← all config data (features, signal maps, vectors, etc.)
      nudge-types.ts                   ← TypeScript interfaces (NudgeState, Milestone, Feature, etc.)
      nudge-engine.ts                  ← pure functions (calculateScores, checkGuardrails, generateCopy, etc.)
      nudge-profiler.ts                ← context profiling (mindset, stakes, prompt synthesis + keyword fallback)
```

---

## What We Port from the Simulator

Everything. The engine logic is identical — just restructured as TypeScript modules instead of inline JS:

| Simulator Section | Frontend File |
|------------------|---------------|
| CONFIG, FEATURES, ACTIONS | `nudge-config.ts` |
| DIRECT_MAP, UNIVERSAL_MAP, MINDSET_VECTORS, PROMPT_SYNTHESIS | `nudge-config.ts` |
| NudgeState | `nudge-types.ts` |
| calculateScores, checkGuardrails, evaluateAndFire, fireMilestone | `nudge-engine.ts` |
| profileUser, getAudienceStakes, addStateSignals, synthesizeFromKeywords | `nudge-profiler.ts` |
| generateCopy (with tier modifiers) | `nudge-engine.ts` |
| Activity pause debounce, auto-dismiss timer | `use-nudge-engine.ts` |
| Nudge card HTML | `nudge-modal.tsx` |
| Score matrix, signal list, guardrail bar | `nudge-debug-panel.tsx` |

---

## What We Don't Port

- Prompt shuffler (editor has a real prompt from the create flow)
- Reshuffle User button (user context comes from the flow)
- Action toggle buttons (replaced by real editor interactions)
- Config file loader (config is imported as TypeScript)
- API key input for LLM synthesis (can be added later if needed)

---

## Edge Cases

- **Direct navigation to editor** — no create flow data → randomize all fields
- **Empty prompt** — default to a generic topic from the archetype pool
- **Two nudges in quick succession** — modal-open guard prevents second fire while first is showing
- **User upgrades to Pro** — `isProUser = true`, no more nudges for the session
- **Session cap (3)** — after 3 nudges, no more fire regardless of scores
- **Feature already shown** — skipped in ranking, try next-highest scorer

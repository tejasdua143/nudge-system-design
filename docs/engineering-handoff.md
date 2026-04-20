# Smart Nudge System — Engineering Handoff

## Why

presentations.ai free-to-Pro conversion sits at ~1%. The goal is to reach 2–3% within the first 1–2 sessions a new user completes.

Generic upgrade popups don't move this number. The insight: users convert when they feel a specific gap — "I wish I could do X right now" — not when they see a generic "Go Pro" prompt. The nudge system watches what each user is actually doing and fires a card that names the exact Pro feature most relevant to their current task.

---

## What

The system handles 9 upgrade opportunities:

**Pro features (Pro variant card)**

| ID | Feature |
|---|---|
| `ai-models` | Better AI Models |
| `brand-kit` | Brand Kit |
| `unbranded` | Remove Watermark |
| `export` | PowerPoint / PDF Export |
| `invite-collab` | Invite Collaborators |
| `analytics` | Viewer Analytics |
| `gen-speed` | Generation Speed |
| `pres-refresh` | Presentation Refresh |

**Service upsell (Service variant card)**

| ID | Feature |
|---|---|
| `hire-team` | Hire Our Team — shown when a user is detected struggling; routes to service booking, not the pricing page |

One overlay format. No variations in layout or complexity. The intelligence is entirely in feature selection and copy personalization — not in showing different types of overlays.

---

## How It Works

User actions flow through a 7-stage pipeline before anything appears on screen.

```
  User Action
      │
      ▼
┌─────────────────────┐
│   Signal Collector  │◄── direct-signal-map.json
│                     │◄── universal-signal-map.json
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Context Profiler   │◄── mindset-vectors.json
│  Layer 1: Mindset   │◄── context-layers.json
│  Layer 2: Stakes    │◄── prompt-synthesis-examples.json
│  Layer 3: Prompt    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Scoring Engine    │   Direct + (Universal × 0.4) ≥ 14
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Milestone Selector  │◄── feature-contributors.json
│  (picks #1 feature) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Guardrails      │◄── guardrails.json
│  cap · cooldown ·   │
│  intent · pause     │
└──────────┬──────────┘
           │ pass
           ▼
┌─────────────────────┐
│    Copy Engine      │◄── copy-templates.json
│  20 sub-variants    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Renderer       │
└──────────┬──────────┘
           │
    ┌──────┴───────┐
    ▼              ▼
Pro variant    Service variant
(8 Pro         (hire-team)
 features)
```

> All engines share a central **NudgeState** bus — they read signals, scores, and session state from it rather than calling each other directly.

### 1. Signal Collector

Watches 40+ behavioral signals as the user works: which buttons they click, how many times they edit a slide, how long they spend on a prompt, what role they set, what template they chose.

Signals split into two buckets:
- **Direct signals** — strongly predict one specific feature (e.g. clicking "Export" predicts `export`)
- **Universal signals** — weakly predict all features (e.g. using the app for more than 10 minutes)

### 2. Context Profiler

Builds a richer picture using three layers on top of raw signals:

- **Mindset vector** — combines user role (13 roles: Leadership, Sales, Marketing, Product, Design, Engineering, Data Analytics, Consulting, Operations, Finance, Creator, Teacher, Student) with audience type to produce a per-feature weight vector. A Sales user making an investor pitch is biased toward `brand-kit` and `analytics`. The same Sales user making an internal report is biased toward `ai-models`.
- **Audience stakes** — classifies the presentation destination as high-stakes external (client, investor, board), low-stakes external, or internal (team, self). High-external amplifies `brand-kit`, `unbranded`, and `analytics` scores.
- **Prompt synthesis** — an LLM pass over the user's raw prompt extracts 0–5 relevance scores per feature. "Series A pitch deck" fires high scores on `brand-kit`, `analytics`, and `unbranded` before the user has clicked anything.

### 3. Scoring Engine

Combines signals and context into a single score per feature:

```
Total Score = Direct Score + (Universal Score × 0.4)
```

Direct scores are feature-specific. Universal signals apply a 0.4× multiplier across all features. Maximum possible score is 30. A feature is eligible to fire when its total score reaches **14**.

### 4. Milestone Selector

Picks the single highest-scoring eligible feature. Only one nudge fires at a time — never two overlapping cards.

### 5. Guardrails

Before the nudge card is shown, four checks run:

| Check | Value | Behaviour |
|---|---|---|
| Session cap | 3 nudges per session | Blocks if cap reached |
| Cooldown | 60 seconds since last nudge | Blocks if too soon |
| Intent floor | Universal signal sum ≥ 3 | Blocks if user not engaged enough |
| Activity pause | 3 seconds of idle required | Blocks if user is actively typing/editing |

If any check fails, the nudge is suppressed and the system waits for the next scoring cycle.

### 6. Copy Engine

Selects from 20 copy sub-variants across the 9 features.

Rules:
- Titles name the pain, never the feature — *"Your {topic} deck could be better on the first try"*, not *"Upgrade AI Models"*
- CTAs name the specific feature — *"Get Brand Kit"*, *"Try Analytics"*, *"Remove Watermark"*
- `{topic}` and `{audience}` tokens are interpolated from the user's prompt and audience type
- Topic is truncated to 4 words if longer (e.g. "Series A investor pitch deck" → "Series A investor pitch...")

Sub-variant selection: count how many of the user's active signals match each variant's trigger signals → pick the highest match. Falls back to the first variant if no match.

### 7. Renderer

Renders the nudge card as a fixed overlay (bottom-right). Pro features use the Pro variant; `hire-team` uses the Service variant. The card has a dismiss button; dismissed state persists for the session. The card animates out on dismiss (translate-y + opacity, 250ms).

The component lives in the paids design system at `components/ui/nudge-card.tsx`.

---

## Build Order

Build in dependency order. Each engine only depends on the ones before it.

1. **NudgeState** — central state bus. All engines read/write through this. Build first.
2. **Signal Collector** — registers event listeners, writes to NudgeState. No upstream engine dependencies.
3. **Context Profiler** — reads signals from NudgeState, loads `mindset-vectors.json`, runs the prompt synthesis LLM pass.
4. **Scoring Engine** — reads signals + context from NudgeState, loads `direct-signal-map.json` and `universal-signal-map.json`. Purely computational, no side effects.
5. **Milestone Selector** — picks the highest-scoring eligible feature from Scoring Engine output.
6. **Guardrails** — receives the selected candidate from Milestone Selector, reads session state from NudgeState, loads `guardrails.json`. Returns pass/fail. If it blocks, no copy or render happens.
7. **Copy Engine** — takes selected feature + NudgeState context, loads `copy-templates.json`. Outputs title, body, CTA strings.
8. **Renderer** — receives copy + feature variant, renders `<NudgeCard />`. Can be stubbed with a mock during steps 1–7 for isolated testing.

---

## Config Reference

All tunable values live in JSON in `config/`. No code changes needed to adjust thresholds, copy, or guardrail values.

| File | Controls |
|---|---|
| `direct-signal-map.json` | Per-signal weights for each specific feature |
| `universal-signal-map.json` | Per-signal weights applied across all features (0.4× multiplied) |
| `mindset-vectors.json` | Role × audience → per-feature weight vectors (40 combinations) |
| `prompt-synthesis-examples.json` | Few-shot examples for the LLM prompt synthesis pass |
| `context-layers.json` | Audience stakes classification rules |
| `copy-templates.json` | All 20 copy sub-variants with `{topic}` / `{audience}` tokens |
| `guardrails.json` | SESSION_CAP, COOLDOWN_MS, INTENT_FLOOR, ACTIVITY_PAUSE_MS |
| `feature-contributors.json` | Which signals contribute to which features (used by Milestone Selector) |

---

## Deep Dives

Each engine has a full spec in `specs/`:

| File | Covers |
|---|---|
| [specs/01-nudge-state.md](../specs/01-nudge-state.md) | State schema, event bus API |
| [specs/02-signal-collector.md](../specs/02-signal-collector.md) | Full signal taxonomy, event listener setup |
| [specs/03-context-profiler.md](../specs/03-context-profiler.md) | Mindset vector math, audience classification, LLM prompt |
| [specs/04-scoring-engine.md](../specs/04-scoring-engine.md) | Scoring formula derivation, edge cases |
| [specs/05-milestone-selector.md](../specs/05-milestone-selector.md) | Selection algorithm, tie-breaking |
| [specs/06-guardrails.md](../specs/06-guardrails.md) | All guardrail logic, override conditions |
| [specs/07-copy-engine.md](../specs/07-copy-engine.md) | All 20 copy variants, interpolation grammar |
| [specs/08-renderer.md](../specs/08-renderer.md) | NudgeCard props, animation, dismiss persistence |

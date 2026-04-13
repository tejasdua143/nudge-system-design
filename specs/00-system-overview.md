# Smart Nudge System v2 — System Overview

> A milestone-driven, per-feature scoring system that determines which Pro feature to nudge, when, and with what copy — personalized through 3-layer context profiling and a signal-to-feature scoring matrix.

**Goal:** Convert free users to Pro purchases in the first 1-2 sessions
**Current conversion:** ~1% → target 2-3%
**Approach:** Per-feature scoring from behavioral + contextual signals. The system asks "which Pro feature is most relevant to this user right now?" and fires a milestone nudge for the winner.

---

## Core Concept

Every signal — from the user's role at signup to a mouse click in the editor — contributes a weighted score toward specific Pro features. The highest-scoring feature that crosses the threshold fires as a milestone nudge.

```
Signal → Per-Feature Score → Highest Feature Wins → Milestone Nudge
```

There is one overlay type: the milestone nudge card. The intelligence is in *which feature* was selected, not in the overlay format.

---

## The Eight Pro Features

| ID | Name | What It Does |
|----|------|-------------|
| `ai-models` | Better AI Models | Higher quality slides, smarter content |
| `brand-kit` | Brand Kit | Custom brand colors and fonts across all slides |
| `unbranded` | Unbranded Pro Templates | Professional templates without watermark |
| `export` | PowerPoint/PDF Export | Downloadable files for offline use |
| `invite-collab` | Invite Collaborators | Real-time editing with others |
| `analytics` | Viewer Analytics | Track who opened, which slides, how long |
| `gen-speed` | Generation Speed | Medium/Fast generation instead of Slow |
| `pres-refresh` | Presentation Refresh | Regenerate with improved content/structure |

---

## Architecture — Six Engines + Shared State

```
USER ACTIONS
    │
    ▼
┌──────────────────┐
│ Signal Collector  │  Translates product events → signal names
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Context Profiler  │  3-layer profiling: Mindset + Stakes + Prompt Synthesis
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Scoring Engine    │  Per-feature scoring: Direct signals + Universal signals (×0.4)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Milestone         │  Rank features by score, pick the highest above threshold (14)
│ Selector          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Guardrails        │  Session cap (3), cooldown (60s), intent floor, activity pause
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Copy Engine       │  Personalized copy from topic + audience + country tier
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Renderer          │  Milestone nudge card → user sees it → feedback loops back
└──────────────────┘
```

All engines read from and write to a central **NudgeState Bus**. Each engine owns its slice of state. The Coordinator watches for state changes and routes to the appropriate engine.

---

## NudgeState Bus

### User Identity
- `name`, `role`, `audience`, `topic` (raw prompt)
- `email`, `isCompanyDomain`
- `country`, `countryTier` (1 = high purchasing power, 2 = price-sensitive)
- `acqChannel` (organic | paid | referral)

### Context Layers
- `mindset` — derived from role (persuader, brand-builder, operator, analyst, educator, learner)
- `audienceStakes` — derived from audience (high-external, low-external, internal)
- `promptSynthesis` — LLM-extracted per-feature relevance scores (0-5) from raw prompt

### Session State
- `credits`, `sessionNumber`, `boughtExport`, `dismissals`
- `decksCompleted`, `decksShared`, `decksPublished`

### Signals
- `activeSignals: Set<string>` — all currently active signals from all sources
- `signalLog: SignalEvent[]` — append-only history

### Scoring State
- `featureScores: Map<FeatureId, { direct, universalRaw, universalContrib, total, directSignals[], universalSignals[] }>`

### Guardrails
- `milestonesThisSession`, `featuresShownThisSession: Set<FeatureId>`
- `lastMilestoneTime`, `isUserActive`

### Meta
- `isProUser` (kill switch), `sessionStartTime`

### Overlay
- `activeOverlay`, `copyCache`

---

## Scoring Math

For each of the 8 Pro features:

```
Direct Score    = SUM of all matching signal weights for that feature
Universal Score = SUM of all universal signal weights × 0.4
Total Score     = Direct + Universal

Feature fires when Total ≥ THRESHOLD (14)
```

**Direct signals** are feature-specific — `share-clicked` adds +5 to `unbranded` and +4 to `analytics` but nothing to `gen-speed`.

**Universal signals** boost all features equally — `returning-user` adds +4 to the universal pool, which contributes `4 × 0.4 = 1.6` to every feature. The 0.4 multiplier prevents universal signals from dominating feature-specific behavior.

---

## 3-Layer Context Profiling

Replaces flat archetype detection from v1.

### Layer 1: Mindset (from role)
Maps the user's role to a behavioral mindset that affects feature weights.

| Role | Mindset | Feature bias |
|------|---------|-------------|
| Sales, Leadership | persuader | unbranded, analytics, export |
| Marketing, Design, Creator | brand-builder | brand-kit, unbranded |
| Product, Ops, Engineering, Consulting | operator | invite-collab, gen-speed |
| Data Analytics, Finance | analyst | analytics, export |
| Teacher | educator | export, gen-speed |
| Student | learner | gen-speed, ai-models |

### Layer 2: Audience Stakes
Categorizes the audience by external pressure level.

| Audience | Stakes | Feature bias |
|----------|--------|-------------|
| Investors, VCs, Board, Angel investors, Enterprise clients, C-suite buyers | high-external | unbranded, analytics, brand-kit |
| Prospects, Potential clients, Recruiters, Art directors | low-external | unbranded, brand-kit |
| Team, leadership, classmates, etc. | internal | gen-speed, ai-models, invite-collab |

### Layer 3: Prompt Synthesis (LLM-generated)
The LLM reads the raw user prompt and returns per-feature relevance scores (0-5).

- Rich prompts get strong, differentiated scores
- Weak prompts ("make a presentation") get near-zero scores across the board
- Urgent prompts ("investor meeting tomorrow") boost gen-speed, export, ai-models

Re-runs when the user creates a new deck with a different prompt.

---

## Guardrails

| Check | Threshold | Behavior |
|-------|-----------|----------|
| Pro user | `isProUser === true` | Kill all nudges permanently |
| Session cap | 3 milestones per session | Block additional nudges |
| Cooldown | 60 seconds between milestones | Hold until elapsed |
| Feature repeat | Feature already shown this session | Block (try next ranked feature) |
| Intent floor | Universal signal sum < 3 | Block (not enough general engagement) |
| User activity | Currently typing/dragging/generating | Hold until 3s pause |

---

## Copy Personalization

Copy is generated per feature using:
- **topic** — user's raw prompt, inserted directly into copy
- **audience** — who they're presenting to
- **countryTier** — determines copy modifier append

### Tier Modifiers

| Tier | Tone | Example (ai-models) |
|------|------|-------------------|
| Tier 1 (US, UK, Germany...) | Quality-focused | "Enterprise-grade AI for polished, boardroom-ready output." |
| Tier 2 (India, Brazil, Indonesia...) | Value/efficiency-focused | "Save hours of manual editing." |

---

## Milestone Nudge Card (Single Overlay Type)

```
┌──────────────────────────────────────────┐
│ [icon]  Milestone                   PRO  │
│                                          │
│  Title: feature verb                     │
│  Body: personalized copy                 │
│                                          │
│  [Upgrade to Pro]  [Not now]             │
│                                          │
│  PRO · Feature Name                      │
└──────────────────────────────────────────┘
```

---

## Feedback Loop

| User action | System response |
|-------------|----------------|
| Clicks "Upgrade to Pro" | Route to pricing flow |
| Clicks "Not now" | Feature suppressed for session. milestonesThisSession++ |
| Ignores (auto-dismiss) | Feature suppressed for session |
| Upgrades | `isProUser = true`. All engines stop permanently. |

---

## Engine Specs

Each engine has a detailed spec document:

- [01-nudge-state.md](01-nudge-state.md) — State schema and ownership rules
- [02-signal-collector.md](02-signal-collector.md) — Event to signal mapping
- [03-context-profiler.md](03-context-profiler.md) — 3-layer profiling system
- [04-scoring-engine.md](04-scoring-engine.md) — Direct map, universal map, scoring math
- [05-milestone-selector.md](05-milestone-selector.md) — Ranking, threshold, fallback
- [06-guardrails.md](06-guardrails.md) — Caps, cooldowns, intent floor
- [07-copy-engine.md](07-copy-engine.md) — Personalization and tier modifiers
- [08-renderer.md](08-renderer.md) — Milestone nudge card component

---

## Simulator

A unified, modular interactive simulator at `simulator/index.html` with panels per engine:
- User context panel (randomized profiles)
- Action buttons (trigger signals)
- Active signals display
- Per-feature score matrix with direct/universal breakdown
- Guardrail status bar
- Milestone nudge preview with "why this fired" breakdown

---

## Config Files

All tunable values are externalized as config:

| File | Contents |
|------|----------|
| `direct-signal-map.json` | Signal → feature weight mappings (~40+ entries) |
| `universal-signal-map.json` | Signal → universal weight mappings (~15 entries) |
| `prompt-synthesis-examples.json` | Example LLM outputs per topic type |
| `context-layers.json` | Mindset map + audience stakes map |
| `copy-templates.json` | Per-feature copy templates + tier modifiers |
| `guardrails.json` | Session cap, cooldown, threshold, intent floor |

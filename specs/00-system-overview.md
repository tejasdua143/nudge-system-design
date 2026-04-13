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

## The Nine Features

Eight Pro features + one service upsell.

| ID | Name | Type | What It Does |
|----|------|------|-------------|
| `ai-models` | Better AI Models | Pro | Higher quality slides, smarter content |
| `brand-kit` | Brand Kit | Pro | Custom brand colors and fonts across all slides |
| `unbranded` | Unbranded Pro Templates | Pro | Professional templates without watermark |
| `export` | PowerPoint/PDF Export | Pro | Downloadable files for offline use |
| `invite-collab` | Invite Collaborators | Pro | Real-time editing with others |
| `analytics` | Viewer Analytics | Pro | Track who opened, which slides, how long |
| `gen-speed` | Generation Speed | Pro | Medium/Fast generation instead of Slow |
| `pres-refresh` | Presentation Refresh | Pro | Regenerate with improved content/structure |
| `hire-team` | Hire Our Team | Service | We create the presentation for you |

### Hire Our Team — Service Upsell

Not a Pro plan feature — a paid service where our team builds the presentation for the user. Surfaces when the system detects the user is struggling rather than flowing.

**Key signals:**
- Too many edits (re-edit-3x, edits-5plus, undo-redo)
- Time pressure (urgent prompt language, "due tomorrow", "needed by tonight")
- High-stakes audience (investors, enterprise clients, board, C-suite)
- Template/style thrashing (template-switch, style-change, format-edits)

**The nudge framing is different:** instead of "unlock this feature," it's "let us handle it." The CTA routes to a service booking flow, not the Pro pricing page.

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

### Layer 1: Mindset (from role × audience × prompt)

The mindset is not a static label from the user's role. It's a **computed feature weight vector** shaped by the combination of role, audience, and prompt context together.

Same role, different feature biases:

| Role | Audience | Prompt | Resulting feature bias |
|------|----------|--------|----------------------|
| Leadership | Investors | "Series A pitch" | unbranded, analytics, export, brand-kit (persuader, high external stakes) |
| Leadership | Team | "Q1 business review" | gen-speed, invite-collab, pres-refresh (operator, internal) |
| Leadership | Board | "board deck due end of day" | gen-speed, export, ai-models, hire-team (urgency + high stakes) |
| Sales | Enterprise clients | "Enterprise SaaS proposal" | analytics, unbranded, export, brand-kit (persuader, deal-closing) |
| Sales | Prospects | "quick product overview" | gen-speed, ai-models (speed, lower stakes) |
| Design | Recruiters | "Design portfolio" | brand-kit, unbranded, export (craft, personal brand) |
| Design | Team | "Design system update" | invite-collab, pres-refresh (collaborative, internal) |
| Student | Panel judges | "Final thesis defense" | export, ai-models, unbranded (high stakes for a student) |
| Student | Classmates | "help me with a ppt" | gen-speed, ai-models (low effort, low stakes) |

The mindset step outputs a per-feature weight vector (same format as prompt synthesis: 0-5 per feature) computed from role × audience. This feeds into the Scoring Engine as a direct signal alongside everything else.

### Layer 2: Audience Stakes

Categorizes the audience by external pressure level. A secondary signal layer that adds weight on top of the mindset.

| Audience | Stakes | Feature bias |
|----------|--------|-------------|
| Investors, VCs, Board, Angel investors, Enterprise clients, C-suite buyers | high-external | unbranded, analytics, brand-kit, hire-team |
| Prospects, Potential clients, Recruiters, Art directors | low-external | unbranded, brand-kit |
| Team, leadership, classmates, etc. | internal | gen-speed, ai-models, invite-collab |

### Layer 3: Prompt Synthesis (LLM-generated)

The LLM reads the raw user prompt and returns per-feature relevance scores (0-5).

- Rich prompts get strong, differentiated scores
- Weak prompts ("make a presentation") get near-zero scores across the board
- Urgent prompts ("investor meeting tomorrow") boost gen-speed, export, ai-models, hire-team
- Struggle language ("help me", "I need", "can you just") boosts hire-team

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

## Milestone Nudge Cards

Two card variants depending on feature type:

### Pro Feature Nudge
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

### Hire Our Team Nudge
```
┌──────────────────────────────────────────┐
│ [icon]  Milestone                        │
│                                          │
│  Let us build it for you                 │
│  Body: personalized copy referencing     │
│  their struggle + topic + audience       │
│                                          │
│  [Talk to our team]  [Not now]           │
│                                          │
│  Hire Our Team                           │
└──────────────────────────────────────────┘
```

The hire-team nudge routes to a service booking flow, not the Pro pricing page.

---

## Feedback Loop

| User action | System response |
|-------------|----------------|
| Clicks "Upgrade to Pro" | Route to pricing flow |
| Clicks "Talk to our team" | Route to service booking flow |
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

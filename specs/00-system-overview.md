# Smart Nudge System v2 — System Overview

> A milestone-driven, per-feature scoring system that determines which Pro feature to nudge, when, and with what copy — personalized through 3-layer context profiling, a relevance filter, and a signal-to-feature scoring matrix.

**Goal:** Convert free users to Pro purchases in the first 1-2 sessions
**Current conversion:** ~1% → target 2-3%
**Approach:** Per-feature scoring from behavioral + contextual signals. The system asks "which Pro feature is most relevant to this user right now?" and fires a milestone nudge for the winner.

---

## Core Concept

Every signal — from the user's role at signup to a mouse click in the editor — contributes a weighted score toward specific Pro features. Features are first filtered for relevance, then scored. The highest-scoring relevant feature that crosses the threshold fires as a milestone nudge.

```
Signal → Relevance Filter → Per-Feature Score → Highest Feature Wins → Milestone Nudge
```

There is one overlay type: the milestone nudge card. The intelligence is in *which feature* was selected and *what copy* was generated, not in the overlay format.

---

## The Seven Features

Six Pro features + one service upsell.

| ID | Name | Type | What It Does |
|----|------|------|-------------|
| `ai-models` | Better AI Models | Pro | Higher quality slides, smarter content |
| `brand-kit` | Brand Kit | Pro | Custom brand colors, fonts, logos, and voice across all slides |
| `unbranded` | Remove Watermark | Pro | Clean links and exports without the Presentations.AI watermark |
| `export` | PowerPoint/PDF Export | Pro | Downloadable files for offline use |
| `invite-collab` | Invite Collaborators | Pro | Real-time editing, guest feedback, version history |
| `analytics` | Viewer Analytics | Pro | Track who opened, which slides, how long |
| `hire-team` | Hire Our Team | Service | We create the presentation for you |

### Hire Our Team — Service Upsell

Not a Pro plan feature — a paid service where our team builds the presentation for the user. Surfaces when the system detects the user is struggling rather than flowing.

**Key signals:**
- Repeated edits and undo-redo cycles (log-scaled — high counts fire stronger)
- Repeated deck-regenerate attempts
- Document uploads (especially long documents)
- High-stakes audience (investors, enterprise clients, board, C-suite)

**The nudge framing is different:** instead of "unlock this feature," it's "let us handle it." The CTA routes to a service booking flow, not the Pro pricing page.

---

## Architecture — Seven Engines + Renderer + Shared State

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
│ Relevance Filter  │  Filters features by mindset + prompt fit (threshold ≥ 3)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Scoring Engine    │  Per-feature scoring: Direct signals + Universal signals (×0.4)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Milestone         │  Rank relevant features by score, pick highest above threshold (14)
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
│ Copy Engine       │  Contextual sub-feature copy from topic + audience + active signals
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
- `mindsetVector` — per-feature weights derived from role × audience stakes (0-5 per feature)
- `audienceStakes` — derived from audience (`critical` / `external` / `internal` / `unknown`)
- `promptSynthesis` — per-feature relevance scores (0-5) from prompt analysis

### Session State
- `credits`, `sessionNum`, `boughtExport`, `dismissals`
- `decksCompleted`, `decksShared`, `decksPublished`

### Signals
- `activeSignals: Set<string>` — all currently active signals from all sources
- `activeActions: Set<string>` — currently toggled user actions
- `signalLog: SignalEvent[]` — append-only history

### Scoring State
- `featureScores: Map<FeatureId, { direct, universalRaw, universalContrib, total, directSignals[], universalSignals[] }>`
- `relevantFeatures: Set<FeatureId>` — features that passed the relevance filter
- `relevanceScores: Map<FeatureId, number>` — combined mindset + prompt score per feature

### Guardrails
- `milestonesThisSession`, `featuresShownThisSession: Set<FeatureId>`
- `lastMilestoneTime`, `isUserActive`

### Meta
- `isProUser` (kill switch)

---

## Relevance Filter

Before scoring, features are filtered for relevance to this specific user. A feature must be contextually relevant to appear in the scoring pipeline at all.

```
Relevance Score = Mindset Vector (0-5) + Prompt Synthesis (0-5)
Feature is relevant when Relevance Score ≥ 3
```

Only **mindset** and **prompt synthesis** determine relevance — not action signals. This means a feature can't become relevant just because the user clicked a lot; the user's role and prompt must indicate it's a good fit.

**Exception:** `hire-team` is always marked as relevant. It fires on struggle signals from actions, not context layers.

---

## Scoring Math

Signals come in two types (see `config/signal-types.json`):

- **Repeatable** — user action that can fire many times per session. Contribution = `base × log₂(count + 1)`.
- **Boolean** — user attribute, one-time action, or profile derivation. Contribution = `base`.

For each of the 7 features:

```
For each active signal s:
  base = DIRECT_MAP[s][feature]  // 0 if not listed
  if s is repeatable: contrib = base × log₂(count[s] + 1)
  else:               contrib = base
  directScore += contrib

For each active signal s:
  uBase = UNIVERSAL_MAP[s]       // 0 if not listed
  if s is repeatable: uContrib = uBase × log₂(count[s] + 1)
  else:               uContrib = uBase
  universalScore += uContrib

Total = directScore + (universalScore × 0.4)
Feature fires when: relevant AND Total ≥ THRESHOLD (14)
```

Log-scaling curve (base 2):
- count 1 → ×1.00  (first occurrence carries full weight)
- count 3 → ×2.00
- count 5 → ×2.58
- count 10 → ×3.46

**Direct signals** are feature-specific — `share-link-copy` adds weight to `unbranded` and `analytics` but nothing to `ai-models`.

**Universal signals** boost all features equally — `returning-user` (boolean, +4) contributes `4 × 0.4 = 1.6` to every feature. Repeatable universals (e.g. `pricing-visit`, `gate-hit`) are log-scaled first. The 0.4 multiplier prevents universal signals from dominating feature-specific behavior.

**Why log-scaling:** the earlier threshold aggregates (`edit-streak-3`, `edit-count-5`, `slides-15plus`) introduced cliff behavior and config bloat. Log on the underlying repeatable captures the same escalation curve naturally, without separate signal definitions per milestone.

---

## 3-Layer Context Profiling

### Layer 1: Mindset (role × audience stakes)

A **computed feature weight vector** (0-5 per feature) shaped by the combination of the user's role and their audience's stakes level.

Same role, different feature biases:

| Role | Audience | Resulting feature bias |
|------|----------|----------------------|
| Leadership | Investors | unbranded, analytics, export, brand-kit |
| Leadership | Team | invite-collab (internal, collaborative) |
| Sales | Enterprise clients | analytics, unbranded, export, brand-kit |
| Design | Recruiters | brand-kit, unbranded, export |
| Student | Panel judges | export, ai-models, unbranded |
| Student | Classmates | ai-models (low stakes) |

**Scale:** 13 roles × 3 stakes buckets = 39 base vectors + 1 fallback + ~17 sparse `(role, → audience)` overrides = **~57 cells**. Overrides are deltas on top of the base vector for sharp pairings (e.g. `Sales|→ Investors` lifts unbranded + analytics above the `Sales|critical` base).

### Layer 2: Audience Stakes (classification only)

Classifies the audience into one of 4 buckets. **No direct weights** — buckets are tags for logs + L1 base-key input. Audience strings are prefixed with `→` to disambiguate from role names.

| Bucket | Tag | Audiences |
|---|---|---|
| `critical` | `stakes-critical` | → Investors, → VCs, → Board members, → Angel investors, → Enterprise clients, → C-suite buyers |
| `external` | `stakes-external` | → Prospects, → Potential clients, → Recruiters, → Art directors |
| `internal` | `stakes-internal` | → Exec team, → Executives, → Stakeholders, → XFN stakeholders, → Students, → Corporate trainees, → Workshop attendees, → Professor, → Panel judges, → Classmates |
| `unknown` | `stakes-unknown` | Blank / null / unmatched string — L1 falls back to `role|internal` base key, no override possible |

### Layer 3: Prompt Synthesis

Analyzes the user's prompt to produce per-feature relevance scores (0-5).

**Sources (in priority order):**
1. **Local LLM** (Ollama with Gemma 2) — real-time analysis when available
2. **Lookup table** — 30+ pre-computed prompt-to-score mappings
3. **Keyword fallback** — regex-based keyword matching for unknown prompts

Re-runs when the user changes their prompt.

---

## Guardrails

| Check | Threshold | Behavior |
|-------|-----------|----------|
| Pro user | `isProUser === true` | Kill all nudges permanently |
| Session cap | 3 milestones per session | Block additional nudges |
| Cooldown | 60 seconds between milestones | Hold until elapsed |
| Feature repeat | Feature already shown this session | Block |
| Intent floor | Universal signal sum < 3 | Block (not enough engagement) |
| Activity pause | User interacting right now | Hold until 3s idle |

---

## Copy Engine — Contextual Sub-Feature Copy

Copy is not a static template per feature. Each feature has 1-4 **sub-features**, each with its own title, body, and CTA. The system picks the best sub-feature based on which active signals match.

### Copy Framework

| Element | Rule |
|---|---|
| **Title** | Names the pain tied to what the user is building and for whom. Never names the feature. |
| **Body** | One sentence. Connects the pain to the solution. Uses topic/audience context when natural. |
| **CTA** | Always feature-specific: "Get Brand Kit", "Try Analytics", "Unlock Exports", etc. |
| **Dismiss** | Always "Not now". |
| **Tone** | The product is on the user's side, pointing out a better way. Confident, not commanding. |

### Sub-Feature Selection

1. For the winning feature, look up its sub-feature candidates.
2. Score each candidate by how many of its trigger signals are currently active.
3. Pick the candidate with the most matches.
4. Fallback to the first candidate if none match.

**Example:** If `brand-kit` wins and the user has been changing fonts (`style-change` signal), the "brand-fonts" sub-feature fires with: *"Let your fonts carry the presentation"*. If instead they uploaded media (`insert-media` signal), the "brand-assets" sub-feature fires with: *"Your logo, one click into any slide"*.

### Sub-Feature Count

| Feature | Sub-features |
|---|---|
| ai-models | 3 (advanced models, credits, project knowledge) |
| brand-kit | 4 (fonts, colors, assets, voice) |
| unbranded | 2 (links, exports) |
| export | 3 (PowerPoint, PDF, embeds) |
| invite-collab | 4 (guests, workspace, present remotely, version history) |
| analytics | 3 (page views, slide engagement, demographics) |
| hire-team | 1 |

**Total: 20 copy variants.**

---

## Milestone Nudge Cards

Two card variants depending on feature type:

### Pro Feature Nudge
```
┌──────────────────────────────────────────┐
│ [icon]  Milestone                        │
│                                          │
│  Title: contextual pain statement        │
│  Body: one sentence, pain → solution     │
│                                          │
│  [Get Brand Kit]  [Not now]              │
│                                          │
│  PRO · Brand Kit                         │
└──────────────────────────────────────────┘
```

### Hire Our Team Nudge
```
┌──────────────────────────────────────────┐
│ [🤝]  Service                            │
│                                          │
│  You don't have to build this yourself   │
│  Body: personalized with audience        │
│                                          │
│  [Talk to Our Team]  [Not now]           │
│                                          │
│  SERVICE · Hire Our Team                 │
└──────────────────────────────────────────┘
```

---

## Feedback Loop

| User action | System response |
|-------------|----------------|
| Clicks CTA ("Get Brand Kit", etc.) | `isProUser = true`. All nudges disabled permanently. Toast shown. |
| Clicks "Talk to Our Team" | Route to service booking flow (hire-team only). Toast shown. |
| Clicks "Not now" | `dismissals++`. Removes `zero-dismissals` signal. Closes modal. |
| Ignores (auto-dismiss, 10s) | Modal auto-closes. Feature already suppressed from fire time. Toast shown. |

Feature suppression and milestone counting happen at **fire time** (in `fireMilestone()`), not at dismiss time.

---

## Engine Specs

- [01-nudge-state.md](01-nudge-state.md) — State schema and ownership rules
- [02-signal-collector.md](02-signal-collector.md) — Event to signal mapping
- [03-context-profiler.md](03-context-profiler.md) — 3-layer profiling system
- [04-scoring-engine.md](04-scoring-engine.md) — Direct map, universal map, scoring math
- [05-milestone-selector.md](05-milestone-selector.md) — Relevance filter, ranking, threshold
- [06-guardrails.md](06-guardrails.md) — Caps, cooldowns, intent floor
- [07-copy-engine.md](07-copy-engine.md) — Contextual sub-feature copy system
- [08-renderer.md](08-renderer.md) — Milestone nudge card component

---

## Config Files

| File | Contents |
|------|----------|
| `direct-signal-map.json` | Signal → feature weight mappings |
| `universal-signal-map.json` | Signal → universal weight mappings |
| `mindset-vectors.json` | Layer 1 mindset vectors: role × audienceStakes → per-feature weights (39 combos + fallback) |
| `prompt-synthesis-examples.json` | Example LLM outputs per topic type (30+ prompts) |
| `context-layers.json` | Audience stakes classification rules (`critical` / `external` / `internal` audiences, → prefix) |
| `mindset-overrides.json` | Sparse (role, → audience) deltas on top of base mindset vectors |
| `guardrails.json` | Session cap, cooldown, threshold, intent floor, activity pause |
| `feature-contributors.json` | Feature-centric view of all scoring inputs (reference doc) |

---

## Simulator

An interactive simulator at `simulator/index.html` — single portable HTML file, vanilla JS, no build tools.

**3-column layout:**
- Left (300px): User Context + Prompt Analysis
- Center (fluid): Guardrails + Feature Score Matrix + Nudge Preview + Milestone Feed
- Right (300px): Actions + Active Signals

**Key features:**
- Randomized user profiles with scoring impact tooltips
- Editable prompt input with live keyword synthesis + optional local LLM analysis (Ollama/Gemma 2)
- ~32 toggleable action buttons with per-feature impact tooltips
- Real-time score matrix with relevance filter badges and threshold visualization
- Nudge card rendering (pro + service variants) with "Why this fired" breakdown
- "Randomise Everything" button with full-screen overlay showing the complete scenario
- Guardrail status bar with all 6 checks visible
- Milestone feed with signal breakdown history
- Toast notifications for upgrade/dismiss/auto-dismiss actions

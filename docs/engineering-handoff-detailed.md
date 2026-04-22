# Smart Nudge System — Engineering Handoff (Detailed)

## Why

presentations.ai free-to-Pro conversion sits at ~1%. The goal is to reach 2–3% within the first 1–2 sessions a new user completes.

Generic upgrade popups don't move this number. The insight: users convert when they feel a specific gap — "I wish I could do X right now" — not when they see a generic "Go Pro" prompt. The nudge system watches what each user is actually doing and fires a card that names the exact Pro feature most relevant to their current task.

---

## What

The system handles 7 upgrade opportunities:

**Pro features (Pro variant card)**

| ID | Feature |
|---|---|
| `ai-models` | Better AI Models |
| `brand-kit` | Brand Kit |
| `unbranded` | Remove Watermark |
| `export` | PowerPoint / PDF Export |
| `invite-collab` | Invite Collaborators |
| `analytics` | Viewer Analytics |

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
│   Scoring Engine    │   Σ (base × log₂(count+1)) per feature; direct + 0.4×universal ≥ 14
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Milestone Selector  │◄── feature-contributors.json
│  Stage 1: Relevance │
│  Stage 2: Evaluate  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Guardrails      │◄── guardrails.json
│  6 checks in order  │
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
(6 Pro         (hire-team)
 features)
```

> All engines share a central **NudgeState** bus — they read signals, scores, and session state from it rather than calling each other directly.

---

### 1. Signal Collector

Translates product events into named signals the rest of the system can reason about. In production, listens for real product events and maps them to signal names.

**13 roles → 6 archetypes**

| Role(s) | Archetype |
|---|---|
| Leadership | Founder |
| Sales, Marketing | Sales |
| Product, Engineering, Data Analytics, Consulting, Operations, Finance | Corporate |
| Design, Creator | Creative |
| Teacher | Educator |
| Student | Student |

**Audience pools per archetype**

| Archetype | Audiences |
|---|---|
| Founder | Investors, VCs, Board members, Angel investors |
| Sales | Enterprise clients, Prospects, C-suite buyers |
| Corporate | Leadership team, Executives, Stakeholders, Cross-functional team |
| Creative | Potential clients, Recruiters, Art directors |
| Educator | Students, Corporate trainees, Workshop attendees |
| Student | Professor, Panel judges, Classmates |

**Context signals written to `state.activeSignals`**

| Signal | Condition |
|---|---|
| `credits-low` | `user.credits < 30` |
| `credits-zero` | `user.credits === 0` |
| `returning-user` | `user.sessionNum > 1` |
| `bought-export` | `user.boughtExport === true` |
| `zero-dismissals` | `user.dismissals === 0` |
| `company-domain` | `user.isCompanyDomain === true` |
| `tier-1-country` | `user.countryTier === 1` |
| `deck-veteran` | `user.decksCompleted >= 5` |
| `deck-sharer` | `user.decksShared >= 2` |
| `deck-publisher` | `user.decksPublished >= 1` |
| `acq-organic` | `user.acqChannel === 'organic'` |
| `acq-paid` | `user.acqChannel === 'paid'` |
| `acq-referral` | `user.acqChannel === 'referral'` |

Signals are only added when the condition is `true` — absence equals false.

---

### 2. Context Profiler

Runs 3-layer profiling on the user to produce rich, per-feature signal weights. Bridges the gap between raw user attributes and the numeric weights that the Scoring Engine consumes.

#### Layer 1 — Mindset Vector (base + sparse override)

Maps role × stakes bucket to a per-feature weight vector, with sparse `(role, → audience)` overrides for sharp pairings.

1. Classify stakes (Layer 2) → bucket ∈ {`critical`, `external`, `internal`, `unknown`}
2. Compute `effectiveStakes` = bucket, or `'internal'` when bucket is `unknown`
3. `baseKey = role + '|' + effectiveStakes` (e.g. `"Sales|critical"`)
4. `baseVector = mindsetVectors[baseKey] || MINDSET_FALLBACK`
5. `overrideKey = role + '|' + audience` (e.g. `"Sales|→ Investors"`)
6. Add override deltas if present: `mindsetVectors[baseKey] + mindsetOverrides[overrideKey]`
7. Write final vector to `DIRECT_MAP['mindset-vector']`, add to `state.activeSignals`

**Scale:** 39 base cells + 1 fallback + ~17 sparse overrides = **~57 cells total**.

**Why sparse overrides:** most `(role, audience)` pairs fit their role × stakes base. Only certain combinations warrant sharp treatment (e.g. Sales→Investors ≠ Sales→Prospects, even though both are external-type). Overrides sit in `config/mindset-overrides.json`.

**Example base vectors:**

| Role + Stakes | Top-weighted features |
|---|---|
| Sales \| critical | unbranded (4), analytics (4), export (3), brand-kit (3) |
| Leadership \| internal | invite-collab (3), ai-models (0) |
| Design \| external | brand-kit (4), unbranded (4), export (3) |
| Student \| critical | export (4), unbranded (3), ai-models (3) |

**Example overrides (deltas on top of base):**

| Role \| → Audience | Delta |
|---|---|
| Sales \| → Investors | unbranded +3, analytics +2, brand-kit +1 |
| Student \| → Professor | export +3, unbranded +1 |
| Teacher \| → Students | invite-collab -2, export +1 |

#### Layer 2 — Audience Stakes Classification (tag only, no weight)

Classifies audience into one of four buckets. **No direct weight** — buckets are classification tags plus input to the L1 base key. All stakes-based feature lift lives in the mindset vector (base + overrides). Audience strings are prefixed with `→` to disambiguate from role names.

| Bucket | Tag | Audiences |
|---|---|---|
| `critical` | `stakes-critical` | → Investors, → VCs, → Board members, → Angel investors, → Enterprise clients, → C-suite buyers |
| `external` | `stakes-external` | → Prospects, → Potential clients, → Recruiters, → Art directors |
| `internal` | `stakes-internal` | → Exec team, → Executives, → Stakeholders, → XFN stakeholders, → Students, → Corporate trainees, → Workshop attendees, → Professor, → Panel judges, → Classmates |
| `unknown` | `stakes-unknown` | Audience blank / null / unmatched string |

**Unknown audience handling:**
- Tag `stakes-unknown` emitted (logs only, no weight).
- L1 base key uses `role|internal` as safest default.
- Override cannot apply (audience unknown).
- System still scores — just less confidently; relies more on prompt + actions.

**Naming:** the `→` prefix reads "presenting TO this audience" and avoids the `Leadership` (role) vs `Leadership team` (audience) collision that existed in earlier configs. Legacy strings aliased: `"Leadership team"` → `"→ Exec team"`; `"Cross-functional team"` → `"→ XFN stakeholders"`.

#### Layer 3 — Prompt Synthesis

Analyzes the user's raw prompt/topic to produce per-feature relevance scores (0–5).

**Three-tier priority:**

1. **LLM** (primary in production) — Sends prompt to Gemini Flash or Claude API, receives per-feature scores (0–5) plus inferred audience/stakes. Results written to `DIRECT_MAP['prompt-synthesis']`.
2. **Lookup table** (`prompt-synthesis-examples.json`) — 30+ pre-computed prompt-to-score mappings.
3. **Keyword fallback** — Regex-based keyword matching when neither above is available.

**Keyword-to-feature examples:**

| Keywords | Features boosted |
|---|---|
| "brand", "colors", "fonts" | `brand-kit` |
| "team", "collaborate" | `invite-collab` |
| "investor", "pitch", "funding" | `unbranded`, `analytics`, `export` |
| "help", "struggle", "can you just" | `hire-team` |
| "download", "pdf", "powerpoint" | `export` |

---

### 3. Scoring Engine

Combines all active signals into a single numeric score per feature. Signals come in two types (see `config/signal-types.json`):

- **Repeatable** — user action that can occur many times per session. Contribution = `base × log₂(count + 1)`.
- **Boolean** — user attribute, one-time action, or profile derivation. Contribution = `base`.

**Formula:**

```
Direct Score    = Σ (direct_base × log₂(count+1))  for repeatables
                + Σ  direct_base                    for booleans
Universal Score = Σ (universal_base × log₂(count+1)) for repeatables
                + Σ  universal_base                   for booleans
Total Score     = Direct Score + (Universal Score × 0.4)
```

**Full algorithm:**

```
For each feature:
  For each active signal s:
    directBase = DIRECT_MAP[s]?.[feature] or 0
    if directBase:
      scaled = (s in REPEATABLE_SIGNALS)
        ? directBase × log₂(signalCounts[s] + 1)
        : directBase
      directScore += scaled
  For each active signal s:
    uBase = UNIVERSAL_MAP[s] or 0
    if uBase:
      uScaled = (s in REPEATABLE_SIGNALS)
        ? uBase × log₂(signalCounts[s] + 1)
        : uBase
      universalRaw += uScaled
  universalContrib = round(universalRaw × 0.4, 1)
  total            = round(directScore + universalContrib, 1)
```

**Log-scaling curve** (base 2):

| Count | Factor | Use case |
|---|---|---|
| 1 | 1.00 | First occurrence — full weight |
| 3 | 2.00 | User is iterating |
| 5 | 2.58 | Clear repetition / intent |
| 10 | 3.46 | Heavy usage |
| 20 | 4.39 | Session saturation |

No explicit cap — the curve saturates naturally.

**Output per feature:**

```js
{
  direct: number,           // sum of scaled direct weights
  universalRaw: number,     // sum of scaled universal weights (same for every feature)
  universalContrib: number, // universalRaw × 0.4
  total: number,            // direct + universalContrib
  directSignals: [          // per-signal breakdown
    { name, weight, count, scaled },
    ...
  ],
  universalSignals: [
    { name, weight, count, scaled },
    ...
  ]
}
```

**Repeatable signals (24)** — eligible for log-scaling:

| Cluster | Signals |
|---|---|
| Edit | text-edit, style-change, element-move, undo-redo, slide-delete |
| Content | insert-title, insert-list, insert-media, insert-slide-prompt, insert-slide-template, slide-reorder |
| Preview | play-preview, edit-after-preview, theme-global, layout-slide, deck-regenerate |
| Share / export | share-link-copy, invite-attempt, export-click, export-download |
| Conversion-intent | doc-upload, deck-switch, pricing-visit, gate-hit |

Everything else is **boolean** — user attrs, profile derivations, one-time actions, prompt extractions.

**Why log-scaling replaces aggregate thresholds:** earlier iterations used `edit-streak-3`, `edit-count-5`, `slides-15plus`, `re-edit-3x`. These introduced cliff behavior (score unchanged at count 4, jumps at 5) and required separate signal definitions per milestone. Log-scaling on the underlying repeatable captures the same "escalating frustration" curve naturally, without separate signals.

**Key design insight — why 0.4 multiplier:**
Universal signals apply equally to every feature. Without the multiplier they'd wash out the differentiation created by direct signals. The 0.4 ensures direct signals drive feature ranking while universal signals lift the overall baseline.

Example: `universalRaw = 10`, Feature A has `direct = 8`, Feature B has `direct = 3`:
- Feature A: `8 + (10 × 0.4) = 12.0`
- Feature B: `3 + (10 × 0.4) = 7.0`

The 4.0 universal contribution is identical — ranking is entirely determined by direct scores.

**Signals that appear in both maps** (contribute to both direct and universal): `pricing-visit`, `gate-hit`, `export-download`, `doc-upload`, `bought-export`, `deck-veteran`, `acq-paid`, `acq-referral`, `session-15min`, `second-deck`. Repeatable duals (first four) get log-scaled independently in each pool.

**Dynamic signals** (highest-impact, updated per user by Context Profiler, boolean):
- `DIRECT_MAP['mindset-vector']` — up to 5 points per feature, varies by role × audience
- `DIRECT_MAP['prompt-synthesis']` — up to 5 points per feature, varies by topic

**Threshold:** Feature is eligible to fire when `total ≥ 14`.

---

### 4. Milestone Selector

Two-stage decision engine: relevance filter first, then score evaluation.

#### Stage 1 — Relevance Filter

Run once when user is generated (or when prompt changes). Determines which features are contextually relevant before any action scoring.

```
relevance = mindsetVector[featureId] + promptSynthesis[featureId]
```

- Both scores range 0–5, so relevance ranges 0–10
- Feature is relevant if `relevance >= 3`
- `hire-team` is **always** marked relevant — it fires on struggle signals, not context layers
- Result stored in `state.relevantFeatures`

> Without this filter, a user writing a brand pitch could get nudged about analytics because enough universal signals accumulated. The relevance filter ensures only features that match role + prompt can fire.

#### Stage 2 — Evaluate and Fire

Called after every user action (after the 3s activity pause clears).

```
1. If nudge modal is already open → return
2. calculateScores() → fresh scores for all 7 features
3. Filter: keep features where
     - feature is in state.relevantFeatures, AND
     - total >= 14, AND
     - feature NOT already shown this session
4. Sort descending by total
5. If no qualifying features → return (no nudge)
6. Pick top scorer
7. checkGuardrails(top.id)
8. If pass → fireMilestone(top)
9. If fail → drop. No fallback to second-ranked feature.
```

**Tie-breaking:** When two features share the same score, the one that appears first in the `FEATURES` array wins:

`ai-models → brand-kit → unbranded → export → invite-collab → analytics → hire-team`

**Two gates a feature must clear:**
1. Relevance filter: `mindset + prompt ≥ 3`
2. Scoring threshold: `total ≥ 14`

A feature can score 20 and still not fire if its relevance is below 3.

---

### 5. Guardrails

A gate, not a selector. Runs 6 checks in order after Milestone Selector picks the top feature.

| # | Check | Condition | Block reason |
|---|---|---|---|
| 1 | **Pro user kill switch** | `user.isProUser === true` | Returns immediately — no further checks. All nudges permanently disabled for session. |
| 2 | **Session cap** | `milestonesThisSession >= 3` | `"Session cap reached (3/3)"` |
| 3 | **Cooldown** | `Date.now() - lastMilestoneTime < 60000` AND `lastMilestoneTime > 0` | `"Cooldown active (Xs remaining)"` |
| 4 | **Feature repeat** | `featuresShownThisSession.has(featureId)` | Safety net — MilestoneSelector already filters shown features |
| 5 | **Intent floor** | Sum of all `UNIVERSAL_MAP[signal]` for active signals `< 3` | Prevents nudges firing on minimal engagement |
| 6 | **Activity pause** | `state.isUserActive === true` | User must be idle for 3 seconds before nudge fires |

**Behavior:**
- Checks 2–6 all run even if earlier ones fail (multiple reasons can accumulate) — except Check 1 which exits immediately
- If any check fails, nudge is dropped. No fallback to second-ranked feature.
- `lastMilestoneTime > 0` condition ensures cooldown doesn't block the very first nudge of a session

---

### 6. Copy Engine

Selects from 20 copy sub-variants across 7 features.

**Copy rules:**
- Titles name the pain, never the feature — *"Your {topic} deck could be better on the first try"*, not *"Upgrade AI Models"*
- CTAs name the specific feature — *"Get Brand Kit"*, *"Try Analytics"*, *"Remove Watermark"*
- `{topic}` and `{audience}` tokens interpolated from `state.user`
- Topic truncated to 4 words if longer — `"Series A investor pitch deck"` → `"Series A investor pitch..."`
- No tier or country modifiers — same copy for all users globally

**Sub-variant selection algorithm:**
1. Count trigger signal matches in `state.activeSignals` for each sub-variant
2. Pick the highest match count
3. Fallback to first variant if no signals match — **list order matters, general variant should be first**

**All 20 sub-variants:**

#### ai-models (3)

| Sub-feature | Trigger signals | Title | CTA |
|---|---|---|---|
| advanced-models | text-edit, undo-redo, edit-after-preview, deck-regenerate | Your {topic} deck could be better on the first try | Upgrade to Pro |
| ai-credits | insert-slide-prompt, deck-regenerate | Don't lose momentum on your {topic} deck | Upgrade to Pro |
| project-knowledge | doc-upload, doc-upload-long, prompt-brand | Make your {topic} slides even more accurate | Get Project Knowledge |

#### brand-kit (4)

| Sub-feature | Trigger signals | Title | CTA |
|---|---|---|---|
| brand-fonts | style-change | Set your fonts once for the whole deck | Get Brand Kit |
| brand-colors | theme-global, layout-slide | Your {topic} deck should look like it came from your brand | Get Brand Kit |
| brand-assets | insert-media, prompt-brand | Your {topic} deck is missing your brand assets | Get Brand Kit |
| brand-voice | text-edit, insert-title, insert-list | Make sure {audience} hears your brand's voice in every slide | Get Brand Kit |

#### unbranded (2)

| Sub-feature | Trigger signals | Title | CTA |
|---|---|---|---|
| unbranded-links | share-link-copy, play-preview | Before you share your {topic} deck with {audience} | Remove Watermark |
| unbranded-export | export-click, export-download | Your {topic} export will carry our watermark | Remove Watermark |

#### export (3)

| Sub-feature | Trigger signals | Title | CTA |
|---|---|---|---|
| ppt-export | export-click, export-download | Take your {topic} deck offline | Unlock Exports |
| pdf-export | play-preview, share-link-copy | Send {audience} a polished PDF of your {topic} deck | Unlock Exports |
| embed | share-link-copy | Your {topic} presentation could live on your website | Unlock Embeds |

#### invite-collab (4)

| Sub-feature | Trigger signals | Title | CTA |
|---|---|---|---|
| guests | share-link-copy, prompt-team | Get feedback before this reaches {audience} | Invite Collaborators |
| workspace | prompt-team, invite-attempt | Your team should be building this {topic} deck with you | Invite Collaborators |
| present-remotely | play-preview | Present your {topic} deck live to {audience} | Get Live Presenting |
| version-history | undo-redo, deck-regenerate | Keep a safety net for your {topic} deck | Get Version History |

#### analytics (3)

| Sub-feature | Trigger signals | Title | CTA |
|---|---|---|---|
| page-views | share-link-copy, play-preview | Know when {audience} opens your {topic} deck | Try Analytics |
| slide-engagement | share-link-copy | Find out which slides {audience} actually cared about | Try Analytics |
| demographics | export-click, export-download | See who's viewing your {topic} deck | Try Analytics |

#### hire-team (1)

| Sub-feature | Trigger signals | Title | CTA |
|---|---|---|---|
| hire-team | undo-redo, deck-regenerate, doc-upload-long | Let our team build your {topic} deck for {audience} | Talk to Our Team |

---

### 7. Renderer

Renders the nudge card as a fixed overlay (bottom-right, `z-index: 60`). The component lives in the paids design system at `components/ui/nudge-card.tsx`.

**Nudge card variants:**

| | Pro variant | Service variant |
|---|---|---|
| Features | All 6 Pro features | `hire-team` only |
| Tag | `"Milestone"` | `"Service"` |
| Badge | `PRO` | `SERVICE` |
| CTA default | `"Upgrade to Pro"` | `"Talk to our team"` |
| Accent | Purple | Orange |

**Dismiss behavior:**
- "Not now" on inline card — `handleDismiss()` — updates state (increments `dismissals`, removes `zero-dismissals` signal, re-renders panels)
- "Dismiss" on modal — `closeNudgeModal()` — UI-only close, no state change
- These are intentionally different — inline dismiss reflects a real user action

**On upgrade:**
- Pro features: sets `user.isProUser = true` — kills all future nudges for the session (guardrail Check 1)
- `hire-team`: routes to service booking flow, not the pricing page

**Auto-dismiss:** Modal auto-closes after 10 seconds of no interaction. Feature is already suppressed from fire time — auto-dismiss has no additional state side effects.

---

## Build Order

Build in dependency order. Each engine only depends on the ones before it.

1. **NudgeState** — central state bus. All engines read/write through this. Build first.
2. **Signal Collector** — registers event listeners, writes to `state.user` and `state.activeSignals`. No upstream dependencies.
3. **Context Profiler** — reads `state.user`, loads `mindset-vectors.json`, runs LLM prompt synthesis (Gemini Flash / Claude API in prod, lookup table fallback).
4. **Scoring Engine** — reads `state.activeSignals` + dynamic `DIRECT_MAP` entries. Purely computational, no side effects.
5. **Milestone Selector** — Stage 1 (relevance filter) runs on user load. Stage 2 (`evaluateAndFire`) runs on every action after 3s idle.
6. **Guardrails** — receives selected candidate, reads session state, loads `guardrails.json`. Returns pass/fail.
7. **Copy Engine** — takes selected feature + `state.user` context, loads `copy-templates.json`. Outputs `{ title, body, cta }`.
8. **Renderer** — receives copy + feature variant, renders `<NudgeCard />`. Stub with a mock during steps 1–7 for isolated testing.

---

## Config Reference

All tunable values live in JSON in `config/`. No code changes needed to adjust thresholds, copy, or guardrail values.

| File | Controls |
|---|---|
| `direct-signal-map.json` | Per-signal weights for each specific feature (~40 entries) |
| `universal-signal-map.json` | Per-signal weights applied across all features (0.4× multiplied, ~15 entries) |
| `mindset-vectors.json` | Role × audience → per-feature weight vectors (40 combinations) |
| `prompt-synthesis-examples.json` | 30+ pre-computed prompt-to-score mappings for lookup table fallback |
| `context-layers.json` | Audience stakes classification rules |
| `copy-templates.json` | All 20 copy sub-variants with `{topic}` / `{audience}` tokens |
| `guardrails.json` | `SESSION_CAP=3`, `COOLDOWN_MS=60000`, `INTENT_FLOOR=3`, `ACTIVITY_PAUSE_MS=3000` |
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
| [specs/05-milestone-selector.md](../specs/05-milestone-selector.md) | Selection algorithm, tie-breaking, relevance filter |
| [specs/06-guardrails.md](../specs/06-guardrails.md) | All 6 guardrail checks, override conditions |
| [specs/07-copy-engine.md](../specs/07-copy-engine.md) | All 20 copy variants, interpolation grammar |
| [specs/08-renderer.md](../specs/08-renderer.md) | NudgeCard props, animation, dismiss behaviors |

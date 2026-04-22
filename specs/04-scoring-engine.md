# 04 -- ScoringEngine

## Purpose

The ScoringEngine calculates per-feature conversion scores from active signals. Each signal is either **repeatable** (user can perform the action many times) or **boolean** (one-shot attribute or profile derivation). Repeatable signals are log-scaled by occurrence count so the first few repetitions contribute strongly and further repetitions face diminishing returns. Boolean signals contribute their base weight once. The engine reads `state.activeSignals` + `state.signalCounts`, looks up base weights in DIRECT_MAP / UNIVERSAL_MAP, and produces a detailed scoring breakdown per feature.

## Interface

### Inputs

- `state.activeSignals` -- Set of currently active signal names.
- `state.signalCounts` -- Map of signal name -> occurrence count. Booleans always map to 1 once active.
- `DIRECT_MAP` -- Signal-to-feature weight mappings (including dynamically written `mindset-vector` and `prompt-synthesis` entries).
- `UNIVERSAL_MAP` -- Signal-to-universal-weight mappings.
- `REPEATABLE_SIGNALS` -- Set of signal names eligible for log scaling. Mirrors `config/signal-types.json`.
- `CONFIG.UNIVERSAL_MULTIPLIER` -- Currently `0.4`.

### Outputs

- `state.featureScores` -- Object keyed by feature ID, each containing a full scoring breakdown.
- Return value of `calculateScores()` is the same object.

### Functions

| Function              | Description                                                                           |
|-----------------------|---------------------------------------------------------------------------------------|
| `scaleByCount(s, w)`  | Returns `w × log₂(count + 1)` if signal is repeatable, otherwise `w` unchanged.       |
| `calculateScores()`   | Computes and returns per-feature scores from all active signals.                      |

## Algorithm

### scaleByCount(signalId, baseWeight)

```
If signalId is NOT in REPEATABLE_SIGNALS:
  return baseWeight
count = state.signalCounts[signalId] or 0
If count <= 0:
  return 0
return baseWeight * log₂(count + 1)
```

Log base 2 was chosen for readability:
- count 1 -> factor 1.00   (first occurrence pays full weight)
- count 2 -> factor 1.58
- count 3 -> factor 2.00
- count 5 -> factor 2.58
- count 10 -> factor 3.46
- count 20 -> factor 4.39

There is no explicit cap. The curve saturates naturally; realistic session counts rarely exceed 10.

### calculateScores()

For each feature ID across all 7 features:

```
1. Direct Score
   ------------
   For each signal in state.activeSignals:
     directBase = DIRECT_MAP[signal]?.[featureId] or 0
     If directBase:
       scaled = scaleByCount(signal, directBase)
       direct += scaled
       Record { name, weight: directBase, count, scaled } in directSignals[]

2. Universal Score
   ----------------
   For each signal in state.activeSignals:
     universalBase = UNIVERSAL_MAP[signal] or 0
     If universalBase:
       scaled = scaleByCount(signal, universalBase)
       universal += scaled
       Record { name, weight: universalBase, count, scaled } in universalSignals[]

3. Universal Contribution
   -----------------------
   universalContrib = round(universal * CONFIG.UNIVERSAL_MULTIPLIER, 1)

4. Total Score
   ------------
   total = round(direct + universalContrib, 1)
```

**Important:** Universal signals still boost all features equally, but repeatable universals (e.g. `pricing-visit`, `gate-hit`, `export-download`, `doc-upload`) receive their own log-scaling before the 0.4× multiplier applies. Two users with `pricing-visit` counts of 1 vs 5 therefore produce different universal contributions.

### Rounding

- `direct`, `universalRaw`, `universalContrib`, `total` are each rounded to 1 decimal place.
- Per-signal `scaled` is also rounded to 1 decimal place for display.

## Data Structures

### Output: featureScores

```js
state.featureScores = {
  [featureId]: {
    direct: number,             // Sum of log-scaled direct weights for this feature
    universalRaw: number,       // Sum of log-scaled universal weights (same for every feature)
    universalContrib: number,   // universalRaw × 0.4, rounded to 1 decimal
    total: number,              // direct + universalContrib, rounded to 1 decimal
    directSignals: [            // Per-signal breakdown
      { name: string, weight: number, count: number, scaled: number },
      ...
    ],
    universalSignals: [
      { name: string, weight: number, count: number, scaled: number },
      ...
    ]
  },
  // ... one entry per feature (7 features total)
}
```

### DIRECT_MAP

Maps signal name to per-feature base weight object. Mirrors `config/direct-signal-map.json`. Signal names match the simulator (canonical).

```js
DIRECT_MAP = {
  'signal-name': {
    featureA: 3,
    featureB: 1,
    // ... weights for each of the 7 features
  },
  // ...
}
```

**Static entries:** Most signals have fixed weights that don't change between users (e.g., `credits-low`, `returning-user`, `deck-veteran`). Stakes tags (`stakes-critical`, `stakes-external`, `stakes-internal`, `stakes-unknown`) are present as empty `{}` entries — classification tags only, no direct weight.

**Dynamic entries:** Two signals are dynamically overwritten per user by the ContextProfiler:
- `DIRECT_MAP['mindset-vector']` -- Per-feature weights from Layer 1 profiling (0--5 per feature, varies by role and audience stakes).
- `DIRECT_MAP['prompt-synthesis']` -- Per-feature weights from Layer 3 profiling (0--5 per feature, varies by topic).

Both dynamic signals are boolean (they fire once per user and do not scale with counts).

### UNIVERSAL_MAP

Maps signal name to a single numeric weight (not per-feature). Mirrors `config/universal-signal-map.json`.

### REPEATABLE_SIGNALS

Set of signal names eligible for log scaling. Everything else is boolean. Canonical definition lives in `config/signal-types.json`; simulator embeds a mirror copy. Current membership (24 signals):

```
Edit cluster:        text-edit, style-change, element-move, undo-redo, slide-delete
Content cluster:     insert-title, insert-list, insert-media, insert-slide-prompt,
                     insert-slide-template, slide-reorder
Preview cluster:     play-preview, edit-after-preview, theme-global, layout-slide,
                     deck-regenerate
Share/export:        share-link-copy, invite-attempt, export-click, export-download
Conversion-intent:   doc-upload, deck-switch, pricing-visit, gate-hit
```

### Signals That Appear in Both Maps

A signal can exist in both `DIRECT_MAP` and `UNIVERSAL_MAP`. When active, it contributes to both scores. If the signal is repeatable, the same `log₂(count + 1)` factor is applied independently to each contribution. Current dual-map signals: `pricing-visit`, `gate-hit`, `export-download`, `doc-upload`, `bought-export`, `deck-veteran`, `acq-paid`, `acq-referral`, `session-15min`, `second-deck`.

## Key Design Insights

### Why log scaling for repeatables

Earlier iterations used threshold aggregates (`edit-streak-3`, `edit-count-5`, `slides-15plus`, `re-edit-3x`). These introduced cliff behavior (score unchanged at count 4, jumps at count 5) and required separate signal definitions per milestone. Log scaling captures the same "escalating frustration" curve naturally:

- 1 edit: user is just starting -> full base weight applies
- 5 edits: user is iterating -> base × 2.58
- 20 edits: user is clearly struggling -> base × 4.39

The aggregate signals were removed; the same behavior is now an emergent property of log on the underlying repeatable.

### Why 0.4 universal multiplier

The 0.4 universal multiplier is a deliberate design choice. Without it, universal signals (which apply equally to all features) would dominate scoring and wash out the differentiation created by direct signals. The multiplier ensures that:

- **Direct signals drive feature ranking** -- They determine which feature scores highest for a given user.
- **Universal signals lift the baseline** -- They increase the overall score magnitude, making the system more confident a user is ready for a nudge, without changing which feature wins.

Example: user has universal `pricing-visit` at count 3 (base 3 -> scaled 6.0) plus boolean `returning-user` (4) -> universalRaw = 10. Feature A direct = 8, feature B direct = 3.
- Feature A total = 8 + (10 × 0.4) = **12.0**
- Feature B total = 3 + (10 × 0.4) = **7.0**
- Universal contribution (4.0) is identical for both. Ranking still determined by direct scores.

## Config Dependencies

- `DIRECT_MAP` -- `config/direct-signal-map.json`
- `UNIVERSAL_MAP` -- `config/universal-signal-map.json`
- `REPEATABLE_SIGNALS` -- `config/signal-types.json`
- `CONFIG.UNIVERSAL_MULTIPLIER` -- `0.4`
- Feature ID list (7 features)

## Cross-References

- **NudgeState** (spec 01) -- Reads `state.activeSignals` + `state.signalCounts`, writes `state.featureScores`.
- **SignalCollector** (spec 02) -- Produces counts + boolean signals that flow into scoring.
- **ContextProfiler** (spec 03) -- Dynamically writes `mindset-vector` and `prompt-synthesis` into `DIRECT_MAP` before scoring runs. Both are boolean.
- **MilestoneSelector** (spec 05) -- Reads `state.featureScores` to decide which feature to nudge and when.

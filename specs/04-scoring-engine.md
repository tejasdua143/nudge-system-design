# 04 -- ScoringEngine

## Purpose

The ScoringEngine calculates per-feature conversion scores from active signals. It reads every signal in `state.activeSignals`, looks up their weights in two maps (DIRECT_MAP and UNIVERSAL_MAP), and produces a detailed scoring breakdown per feature. The output determines which features are most relevant for nudging this specific user.

## Interface

### Inputs

- `state.activeSignals` -- Set of currently active signal names.
- `DIRECT_MAP` -- Signal-to-feature weight mappings (including dynamically written `mindset-vector` and `prompt-synthesis` entries).
- `UNIVERSAL_MAP` -- Signal-to-universal-weight mappings.
- `CONFIG.UNIVERSAL_MULTIPLIER` -- Currently `0.4`.

### Outputs

- `state.featureScores` -- Object keyed by feature ID, each containing a full scoring breakdown.
- Return value of `calculateScores()` is the same object.

### Functions

| Function            | Description                                              |
|---------------------|----------------------------------------------------------|
| `calculateScores()` | Computes and returns per-feature scores from all active signals |

## Algorithm

### calculateScores()

For each feature ID across all 7 features:

```
1. Direct Score Calculation
   -------------------------
   For each signal in state.activeSignals:
     If DIRECT_MAP[signal] exists AND DIRECT_MAP[signal][featureId] exists:
       directScore += DIRECT_MAP[signal][featureId]
       Record { name: signal, weight: DIRECT_MAP[signal][featureId] } in directSignals[]

2. Universal Score Calculation
   ----------------------------
   For each signal in state.activeSignals:
     If UNIVERSAL_MAP[signal] exists:
       universalRaw += UNIVERSAL_MAP[signal]
       Record { name: signal, weight: UNIVERSAL_MAP[signal] } in universalSignals[]

3. Universal Contribution
   -----------------------
   universalContrib = round(universalRaw * CONFIG.UNIVERSAL_MULTIPLIER, 1)
   // CONFIG.UNIVERSAL_MULTIPLIER = 0.4

4. Total Score
   ------------
   total = round(directScore + universalContrib, 1)
```

**Important:** The universal score calculation produces the **same `universalRaw` value for every feature**. Universal signals boost all features equally. Only the direct score differentiates features from each other.

### Rounding

- `universalContrib` is rounded to 1 decimal place.
- `total` is rounded to 1 decimal place.
- `direct` and `universalRaw` are stored as-is (summed weights).

## Data Structures

### Output: featureScores

```js
state.featureScores = {
  [featureId]: {
    direct: number,             // Sum of all direct weights for this feature
    universalRaw: number,       // Sum of all universal weights (same for every feature)
    universalContrib: number,   // universalRaw * 0.4, rounded to 1 decimal
    total: number,              // direct + universalContrib, rounded to 1 decimal
    directSignals: [            // Contributing direct signals
      { name: string, weight: number },
      ...
    ],
    universalSignals: [         // Contributing universal signals
      { name: string, weight: number },
      ...
    ]
  },
  // ... one entry per feature (7 features total)
}
```

### DIRECT_MAP

Approximately **40+ entries**. Each entry maps a signal name to a per-feature weight object.

```js
DIRECT_MAP = {
  'signal-name': {
    featureA: 3,
    featureB: 1,
    featureC: 0,
    // ... weights for each of the 7 features
  },
  // ...
}
```

**Static entries:** Most signals have fixed weights that don't change between users (e.g., `stakes-high-external`, `credits-low`, `returning-user`).

**Dynamic entries:** Two signals are dynamically overwritten per user by the ContextProfiler:
- `DIRECT_MAP['mindset-vector']` -- Per-feature weights from Layer 1 profiling (0--5 per feature, varies by role and audience stakes).
- `DIRECT_MAP['prompt-synthesis']` -- Per-feature weights from Layer 3 profiling (0--5 per feature, varies by topic).

These two dynamic signals are typically the highest-impact direct signals because they can contribute up to 5 points per feature, while most static signals contribute smaller weights.

### UNIVERSAL_MAP

Approximately **15 entries**. Each entry maps a signal name to a single numeric weight (not per-feature).

```js
UNIVERSAL_MAP = {
  'signal-name': 2,    // This weight applies equally to ALL features
  'other-signal': 1,
  // ...
}
```

### Signals That Appear in Both Maps

Some signals exist in both `DIRECT_MAP` and `UNIVERSAL_MAP`. When such a signal is active, it contributes to both the direct score (per-feature, different weight per feature) and the universal score (same weight for all features). Known dual-map signals include:

- `export-attempt`
- `multi-deck`
- `bought-export`
- `deck-veteran`
- `acq-paid`
- `acq-referral`

This means these signals carry extra weight overall -- they affect a specific feature's ranking via the direct map while also lifting all features via the universal map.

## Key Design Insight

The 0.4 universal multiplier is a deliberate design choice. Without it, universal signals (which apply equally to all features) would dominate scoring and wash out the differentiation created by direct signals. The multiplier ensures that:

- **Direct signals drive feature ranking** -- They determine which feature scores highest for a given user.
- **Universal signals lift the baseline** -- They increase the overall score magnitude, making the system more confident a user is ready for a nudge, without changing which feature wins.

Example: If a user has `universalRaw = 10` and feature A has `direct = 8` while feature B has `direct = 3`:
- Feature A total = 8 + (10 * 0.4) = **12.0**
- Feature B total = 3 + (10 * 0.4) = **7.0**
- The universal contribution (4.0) is identical for both. The ranking is entirely determined by direct scores.

## Config Dependencies

- `DIRECT_MAP` -- ~40+ signal entries with per-feature weights
- `UNIVERSAL_MAP` -- ~15 signal entries with single weights
- `CONFIG.UNIVERSAL_MULTIPLIER` -- `0.4`
- Feature ID list (7 features)

## Cross-References

- **NudgeState** (spec 01) -- Reads `state.activeSignals`, writes `state.featureScores`.
- **SignalCollector** (spec 02) -- Produces the user and initial signals that flow into scoring.
- **ContextProfiler** (spec 03) -- Dynamically writes `mindset-vector` and `prompt-synthesis` into `DIRECT_MAP` before scoring runs. These are typically the two highest-impact direct signals.
- **MilestoneSelector** -- Reads `state.featureScores` to decide which feature to nudge and when.

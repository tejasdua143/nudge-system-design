# 01 -- NudgeState

## Purpose

NudgeState is the central shared state bus for the nudge system. Every engine reads from and writes to its own designated slice of this object. It serves as the single source of truth for user context, active signals, scoring results, and milestone history throughout a session.

## Interface

### Reads

All engines may read any field on `state`. There are no access restrictions on reads.

### Writes

Each engine exclusively owns its slice (see Ownership Rules below). No engine writes to another engine's slice.

## Data Structure

```js
let state = {
  user: {},                           // User profile (see User Object below)
  activeSignals: new Set(),           // All currently active signal names (action + context)
  activeActions: new Set(),           // Action IDs with count > 0 (mirrors actionCounts keys)
  actionCounts: {},                   // actionId -> click count. Repeatable actions increment,
                                      // booleans toggle between 0 (absent) and 1.
  signalCounts: {},                   // signalId -> count. Populated from actionCounts via
                                      // rebuildSignalsFromActions(). Booleans always 1 when active.
  signalLog: [],                      // Append-only signal history
  featureScores: {},                  // Per-feature scoring breakdown from ScoringEngine
  milestonesThisSession: 0,          // Count of milestones fired this session
  featuresShownThisSession: new Set(), // Feature IDs already shown as milestones
  lastMilestoneTime: 0,              // Timestamp of last milestone (used for cooldown)
  milestoneLog: [],                   // Reverse-chronological log of fired milestones
  isUserActive: false,                // Whether the user is currently active
};
```

### User Object

Set once by `SignalCollector.generateUser()`. Contains both raw profile fields and derived fields computed by the ContextProfiler.

#### Raw Fields

| Field             | Type    | Range / Values                                      |
|-------------------|---------|-----------------------------------------------------|
| `name`            | string  | User's name                                         |
| `role`            | string  | One of 13 roles (see SignalCollector spec)           |
| `archetype`       | string  | One of 6 archetypes mapped from role                |
| `audience`        | string  | Picked from archetype-specific pool                 |
| `topic`           | string  | Picked from archetype-specific pool                 |
| `email`           | string  | User email address                                  |
| `isCompanyDomain` | boolean | `true` if email uses a company domain               |
| `country`         | string  | Country name                                        |
| `countryTier`     | number  | `1` or `2`                                          |
| `credits`         | number  | `0` -- `100`                                        |
| `sessionNum`      | number  | `1` -- `3`                                          |
| `boughtExport`    | boolean | Whether user has purchased an export                |
| `dismissals`      | number  | `0` -- `2`, count of prior nudge dismissals         |
| `decksCompleted`  | number  | Total decks completed (correlated with sessionNum)  |
| `decksShared`     | number  | Total decks shared                                  |
| `decksPublished`  | number  | Total decks published                               |
| `acqChannel`      | string  | `'organic'` \| `'paid'` \| `'referral'`             |

#### Derived Fields

Set by the ContextProfiler after `generateUser()`.

| Field              | Type   | Description                                                      |
|--------------------|--------|------------------------------------------------------------------|
| `mindsetVector`    | object | Per-feature weight object (base + any sparse override). Values 0-5+.  |
| `mindsetKey`       | string | Base lookup key used, e.g. `"Sales|critical"`. For debugging.          |
| `mindsetOverrideApplied` | boolean | `true` if a sparse (role, audience) override was applied        |
| `audienceStakes`   | string | `'critical'` \| `'external'` \| `'internal'` \| `'unknown'`            |
| `promptSynthesis`  | object | Per-feature 0--5 scores derived from topic/prompt analysis             |
| `isProUser`        | boolean | Derived field set by `handleUpgrade()`; default `undefined`/`false` |

### featureScores Structure

Keyed by feature ID. Each entry:

```js
{
  direct: number,              // Sum of direct signal weights for this feature
  universalRaw: number,        // Sum of universal signal weights (same across all features)
  universalContrib: number,    // universalRaw * 0.4, rounded to 1 decimal
  total: number,               // direct + universalContrib, rounded to 1 decimal
  directSignals: [             // Which direct signals contributed
    { name: string, weight: number }
  ],
  universalSignals: [          // Which universal signals contributed
    { name: string, weight: number }
  ]
}
```

### milestoneLog Entry

Entries are stored in reverse-chronological order (newest first).

```js
{
  feature: object,             // Full feature object (id, name, icon, type, verb, does, plus merged score fields)
  copy: {
    title: string,             // Milestone display title
    body: string               // Milestone display body text
  },
  score: number,               // Total score at time of firing
  direct: number,              // Direct score component
  universal: number,           // Universal contribution component
  directSignals: [...],        // Direct signals that were active
  universalSignals: [...],     // Universal signals that were active
  time: string                 // Formatted time string from new Date().toLocaleTimeString() (e.g. "2:34:15 PM")
}
```

## Ownership Rules

| Engine              | Owned Fields                                                                              |
|---------------------|-------------------------------------------------------------------------------------------|
| **SignalCollector**  | `user`, `activeSignals`, `signalLog`                                                      |
| **ScoringEngine**   | `featureScores`                                                                           |
| **MilestoneSelector** | `milestonesThisSession`, `featuresShownThisSession`, `lastMilestoneTime`, `milestoneLog` |
| **Coordinator**     | `activeActions`, `isUserActive` (toggled by `toggleUserActive()`)                         |
| **Feedback Handlers** | `user.isProUser` (set by `handleUpgrade()`)                                             |

No engine writes outside its slice. This prevents race conditions and makes the data flow deterministic and traceable.

## Lifecycle

1. **Initialization** -- State is created with empty defaults.
2. **User generation** -- SignalCollector writes `user` and initial `activeSignals`.
3. **Profiling** -- ContextProfiler enriches `user` with derived fields and adds context signals to `activeSignals`.
4. **Scoring** -- ScoringEngine reads `activeSignals` and writes `featureScores`.
5. **Milestone selection** -- MilestoneSelector reads `featureScores` and writes milestone tracking fields.
6. **Runtime** -- Coordinator toggles `activeActions` as the user interacts; scoring and milestones re-evaluate as signals change.

## Cross-References

- **SignalCollector** (spec 02) -- Populates `user`, `activeSignals`, and `signalLog`.
- **ContextProfiler** (spec 03) -- Enriches `user` with derived fields; adds context signals.
- **ScoringEngine** (spec 04) -- Reads `activeSignals`, writes `featureScores`.
- **MilestoneSelector** -- Reads `featureScores`, writes milestone tracking fields.
- **Coordinator** -- Manages `activeActions` based on user interactions; `toggleUserActive()` toggles `isUserActive`.
- **`handleDismiss()`** -- Feedback loop handler for nudge dismissals.
- **`handleUpgrade()`** -- Feedback loop handler that sets `user.isProUser` on upgrade.

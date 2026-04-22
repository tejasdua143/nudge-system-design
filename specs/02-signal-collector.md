# 02 -- SignalCollector

## Purpose

The SignalCollector translates product events into named signals that the rest of the nudge system can reason about. In the simulator, it generates randomized but realistic user profiles and writes the initial set of context signals to NudgeState. In production, it would listen for real product events and map them to signal names.

Signals are classified two ways (see `config/signal-types.json`):
- **Repeatable** -- user can perform the event multiple times per session. Each occurrence increments a counter. The ScoringEngine log-scales by `log₂(count + 1)`.
- **Boolean** -- fires once per session (user attribute, threshold, prompt extraction). Count is always 1.

Aggregate threshold signals such as `edit-streak-3`, `edit-count-5`, `slides-15plus` were removed under log-scaling; escalation is now captured by log on the underlying repeatable (`text-edit`, `undo-redo`, etc.).

## Interface

### Inputs

None -- `generateUser()` is the entry point and requires no arguments. It internally uses randomized selection with weighted distributions.

### Outputs

Writes to NudgeState:
- `state.user` -- Complete user profile object
- `state.activeSignals` -- Set of signal names currently active (union of context + action signals)
- `state.actionCounts` -- Map of actionId -> click count (increments for repeatable actions; 0 or 1 for booleans)
- `state.signalCounts` -- Map of signal name -> count (derived from actionCounts; booleans default to 1 when active)
- `state.signalLog` -- Appended signal history entries

### Functions

| Function                         | Description                                                                              |
|----------------------------------|------------------------------------------------------------------------------------------|
| `generateUser()`                 | Generates a full random user profile, then calls `profileUser()` and `addStateSignals()` |
| `pick(arr)`                      | Returns a random element from the given array                                            |
| `performAction(actionId)`        | Records a user action. Repeatable actions increment `actionCounts[id]`; boolean actions toggle on/off. Triggers `rebuildSignalsFromActions()`. |
| `rebuildSignalsFromActions()`    | Rebuilds `activeSignals` + `signalCounts` from `actionCounts` + profile-derived context signals. Booleans receive count = 1; repeatable signal counts sum across all actions that emit them. |

## Algorithm

### generateUser()

1. **Pick role** from the 13-role list.
2. **Map role to archetype** using the fixed role-to-archetype mapping.
3. **Pick audience** from the archetype-specific audience pool.
4. **Pick topic** from the archetype-specific topic pool.
5. **Generate credits** -- random integer 0--100.
6. **Generate sessionNum** -- random integer 1--3.
7. **Generate boughtExport** -- random boolean.
8. **Generate dismissals** -- random integer 0--2.
9. **Generate deck history** -- `decksCompleted`, `decksShared`, `decksPublished`, correlated with `sessionNum` (higher session numbers produce higher deck counts).
10. **Generate email** -- includes domain detection for `isCompanyDomain`.
11. **Pick country and tier** -- weighted 2:1 toward Tier 2 countries.
12. **Pick acquisition channel** -- `'organic'`, `'paid'`, or `'referral'`.
13. **Write** the assembled user object to `state.user`.
14. **Call** `profileUser()` (ContextProfiler) to compute derived fields.
15. **Call** `addStateSignals()` (ContextProfiler) to write context signals.

## Data Structures

### Roles (13)

```
Leadership, Sales, Marketing, Product, Design, Engineering,
Data Analytics, Consulting, Operations, Finance, Creator, Teacher, Student
```

### Role-to-Archetype Mapping (13 roles to 6 archetypes)

| Role(s)                                                              | Archetype    |
|----------------------------------------------------------------------|--------------|
| Leadership                                                           | **Founder**  |
| Sales, Marketing                                                     | **Sales**    |
| Product, Engineering, Data Analytics, Consulting, Operations, Finance | **Corporate** |
| Design, Creator                                                      | **Creative** |
| Teacher                                                              | **Educator** |
| Student                                                              | **Student**  |

### Audience Pools (per archetype)

| Archetype   | Audience Pool                                              |
|-------------|------------------------------------------------------------|
| Founder     | Investors, VCs, Board members, Angel investors             |
| Sales       | Enterprise clients, Prospects, C-suite buyers              |
| Corporate   | Leadership team, Executives, Stakeholders, Cross-functional team |
| Creative    | Potential clients, Recruiters, Art directors                |
| Educator    | Students, Corporate trainees, Workshop attendees           |
| Student     | Professor, Panel judges, Classmates                        |

### Country Tiers

**Tier 1** (higher GDP, higher willingness-to-pay):
```
US, UK, Canada, Australia, Germany, France, Netherlands,
Sweden, Switzerland, Japan, Singapore
```

**Tier 2** (lower GDP, price-sensitive):
```
India, Brazil, Indonesia, Philippines, Mexico, Nigeria, Vietnam,
Colombia, Egypt, Bangladesh, Pakistan, Kenya
```

**Distribution**: Weighted 2:1 toward Tier 2. For every 1 Tier 1 user generated, approximately 2 Tier 2 users are generated. This reflects real-world freemium user distributions.

### Acquisition Channels

```
'organic' | 'paid' | 'referral'
```

## Action / Signal Classification

30 simulator actions emit 40+ signals. Each signal is tagged repeatable or boolean in `config/signal-types.json`. An action is **repeatable** if any of the signals it emits is repeatable.

### Repeatable actions (24)

| Cluster            | Actions                                                                                  |
|--------------------|------------------------------------------------------------------------------------------|
| Edit               | text-edit, style-change, element-move, undo-redo, slide-delete                           |
| Content            | insert-title, insert-list, insert-media, insert-slide-prompt, insert-slide-template, slide-reorder |
| Preview            | play-preview, edit-after-preview, theme-global, layout-slide, deck-regenerate             |
| Share / export     | share-link-copy, invite-attempt, export-click, export-download                            |
| Conversion-intent  | doc-upload, deck-switch, pricing-visit, gate-hit                                          |

### Boolean actions (6)

`prompt-brand`, `prompt-team`, `doc-upload-long`, `session-15min`, `second-deck`, `bought-export`.

### Context / profile signals (boolean)

Derived from the user profile, never from an action click: `stakes-critical`, `stakes-external`, `stakes-internal`, `stakes-unknown`, `deck-veteran`, `deck-sharer`, `deck-publisher`, `acq-organic`, `acq-paid`, `acq-referral`, `credits-low`, `credits-zero`, `returning-user`, `zero-dismissals`, `company-domain`, `tier-1-country`, `mindset-vector`, `prompt-synthesis`. Stakes tags carry no direct weight — they are classification labels; all stakes-driven feature lift is encoded in `mindset-vector`.

### Counter semantics

- Repeatable action click -> `actionCounts[id]++`. Each signal it emits gains `+1` count in `signalCounts`.
- Boolean action click -> toggles presence. Count stays at 1 when active.
- One action can emit multiple signals (e.g. `invite-attempt` emits `invite-attempt` + `gate-hit`); each signal's count increments equally.
- Context signals added post-profile get count = 1 if not already counted.
- Reset clears both `actionCounts` and `signalCounts`.

## Config Dependencies

- Role list (13 entries)
- Archetype mapping (13-to-6)
- Audience pools (6 pools)
- Topic pools (per archetype, used for prompt synthesis downstream)
- Country lists and tier assignment
- Weighting for country tier distribution (2:1 Tier 2 bias)
- `config/signal-types.json` -- repeatable/boolean tagging

## Cross-References

- **NudgeState** (spec 01) -- SignalCollector owns `user`, `activeSignals`, `actionCounts`, `signalCounts`, and `signalLog`.
- **ContextProfiler** (spec 03) -- Called by `generateUser()` via `profileUser()` and `addStateSignals()`. The ContextProfiler enriches the user profile and writes boolean context signals.
- **ScoringEngine** (spec 04) -- Consumes `activeSignals` + `signalCounts`. Applies `log₂(count + 1)` to repeatable signals before summing weights.

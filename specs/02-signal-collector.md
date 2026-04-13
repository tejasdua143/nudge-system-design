# 02 -- SignalCollector

## Purpose

The SignalCollector translates product events into named signals that the rest of the nudge system can reason about. In the simulator, it generates randomized but realistic user profiles and writes the initial set of context signals to NudgeState. In production, it would listen for real product events and map them to signal names.

## Interface

### Inputs

None -- `generateUser()` is the entry point and requires no arguments. It internally uses randomized selection with weighted distributions.

### Outputs

Writes to NudgeState:
- `state.user` -- Complete user profile object
- `state.activeSignals` -- Initial set of context-derived signal names
- `state.signalLog` -- Appended signal history entries

### Functions

| Function         | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| `generateUser()` | Generates a full random user profile, then calls `profileUser()` and `addStateSignals()` |
| `pick(arr)`      | Returns a random element from the given array                            |

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

## Config Dependencies

- Role list (13 entries)
- Archetype mapping (13-to-6)
- Audience pools (6 pools)
- Topic pools (per archetype, used for prompt synthesis downstream)
- Country lists and tier assignment
- Weighting for country tier distribution (2:1 Tier 2 bias)

## Cross-References

- **NudgeState** (spec 01) -- SignalCollector owns `user`, `activeSignals`, and `signalLog`.
- **ContextProfiler** (spec 03) -- Called by `generateUser()` via `profileUser()` and `addStateSignals()`. The ContextProfiler enriches the user profile and writes context signals.
- **ScoringEngine** (spec 04) -- Consumes the signals written by SignalCollector and ContextProfiler.

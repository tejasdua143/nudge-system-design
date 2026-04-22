# 03 — ContextProfiler

## Purpose

The ContextProfiler runs 3-layer profiling on each generated user to produce per-feature signal weights. It bridges raw user attributes (role, audience, topic) to the numeric weights the ScoringEngine consumes.

Three layers, composed additively:
- **L1 Mindset** — role × stakes-bucket → base vector, with sparse (role, audience) overrides for sharp pairings.
- **L2 Audience Stakes** — classifies audience into one of 4 buckets: `critical / external / internal / unknown`. **Classification tag only — no direct weight.** All stakes lift now lives in the mindset vector.
- **L3 Prompt Synthesis** — 0-5 per-feature scores from the user's prompt via LLM, lookup, or keyword fallback.

## Interface

### Inputs
- `state.user` — Populated by SignalCollector before profiling runs.

### Outputs
- `state.user.mindsetVector` — Per-feature weights from L1 (base + override)
- `state.user.mindsetKey` — The base lookup key used (for debugging)
- `state.user.mindsetOverrideApplied` — Boolean, true if a sparse override was applied
- `state.user.audienceStakes` — One of `critical`, `external`, `internal`, `unknown`
- `state.user.promptSynthesis` — Per-feature 0-5 object from L3
- `state.activeSignals` — Adds `mindset-vector`, `stakes-<bucket>`, `prompt-synthesis`, plus state signals
- `DIRECT_MAP['mindset-vector']` — Dynamically written per-user
- `DIRECT_MAP['prompt-synthesis']` — Dynamically written per-user

### Functions

| Function | Description |
|---|---|
| `profileUser()` | Runs L1 + L2 + L3 in sequence |
| `getAudienceStakes(audience)` | Returns bucket name or `'unknown'` |
| `applyMindsetOverride(baseVector, overrideKey)` | Adds sparse (role, audience) deltas to base vector, returns new vector |
| `addStateSignals()` | Writes credit/session/behavior signals (called by SignalCollector) |

## Algorithm — profileUser()

```
1. Alias legacy audience strings (e.g. "Leadership team" → "→ Exec team")
2. audienceStakes = getAudienceStakes(user.audience)                  // L2
3. state.activeSignals.add('stakes-' + audienceStakes)                // tag only
4. effectiveStakes = (audienceStakes === 'unknown') ? 'internal' : audienceStakes
5. baseKey       = role + '|' + effectiveStakes                       // e.g. "Sales|critical"
6. baseVector    = MINDSET_VECTORS[baseKey] || MINDSET_FALLBACK       // L1 base
7. overrideKey   = role + '|' + user.audience                         // e.g. "Sales|→ Investors"
8. mindsetVector = applyMindsetOverride(baseVector, overrideKey)      // L1 override (sparse)
9. DIRECT_MAP['mindset-vector'] = mindsetVector
10. state.activeSignals.add('mindset-vector')
11. L3 — LLM / lookup / keyword fallback → promptSynthesis
12. DIRECT_MAP['prompt-synthesis'] = promptSynthesis
13. state.activeSignals.add('prompt-synthesis')
```

## Layer 1: Mindset (base + sparse override)

### Base table (`MINDSET_VECTORS`, 39 entries + fallback)

Key format: `"role|stakesBucket"` where bucket ∈ `{critical, external, internal}`.
Values: per-feature weights 0-5.
`MINDSET_FALLBACK` used when no match (e.g. stakes=unknown and role missing from table).

### Sparse overrides (`MINDSET_OVERRIDES`, ~17 entries)

Key format: `"role|→ audience"` (audience prefixed with `→` to avoid role-name collision).
Values: per-feature **deltas** (can be negative).

Override is applied *on top* of the base vector — weights sum. Empty / missing key = no override, base vector used unchanged. Mirrors `config/mindset-overrides.json`.

**Why sparse overrides:** most (role, audience) pairs fit their role × stakes base. Only ~17 combinations warrant sharp treatment (e.g. Sales pitching Investors ≠ Sales pitching Prospects, even though both are external-type).

### Lookup scale

- Base: 13 roles × 3 buckets = **39 cells**
- Override: **~17 sparse cells**
- Fallback: **1 vector**
- **Total: ~57 cells** (vs. full 13×25 matrix = 325 cells)

## Layer 2: Audience Stakes Classification

### Buckets

| Bucket | Audience examples | Meaning |
|---|---|---|
| `critical` | → Investors, → VCs, → Board members, → Angel investors, → Enterprise clients, → C-suite buyers | High-consequence external presentation |
| `external` | → Prospects, → Potential clients, → Recruiters, → Art directors | Lower-stakes external, still professional |
| `internal` | → Exec team, → Executives, → Stakeholders, → XFN stakeholders, → Students, → Corporate trainees, → Workshop attendees, → Professor, → Panel judges, → Classmates | Internal, academic, or low-consequence |
| `unknown` | Blank / null / unmatched string | Audience not given or unclear |

### Naming conventions

- **Audience strings prefixed with `→`** — reads as "presenting TO this audience". Disambiguates from role names (role `Leadership` vs audience `→ Exec team`).
- **Legacy alias table** — old configs using `"Leadership team"` / `"Cross-functional team"` auto-aliased to `→ Exec team` / `→ XFN stakeholders`.

### Weights

**None.** Stakes tags carry no direct weight in `DIRECT_MAP`. They exist as:
1. Classification labels for logs + debugging
2. Inputs to the L1 base key (via `effectiveStakes`)

All actual stakes-based feature lift lives in the mindset vector (base table + sparse overrides).

### Unknown audience handling

```
audience missing / blank / unmatched
  ↓
stakes = 'unknown' → emit stakes-unknown tag (logs only)
  ↓
effectiveStakes = 'internal' (safest default for L1 base key)
  ↓
Override lookup: 'role|' + (audience || '') — will miss, so no override applied
  ↓
Base vector from "role|internal" still applies
  ↓
System still scores users — just less confidently. Relies more on L3 prompt + actions.
```

No crash, no silent misclassification. An unknown audience produces a weaker, role-only profile; the Relevance Filter + action log decide whether to fire.

## Layer 3: Prompt Synthesis

### Three sources (priority order)
1. **Local LLM (Ollama/Gemma)** — real-time per-feature 0-5 scores + inferred audience/stakes.
2. **Lookup table (`PROMPT_SYNTHESIS`)** — 30+ pre-computed topic → scores.
3. **Keyword fallback (`synthesizeFromKeywords`)** — regex-based inference.

### Steps
```
synthesis = PROMPT_SYNTHESIS[user.topic]
         || synthesizeFromKeywords(user.topic)
DIRECT_MAP['prompt-synthesis'] = synthesis
state.activeSignals.add('prompt-synthesis')
```

LLM path overwrites earlier result and may also update `user.audience` / `user.audienceStakes` (then L1 re-runs). LLM is expected to return `audience_stakes ∈ {critical, external, internal, unknown}`.

### Keyword-to-feature examples
- "brand", "colors", "fonts" → `brand-kit`
- "team", "collaborate" → `invite-collab`
- "investor", "pitch", "funding" → `unbranded`, `analytics`, `export`
- "help", "struggle", "can't" → `hire-team`
- "download", "pdf" → `export`

## addStateSignals()

Reads user attributes, writes boolean state signals.

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
| `acq-organic` / `acq-paid` / `acq-referral` | Matches `user.acqChannel` |

## Config Dependencies

- `config/mindset-vectors.json` — 39 base cells + fallback
- `config/mindset-overrides.json` — **new.** ~17 sparse (role, audience) deltas
- `config/context-layers.json` — audience-to-bucket lists (no weights)
- `config/signal-types.json` — stakes tags listed under boolean
- `config/prompt-synthesis-examples.json` — L3 lookup + LLM few-shot

## Cross-References

- **NudgeState** (spec 01) — Reads `state.user`, writes `mindsetVector`, `audienceStakes`, `promptSynthesis`, activeSignals.
- **SignalCollector** (spec 02) — Calls `profileUser()` and `addStateSignals()`.
- **Relevance Filter** (spec 05) — Uses `mindsetVector` + `promptSynthesis` (relevance ≥ 3).
- **ScoringEngine** (spec 04) — Reads `mindset-vector` + `prompt-synthesis` as boolean direct signals. Stakes tags have no weight.

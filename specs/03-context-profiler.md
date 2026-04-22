# 03 — ContextProfiler

## Purpose

The ContextProfiler runs 3-layer profiling on each generated user to produce rich, per-feature signal weights. It bridges the gap between raw user attributes (role, audience, topic) and the numeric signal weights that the ScoringEngine consumes. Each layer adds a different dimension of context.

## Interface

### Inputs

- `state.user` — Must be populated by SignalCollector before profiling runs.

### Outputs

Writes to:
- `state.user.mindsetVector` — Per-feature weight object from Layer 1
- `state.user.audienceStakes` — Audience classification from Layer 2
- `state.user.promptSynthesis` — Per-feature score object from Layer 3
- `state.activeSignals` — Adds context signals (`mindset-vector`, audience stakes signal, `prompt-synthesis`, and state signals)
- `DIRECT_MAP['mindset-vector']` — Dynamically written per-feature weights
- `DIRECT_MAP['prompt-synthesis']` — Dynamically written per-feature weights

### Functions

| Function              | Description                                                    |
|-----------------------|----------------------------------------------------------------|
| `profileUser()`       | Runs all 3 profiling layers in sequence                        |
| `getAudienceStakes(audience)` | Classifies an audience string into a stakes category  |
| `addStateSignals()`   | Writes credit/session/domain/behavior signals to activeSignals |

## Algorithm

### profileUser()

Executes Layers 1, 2, and 3 in order. Does **not** call `addStateSignals()` — that function is called separately by `generateUser()` in the SignalCollector (spec 02).

---

### Layer 1: Mindset Vector

Maps the user's role and audience stakes to a per-feature weight vector.

**Steps:**
1. Compute audience stakes via `getAudienceStakes(user.audience)`.
2. Build lookup key: `role + '|' + audienceStakes` (e.g., `"Sales|high-external"`).
3. Look up `MINDSET_VECTORS[key]`.
4. If no match, fall back to `MINDSET_FALLBACK`.
5. Write the vector to `DIRECT_MAP['mindset-vector']` (dynamically overwrites the entry).
6. Add `'mindset-vector'` to `state.activeSignals`.
7. Store the vector on `state.user.mindsetVector`.

**Vector shape:** An object keyed by feature ID, each value 0-5. Covers all 7 features.

**Scale:**
- **13 roles × 3 audience stakes = 39 unique vectors** in the `MINDSET_VECTORS` lookup table.
- **1 fallback vector** (`MINDSET_FALLBACK`) for any unmatched combination.
- Total: **40 vectors**.

---

### Layer 2: Audience Stakes Classification

Classifies the user's audience into one of three categories based on the perceived external pressure and consequence of the presentation.

**Classification rules:**

| Category              | Signal Name            | Audiences                                                        |
|-----------------------|------------------------|------------------------------------------------------------------|
| **High external**     | `stakes-high-external` | Investors, VCs, Board members, Angel investors, Enterprise clients, C-suite buyers, Panel judges, Professor, Executives |
| **Low external**      | `stakes-low-external`  | Prospects, Potential clients, Recruiters, Art directors, Workshop attendees, Corporate trainees |
| **Internal**          | `stakes-internal`      | Everything else (Leadership team, Stakeholders, Cross-functional team, Students, Classmates) |

**Design rationale:** Panel judges, Professor, and Executives are classified as high-external because the presentation stakes for these audiences are equivalent to external stakeholders — a student presenting to panel judges or a professor faces the same pressure as someone pitching investors.

**Steps:**
1. Match `user.audience` against the high-external list. If found, return `'high-external'`.
2. Match against the low-external list. If found, return `'low-external'`.
3. Default to `'internal'`.
4. Store on `state.user.audienceStakes`.
5. Add the corresponding signal name (`stakes-high-external`, `stakes-low-external`, or `stakes-internal`) to `state.activeSignals`.

These signal names are keys in `DIRECT_MAP` and carry per-feature weights that the ScoringEngine reads.

---

### Layer 3: Prompt Synthesis

Analyzes the user's raw prompt/topic to produce per-feature relevance scores.

**Three sources (in priority order):**

1. **Local LLM (Ollama/Gemma 2)** — When Ollama is running locally, the simulator sends the prompt to the LLM for real-time analysis. The LLM returns per-feature scores (0-5) plus inferred audience and stakes. This overwrites the lookup/keyword results with higher-quality analysis.

2. **Lookup table (`PROMPT_SYNTHESIS`)** — 30+ pre-computed prompt-to-score mappings covering investor pitches, enterprise proposals, internal reviews, creative portfolios, education, and student presentations.

3. **Keyword fallback (`synthesizeFromKeywords`)** — When the prompt isn't in the lookup table and no LLM is available, regex-based keyword matching generates approximate 0-5 scores.

**Steps (for lookup/keyword path):**
1. Look up `PROMPT_SYNTHESIS[user.topic]`.
2. If found, use the result. If not, call `synthesizeFromKeywords(user.topic)`.
3. Write the score object to `DIRECT_MAP['prompt-synthesis']`.
4. Add `'prompt-synthesis'` to `state.activeSignals`.
5. Store on `state.user.promptSynthesis`.

**Steps (for LLM path):**
1. Check if Ollama is available at `localhost:11434`.
2. Send the prompt to Gemma 2 with a structured system prompt requesting per-feature scores.
3. Parse the JSON response.
4. Overwrite `DIRECT_MAP['prompt-synthesis']` and `state.user.promptSynthesis` with LLM results.
5. Also update `user.audience` and `user.audienceStakes` if the LLM infers them.

**Keyword-to-feature mapping examples:**
- "brand", "colors", "fonts" → `brand-kit`
- "team", "collaborate" → `invite-collab`
- "investor", "pitch", "funding" → `unbranded`, `analytics`, `export`
- "help", "struggle", "can you just" → `hire-team`
- "download", "pdf", "powerpoint" → `export`

---

### addStateSignals()

Reads raw user attributes and writes boolean-style signals to `state.activeSignals`.

| Signal Name        | Condition                     |
|--------------------|-------------------------------|
| `credits-low`      | `user.credits < 30`           |
| `credits-zero`     | `user.credits === 0`          |
| `returning-user`   | `user.sessionNum > 1`         |
| `bought-export`    | `user.boughtExport === true`  |
| `zero-dismissals`  | `user.dismissals === 0`       |
| `company-domain`   | `user.isCompanyDomain === true`|
| `tier-1-country`   | `user.countryTier === 1`      |
| `deck-veteran`     | `user.decksCompleted >= 5`    |
| `deck-sharer`      | `user.decksShared >= 2`       |
| `deck-publisher`   | `user.decksPublished >= 1`    |
| `acq-organic`      | `user.acqChannel === 'organic'` |
| `acq-paid`         | `user.acqChannel === 'paid'`  |
| `acq-referral`     | `user.acqChannel === 'referral'` |

Each signal is only added when its condition is `true`. Signals that don't meet their condition are not added (absence = false).

## Data Structures

### MINDSET_VECTORS

A lookup table of 39 entries + 1 fallback.

- **Key format:** `"role|audienceStakes"` (e.g., `"Marketing|high-external"`)
- **Value:** Object keyed by feature ID, each value 0-5.
- **Fallback key:** `MINDSET_FALLBACK` — used when no exact role+stakes match exists.

### PROMPT_SYNTHESIS

A lookup table of 30+ entries.

- **Key:** Topic string (exact match from the user's topic pool).
- **Value:** Object keyed by feature ID, each value 0-5.

### DIRECT_MAP (dynamic entries)

Two entries are dynamically written by the ContextProfiler:

- `DIRECT_MAP['mindset-vector']` — Overwritten per user with their mindset vector (per-feature 0-5 weights).
- `DIRECT_MAP['prompt-synthesis']` — Overwritten per user with their prompt synthesis scores (per-feature 0-5 weights).

These are special because their values change per user, unlike static signal entries in `DIRECT_MAP` which have fixed weights.

## Config Dependencies

- `MINDSET_VECTORS` — 40 entries (39 role-stakes combinations + 1 fallback)
- `MINDSET_FALLBACK` — Default vector
- `PROMPT_SYNTHESIS` — 30+ topic-to-score mappings
- `DIRECT_MAP` — Audience stakes signals plus dynamically written `mindset-vector` and `prompt-synthesis`
- Audience classification lists (high-external, low-external audiences)

## Cross-References

- **NudgeState** (spec 01) — Reads `state.user`, writes derived fields to `state.user`, writes to `state.activeSignals`.
- **SignalCollector** (spec 02) — Calls `profileUser()` and `addStateSignals()` as the final step of `generateUser()`.
- **Relevance Filter** (spec 05) — Uses `mindsetVector` and `promptSynthesis` to determine which features are relevant before scoring.
- **ScoringEngine** (spec 04) — Reads the signals and dynamic DIRECT_MAP entries written by the ContextProfiler.

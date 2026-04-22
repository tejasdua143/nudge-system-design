# 05 — Milestone Selector

## Purpose

The MilestoneSelector is the decision engine that determines **which** nudge to fire and **when**. It has two stages: first, a relevance filter removes features that don't fit the user's context; then, remaining features are scored and the highest one that clears the threshold fires through guardrails. There is no fallback — if the top pick is blocked, nothing fires.

---

## Interface

### Inputs

| Source | Data |
|---|---|
| `state.relevantFeatures` | Set of feature IDs that passed the relevance filter |
| `calculateScores()` | Fresh score map for all 7 features (direct + universal per feature) |
| `state.featuresShownThisSession` | Set of feature IDs already fired this session |
| `CONFIG.THRESHOLD` | Minimum total score to qualify (14) |
| `checkGuardrails(featureId)` | Gate check returning `{ pass, reasons }` |

### Outputs

| Output | Description |
|---|---|
| Nudge fired | Triggers rendering pipeline (preview, feed, matrix, guardrails) |
| No-op | If no feature qualifies or guardrails block the top pick |

---

## Stage 1: Relevance Filter

### Function: `computeRelevantFeatures()`

Called once when a user is generated and when prompt synthesis changes. Determines which features are contextually relevant to this user before any action scoring happens.

**Algorithm:**

1. For each feature, compute: `relevance = mindsetVector[featureId] + promptSynthesis[featureId]`
2. Both scores range 0-5, so relevance ranges 0-10.
3. If `relevance >= RELEVANCE_THRESHOLD` (3), the feature is relevant.
4. Always include `hire-team` as relevant (it fires on struggle signals from actions, not context layers).
5. Store the relevant set in `state.relevantFeatures` and all scores in `state.relevanceScores`.

**Why this exists:** Without the filter, a user writing a brand pitch could get nudged about analytics because enough universal signals accumulated. The relevance filter ensures only features that match the user's role + prompt context can fire.

**What determines relevance:**
- **Mindset vector** (0-5) — the user's role and audience stakes
- **Prompt synthesis** (0-5) — what the user's prompt suggests they need

**What does NOT determine relevance:**
- User actions (clicking, editing, sharing) — these feed into scoring, not filtering
- Universal signals (credits, session number) — these boost all features equally

---

## Stage 2: Evaluate and Fire

### Function: `evaluateAndFire()`

Called after every user action and after the activity pause clears.

**Algorithm (step by step):**

1. Guard: if the nudge modal is already open, return immediately.
2. Call `calculateScores()` to get a fresh score object for all features.
3. Map all 7 features by merging each FEATURES entry with its current scores.
4. **Filter** — keep only features where:
   - Feature is in `state.relevantFeatures` (passed relevance filter), AND
   - `total >= CONFIG.THRESHOLD` (14), AND
   - Feature has NOT already been shown this session
5. **Sort** descending by `total` score.
6. If no features qualify after filtering, return (no nudge).
7. Take the **top scorer** (index 0 after sort).
8. Run `checkGuardrails(top.id)`.
9. If guardrails **pass**, call `fireMilestone(top)`.
10. If guardrails **fail**, the nudge is **blocked**. No fallback to the next-ranked feature.

### Function: `fireMilestone(feature)`

Records the milestone in state and triggers the full render pipeline.

**Steps:**

1. Increment `state.milestonesThisSession`.
2. Add `feature.id` to `state.featuresShownThisSession`.
3. Set `state.lastMilestoneTime = Date.now()`.
4. Generate copy via `generateCopy(feature)` (see [07-copy-engine.md](./07-copy-engine.md)).
5. Push to `state.milestoneLog` using `unshift` (newest entry first). The log entry contains: feature info, copy, scores, direct signals, universal signals, and timestamp.
6. Trigger renders:
   - `renderNudgePreview(feature, copy)`
   - `renderFeed()`
   - `renderMatrix()`
   - `renderGuardrails()`

---

## Tie-Breaking

When two or more features share the same total score, the feature that appears **first** in the `FEATURES` array wins. This is a natural consequence of using a stable sort — the original array order is preserved for equal values.

**FEATURES array order:**

| Index | Feature ID |
|---|---|
| 0 | `ai-models` |
| 1 | `brand-kit` |
| 2 | `unbranded` |
| 3 | `export` |
| 4 | `invite-collab` |
| 5 | `analytics` |
| 6 | `hire-team` |

So if `brand-kit` and `export` both score 18, `brand-kit` wins because it has a lower array index.

---

## Configuration Constants

| Constant | Value | Purpose |
|---|---|---|
| `RELEVANCE_THRESHOLD` | 3 | Minimum mindset + prompt score for a feature to be relevant |
| `CONFIG.THRESHOLD` | 14 | Minimum total score for a relevant feature to fire |
| `CONFIG.MAX_SCORE` | 30 | Used for UI bar visualization only (does not affect selection) |

---

## Behavior Notes

- **Two gates**: A feature must pass both the relevance filter (context fit ≥ 3) AND the scoring threshold (total ≥ 14) to fire. A feature can score 20 but still not fire if its relevance is below 3.
- **No fallback**: If the top-ranked feature is blocked by guardrails, the system does nothing. It does not try the second-ranked feature.
- **Session scoping**: `featuresShownThisSession` resets when the session resets. A feature can only fire once per session.
- **Re-evaluation on every action**: Scores are recalculated fresh on every call. A feature that didn't qualify before may qualify after new actions add signals.
- **Relevance is stable within a session**: `computeRelevantFeatures()` only re-runs when the user or prompt changes, not on every action. Actions change scores but not relevance.

---

## Cross-References

- **Context Profiler** (spec 03) — Produces `mindsetVector` and `promptSynthesis` that feed the relevance filter.
- **Scoring Engine** (spec 04) — `calculateScores()` produces per-feature breakdowns of direct and universal contributions.
- **Guardrails** (spec 06) — The gate that can block the top pick after relevance and scoring both pass.
- **Copy Engine** (spec 07) — Generates contextual title/body/CTA for the fired nudge.
- **Renderer** (spec 08) — All render functions triggered by `fireMilestone`.

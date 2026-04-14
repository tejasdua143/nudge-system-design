# 05 — Milestone Selector

## Purpose

The MilestoneSelector is the decision engine that determines **which** nudge to fire and **when**. After every user action, it re-scores all 9 features, picks the highest-scoring one that clears the threshold, and attempts to fire it through guardrails. It does not retry or fall back — if the top pick is blocked, nothing fires.

---

## Interface

### Inputs

| Source | Data |
|---|---|
| `calculateScores()` | Fresh score map for all 9 features (direct + universal per feature) |
| `state.featuresShownThisSession` | Set of feature IDs already fired this session |
| `CONFIG.THRESHOLD` | Minimum total score to qualify (14) |
| `checkGuardrails(featureId)` | Gate check returning `{ pass, reasons }` |

### Outputs

| Output | Description |
|---|---|
| Nudge fired | Triggers rendering pipeline (preview, feed, matrix, guardrails) |
| No-op | If no feature qualifies or guardrails block the top pick |

---

## Functions

### `evaluateAndFire()`

Called after every user action. This is the main decision function.

**Algorithm (step by step):**

1. Call `calculateScores()` to get a fresh score object for all features.
2. Map all 9 features by merging each FEATURES entry with its current scores: `{ id, name, icon, type, verb, does, direct, universalRaw, universalContrib, total, directSignals, universalSignals }`.
3. **Filter** — keep only features where:
   - `total >= CONFIG.THRESHOLD` (14), AND
   - feature has NOT already been shown this session (`state.featuresShownThisSession`)
4. **Sort** descending by `total` score.
5. If no features qualify after filtering, return immediately (no nudge).
6. Take the **top scorer** (index 0 after sort).
7. Run `checkGuardrails(top.id)`.
8. If guardrails **pass**, call `fireMilestone(top)`.
9. If guardrails **fail**, the nudge is **blocked**. There is **no fallback** to the next-ranked feature.

### `fireMilestone(feature)`

Records the milestone in state and triggers the full render pipeline.

**Steps:**

1. Increment `state.milestonesThisSession`.
2. Add `feature.id` to `state.featuresShownThisSession`.
3. Set `state.lastMilestoneTime = Date.now()`.
4. Generate copy via `generateCopy(feature)` (see [07-copy-engine.md](./07-copy-engine.md)).
5. Push to `state.milestoneLog` using `unshift` (newest entry first). The log entry contains the full breakdown: feature info, scores, signals, copy, and timestamp.
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
| 6 | `gen-speed` |
| 7 | `pres-refresh` |
| 8 | `hire-team` |

So if `brand-kit` and `export` both score 18, `brand-kit` wins because it has a lower array index.

---

## Configuration Constants

| Constant | Value | Purpose |
|---|---|---|
| `CONFIG.THRESHOLD` | 14 | Minimum total score for a feature to qualify |
| `CONFIG.MAX_SCORE` | 30 | Used for UI bar visualization only (does not affect selection logic) |

---

## Behavior Notes

- **No fallback**: If the top-ranked feature is blocked by guardrails, the system does nothing. It does not try the second-ranked feature. This is intentional — if the best candidate can't fire, the moment isn't right for any nudge.
- **Session scoping**: `featuresShownThisSession` resets when the session resets. A feature can only fire once per session.
- **Double filtering**: The "already shown" check happens both in the filter step (step 3) and inside guardrails (feature repeat check). The filter step is the primary gate; the guardrail check is a safety net.
- **Re-evaluation on every action**: Scores are recalculated fresh on every call. A feature that didn't qualify before may qualify after new actions add signals.
- **Guardrail suppression**: Even when the top feature scores above threshold, `checkGuardrails()` can still prevent it from firing. In particular, the activity pause guardrail (cooldown after recent nudge) and the Pro user kill switch (no nudges for Pro subscribers) will block the nudge silently. See [06-guardrails.md](./06-guardrails.md) for the full list of guardrail checks.

---

## Cross-References

- **Scoring**: Score calculation is handled by the scoring engine. `calculateScores()` returns per-feature breakdowns of direct and universal contributions.
- **Guardrails**: [06-guardrails.md](./06-guardrails.md) — the gate that can block the top pick.
- **Copy Engine**: [07-copy-engine.md](./07-copy-engine.md) — generates personalized title/body for the fired nudge.
- **Renderer**: [08-renderer.md](./08-renderer.md) — all render functions triggered by `fireMilestone`.

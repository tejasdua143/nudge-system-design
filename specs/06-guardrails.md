# 06 — Guardrails

## Purpose

Guardrails are a **gate**, not a selector. They can block a nudge from firing but they cannot change which nudge was selected. The MilestoneSelector picks the top-scoring feature first, then asks guardrails for a pass/fail verdict. If guardrails fail, the nudge is simply dropped — there is no fallback to the next feature.

---

## Interface

### Input

| Parameter | Type | Description |
|---|---|---|
| `featureId` | `string` | The ID of the feature the MilestoneSelector wants to fire |

### Output

| Field | Type | Description |
|---|---|---|
| `pass` | `boolean` | `true` if the nudge is allowed to fire |
| `reasons` | `string[]` | Human-readable reasons for each failed check (empty if pass is true) |

---

## Function: `checkGuardrails(featureId)`

Runs 4 checks **in order**. Each check that fails adds a reason string to the `reasons` array. The function returns `pass: true` only if all checks pass.

### Check 1 — Session Cap

```
state.milestonesThisSession >= CONFIG.SESSION_CAP (3)
```

- **Blocked** if the user has already seen 3 milestones this session.
- Reason: `"Session cap reached (3/3)"`

### Check 2 — Cooldown

```
Date.now() - state.lastMilestoneTime < CONFIG.COOLDOWN_MS (60000)
AND state.lastMilestoneTime > 0
```

- **Blocked** if fewer than 60 seconds have passed since the last milestone fired AND a milestone has actually fired (lastMilestoneTime > 0).
- Reason includes the remaining seconds: `"Cooldown active (Xs remaining)"`
- The `lastMilestoneTime > 0` condition ensures the cooldown doesn't block the very first milestone of a session.

### Check 3 — Feature Repeat

```
state.featuresShownThisSession.has(featureId)
```

- **Blocked** if this specific feature has already been shown this session.
- Reason: `"Feature already shown this session"`
- **Note**: This is a double-check. The MilestoneSelector already filters out shown features before reaching guardrails (step 3 of `evaluateAndFire`). This guardrail exists as a safety net.

### Check 4 — Intent Floor

```
Sum of all UNIVERSAL_MAP[signal] for active signals < CONFIG.INTENT_FLOOR (3)
```

- **Blocked** if the total universal intent score across all active signals is below 3.
- Reason: `"Intent floor not met (X < 3)"`
- This prevents nudges from firing when the user hasn't demonstrated enough overall engagement, even if a single feature happens to score above threshold via direct signals alone.

---

## Configuration Constants

| Constant | Value | Description |
|---|---|---|
| `CONFIG.SESSION_CAP` | 3 | Maximum milestones per session |
| `CONFIG.COOLDOWN_MS` | 60000 | Minimum milliseconds between milestones (60 seconds) |
| `CONFIG.INTENT_FLOOR` | 3 | Minimum total universal intent score required |

---

## Unimplemented Guardrails

The following guardrails are defined in the spec but **not implemented** in the current simulation:

### Activity Pause

- **Rule**: If the user is currently typing, dragging, or generating, hold the nudge until a 3-second pause in activity.
- **Rationale**: Don't interrupt a user mid-flow.
- **Status**: Not simulated. Would require real-time activity detection.

### Pro User Kill Switch

- **Rule**: If `isProUser === true`, kill all nudges permanently.
- **Rationale**: Pro users have already converted. Nudging them is pointless and annoying.
- **Status**: Not simulated. The prototype assumes a free user context.

---

## UI: Guardrail Status Bar

The guardrail state is visualized as a 4-item status bar rendered by `renderGuardrails()` (see [08-renderer.md](./08-renderer.md)).

| Indicator | Display | States |
|---|---|---|
| **Milestones fired** | `X/3` | ok (0-1), warn (2), blocked (3) |
| **Cooldown** | `Xs` or `Ready` | warn (active, shows seconds remaining), ok (ready) |
| **Features shown** | `X/9` | Informational count of distinct features shown |
| **Intent floor** | `Pass` or `Low (X)` | ok (score >= 3), blocked (score < 3, shows actual value) |

---

## Helper: `skipCooldown()`

Resets `state.lastMilestoneTime = 0`, which causes the cooldown check to pass immediately (because the `lastMilestoneTime > 0` condition fails). This exists for **testing purposes only** — it lets you fire milestones in rapid succession without waiting 60 seconds.

Accessible via the "Skip Cooldown" button in the nudge modal UI.

---

## Behavior Notes

- **All checks run regardless of earlier failures**. If the session cap is hit AND the cooldown is active, both reasons appear in the output. This is useful for debugging and for the UI status bar.
- **Guardrails never change the selection**. They are purely pass/fail on the feature the MilestoneSelector already chose.
- **No fallback on failure**. If guardrails block the top pick, the system does not try the second-ranked feature. See [05-milestone-selector.md](./05-milestone-selector.md) for rationale.

---

## Cross-References

- **MilestoneSelector**: [05-milestone-selector.md](./05-milestone-selector.md) — calls `checkGuardrails()` as step 7 of `evaluateAndFire()`.
- **Renderer**: [08-renderer.md](./08-renderer.md) — `renderGuardrails()` visualizes the 4-item status bar.
- **Scoring**: The intent floor check depends on `UNIVERSAL_MAP` values from the scoring layer.

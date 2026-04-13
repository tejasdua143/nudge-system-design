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

Runs 6 checks **in order**. Each check that fails adds a reason string to the `reasons` array. The function returns `pass: true` only if all checks pass.

### Check 1 — Pro User Kill Switch

```
state.user.isProUser === true
```

- **Blocked immediately** (returns early, no further checks run).
- Reason: `"User is Pro — all nudges disabled"`
- This is the ultimate kill switch. Once a user upgrades to Pro (via `handleUpgrade()`), all nudges are permanently disabled for the session.

### Check 2 — Session Cap

```
state.milestonesThisSession >= CONFIG.SESSION_CAP (3)
```

- **Blocked** if the user has already seen 3 milestones this session.
- Reason: `"Session cap reached (3/3)"`

### Check 3 — Cooldown

```
Date.now() - state.lastMilestoneTime < CONFIG.COOLDOWN_MS (60000)
AND state.lastMilestoneTime > 0
```

- **Blocked** if fewer than 60 seconds have passed since the last milestone fired AND a milestone has actually fired (lastMilestoneTime > 0).
- Reason includes the remaining seconds: `"Cooldown active (Xs)"`
- The `lastMilestoneTime > 0` condition ensures the cooldown doesn't block the very first milestone of a session.

### Check 4 — Feature Repeat

```
state.featuresShownThisSession.has(featureId)
```

- **Blocked** if this specific feature has already been shown this session.
- Reason: `"Feature already shown this session"`
- **Note**: This is a double-check. The MilestoneSelector already filters out shown features before reaching guardrails (step 3 of `evaluateAndFire`). This guardrail exists as a safety net.

### Check 5 — Intent Floor

```
Sum of all UNIVERSAL_MAP[signal] for active signals < CONFIG.INTENT_FLOOR (3)
```

- **Blocked** if the total universal intent score across all active signals is below 3.
- Reason: `"Intent floor not met (X < 3)"`
- This prevents nudges from firing when the user hasn't demonstrated enough overall engagement, even if a single feature happens to score above threshold via direct signals alone.

### Check 6 — Activity Pause

```
state.isUserActive === true
```

- **Blocked** if the user is currently active (typing, dragging, generating).
- Reason: `"User is active (needs 3s idle)"`
- In the simulator, this is controlled via a **clickable toggle** in the guardrail status bar. In production, it would be driven by real-time activity detection with a 3-second idle threshold (`CONFIG.ACTIVITY_PAUSE_MS`).
- When the user goes from active → idle (via `toggleUserActive()`), `evaluateAndFire()` is called to check if any pending nudge can now fire.

---

## Configuration Constants

| Constant | Value | Description |
|---|---|---|
| `CONFIG.SESSION_CAP` | 3 | Maximum milestones per session |
| `CONFIG.COOLDOWN_MS` | 60000 | Minimum milliseconds between milestones (60 seconds) |
| `CONFIG.INTENT_FLOOR` | 3 | Minimum total universal intent score required |
| `CONFIG.ACTIVITY_PAUSE_MS` | 3000 | Minimum idle time before nudge can fire (3 seconds) |

---

## UI: Guardrail Status Bar

The guardrail state is visualized as a 6-item status bar rendered by `renderGuardrails()` (see [08-renderer.md](./08-renderer.md)).

| Indicator | Display | States |
|---|---|---|
| **Pro user** | `Yes` or `No` | blocked (Pro), ok (free) |
| **Milestones fired** | `X/3` | ok (0-1), warn (2), blocked (3) |
| **Cooldown** | `Xs` or `Ready` | warn (active, shows seconds remaining), ok (ready) |
| **Features shown** | `X/9` | Informational count of distinct features shown |
| **Intent floor** | `Pass` or `Low (X)` | ok (score >= 3), blocked (score < 3, shows actual value) |
| **Activity** | `Active` or `Idle` | blocked (active), ok (idle). **Clickable** — toggles `state.isUserActive` |

---

## Helper: `skipCooldown()`

Resets `state.lastMilestoneTime = 0`, which causes the cooldown check to pass immediately (because the `lastMilestoneTime > 0` condition fails). This exists for **testing purposes only** — it lets you fire milestones in rapid succession without waiting 60 seconds.

Accessible via the "Skip Cooldown" button in the nudge modal UI.

---

## Behavior Notes

- **Most checks run regardless of earlier failures**. If the session cap is hit AND the cooldown is active, both reasons appear in the output. This is useful for debugging and for the UI status bar. The one exception is the **Pro user kill switch** (Check 1), which returns immediately without running further checks.
- **Guardrails never change the selection**. They are purely pass/fail on the feature the MilestoneSelector already chose.
- **No fallback on failure**. If guardrails block the top pick, the system does not try the second-ranked feature. See [05-milestone-selector.md](./05-milestone-selector.md) for rationale.

---

## Cross-References

- **MilestoneSelector**: [05-milestone-selector.md](./05-milestone-selector.md) — calls `checkGuardrails()` as step 7 of `evaluateAndFire()`.
- **Renderer**: [08-renderer.md](./08-renderer.md) — `renderGuardrails()` visualizes the 4-item status bar.
- **Scoring**: The intent floor check depends on `UNIVERSAL_MAP` values from the scoring layer.

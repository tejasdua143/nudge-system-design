# 08 — Renderer

## Purpose

The Renderer contains all UI panel render functions. Each function reads from `state` and updates one DOM panel. Together they form the complete visualization of the nudge system's internal state: user context, scoring, guardrails, and fired nudges.

---

## Layout

3-column CSS grid: `300px / 1fr / 300px`.

| Left Column (300px) | Center Column (1fr) | Right Column (300px) |
|---|---|---|
| User Context | Guardrails Status Bar | Actions |
| Prompt Analysis | Score Matrix | Active Signals |
| | Nudge Preview | |
| | Feed | |

---

## Render Functions

### 1. `renderUserContext()`

Displays 15 rows of user profile data from `state.user`.

**Behavior:**
- Rows that have scoring impact show **tooltips on hover**, generated via `getUserContextImpact()` and `buildUserTooltipHTML()`.
- Certain values are highlighted in the **accent color** to draw attention to scoring-relevant data.
- Each row shows a label and the current value from the user profile.

**Tooltip content:** Shows which features are affected by this user attribute and how (e.g., "countryTier = 1 → boosts ai-models, brand-kit").

---

### 2. `renderPromptAnalysis()`

Displays the raw user prompt and LLM signal extraction results.

**Components:**
- **Raw prompt display** with a **Shuffle button** adjacent.
- **Per-feature bar chart** showing prompt-synthesis scores (0-5 per feature).
- **Explanation text** describing how prompt-synthesis feeds into the scoring pipeline.

**Source indicator:** Shows "(LLM)" next to the prompt when the prompt matched the `PROMPT_SYNTHESIS` lookup table, or "(keyword fallback)" when the heuristic `synthesizeFromKeywords()` function was used to generate scores.

**`shufflePrompt()` behavior:**
1. Picks a random different prompt from the `PROMPT_SYNTHESIS` dataset.
2. Re-runs Layer 3 profiling on the new prompt.
3. Rebuilds all signals derived from the prompt.
4. Re-renders everything (full cascade).

---

### 3. `renderActions()`

Displays ~32 action buttons organized into 6 categories.

**Categories:**
1. Editing
2. Content
3. Navigation & Preview
4. Sharing & Export
5. Prompt & Creation
6. Session & Journey

**Button behavior:**
- **Toggleable**: Click to activate (adds the action's signals to active set), click again to deactivate (removes signals).
- **Hover tooltip**: Shows score impact per feature via `getActionImpact()` and `buildTooltipHTML()`. The tooltip breaks down which features gain or lose points from this action.

---

### 4. `renderSignals()`

Displays all currently active signals with type classification badges.

**Badge types:**

| Badge | Meaning |
|---|---|
| `DIR` | Signal contributes to direct scoring only |
| `UNI` | Signal contributes to universal scoring only |
| `D+U` | Signal contributes to both direct and universal scoring |

**Signal pool:** 48 possible signals defined in the `allSignals` array. Only active signals are shown at any given time.

---

### 5. `renderMatrix()`

Score matrix table showing all 9 features ranked by total score.

**Columns:**
- Feature name
- Direct score
- Universal contribution
- Total score with **bar visualization** (bar width proportional to total / `CONFIG.MAX_SCORE`)

**Sorting:** Rows sorted descending by total score.

**Threshold line:** Visual marker at 14/30 separating qualifying from non-qualifying features.

**Row badges:**

| Badge | Condition |
|---|---|
| `NEXT` | Top scorer above threshold (will fire if guardrails pass) |
| `QUEUED` | Above threshold but not the top scorer |
| `SHOWN` | Already fired this session |

**Row highlighting:**
- **Top-pick highlight** on the `NEXT` row.
- **Qualified highlight** on `QUEUED` rows.
- Standard styling on rows below threshold or already shown.

---

### 6. `renderGuardrails()`

6-item status bar showing current guardrail state.

| Indicator | Display | Visual States |
|---|---|---|
| Pro user | `Pro` or `Free` | `ok` (free user, nudges active), `blocked` (Pro user, all nudges suppressed) |
| Milestones fired | `X/3` | `ok` (0-1 fired), `warn` (2 fired), `blocked` (3 fired — cap hit) |
| Cooldown | `Xs` or `Ready` | `warn` (active, shows remaining seconds), `ok` (ready to fire) |
| Features shown | `X/9` | Informational count of distinct features shown this session |
| Intent floor | `Pass` or `Low (X)` | `ok` (universal sum >= 3), `blocked` (universal sum < 3, shows value) |
| Activity | `Active` or `Idle` | Clickable toggle. Calls `toggleUserActive()`. When toggled active→idle, triggers `evaluateAndFire()` |

---

### 7. `renderNudgePreview(feature, copy)`

Triggered when a milestone fires. Renders two things:

1. **Inline preview** — appears below the score matrix in the center column.
2. **Modal overlay** — full-screen overlay with the nudge card and breakdown.

**Nudge card content:**
- Feature tag
- Title and body (from CopyEngine output)
- CTA button
- Badge

**"Why this fired" breakdown:**
- Direct signals that contributed
- Universal signals that contributed
- Total score
- User context summary

**Modal buttons:**
- **Dismiss** — closes the modal (`closeNudgeModal()`)
- **Skip Cooldown** — calls `skipCooldown()` to reset the cooldown timer for testing

**Auto-dismiss timer:** When a nudge modal opens, a 10-second timer starts. If the user doesn't interact with the modal within 10 seconds, it auto-closes and a toast notification is shown. The feature is already suppressed from fire time, so auto-dismiss has no additional state side effects.

**Important: dismiss behaviors differ.** The inline nudge card's "Not now" button calls `handleDismiss()`, which updates state (increments dismissals, removes the `zero-dismissals` signal, re-renders multiple panels). The modal's "Dismiss" button calls `closeNudgeModal()`, which only closes the overlay without changing state. These are intentionally different — inline dismiss reflects a real user action, while modal dismiss is just UI cleanup.

---

### 8. `renderFeed()`

Reverse-chronological list of all fired milestones.

Each feed entry contains:
- Feature name and badge
- Copy (title + body)
- Full score breakdown (direct, universal, total)
- Active signals at time of firing
- Timestamp

Entries are read from `state.milestoneLog`, which stores newest-first (via `unshift`).

---

## Nudge Card Variants

Built by `buildNudgeCardHTML(feature, copy)`.

### Pro Variant (all features except hire-team)

| Property | Value |
|---|---|
| Tag | `"Milestone"` |
| CTA | `"Upgrade to Pro"` |
| Badge | `PRO` |
| Accent | Purple |

### Service Variant (hire-team only)

| Property | Value |
|---|---|
| Tag | `"Service"` |
| CTA | `"Talk to our team"` |
| Badge | `SERVICE` |
| Accent | Orange |

---

## Helper Functions

| Function | Purpose |
|---|---|
| `buildNudgeCardHTML(feature, copy)` | Generates nudge card markup, choosing Pro or Service variant |
| `buildBreakdownHTML(milestone)` | Generates the "why this fired" breakdown for a milestone entry |
| `buildContextHTML(u)` | Generates a user context summary snippet |
| `closeNudgeModal()` | Dismisses the modal overlay |
| `skipCooldown()` | Resets `state.lastMilestoneTime = 0` for testing (see [06-guardrails.md](./06-guardrails.md)) |
| `getUserContextImpact()` | Returns scoring impact data for a user context row |
| `buildUserTooltipHTML()` | Generates tooltip markup for user context hover |
| `getActionImpact()` | Returns per-feature score impact for an action button |
| `buildTooltipHTML()` | Generates tooltip markup for action button hover |
| `shufflePrompt()` | Picks a new random prompt and re-runs the full pipeline |
| `handleDismiss(featureId)` | Called by "Not now" button on inline nudge card. Increments `state.user.dismissals`, removes `zero-dismissals` signal, closes modal, re-renders UserContext/Signals/Matrix/Guardrails |
| `showToast(title, body, type)` | Creates an animated toast notification in the top-right corner. Types: `service` (orange border), `success` (green border), or default (purple). Auto-fades after 4 seconds |
| `handleUpgrade(featureId)` | Called by "Upgrade to Pro" / "Talk to our team" CTA button. For Pro features: sets `state.user.isProUser = true` and kills all future nudges. For hire-team: routes to service booking flow |
| `toggleUserActive()` | Called by clicking the Activity indicator in the guardrail bar. Toggles `state.isUserActive`, re-renders guardrails, and triggers `evaluateAndFire()` when going from active→idle |

---

## Behavior Notes

- **All renders are synchronous DOM updates.** Each function targets a specific panel and overwrites its contents.
- **Render cascade on milestone fire:** When `fireMilestone()` triggers, it calls `renderNudgePreview`, `renderFeed`, `renderMatrix`, and `renderGuardrails` in sequence. This ensures all panels reflect the new state immediately.
- **Action toggles trigger re-evaluation:** Toggling an action button doesn't just re-render the signals and matrix — it also calls `evaluateAndFire()`, which may trigger a new milestone and its associated renders.
- **Prompt shuffle is a full reset of derived state:** Shuffling the prompt changes the signal landscape, which cascades through scoring, matrix, guardrails, and potentially fires a new milestone.

---

## Cross-References

- **MilestoneSelector**: [05-milestone-selector.md](./05-milestone-selector.md) — `fireMilestone()` triggers `renderNudgePreview`, `renderFeed`, `renderMatrix`, `renderGuardrails`.
- **Guardrails**: [06-guardrails.md](./06-guardrails.md) — `renderGuardrails()` visualizes the 6-item status bar; `skipCooldown()` is exposed in the modal UI.
- **Copy Engine**: [07-copy-engine.md](./07-copy-engine.md) — `renderNudgePreview()` and `buildNudgeCardHTML()` consume copy output.
- **Scoring**: `renderMatrix()` reads score data; `renderActions()` and `renderUserContext()` show score impact via tooltips.

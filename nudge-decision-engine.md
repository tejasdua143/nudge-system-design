# Nudge Decision Engine — Presentations.AI

> Intent-score-based system for determining which nudge overlay to show, when, and with what content.

---

## How It Works

```
USER SIGNALS ──► INTENT SCORE ──► OVERLAY UNLOCKED
                      +
USER SIGNALS ──► ARCHETYPE (weighted) ──► COPY / TONE
                      +
TRIGGER ──► WHICH Pro feature was interacted with
                      +
RULES ENGINE ──► Should we suppress?
                      │
                      ▼
              LLM-GENERATED COPY (pre-cached at session start)
                      │
                      ▼
              RENDER OVERLAY
```

**Three independent systems working together:**

1. **Intent Score** (continuous, 0–∞) → determines which overlay type is unlocked
2. **Archetype** (weighted detection) → determines copy tone and value prop framing
3. **Rules Engine** (caps, cooldowns, dismiss tracking) → determines if the nudge should be suppressed

---

## 1. Intent Scoring

Intent is a **continuous score** that accumulates throughout a session and **persists across sessions**. Higher score = more intense overlays unlocked.

### Positive Signals

| Signal | Points | Notes |
|--------|--------|-------|
| First gate hit (click Pro feature) | +3 | Real intent — they tried to use it |
| Second gate hit (same feature) | +2 | Repeat interest in specific feature |
| Gate hit on a different feature | +3 | Breadth of interest across Pro features |
| Created 2nd deck in session | +4 | Building habit, invested in platform |
| Created 3rd+ deck in session | +2 each | Diminishing but still meaningful |
| Visited pricing page | +2 | Evaluating purchase (treat as passive signal — don't change nudge behavior) |
| Bought single PPTX export ($X) | +5 | Already paid once — strongest signal |
| Credits < 50 | +3 | Starting to feel the limit |
| Credits = 0 | +5 | Hard blocker — can't proceed |
| Time in editor > 10 min | +1 | Engagement, but weak signal alone |
| Shared a deck | +2 | Using the product for real output |
| Returning for Session 2+ | +3 | Came back — bonus added on top of persisted score |

### Negative Signals (light penalties)

| Signal | Points | Notes |
|--------|--------|-------|
| Dismissed with "Not now" | -1 | Soft pushback — slow down, don't stop |
| Dismissed with "Don't show again" | -2 | Stronger pushback — back off on that nudge |
| Ignored a nudge (no interaction, auto-dismissed) | -0.5 | Didn't engage at all |

### Score Rules

- Score **persists across sessions** — user returns with their previous score + a +3 return bonus
- Score **never goes below 0**
- Negative signals are **light** — a -1 or -2 will never undo a +5 from buying an export
- Credits **only matter below 50** — credits above 50 are not a signal in the system
- **Credit signals are threshold-based, fire once per session.** Credits crossing below 50 → +3 once. Credits hitting 0 → +5 once. Not on every credit spend.
- Pricing page visits add to score **passively** — no change in nudge behavior, just propensity tracking
- Export/PPTX gate flow is **untouched** — it already converts at 40%, the nudge system works around it

### Export Behavior as Signal

| Export Status | Signal Value | How It's Used |
|---------------|-------------|---------------|
| Bought single export ($X) | +5 to intent score | Nudges can reference: "You paid $X for one deck. Plan gives unlimited + everything else for $Y/mo" |
| Saw export pricing, didn't buy | +2 to intent score | Warm but price-sensitive. Don't reference directly — just treat as propensity |
| Never tried to export | No signal | Focus on other Pro features |

---

## 2. Score → Overlay Mapping

| Score Range | Unlocked Overlays | Tone |
|-------------|-------------------|------|
| **0** | None — Pro icons visible in toolbar but no nudges fire | Silent |
| **1–5** | Contextual Tooltip | Educate with soft CTA |
| **6–10** | + Credit Reminder | Light awareness of credit status |
| **11–15** | + Usage Insight, Comparison Card | Reflect investment, show free vs Pro |
| **16–20** | + Milestone Moment | Acknowledge progress, secondary upsell |
| **20+** | + Upgrade Panel | Full pitch — or user-initiated via "See Pro plans" |

**Important:** The score unlocks what **can** fire, but the **trigger** determines what actually fires. A user at score 12 who clicks the branding gate gets a Comparison Card about branding — not a random nudge.

### Overlay Types

| # | Overlay | Size | Purpose |
|---|---------|------|---------|
| 1 | **Contextual Tooltip** | Small, anchored to feature | Educate — explain what the Pro feature does, personalized to their use case. Soft CTA. |
| 2 | **Credit Reminder** | Small, corner, non-blocking | Lightweight awareness — "~10 slides left." Auto-dismisses after 5s. Small "See Pro" link. |
| 3 | **Usage Insight** | Medium, centered | Reflect investment — "You've generated 35 slides on your pitch deck. Pro gives unlimited." |
| 4 | **Comparison Card** | Medium, centered | Visual free vs Pro side-by-side — watermark comparison, branded vs unbranded. |
| 5 | **Milestone Moment** | Medium, lighter feel | Celebrate progress first (primary), subtle Pro mention second (secondary). |
| 6 | **Upgrade Panel** | Large, centered/side panel | The full pitch — features, pricing, direct purchase CTA. Only at high intent or user-initiated. |

### What Triggers Each Overlay

| Overlay | Triggered By |
|---------|-------------|
| Contextual Tooltip | User clicks any Pro feature (gate hit) |
| Credit Reminder | Credits drop below 50 |
| Usage Insight | Credits drop below 25, OR high engagement detected (many edits, multiple decks, long session) |
| Comparison Card | Gate hit on branding or watermark-related features (visual comparison makes sense) |
| Milestone Moment | First deck complete, first share, second deck created |
| Upgrade Panel | Credits = 0 (functional blocker), OR user clicks "See Pro plans" from any overlay |

---

## 3. Archetype Detection (Weighted)

Archetypes determine **copy and tone**, not overlay type. Detection uses weighted signals instead of first-match-wins.

### Signal Weights

| Signal | Weight | Why |
|--------|--------|-----|
| Role (from signup) | 3 | Strongest — user explicitly declared this |
| Audience (from signup) | 3 | Equally strong — who they're presenting to |
| Topic keywords (from prompt) | 2 | Inferred, not declared |
| Email domain | 1 | Weak — founders use gmail too |
| Document content (if uploaded) | 2 | Content signals purpose |
| Pro feature clicked | 2 | Behavioral — branding click = cares about polish |
| Template browsed | 1 | Interest signal |

### Scoring Per Archetype

Each archetype has a set of matching keywords. Every matching signal adds its weight to that archetype's confidence score. **Highest score wins.**

### Role → Archetype Mapping (Predefined Dropdown)

Since roles are predefined in the signup form (not free text), we use a direct mapping as the strongest signal:

| Role (from signup) | Maps to Archetype |
|-------------------|-------------------|
| Leadership | Founder |
| Sales | Sales |
| Marketing | Sales |
| Product | Corporate |
| Design | Creative |
| Engineering | Corporate |
| Data Analytics | Corporate |
| Consulting | Corporate |
| Support | Corporate |
| Operations | Corporate |
| Finance | Corporate |
| Legal | Corporate |
| Creator | Creative |
| Teacher | Educator |
| Student | Student |

### Full Archetype Scoring

| Archetype | Role (direct map, w:3) | Audience matches (w:3) | Topic matches (w:2) |
|-----------|----------------------|----------------------|-------------------|
| **Founder** | Leadership | investors, VCs, board | pitch, fundraise, series, seed, startup, funding |
| **Sales** | Sales, Marketing | clients, prospects, customers | sales, proposal, pricing, deal, revenue, pipeline |
| **Educator** | Teacher | students, trainees, class | lecture, course, lesson, training, curriculum |
| **Corporate** | Product, Engineering, Data Analytics, Consulting, Support, Operations, Finance, Legal | team, leadership, executives | update, review, quarterly, report, strategy, roadmap, OKR |
| **Creative** | Design, Creator | clients, recruiters, portfolio | portfolio, showcase, case study, design, brand, agency |
| **Student** | Student | classmates, personal, friends | assignment, project, school, thesis |
| **Fallback** | — | — | No confident match above threshold |

**Override rule:** Leadership + investors audience = Founder (not Corporate). The audience signal overrides the generic Corporate mapping when investors are involved.

**Example:**
- Role: "Leadership" (direct map → Founder +3)
- Audience: "investors" (matches Founder → +3)
- Topic: "Series A pitch" (matches Founder → +2)
- **Founder score: 8, next closest maybe 0** → high confidence Founder

**If two archetypes score within 2 points of each other**, prefer the higher-stakes one (Founder > Corporate > Sales > Educator > Creative > Student).

### Archetype Shifting

- Archetypes are re-evaluated when a user creates a new deck with different signals
- If Session 2 deck has different topic/audience, archetype may shift
- Previous archetype is not discarded — if ambiguous, prefer the one with higher-stakes Pro value

---

## 4. Dynamic Copy Generation

### Approach

**One batch LLM call at session start.** Given the user's signals (role, audience, topic, prompt content), generate personalized nudge copy for all 11 paywall features. Cache in memory. Instant retrieval when a nudge fires.

### Paywall Features (copy needed for each)

1. Slide generation (credit-based)
2. AI edits (credit-based)
3. AI enhance (Pro-only)
4. Custom brand colors (Pro-only)
5. Remove watermark (Pro-only)
6. Pro templates (Pro-only, upcoming)
7. PDF export (Pro-only)
8. PPTX export (paywall — biggest converter at 40%)
9. Share without watermark (Pro-only)
10. Invite collaborators (Pro-only, limited free guest)
11. Viewer analytics (Pro-only)

### LLM Prompt Structure

```
Given this user:
- Role: {role}
- Audience: {audience}
- Topic: {topic/prompt}
- Email domain: {domain}

Generate a short, personalized nudge message (title + body, max 2 sentences)
for each of these Pro features. The message should:
- Connect the feature to their specific use case
- Be conversational, not salesy
- Reference their audience or topic naturally
- Title: max 8 words
- Body: max 2 sentences

Features:
1. AI enhance
2. Custom brand colors
3. Remove watermark
...
```

### Fallback

If the LLM call fails or hasn't completed yet, fall back to **rule-based templates** with variable slots:
- "Track {audience} engagement on your {topic} deck"
- "{Audience} will notice the details. Present with your brand."

The copy matrix from the system doc serves as the fallback layer.

### Archetype Shift → Re-trigger Copy

If the user creates a new deck with different signals and the archetype shifts mid-session, re-trigger the LLM batch call for the new archetype. Until the new copy is cached, fall back to rule-based templates with variable slots. This prevents stale copy (e.g., founder-tone nudges showing while the user is building a training deck).

---

## 5. Rules Engine

The rules engine runs **after** the intent score determines the overlay type. It can suppress a nudge but never change the type.

### Session Rules

| Rule | Details |
|------|---------|
| **Session nudge cap** | Max 2 **system-initiated** overlay impressions per session (credit reminder, milestone, usage insight). **User-initiated gate hits always show a nudge** — if the user actively clicks a Pro feature, the system always responds. No cap on user-initiated. |
| **No overlays during active work** | Never fire while user is typing, dragging, or AI is generating. Wait for 3+ second pause. |
| **One tooltip per feature per session** | If dismissed, don't show for that feature again this session. |
| **Credit nudges only below 50** | No credit-related overlays when credits > 50. |
| **Credit Reminder cap** | Max 1 Credit Reminder per session. Fires once when credits first cross below 50. Does not re-fire on subsequent credit spends. |
| **Upgrade Panel: high intent or user-initiated only** | Only fires at score 20+ or when user clicks "See Pro plans." Exception: credits = 0 (functional blocker). |
| **Export/PPTX flow untouched** | The nudge system does not interfere with the export paywall flow. |

### Dismiss Rules

| Dismiss Action | Effect |
|----------------|--------|
| "Not now" / X close | Suppress same overlay type for rest of session. -1 to intent score. |
| "Don't show again" | Permanently suppress that specific nudge (feature × overlay combination). -2 to intent score. |
| Ignored (auto-dismissed) | -0.5 to intent score. No suppression. |

### Priority (when multiple overlays could fire simultaneously)

1. Credits = 0 (Upgrade Panel — functional blocker, always wins)
2. Comparison Card (visual, high impact)
3. Usage Insight (factual, reflective)
4. Contextual Tooltip (educational, triggered by direct action)
5. Milestone Moment (positive, lower urgency)
6. Credit Reminder (lightest, auto-dismisses)

### Suppression

- **Upgrade = kill switch.** User upgrades → all nudges permanently suppressed.
- **Score never triggers suppressed overlays.** If a user at score 25 has dismissed all overlay types with "Don't show again", nothing fires — the system respects their choice.

---

## 6. Complete Architecture

```
SESSION START
│
├── Collect signals: role, audience, topic, email, prompt
│
├── Detect archetype (weighted scoring)
│   └── Result: e.g., Founder/Pitcher (confidence: 8/10)
│
├── Batch LLM call: generate personalized nudge copy for 11 features
│   └── Cache in memory. Fallback: rule-based templates.
│
├── Initialize intent score
│   ├── New user: score = 0
│   └── Returning user: persisted score + 3 (return bonus)
│
└── Load dismiss history (persisted)


USER TAKES ACTION
│
├── Is it a scoring event? (gate hit, deck created, credits < 50, etc.)
│   └── YES → Update intent score
│
├── Is it a nudge trigger? (gate hit, credit threshold, deck complete, etc.)
│   └── YES → Continue
│   └── NO → Do nothing
│
├── What overlay type does the intent score unlock?
│   └── e.g., score = 12 → Contextual Tooltip, Credit Reminder, Usage Insight, Comparison Card
│
├── Which of those overlays matches this trigger?
│   └── e.g., gate hit on branding at score 12 → Comparison Card (branding free vs Pro)
│
├── Rules engine check:
│   ├── Session cap reached? → Suppress
│   ├── User actively working? → Wait for pause
│   ├── This nudge dismissed before? → Suppress
│   ├── Credits > 50 and credit nudge? → Suppress
│   └── All clear? → Fire
│
├── Fetch copy from LLM cache (or fallback template)
│   └── Personalized: "Recruiters will notice the details. Present your portfolio with your brand."
│
└── Render overlay with modular components
    └── Shell(type, size, position) + Icon + Title + Body + CTA + Dismiss


USER RESPONDS
│
├── Clicked CTA → Route to pricing/upgrade flow. Log conversion.
├── Dismissed "Not now" → -1 score. Suppress this overlay type for session.
├── Dismissed "Don't show again" → -2 score. Permanently suppress.
├── Ignored (auto-dismiss) → -0.5 score.
└── Upgraded → Kill switch. All nudges suppressed forever.
```

---

## 7. Key Design Decisions (Summary)

| Decision | Choice | Why |
|----------|--------|-----|
| Scoring model | Continuous intent score, not fixed levels | Real user behavior is messy, not linear |
| Credits | Only matter below 50 | Users don't feel pressure above 50 |
| Export/PPTX gate | Untouched by nudge system | Already converts at 40% — don't fix what works |
| Export as signal | Buying single export = +5 to intent | They've already paid, most likely to convert to plan |
| Pricing page visit | +2, passive | Propensity signal, but don't change behavior because of it |
| Copy generation | LLM batch at session start, cached | Dynamic personalization without runtime lag |
| Archetype detection | Weighted signals, highest score wins | More accurate than first-match-wins |
| Dismiss penalties | Light (-1 to -2) | Soft brake, not hard stop — don't undo real intent |
| Score persistence | Across sessions, +3 return bonus | Returning users are warmer |
| Nudge cap | 2 per session | Protect first impression, prevent annoyance |
| Overlay escalation | Score-based, not time-based | Intensity matches demonstrated intent, not arbitrary timers |

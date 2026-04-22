# Smart Nudge System — Presentations.AI

> A personalized, signal-driven, modular nudge system for converting free users to Pro in the first 1-2 sessions.

**Goal:** Drive direct Pro purchases (not just trial starts)
**Scope:** First 1-2 sessions only — the critical conversion window
**Approach:** Rule-based personalization using onboarding + real-time signals
**Current conversion:** ~1% top-of-funnel → paid. This system aims to significantly improve that.

---

## Table of Contents

1. [How the System Works — Overview](#1-how-the-system-works)
2. [Signal Taxonomy](#2-signal-taxonomy)
3. [User Archetypes](#3-user-archetypes)
4. [Session Micro-Phases](#4-session-micro-phases)
5. [The Credit Engine](#5-the-credit-engine)
6. [Nudge Types & Modular Components](#6-nudge-types--modular-components)
7. [Journey Map — Session 1 & 2](#7-journey-map)
8. [Copy Matrix](#8-copy-matrix)
9. [Rules Engine — Anti-Annoyance](#9-rules-engine)
10. [Persona Walkthroughs](#10-persona-walkthroughs)
11. [Measurement Framework](#11-measurement-framework)

---

## 1. How the System Works

Every nudge decision is a function of two inputs:

```
NUDGE = Archetype (WHO is this user?) × Micro-Phase (WHAT are they doing right now?)
```

- **Archetype** determines the **copy, value prop, and tone** — what to say
- **Micro-Phase** determines the **nudge type, intensity, and CTA** — when and how to say it

The system never guesses blindly. It uses signals the user has already provided (role, audience, topic) combined with real-time behavior (feature clicks, credit usage, export attempts) to serve the right message at the right moment.

### Core Principles

1. **Never interrupt creation.** The create flow and active editing are sacred. Signals are collected silently.
2. **Earn the right to nudge.** Low intensity first. Escalate only with evidence of intent.
3. **Be specific, not generic.** "Investors notice details" beats "Upgrade for more features."
4. **Credit math > sales pitch.** Showing "You've used 150 credits — Pro gives unlimited for $X/mo" is a fact, not a pitch.
5. **Respect dismissal.** If the user says "not now," honor it. If they say "never," remember it forever.

---

## 2. Signal Taxonomy

We have an unusual advantage: the onboarding and create flow collect rich signals **before the user enters the editor**. This means personalization starts from the very first nudge.

### A. Onboarding Signals (collected at signup + create flow)

| Signal | Source | What It Tells Us |
|--------|--------|-----------------|
| **Role** | Signup form | Professional context — founder, marketer, teacher, student, designer, etc. |
| **Audience** | Signup form | Who they're presenting to — investors, clients, students, team, leadership |
| **Topic / Prompt** | Create flow | What the presentation is about — "Series A pitch for TechCo", "Q3 Sales Review" |
| **Document upload** | Create flow (if used) | Document type and content signals purpose and stakes |
| **Email domain** | Signup | `@gmail.com` = personal/student, `@company.com` = business/professional |

These signals feed **archetype detection** immediately — before any in-app behavior.

### B. Credit & Usage Signals (real-time)

| Signal | What It Tells Us |
|--------|-----------------|
| **Credits remaining** | Proximity to depletion — drives urgency naturally |
| **Credit burn rate** | Fast burner (heavy AI user, lots of generations) vs. conservative (careful, edits manually) |
| **Credits-per-action awareness** | Did the user check the credit meter? Hover over credit costs? |
| **Slides generated** | Volume of AI usage — correlates with perceived value |
| **Edits made** | Investment in the content — higher edits = higher switching cost |

Key thresholds: **200 → 100 → 50 → 25 → 0 credits**

### C. Feature Interaction Signals (real-time)

| Signal | What It Tells Us |
|--------|-----------------|
| **Pro icon hover** | Curiosity about a specific Pro feature |
| **Pro feature click (gate hit)** | Active attempt to use a locked feature — direct intent signal |
| **Repeat gate hits** | Hit the same Pro feature 2+ times → strong intent for that specific feature |
| **Specific feature targeted** | Which gate? Branding, PDF export, AI enhance, analytics, collaboration, Pro templates |
| **Edit depth** | Slides edited, elements modified, time in editor |
| **Share/export attempt** | Tried to share or download — the highest-intent action |

### D. Composite Intent Signals (inferred)

These are derived from combining A + B + C:

| Intent Pattern | Detection | Implication |
|---------------|-----------|-------------|
| **High-stakes professional** | Role=founder/exec + Audience=investors + pitch topic | Will care about polish, branding, PDF. Lead with quality. |
| **Revenue-driven** | Role=sales + Audience=clients + sales/proposal topic | Will care about analytics, branding, professional output. Lead with ROI. |
| **Educator** | Role=teacher + Audience=students + educational topic | Will care about sharing, unlimited AI, clean output. Lead with reach. |
| **Team user** | Tried to invite collaborators or share with multiple recipients | Will care about collaboration features, team plan. |
| **Credit-pressured** | Fast burn rate + approaching depletion + high edit investment | Most urgent — they need more credits to finish what they started. |
| **Power explorer** | Many Pro feature hovers/clicks + high edit depth + fast engagement | Likely to convert if shown the full Pro picture. |

---

## 3. User Archetypes

Archetypes are detected **from onboarding signals** using rule-based matching. The system evaluates in priority order: Role → Audience → Topic keywords. First strong match wins.

### Detection Rules

| Archetype | Rule | Priority |
|-----------|------|----------|
| **Founder/Pitcher** | Role IN (founder, CEO, co-founder, exec, entrepreneur) OR Audience = investors OR Topic CONTAINS (pitch, fundraise, series, seed, investor, startup) | 1 |
| **Sales/Marketing** | Role IN (sales, marketing, growth, BD, account exec) OR Audience IN (clients, prospects, customers) OR Topic CONTAINS (sales, proposal, pricing, product, client, deal) | 2 |
| **Educator** | Role IN (teacher, professor, trainer, instructor, lecturer) OR Audience IN (students, trainees, class) OR Topic CONTAINS (lecture, course, lesson, training, class, curriculum) | 3 |
| **Corporate/Internal** | Role IN (manager, analyst, PM, consultant, director) OR Audience IN (team, leadership, board, executives) OR Topic CONTAINS (update, review, quarterly, report, strategy, OKR) | 4 |
| **Creative/Freelancer** | Role IN (designer, freelancer, creator, consultant, agency) OR Topic CONTAINS (portfolio, showcase, case study, creative brief) | 5 |
| **Student/Personal** | Role = student OR Audience IN (classmates, personal, friends) OR Topic signals low-stakes content | 6 |
| **Fallback** | No confident match from above | 7 |

### Archetype Profiles

#### Founder/Pitcher
- **They care about:** Looking polished and professional in front of investors. Every detail matters.
- **Lead Pro value:** Remove watermark, custom branding, PDF export
- **Nudge tone:** Aspirational, high-stakes. "Investors notice details."
- **Most effective nudge moment:** Export gate (when they try to download/share their pitch)
- **Credit sensitivity:** Medium — they'll pay if the output is good enough

#### Sales/Marketing
- **They care about:** Closing deals. Analytics (who viewed the deck). Professional appearance.
- **Lead Pro value:** Analytics (viewer tracking), custom branding, PDF export
- **Nudge tone:** ROI-driven. "Close the deal." "See when your client opens it."
- **Most effective nudge moment:** Share gate (sending to clients) and analytics discovery
- **Credit sensitivity:** Low — if it helps close deals, the cost is justified

#### Educator
- **They care about:** Reaching students effectively. Clean, distraction-free sharing.
- **Lead Pro value:** Unlimited AI generations, watermark-free sharing, more content
- **Nudge tone:** Supportive, empowering. "Make learning stick." "Engage your students."
- **Most effective nudge moment:** Share gate (distributing to students) and credit depletion (need more content)
- **Credit sensitivity:** High — often on personal/institutional budgets

#### Corporate/Internal
- **They care about:** Looking sharp in front of leadership. Brand consistency. Quick turnaround.
- **Lead Pro value:** Custom branding, polished templates, PDF export
- **Nudge tone:** Professional, credibility-focused. "Show leadership you mean business."
- **Most effective nudge moment:** Branding gate and export gate
- **Credit sensitivity:** Low — company can expense it

#### Creative/Freelancer
- **They care about:** Portfolio quality. Personal brand. Client impression.
- **Lead Pro value:** Custom branding, Pro templates, watermark removal
- **Nudge tone:** Craft-focused. "Your portfolio, your brand." "Show your best work."
- **Most effective nudge moment:** Branding gate and export gate
- **Credit sensitivity:** Medium — freelancers balance quality vs. cost

#### Student/Personal
- **They care about:** Getting it done. Budget constraints. Simple output.
- **Lead Pro value:** Only nudge at natural gates — don't push hard
- **Nudge tone:** Gentle, budget-aware. No pressure.
- **Most effective nudge moment:** Credit depletion (if they run out) and export gate (if they need PDF)
- **Credit sensitivity:** Highest — price is the primary concern

#### Fallback
- **When:** No confident archetype match from onboarding signals
- **Approach:** Feature-focused nudges. Let real-time behavior (which Pro features they interact with) determine copy.
- **Nudge tone:** Neutral, informative. Focus on the specific feature they just tried.

### Archetype Shifting

Archetypes are not permanent. If a user's **second deck** (Session 2) has different signals, the system re-evaluates:
- Session 1: Pitch deck (Founder archetype) → Session 2: Team update (Corporate archetype) → Nudges shift to Corporate
- If both archetypes have evidence, prefer the one with the **higher-stakes** Pro value (Founder > Corporate)

---

## 4. Session Micro-Phases

Micro-phases are the **moments within a session** that determine nudge timing and intensity. The system progresses through these sequentially but can skip phases based on user behavior.

| # | Micro-Phase | Trigger | Nudge Strategy | Allowed Nudge Types |
|---|-------------|---------|----------------|-------------------|
| 0 | **Create flow** | User is entering prompt, uploading doc, selecting options | **Zero nudges.** Silent signal collection only. | None |
| 1 | **First editor view** | AI-generated deck loads in editor | **Passive only.** Credit meter visible. Pro icons on features. | Credit Meter only |
| 2 | **Feature exploration** | User hovers over a Pro feature icon | **Inline hint.** Tooltip on hover explaining the feature. | Inline Hint |
| 3 | **First gate hit** | User clicks a Pro feature (attempts to use it) | **Contextual tooltip.** Archetype-personalized copy + soft CTA. | Contextual Tooltip |
| 4 | **Credit milestone** | Credits drop below 100 / 50 / 25 | **Credit alert.** Remaining credits + cost math + Pro unlock. | Credit Alert |
| 5 | **Export/Share** | User clicks export or share | **Slide-over panel.** Highest intent moment. Before/after visual. Direct purchase CTA. | Slide-over Panel |
| 6 | **First deck complete** | User finishes meaningful editing (natural pause, 3+ slides edited, 5+ min in editor) | **Celebration card.** Acknowledge achievement + Pro upsell. | Celebration Card |
| — | **Credit depletion** | Credits hit 0 (can happen at any phase) | **Depleted state.** Functional blocker + upgrade path. Not a nudge — the user literally can't proceed. | Credit Depleted Panel |

### Phase Transitions

- Phases don't have to happen in order. A user could hit Export/Share (phase 5) before any Feature Exploration (phase 2).
- Each phase fires its nudge **at most once per session** (except credit milestones, which fire at each threshold).
- The system tracks which phases have fired and doesn't repeat.
- If a user hits credit depletion, it overrides the current phase — this is a hard blocker, not a nudge.

---

## 5. The Credit Engine

The credit system is the **most powerful nudge lever** because it creates urgency organically. The user has invested effort. They can see the value. The credits running out is a natural consequence of engagement, not an arbitrary upsell trigger.

### Credit Meter Component

Always visible in the editor (sidebar or header area).

| Credits Remaining | Meter State | Color | Behavior |
|-------------------|-------------|-------|----------|
| 200–101 | Normal | Green | Static display. No nudge. |
| 100 | First threshold | Amber | Meter shifts to amber. One-time inline tooltip: "Half your credits used. Pro = unlimited." |
| 99–51 | Watching | Amber | Amber meter stays. No new nudge unless user interacts with Pro features. |
| 50 | Second threshold | Amber/Orange | Credit Alert nudge fires. Shows credit math: "~10 slides left at your pace." |
| 49–26 | Low | Orange | Orange meter. No new nudge. |
| 25 | Third threshold | Red/Orange | Stronger Credit Alert. "~5 slides left. Upgrade to finish without limits." |
| 24–1 | Critical | Red | Red meter. No new nudge (already alerted). |
| 0 | Depleted | Red/Gray | Depleted state panel. AI generation is blocked. Clear upgrade path as primary action. |

### Credit Math — Why It Works

Credit math nudges are powerful because they're **personalized, factual, and verifiable:**

- **"You've generated 30 slides in this session."** — The user knows this is true.
- **"That's X credits used."** — They can see the meter.
- **"Pro gives you unlimited for $Y/month."** — Clear value comparison.
- **"At your pace, you'll run out in ~10 more slides."** — Predictive, urgent, but honest.

This isn't persuasion — it's information. The user makes their own decision with full context.

### Credit Depletion — The Functional Gate

When credits hit 0, AI generation is blocked. This is not a nudge — it's a product state. But the **depletion screen** is a critical conversion moment.

**Depleted State Panel:**
```
┌─────────────────────────────────────────────┐
│  ⚡ You've used all 200 free credits         │
│                                             │
│  You generated [X] slides and made [Y]      │
│  edits on your [Archetype-specific: pitch   │
│  deck / sales presentation / lecture].      │
│                                             │
│  [Archetype-specific value prop]            │
│                                             │
│  ┌──────────────┐  ┌─────────────────────┐  │
│  │ Upgrade to   │  │ When do credits     │  │
│  │ Pro — $X/mo  │  │ refresh?            │  │
│  └──────────────┘  └─────────────────────┘  │
│                                             │
│  Or start a 7-day free trial (200 credits)  │
└─────────────────────────────────────────────┘
```

The trial offer appears as a secondary path here — the primary CTA is direct purchase. But for price-sensitive archetypes (Student, Educator), the trial can be more prominent.

---

## 6. Nudge Types & Modular Components

### Component Architecture

Every nudge is composed from the same set of swappable sub-components, assembled differently based on nudge type.

```
<NudgeShell type={} position={} size={}>
  ├── <NudgeIcon>       → Feature-specific icon
  ├── <NudgeTitle>      → Archetype-driven headline (short)
  ├── <NudgeValueProp>  → 1-2 sentence copy from the copy matrix
  ├── <NudgeProof>      → Credit math | stat | before-after comparison
  ├── <NudgeVisual>     → Screenshot | comparison image | none
  ├── <NudgeCTA>        → Primary button + optional secondary
  └── <NudgeDismiss>    → Close | close+later | close+later+never
</NudgeShell>
```

### Sub-Component Variants

| Sub-Component | Variants | When to Use |
|--------------|----------|-------------|
| **NudgeIcon** | `branding` `export` `credits` `ai` `collaboration` `template` `analytics` `generic` | Always matches the Pro feature being nudged |
| **NudgeTitle** | Short string, max ~8 words | Archetype-driven. "Your pitch deserves your brand." |
| **NudgeValueProp** | 1-2 sentences from copy matrix | Archetype × Trigger lookup |
| **NudgeProof** | `credit-math` `before-after` `stat` `none` | Credit math for credit alerts. Before-after for export gate. |
| **NudgeVisual** | `comparison` `screenshot` `none` | Only in expanded nudges (panels). Shows user's actual content. |
| **NudgeCTA** | Primary: `"Upgrade to Pro"` `"See Pro plans"` `"See pricing"` | Stronger CTA at higher-intent moments |
| | Secondary: `"Learn more"` `"Maybe later"` `"Compare plans"` | Softer secondary for lower-intent moments |
| **NudgeDismiss** | `close-only` `close+later` `close+later+never` | Simpler dismiss for low-intensity, full options for panels |

### Nudge Type Compositions

#### Credit Meter (Passive)
- Always visible in editor
- No sub-components — standalone component
- States: normal (green) → amber → orange → red → depleted
- On threshold hit: spawns a one-time Inline Hint or Credit Alert

#### Inline Hint (Low Intensity)
```
Components: NudgeIcon + NudgeTitle
Size: compact
Position: anchored (next to Pro icon in toolbar)
Dismiss: auto-dismiss on mouse-out
Trigger: Pro feature hover
```
Example: User hovers over the "Custom Branding" Pro icon → small tooltip appears: "🎨 Pro — Add your company's brand colors"

#### Contextual Tooltip (Medium Intensity)
```
Components: NudgeIcon + NudgeTitle + NudgeValueProp + NudgeCTA(primary) + NudgeDismiss(close-only)
Size: compact
Position: anchored (near the locked feature)
Trigger: Pro feature click (gate hit)
```
Example: User clicks "Remove Watermark" → tooltip anchored to the button:
- Title: "Present with your brand"
- Copy: "Investors notice the details. Remove the watermark and add your logo."
- CTA: "See Pro plans →"
- Dismiss: X button

#### Credit Alert (Medium Intensity)
```
Components: NudgeIcon(credits) + NudgeTitle + NudgeValueProp + NudgeProof(credit-math) + NudgeCTA(primary+secondary) + NudgeDismiss(close+later)
Size: standard
Position: overlay (editor, non-blocking)
Trigger: Credit threshold (100, 50, 25)
```
Example: Credits drop to 50 →
- Title: "Running low on credits"
- Copy: "You've used 150 credits perfecting your pitch deck."
- Proof: "~10 slides left at your pace. Pro = unlimited."
- CTA Primary: "Upgrade to Pro"
- CTA Secondary: "Maybe later"
- Dismiss: X + "Remind me later"

#### Slide-over Panel (Medium-High Intensity)
```
Components: NudgeIcon + NudgeTitle + NudgeValueProp + NudgeProof(before-after) + NudgeVisual(comparison) + NudgeCTA(primary+secondary) + NudgeDismiss(close+later+never)
Size: expanded
Position: overlay (side panel or centered)
Trigger: Export/share gate or credit depletion
```
Example: User clicks "Export as PDF" →
- Title: "Export your pitch as a polished PDF"
- Copy: "Send investors a professional PDF they can share with their partners."
- Visual: Side-by-side of their actual slide — one with watermark, one without
- CTA Primary: "Upgrade to Pro — $X/mo"
- CTA Secondary: "Compare plans"
- Dismiss: X + "Not now" + "Don't show again"

#### Banner (Low Intensity)
```
Components: NudgeIcon + NudgeTitle + NudgeCTA(primary) + NudgeDismiss(close-only)
Size: compact
Position: fixed (top of dashboard or editor)
Trigger: Session 2 return
Session: Session 2 ONLY — never in Session 1
```
Example: User returns for Session 2 →
- Title: "Welcome back! Upgrade to Pro for unlimited presentations."
- CTA: "See Pro plans"
- Dismiss: X

#### Celebration Card (Medium Intensity)
```
Components: NudgeIcon(generic/celebration) + NudgeTitle + NudgeValueProp + NudgeCTA(primary+secondary) + NudgeDismiss(close-only)
Size: standard
Position: overlay (centered, light)
Trigger: First deck completion
```
Example: User finishes their first pitch deck →
- Title: "Your pitch deck is ready! 🎉"
- Copy: "With Pro, export as a polished PDF and present with your own branding."
- CTA Primary: "Upgrade to Pro"
- CTA Secondary: "Maybe later"
- Dismiss: X

### Variant Axes (for Figma)

| Axis | Options | What Determines It |
|------|---------|-------------------|
| **Size** | compact / standard / expanded | Nudge type |
| **Tone** | subtle / confident / urgent | Micro-phase (low urgency early, higher at gates) |
| **Position** | inline / anchored / overlay / fixed | Nudge type + placement |

---

## 7. Journey Map

### Session 1: Complete Flow

```
PHASE 0: SIGNUP + CREATE FLOW (Zero nudges — signal collection only)
══════════════════════════════════════════════════════════════════

[User signs up]
  │
  ├── Collects: email, role, audience
  │   └── ARCHETYPE DETECTED (first pass: role + audience)
  │
  ▼
[Create flow]
  │
  ├── User enters prompt / uploads document
  │   └── ARCHETYPE REFINED (second pass: + topic keywords)
  │
  ├── User selects template (may browse Pro templates)
  │   └── SIGNAL: Pro template browsed? (yes/no)
  │
  ▼
[AI generates presentation]
  │
  └── Credits deducted: 200 → ~170 (depending on slide count)


PHASE 1-2: EDITOR — FIRST VIEW + EXPLORATION
══════════════════════════════════════════════

[Editor loads with generated deck]
  │
  ├── Credit Meter appears (passive, always visible)
  │   └── "Credits: 170 / 200" — green, no nudge
  │
  ├── Pro features visible in toolbar with Pro icon
  │
  ├── User hovers over a Pro feature
  │   └── INLINE HINT: "Pro — [feature description]"
  │       (auto-dismiss on mouse-out)
  │
  ▼
[User edits their deck]
  │
  ├── AI generations deduct credits
  ├── Manual edits (some cost credits)
  └── Credit meter updates in real-time


PHASE 3: FIRST GATE HIT
═══════════════════════

[User clicks a Pro feature]
  │
  └── CONTEXTUAL TOOLTIP:
      ┌──────────────────────────────────────┐
      │ 🎨 Present with your brand           │
      │                                      │
      │ Investors notice the details.        │
      │ Remove the watermark and add         │
      │ your company's colors.               │
      │                                      │
      │ [See Pro plans →]              [ ✕ ] │
      └──────────────────────────────────────┘

      Copy is ARCHETYPE-PERSONALIZED.
      Dismissed = no repeat for this feature in this session.


PHASE 4: CREDIT MILESTONES (if reached)
═══════════════════════════════════════

[Credits drop to 100]
  │
  └── Credit meter shifts to AMBER
      + One-time inline hint: "Half your credits used. Pro = unlimited."

[Credits drop to 50]
  │
  └── CREDIT ALERT:
      ┌──────────────────────────────────────┐
      │ ⚡ Running low on credits             │
      │                                      │
      │ You've used 150 credits on your      │
      │ pitch deck. ~10 slides left at       │
      │ your pace.                           │
      │                                      │
      │ Pro gives you unlimited generations. │
      │                                      │
      │ [Upgrade to Pro]  [Maybe later]      │
      └──────────────────────────────────────┘

[Credits drop to 25]
  │
  └── CREDIT ALERT (stronger):
      "~5 slides left. Don't let credits limit your pitch."

[Credits hit 0]
  │
  └── DEPLETED STATE (functional blocker, not a nudge):
      AI generation is blocked.
      Full-screen panel with upgrade as primary action.


PHASE 5: EXPORT / SHARE (Highest Intent)
════════════════════════════════════════

[User clicks Export or Share]
  │
  └── SLIDE-OVER PANEL:
      ┌──────────────────────────────────────────────────┐
      │ 📄 Export your pitch as a polished PDF            │
      │                                                  │
      │ Send investors a professional PDF they can       │
      │ share with their partners.                       │
      │                                                  │
      │ ┌────────────────┐  ┌────────────────┐           │
      │ │ With watermark │  │ Without (Pro)  │           │
      │ │   [preview]    │  │   [preview]    │           │
      │ └────────────────┘  └────────────────┘           │
      │                                                  │
      │ [Upgrade to Pro — $X/mo]  [Compare plans]        │
      │                                                  │
      │ [ ✕ ]  [Not now]  [Don't show again]             │
      └──────────────────────────────────────────────────┘

      Visual shows THEIR ACTUAL SLIDE — with and without watermark.
      This is the highest-conversion moment.


PHASE 6: FIRST DECK COMPLETE
════════════════════════════

[User pauses after meaningful editing — 3+ slides, 5+ min]
  │
  └── CELEBRATION CARD:
      ┌──────────────────────────────────────┐
      │ 🎉 Your pitch deck is ready!         │
      │                                      │
      │ With Pro, export as PDF and present  │
      │ with your own branding.              │
      │                                      │
      │ [Upgrade to Pro]  [Maybe later]      │
      └──────────────────────────────────────┘
```

### Session 2: Return Visit

```
[User opens app — Session 2]
  │
  ├── DASHBOARD BANNER:
  │   "Welcome back! Upgrade to Pro for unlimited presentations."
  │   [See Pro plans →]                                    [ ✕ ]
  │
  ├── If they had a gate hit in Session 1:
  │   └── Reminder tooltip on the SAME feature:
  │       "Still curious about custom branding? See what Pro includes."
  │
  ├── If they hit credit depletion in Session 1:
  │   └── Credits may have refreshed — credit meter shows remaining
  │       + Inline hint: "Credits refreshed! Pro = unlimited, always."
  │
  └── Session 2 nudge intensity is slightly higher:
      - Panels allowed (not just tooltips)
      - CTA can be "Upgrade to Pro" (not just "Learn more")
      - Max 2 active nudges + 1 banner
```

---

## 8. Copy Matrix

Complete copy templates for every Archetype × Trigger combination. These are the actual strings that populate the `NudgeValueProp` sub-component.

### Pro Feature Hover (Inline Hint — shortest copy)

| Archetype | Copy |
|-----------|------|
| Founder/Pitcher | "Pro — Make your pitch stand out" |
| Sales/Marketing | "Pro — Impress your clients" |
| Educator | "Pro — Engage your students" |
| Corporate/Internal | "Pro — Elevate your presentation" |
| Creative/Freelancer | "Pro — Showcase your work" |
| Student/Personal | "Pro — Level up your deck" |
| Fallback | "Pro — Unlock this feature" |

### Gate Hit: Remove Watermark / Custom Branding

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "Present with your brand" | "Investors notice the details. Remove the watermark and present with your company's identity." |
| Sales/Marketing | "Your brand, not ours" | "Your client should see your brand on every slide. Remove the watermark and add your colors." |
| Educator | "A clean, professional lecture" | "A polished presentation builds trust with your students. Remove the watermark for a distraction-free experience." |
| Corporate/Internal | "Look sharp in front of leadership" | "Brand consistency matters. Present with your company's identity, not a third-party watermark." |
| Creative/Freelancer | "Your portfolio, your brand" | "Your work should speak for itself. Remove the watermark and present under your own name." |
| Student/Personal | "Remove the watermark" | "Get a cleaner look by removing the Presentations.AI watermark." |
| Fallback | "Make it yours" | "Remove the watermark and customize your presentation with your own branding." |

### Gate Hit: PDF Export

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "Send your pitch as a PDF" | "Give investors a polished PDF they can forward to their partners and share offline." |
| Sales/Marketing | "A PDF your client can share" | "Export a professional PDF your client can forward to decision-makers." |
| Educator | "A PDF students can study from" | "Give your students a PDF version they can reference anytime, anywhere." |
| Corporate/Internal | "Export for the exec team" | "Send leadership a polished PDF they can review on their own time." |
| Creative/Freelancer | "Deliver a PDF portfolio" | "Send clients a downloadable PDF they can review and share." |
| Student/Personal | "Download as PDF" | "Export your deck as a PDF to share or present offline." |
| Fallback | "Export as PDF" | "Download your presentation as a professional PDF." |

### Gate Hit: Analytics

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "Know when investors open your pitch" | "See who viewed your deck, how long they spent, and which slides caught their attention." |
| Sales/Marketing | "Track your prospect's engagement" | "See when your client opens the deck. Know which slides they lingered on. Follow up at the right moment." |
| Corporate/Internal | "See who's reviewed your deck" | "Track whether leadership has seen your presentation before the meeting." |
| Fallback | "See who viewed your deck" | "Get insights on who opened your presentation and how they engaged with it." |

### Gate Hit: AI Enhance

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "AI that elevates your pitch" | "Pro AI refines your copy, improves layouts, and makes every slide investor-ready." |
| Sales/Marketing | "AI that sharpens your message" | "Pro AI optimizes your sales copy and layouts for maximum impact." |
| Educator | "AI that enhances your lesson" | "Pro AI helps structure your content for better learning outcomes." |
| Fallback | "Smarter AI, better slides" | "Pro AI generates higher-quality content and more design options." |

### Credit Alert — 100 Credits (First Threshold)

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "Half your credits used" | "You've used 100 credits on your pitch deck. Pro gives you unlimited generations to perfect every slide." |
| Sales/Marketing | "Investing in this deck" | "100 credits used. You're building something strong — go unlimited with Pro to finish without limits." |
| Educator | "100 credits used" | "You've put 100 credits into this lesson. Pro gives you unlimited AI so you can keep building." |
| Corporate/Internal | "Halfway through your credits" | "100 credits used. Unlock unlimited with Pro to finish your presentation without worrying about limits." |
| Creative/Freelancer | "Don't limit your creativity" | "100 credits used. Your creative flow shouldn't have a cap — go unlimited with Pro." |
| Student/Personal | "Half your free credits used" | "You've used half your free credits. Keep an eye on your balance as you continue." |
| Fallback | "Credits update" | "You've used 100 of your 200 free credits. Pro gives you unlimited generations." |

### Credit Alert — 50/25 Credits (Urgency Threshold)

| Archetype | Copy (50 credits) | Copy (25 credits) |
|-----------|-------------------|-------------------|
| Founder/Pitcher | "~10 slides left at your pace. Don't let credits limit your pitch." | "~5 slides left. Your pitch isn't done — upgrade to finish strong." |
| Sales/Marketing | "~10 slides left. Finish your sales deck strong with unlimited Pro." | "~5 slides left. Don't lose momentum — upgrade to Pro." |
| Educator | "~10 slides left. Keep building your lesson with Pro." | "~5 slides left. Upgrade to keep creating." |
| Corporate/Internal | "~10 slides left. Upgrade to finish without limits." | "~5 slides left. Unlock unlimited with Pro." |
| Creative/Freelancer | "~10 slides left. Go unlimited." | "~5 slides left. Your creativity shouldn't stop here." |
| Student/Personal | "Running low on credits." | "Almost out of credits." |
| Fallback | "~10 slides left at your pace." | "~5 slides left." |

### Credits Depleted

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "Your pitch isn't done yet" | "You've used all 200 credits on [X] slides. Upgrade to keep refining — investors will notice the difference." |
| Sales/Marketing | "Don't lose momentum" | "You've built [X] slides for your client. Upgrade to Pro to finish and send a polished deck." |
| Educator | "Keep creating" | "You've used all your credits on [X] slides. Upgrade for unlimited AI to complete your lesson." |
| Corporate/Internal | "Continue your work" | "All 200 credits used. Upgrade to Pro for unlimited generations and finish your presentation." |
| Creative/Freelancer | "Your creativity shouldn't stop here" | "You've generated [X] slides. Upgrade to Pro and keep creating without limits." |
| Student/Personal | "Out of credits" | "You've used all your free credits. See Pro pricing for unlimited access, or wait for credits to refresh." |
| Fallback | "Credits used up" | "All 200 free credits used. Upgrade to Pro for unlimited AI generations." |

### Export/Share Gate

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "Present to investors without our watermark" | "Your pitch deck is ready — present it with your brand, not ours. Pro removes the watermark and unlocks PDF export." |
| Sales/Marketing | "Send a branded deck to close the deal" | "Your client should see your brand on the cover, not ours. Upgrade to share a watermark-free PDF." |
| Educator | "Share a clean presentation with your class" | "Your students deserve a distraction-free experience. Share without the watermark with Pro." |
| Corporate/Internal | "Share without the watermark" | "Present to leadership with a clean, branded deck. Pro removes the watermark and enables PDF export." |
| Creative/Freelancer | "Present your work without distractions" | "Your portfolio piece deserves a clean presentation. Remove the watermark and export as PDF." |
| Student/Personal | "Share a clean deck" | "Remove the Presentations.AI watermark and share a polished version of your deck." |
| Fallback | "Share without branding" | "Remove the watermark and export your presentation as a professional PDF." |

### Celebration — First Deck Complete

| Archetype | Title | Body |
|-----------|-------|------|
| Founder/Pitcher | "Your pitch deck is ready!" | "With Pro, export as a polished PDF and present with your own branding. Own the room." |
| Sales/Marketing | "Your sales deck is done!" | "Pro adds viewer analytics — see when your client opens it and which slides they focus on." |
| Educator | "Your lesson is ready!" | "Share it seamlessly with your class — Pro removes the watermark and unlocks PDF export." |
| Corporate/Internal | "Your presentation is complete!" | "Pro polishes it with your company's brand and lets you export a clean PDF for leadership." |
| Creative/Freelancer | "Your portfolio piece is done!" | "Pro removes the watermark so your work speaks for itself. Export as PDF for client delivery." |
| Student/Personal | "Nice work! Your deck is ready." | "Share it with your classmates or download it for your presentation." |
| Fallback | "Your presentation is ready!" | "Upgrade to Pro for watermark-free sharing and PDF export." |

### Session 2 — Welcome Back Banner

| Archetype | Copy |
|-----------|------|
| Founder/Pitcher | "Welcome back! Upgrade to Pro — unlimited AI, your branding, PDF exports." |
| Sales/Marketing | "Welcome back! Pro adds analytics and unlimited presentations for your team." |
| Educator | "Welcome back! Go Pro for unlimited lessons and watermark-free sharing." |
| Corporate/Internal | "Welcome back! Upgrade to Pro for your company's branding and unlimited decks." |
| Creative/Freelancer | "Welcome back! Pro removes limits — unlimited decks, your brand, PDF delivery." |
| Student/Personal | "Welcome back! Your credits have been refreshed." |
| Fallback | "Welcome back! See what Pro can do for your presentations." |

---

## 9. Rules Engine — Anti-Annoyance

### Session 1 Rules

| Rule | Details |
|------|---------|
| **Create flow: zero nudges** | Never interrupt while user is entering prompt, uploading doc, or selecting template. Signals only. |
| **Session 1 cap: 3 active nudges** | Max 3 active nudge impressions in Session 1. Passive elements (credit meter, Pro icons, inline hints on hover) don't count toward the cap. |
| **No modals in Session 1** | Maximum intensity = Slide-over Panel, and only at export/share gate. No full-screen modals. |
| **One tooltip per feature** | If user dismisses a contextual tooltip on a locked feature, don't show it again for that feature in this session. |
| **Credit alerts: max 2** | Fire at the 100-credit and 50-or-25-credit thresholds. Not both 50 AND 25 — pick whichever they hit first below 50. |
| **No interruption during active work** | Never fire a nudge while user is typing, dragging, resizing, or while AI is generating content. Wait for a natural pause (3+ seconds of inactivity). |
| **Credit depletion overrides cap** | When credits hit 0, the depleted state always shows. This is functional (they can't generate), not a nudge. Doesn't count toward the 3-nudge cap. |

### Session 2 Rules

| Rule | Details |
|------|---------|
| **Session 2 cap: 2 active nudges + 1 banner** | Slightly higher than Session 1 because returning users are warmer. |
| **Panels allowed** | Slide-over panels can appear in Session 2 at gate hits, not just at export/share. |
| **Escalated CTAs** | CTA can be "Upgrade to Pro" in Session 2 (not just "See Pro plans" or "Learn more"). |
| **Gate-hit memory** | If user hit a specific Pro feature gate in Session 1, the Session 2 reminder tooltip targets that same feature. |

### Universal Rules

| Rule | Details |
|------|---------|
| **Dismiss: "Not now"** | Suppresses the same nudge type for the rest of the session. |
| **Dismiss: "Don't show again"** | Permanently suppresses that specific nudge (feature × type combination). |
| **Upgrade = kill switch** | The moment a user upgrades to Pro, ALL nudges are immediately and permanently suppressed. |
| **Never stack nudges** | Only one active nudge visible at a time. If two triggers fire simultaneously, prioritize by intent: Export/Share > Credit Alert > Gate Hit > Celebration. |
| **Archetype shift** | If Session 2 deck has different signals, re-detect archetype. If ambiguous, prefer the higher-stakes archetype. |

### Priority Order (when multiple triggers compete)

1. **Credit depletion** (functional — always wins)
2. **Export/Share gate** (highest conversion intent)
3. **Credit alert** (urgency-based)
4. **Feature gate hit** (direct intent)
5. **Celebration card** (positive reinforcement)
6. **Banner** (ambient, Session 2 only)
7. **Inline hint** (passive, on hover)

---

## 10. Persona Walkthroughs

### Persona 1: Raj — Founder Making a Pitch Deck

**Profile:**
- Role: CEO / Founder
- Audience: Investors
- Topic: "Series A pitch for TechCo — $5M raise"
- Email: raj@techco.com (business domain)
- **Archetype detected: Founder/Pitcher** (role=CEO, audience=investors, topic=pitch)

**Session 1 Journey:**

| Step | User Action | System Response | Nudge? |
|------|------------|----------------|--------|
| 1 | Signs up. Role: CEO, Audience: Investors | Archetype = Founder/Pitcher. No nudge. | No |
| 2 | Enters prompt: "Series A pitch for TechCo" | Archetype confirmed. Topic = pitch. No nudge. | No |
| 3 | Browses templates. Clicks a Pro template, then picks a free one. | Signal: Pro template interest. No nudge. | No |
| 4 | AI generates 12-slide pitch deck. Credits: 200 → 140 | Credit meter appears (green, 140/200). | Passive only |
| 5 | Edits slides for 8 minutes. Regenerates 3 slides. Credits: 140 → 105 | Credit meter updates. No nudge. | No |
| 6 | Hovers over "Custom Brand Colors" (Pro feature) | **Inline Hint:** "Pro — Add your company's brand colors" | Hint (doesn't count toward cap) |
| 7 | Clicks "Custom Brand Colors" trying to use it | **Contextual Tooltip:** "Present with your brand. Investors notice the details. Remove the watermark and add your company's identity." CTA: "See Pro plans →" | **Nudge #1** |
| 8 | Dismisses tooltip. Continues editing. Credits drop to 95 | Credit meter shifts to amber (below 100). **Inline hint:** "Half your credits used. Pro = unlimited." | Hint (1-time, doesn't count) |
| 9 | Keeps editing. Credits drop to 50 | **Credit Alert:** "You've used 150 credits on your pitch deck. ~10 slides left at your pace. Pro = unlimited." CTA: "Upgrade to Pro" / "Maybe later" | **Nudge #2** |
| 10 | Clicks "Export as PDF" | **Slide-over Panel:** "Present to investors without our watermark." Shows before/after of Raj's actual slide. CTA: "Upgrade to Pro — $X/mo" / "Compare plans" | **Nudge #3** |
| 11 | Dismisses. Shares via link (with watermark). | No more nudges — cap reached. | No |
| 12 | Finishes session. | Celebration card would fire, but cap is reached → suppressed. | Suppressed |

**Result:** 3 active nudges, all personalized as Founder/Pitcher, escalating naturally from tooltip → credit alert → export panel. Credit meter and inline hints were passive/ambient.

---

### Persona 2: Maria — Teacher Creating a Lecture

**Profile:**
- Role: Teacher
- Audience: Students
- Topic: "Biology 101 — Cell Structure and Function"
- Email: maria@school.edu (edu domain)
- **Archetype detected: Educator** (role=teacher, audience=students, topic=lecture)

**Session 1 Journey:**

| Step | User Action | System Response | Nudge? |
|------|------------|----------------|--------|
| 1 | Signs up. Role: Teacher, Audience: Students | Archetype = Educator. No nudge. | No |
| 2 | Enters prompt: "Biology 101 Cell Structure lecture" | Archetype confirmed. No nudge. | No |
| 3 | AI generates 8-slide lecture. Credits: 200 → 160 | Credit meter (green, 160/200). | Passive |
| 4 | Edits content. Regenerates 2 slides for better explanations. Credits: 160 → 140 | No nudge. | No |
| 5 | Hovers over "AI Enhance" (Pro feature) | **Inline Hint:** "Pro — Engage your students" | Hint |
| 6 | Clicks "AI Enhance" | **Contextual Tooltip:** "AI that enhances your lesson. Pro AI helps structure your content for better learning outcomes." CTA: "See what's included" | **Nudge #1** |
| 7 | Dismisses. Continues editing. Content looks good. | No nudge. | No |
| 8 | Clicks "Share Link" to distribute to students | **Slide-over Panel:** "Share a clean presentation with your class. Your students deserve a distraction-free experience. Share without the watermark with Pro." Visual: their slide with/without watermark. CTA: "Upgrade to Pro — $X/mo" | **Nudge #2** |
| 9 | Dismisses. Shares with watermark. Credits: 120 | No nudge. | No |
| 10 | Session ends naturally. 6 slides edited, 12 min in editor. | **Celebration Card:** "Your lesson is ready! Share it seamlessly with your class — Pro removes the watermark and unlocks PDF export." CTA: "Upgrade to Pro" / "Maybe later" | **Nudge #3** |

**Result:** 3 nudges, all Educator-toned. No credit alerts because Maria was conservative with credits (never hit 100 threshold). Export/share gate was the strongest moment.

---

### Persona 3: Alex — Freelancer Needing a Quick Proposal

**Profile:**
- Role: Freelancer
- Audience: Clients
- Topic: "Project proposal for ClientCo — web redesign"
- Email: alex@gmail.com (personal domain)
- **Archetype detected: Creative/Freelancer** (role=freelancer, audience=clients, topic=proposal)

**Session 1 Journey:**

| Step | User Action | System Response | Nudge? |
|------|------------|----------------|--------|
| 1 | Signs up. Role: Freelancer, Audience: Clients | Archetype = Creative/Freelancer. No nudge. | No |
| 2 | Enters prompt: "Web redesign proposal for ClientCo" | Archetype confirmed. No nudge. | No |
| 3 | AI generates 6-slide proposal. Credits: 200 → 170 | Credit meter (green). | Passive |
| 4 | Quick edits — adjusts 2 slides, satisfied quickly. 4 min in editor. Credits: 155 | No nudge. | No |
| 5 | Immediately clicks "Export as PDF" to send to client | **Slide-over Panel:** "Present your work without distractions. Your portfolio piece deserves a clean presentation. Remove the watermark and export as PDF." Visual: before/after. CTA: "Upgrade to Pro — $X/mo" / "Compare plans" | **Nudge #1** |
| 6 | Interested but not sure. Clicks "Compare plans" | Opens pricing comparison (not a nudge — user-initiated) | No |
| 7 | Decides not to upgrade. Exports link (with watermark) to client. | No more nudges this session. | No |
| 8 | Session ends. | **Celebration Card:** "Your portfolio piece is done! Pro removes the watermark so your work speaks for itself." CTA: "Upgrade to Pro" / "Maybe later" | **Nudge #2** |

**Result:** Only 2 nudges needed. Alex's journey was fast — straight to export. The export panel was the highest-impact moment. No credit issues (barely used credits). Celebration card reinforces the value.

**Session 2 (2 days later):**

| Step | User Action | System Response | Nudge? |
|------|------------|----------------|--------|
| 1 | Opens app | **Banner:** "Welcome back! Pro removes limits — unlimited decks, your brand, PDF delivery." CTA: "See Pro plans" | **Banner** |
| 2 | Creates new proposal for a different client | No nudge during create flow. | No |
| 3 | In editor, hovers "Remove Watermark" (same feature from Session 1) | **Reminder Tooltip:** "Still curious about removing the watermark? Your clients see a cleaner presentation with Pro." | **Nudge #1** |
| 4 | Clicks Export again | **Slide-over Panel:** Same export panel, but CTA is now "Upgrade to Pro" (stronger, Session 2 allowed) | **Nudge #2** |
| 5 | Decides to upgrade → purchases Pro | **All nudges immediately suppressed. Pro features unlocked.** | Kill switch |

**Result:** Session 2 was the conversion session. Banner + targeted reminder + export panel. 3 touchpoints, conversion achieved.

---

## 11. Measurement Framework

### Primary Metrics

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Nudge → Purchase conversion rate** | % of users who saw a nudge and purchased Pro within 48h | Baseline TBD, then improve |
| **Export gate conversion rate** | % of users who hit the export/share panel and convert | Highest expected rate |
| **Credit depletion conversion rate** | % of users who depleted credits and converted | Second highest expected rate |
| **Overall free → Pro rate** | % of all free signups who convert in first 2 sessions | Currently ~1%, goal: 2-3% |

### Secondary Metrics

| Metric | What It Measures | Red Flag |
|--------|-----------------|----------|
| **Nudge dismiss rate** | % of nudges dismissed per type | >80% dismiss = copy or timing is wrong |
| **"Don't show again" rate** | % of users who permanently dismiss | >20% = too aggressive |
| **Nudge → feature exploration rate** | % who click "Learn more" / "See plans" | Low = copy isn't compelling |
| **Session 1 → Session 2 return rate** | % who come back | If nudged users return less → nudges are harmful |
| **Credit depletion drop-off** | % who leave when credits hit 0 and never return | High = depletion experience is too harsh |

### A/B Testing Plan

| Test | Variants | What We Learn |
|------|----------|---------------|
| **Copy by archetype** | Archetype-personalized copy vs. generic copy | Does personalization improve conversion? |
| **Credit alert threshold** | Alert at 100 vs. alert at 75 | When is the optimal moment for credit urgency? |
| **Export panel visual** | Before/after comparison vs. text-only | Does seeing their own slide watermark-free convert better? |
| **CTA wording** | "Upgrade to Pro" vs. "See Pro plans" vs. "Go unlimited" | Which drives more clicks? |
| **Celebration card** | With Pro upsell vs. without | Does celebrating + upselling feel good or manipulative? |
| **Session 2 banner** | Personalized (archetype) vs. generic welcome back | Does personalization carry across sessions? |

### Tracking Implementation

Every nudge event should log:
- `nudge_type`: tooltip / credit_alert / panel / banner / celebration
- `archetype`: founder / sales / educator / corporate / creative / student / fallback
- `micro_phase`: feature_exploration / gate_hit / credit_milestone / export_share / deck_complete / session_2_return
- `trigger_feature`: branding / pdf_export / ai_enhance / analytics / collaboration / credits
- `credits_remaining`: integer
- `action`: impression / click_primary / click_secondary / dismiss / dismiss_never
- `session_number`: 1 or 2
- `conversion_within_48h`: boolean (joined post-hoc)

---

## Appendix: Quick Reference

### Decision Flowchart

```
User enters editor
  │
  ├─ Is user actively working? (typing, dragging, AI generating)
  │   └─ YES → Wait. No nudge until 3s pause.
  │
  ├─ Has session cap been reached? (3 for S1, 2+banner for S2)
  │   └─ YES → No more nudges (except credit depletion).
  │
  ├─ What triggered this moment?
  │   ├─ Pro feature hover → Inline Hint (doesn't count toward cap)
  │   ├─ Pro feature click → Contextual Tooltip (archetype-personalized)
  │   ├─ Credit threshold → Credit Alert (credit math)
  │   ├─ Export/Share click → Slide-over Panel (before/after visual)
  │   ├─ Deck complete → Celebration Card
  │   ├─ Credits = 0 → Depleted Panel (functional, always shows)
  │   └─ Session 2 entry → Dashboard Banner
  │
  ├─ Has this nudge already fired this session?
  │   └─ YES → Suppress. Don't repeat.
  │
  └─ Was this nudge permanently dismissed?
      └─ YES → Suppress forever.
```

### Archetype Detection Cheat Sheet

```
Role = founder/CEO/exec          → Founder/Pitcher
Role = sales/marketing           → Sales/Marketing
Role = teacher/professor         → Educator
Role = manager/analyst/PM        → Corporate/Internal
Role = designer/freelancer       → Creative/Freelancer
Role = student                   → Student/Personal
Audience = investors             → Founder/Pitcher
Audience = clients               → Sales/Marketing (or Creative if role matches)
Audience = students              → Educator
Audience = team/leadership       → Corporate/Internal
Topic contains: pitch, series    → Founder/Pitcher
Topic contains: sales, proposal  → Sales/Marketing
Topic contains: lecture, lesson  → Educator
Topic contains: update, review   → Corporate/Internal
Topic contains: portfolio        → Creative/Freelancer
No match                         → Fallback
```

### Component Composition Cheat Sheet

```
Inline Hint       = Shell(compact, anchored) + Icon + Title
Contextual Tooltip = Shell(compact, anchored) + Icon + Title + ValueProp + CTA(primary) + Dismiss(close)
Credit Alert       = Shell(standard, overlay) + Icon(credits) + Title + ValueProp + Proof(credit-math) + CTA(primary+secondary) + Dismiss(close+later)
Slide-over Panel   = Shell(expanded, overlay) + Icon + Title + ValueProp + Proof(comparison) + Visual(before-after) + CTA(primary+secondary) + Dismiss(close+later+never)
Banner             = Shell(compact, fixed) + Icon + Title + CTA(primary) + Dismiss(close)
Celebration Card   = Shell(standard, overlay) + Icon(celebration) + Title + ValueProp + CTA(primary+secondary) + Dismiss(close)
Credit Meter       = Standalone component. States: green / amber / orange / red / depleted
```

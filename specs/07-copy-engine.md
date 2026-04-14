# 07 — Copy Engine

## Purpose

The CopyEngine generates personalized nudge copy for each feature using the user's context (topic, audience, country tier). It produces a title and body string per feature, with tier-specific modifiers appended based on the user's country classification.

---

## Interface

### Input

| Parameter | Type | Description |
|---|---|---|
| `feature` | `object` | Feature object with at least `{ id }` |

### Output

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Nudge headline |
| `body` | `string` | Nudge body copy with tier modifier appended |

### State Dependencies

| Field | Source | Description |
|---|---|---|
| `state.user.topic` | User context | Truncated to 4 words + `"..."` if longer than 4 words |
| `state.user.audience` | User context | Target audience string |
| `state.user.countryTier` | User context | `1` (quality-focused) or `2` (value-focused) |

---

## Function: `generateCopy(feature)`

1. Read `topic`, `audience`, and `countryTier` from `state.user`.
2. Truncate `topic` to 4 words + `"..."` if it exceeds 4 words.
3. Look up the copy template by `feature.id`.
4. Interpolate `topic` and `audience` into the template.
5. Look up the tier modifier by `feature.id` and `countryTier`.
6. Append the tier modifier to the body.
7. Return `{ title, body }`.

---

## Copy Templates (9 features)

### Standard Pro Features

| Feature ID | Title | Body References |
|---|---|---|
| `ai-models` | "Upgrade to a better AI model" | topic + audience |
| `brand-kit` | "Set up your Brand Kit" | topic |
| `unbranded` | "Use unbranded Pro templates" | audience |
| `export` | "Export your deck" | topic + audience |
| `invite-collab` | "Invite collaborators" | topic + audience |
| `analytics` | "Turn on viewer analytics" | audience + topic |
| `gen-speed` | "Upgrade generation speed" | topic |
| `pres-refresh` | "Refresh your presentation" | topic |

### Service Feature

| Feature ID | Title | Body References |
|---|---|---|
| `hire-team` | "Let us build it for you" | topic + audience, framed as "we handle the design" |

The `hire-team` copy is **distinctly framed** compared to other features:
- Other features say "unlock this capability."
- `hire-team` says "let us handle it for you."
- The CTA is `"Talk to our team"` instead of `"Upgrade to Pro"`.
- The nudge card uses the Service variant (orange accent, SERVICE badge) rather than the Pro variant.

---

## Tier Modifiers

A tier modifier is a sentence appended to the base body copy. It adjusts the value proposition framing based on the user's country tier.

### Tier 1 — Quality-Focused

Markets where users prioritize polish, precision, and enterprise credibility.

| Feature ID | Modifier |
|---|---|
| `ai-models` | "Enterprise-grade AI for presentations that command attention." |
| `brand-kit` | "Pixel-perfect brand consistency across every slide." |
| `unbranded` | "Clean, professional finish your audience expects." |
| `export` | "Presentation-ready exports that meet enterprise standards." |
| `invite-collab` | "Seamless team collaboration with version control." |
| `analytics` | "Detailed engagement metrics for data-driven decisions." |
| `gen-speed` | "Priority processing for time-sensitive deliverables." |
| `pres-refresh` | "Keep presentations current with one-click refresh." |
| `hire-team` | "Our design team ensures world-class output." |

### Tier 2 — Value-Focused

Markets where users prioritize efficiency, savings, and punching above their weight.

| Feature ID | Modifier |
|---|---|
| `ai-models` | "Save hours of manual editing." |
| `brand-kit` | "Set it once, reuse across every deck without rework." |
| `unbranded` | "Look established without hiring a designer." |
| `export` | "Share anywhere — PDF, PPTX, or link." |
| `invite-collab` | "Work together without emailing files back and forth." |
| `analytics` | "Know exactly who viewed and for how long." |
| `gen-speed` | "Get results in seconds, not minutes." |
| `pres-refresh` | "Update once, apply everywhere instantly." |
| `hire-team` | "Get a professional deck without the agency price tag." |

---

## Topic Truncation

If `state.user.topic` is longer than 4 words, it is truncated to the first 4 words with `"..."` appended.

Examples:
- `"AI in healthcare"` → `"AI in healthcare"` (3 words, no truncation)
- `"The future of sustainable energy solutions"` → `"The future of sustainable..."` (truncated at 4 words)

This keeps nudge copy concise and scannable.

---

## Behavior Notes

- **Copy is generated at fire time**, not pre-computed. Each call to `generateCopy` reads the current `state.user` values, so if the user context changes between milestones, copy reflects the latest state.
- **No fallback copy**. Every feature ID has a defined template. If a feature ID were missing from the template map, the function would fail.
- **Tier is binary**. Only tier 1 and tier 2 exist. There is no tier 3 or default tier.

---

## Cross-References

- **MilestoneSelector**: [05-milestone-selector.md](./05-milestone-selector.md) — calls `generateCopy(feature)` inside `fireMilestone()`.
- **Renderer**: [08-renderer.md](./08-renderer.md) — `renderNudgePreview()` and `buildNudgeCardHTML()` consume the copy output to display the nudge.
- **User Context**: The user profiling layer provides `topic`, `audience`, and `countryTier`.

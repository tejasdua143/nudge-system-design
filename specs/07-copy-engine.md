# 07 — Copy Engine

## Purpose

The CopyEngine generates contextual nudge copy for each feature using the user's context (topic, audience) and their active signals. Each feature has multiple **sub-features** — the engine picks the most relevant one based on what the user has been doing.

---

## Interface

### Input

| Parameter | Type | Description |
|---|---|---|
| `feature` | `object` | Feature object from `fireMilestone()` with at least `{ id, type }` |

### Output

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Nudge headline — directional, outcome-focused |
| `body` | `string` | 1–2 short sentences connecting the moment to the Pro outcome |
| `cta` | `string` | Feature-specific CTA label (e.g., "Get Brand Kit") |

### State Dependencies

| Field | Source | Notes |
|---|---|---|
| `state.user.topic` | User context | Used raw (no truncation) |
| `state.user.audience` | User context | `→ ` prefix stripped + lowercased for interpolation |
| `state.activeSignals` | Signal state | Used to pick the best sub-feature |

---

## Copy Framework

| Element | Rule |
|---|---|
| **Title** | Directional, outcome-focused. Frames the win, not the flaw. Sentence-case, no period. Uses `{audience}` or `{topic}` only when it sharpens the moment. |
| **Body** | 1–2 short sentences. User action or outcome first; "Pro" is a qualifier, not a subject noun. No em dashes. |
| **CTA** | Feature-named: "Get Brand Kit", "Try Analytics", "Unlock Exports", "Remove Watermark", "Talk to Our Team", "Upgrade to Pro". Never generic outside `ai-models`. |
| **Dismiss** | "Not now". |
| **Tone** | Helpful confidence. Aspirational upsell, never punches down on the current product. |
| **Never say** | "missing", "shouldn't see our logo", "without the back-and-forth", "on the first try", "first pass". Any phrasing that implies the current state is bad. |
| **Tier modifiers** | None. Same copy for all users. |

### Audience interpolation

Audience strings are stored with a `→ ` prefix (`→ Investors`, `→ Exec team`). Before interpolation, the engine strips the prefix and lowercases:

```js
const audience = (u.audience || '').replace(/^→\s*/, '').toLowerCase();
// "→ Investors" → "investors"
// "→ C-suite buyers" → "c-suite buyers"
```

---

## Function: `generateCopy(feature)`

### Algorithm

1. Read `topic` from `state.user.topic` (no truncation).
2. Compute `audience` via the strip-and-lowercase helper.
3. Look up the sub-feature candidates for `feature.id`.
4. For each candidate, count how many of its trigger signals are in `state.activeSignals`.
5. Pick the candidate with the highest match count.
6. If no signals match any candidate, fall back to the first candidate.
7. Return `{ title, body, cta }`.

---

## Sub-Feature Variants (20 total)

### ai-models (3 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| advanced-models | text-edit, undo-redo, edit-after-preview, deck-regenerate | Write tighter copy with Pro plans | Pro AI nails the wording and layout so your {topic} deck sounds exactly how you want it. | Upgrade to Pro |
| ai-credits | insert-slide-prompt, deck-regenerate | More AI credits, more iterations | Go heavier on AI with Pro. Higher credit limits keep your {topic} deck evolving. | Upgrade to Pro |
| project-knowledge | doc-upload, doc-upload-long, prompt-brand | Your uploaded docs, working in every slide | Project Knowledge on Pro feeds your uploaded docs into every AI-generated slide. | Get Project Knowledge |

### brand-kit (4 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| brand-fonts | style-change | Let your fonts carry the presentation | Save your typeface to Brand Kit on Pro. Every slide reads with the same voice, start to finish. | Get Brand Kit |
| brand-colors | theme-global, layout-slide | Give your {audience} a deck that reads unmistakably yours | Pro's Brand Kit applies your colors and fonts everywhere. No toolbar touches needed. | Get Brand Kit |
| brand-assets | insert-media, prompt-brand | Your logo, one click into any slide | Store your logo and images in Brand Kit. Drop them anywhere with one click on Pro. | Get Brand Kit |
| brand-voice | text-edit, insert-title, insert-list | Keep your voice consistent across slides | Brand Kit remembers your tone, Pro AI writes every new slide to match. | Get Brand Kit |

### unbranded (2 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| unbranded-links | share-link-copy, play-preview | Send a clean link to your {audience} | Remove the watermark with Pro. Every shared link looks fully yours. | Remove Watermark |
| unbranded-export | export-click, export-download | Deliver a polished file to your {audience} | Pro exports come watermark-free so your {audience} gets a clean, finished deliverable. | Remove Watermark |

### export (3 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| ppt-export | export-click, export-download | Send this wherever it needs to go | Pro export gives you a polished .pptx or PDF that opens cleanly in any tool your {audience} uses. | Unlock Exports |
| pdf-export | play-preview, share-link-copy | Send a PDF they can open anywhere | Export your {topic} deck to PDF with Pro. Ready to email, print, or attach. | Unlock Exports |
| embed | share-link-copy | Put your {topic} deck on any webpage | Embed your {topic} deck on any page with Pro. Fully interactive, live updates. | Unlock Embeds |

### invite-collab (4 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| guests | share-link-copy, prompt-team | Keep every comment on the slide | Invite guests to view and comment with Pro. Feedback stays on the deck, not in Slack. | Invite Collaborators |
| workspace | prompt-team, invite-attempt | Build this deck with your team | Work on your {topic} deck together in Pro workspaces. Real-time edits and comments. | Invite Collaborators |
| present-remotely | play-preview | Present live to your {audience} | Present with Pro. A synced link keeps every slide moving with you, from anywhere. | Get Live Presenting |
| version-history | undo-redo, deck-regenerate | Never lose an edit | Keep 30 days of version history on Pro. Roll back any edit, anytime. | Get Version History |

### analytics (3 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| page-views | share-link-copy, play-preview | See what lands after you hit share | Pro tracks every open, which slide held attention, and for how long, so your next pitch hits harder. | Try Analytics |
| slide-engagement | share-link-copy | See which slides kept your {audience} engaged | Pro Analytics shows exactly where your viewers spent time, slide by slide. | Try Analytics |
| demographics | export-click, export-download | Know who's opening your deck | Pro Analytics breaks down viewers by location, device, and time. | Try Analytics |

### hire-team (1 variant)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| hire-team | undo-redo, deck-regenerate, doc-upload-long | Let our design team build it for you | Our team turns your {topic} deck for {audience} into a polished, on-brand presentation, delivered fast. | Talk to Our Team |

---

## Behavior Notes

- **Copy is generated at fire time**, not pre-computed. Each call to `generateCopy` reads the current `state.user` values.
- **Sub-feature selection is signal-driven.** The same feature produces different copy depending on what the user was doing.
- **Fallback is always the first candidate.** If no signals match, the first sub-feature in the list is used — so the most general variant should be first.
- **CTA is part of the output.** `buildNudgeCardHTML` reads `copy.cta` to render the button label. Fallback: "Upgrade to Pro" (pro) / "Talk to Our Team" (service).
- **No topic truncation.** The prior 4-word limit produced awkward fragments ("Series A investor pitch..."). Copy is written tight enough to accept the full topic.

---

## Cross-References

- **MilestoneSelector** (spec 05) — Calls `generateCopy(feature)` inside `fireMilestone()`.
- **Renderer** (spec 08) — `renderNudgePreview()` + `buildNudgeCardHTML()` consume `(title, body, cta)`.
- **ContextProfiler** (spec 03) — Produces `user.audience` with the `→` prefix that `generateCopy` strips.

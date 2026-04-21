# 07 — Copy Engine

## Purpose

The CopyEngine generates contextual nudge copy for each feature using the user's context (topic, audience) and their active signals. Instead of one static template per feature, each feature has multiple **sub-features** — the engine picks the most relevant one based on what the user has been doing.

---

## Interface

### Input

| Parameter | Type | Description |
|---|---|---|
| `feature` | `object` | Feature object from `fireMilestone()` with at least `{ id, type }` |

### Output

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Nudge headline — names the pain, not the feature |
| `body` | `string` | One sentence connecting the pain to the solution |
| `cta` | `string` | Feature-specific CTA label (e.g., "Get Brand Kit") |

### State Dependencies

| Field | Source | Description |
|---|---|---|
| `state.user.topic` | User context | Truncated to 4 words + `"..."` if longer |
| `state.user.audience` | User context | Target audience string |
| `state.activeSignals` | Signal state | Used to pick the best sub-feature |

---

## Copy Framework

These rules govern all nudge copy:

| Element | Rule |
|---|---|
| **Title** | Names the pain tied to what the user is building and for whom. Never commands ("Stop doing X"). Never calls out specific user behavior ("You've edited 3 times"). The product is on the user's side, pointing out a better way. |
| **Body** | One sentence. Connects the pain to the solution. Uses topic and audience context when it fits naturally. No em-dash splits into two separate thoughts. |
| **CTA** | Always names the specific feature or sub-feature: "Get Brand Kit", "Try Analytics", "Unlock Exports", "Remove Watermark", "Talk to Our Team". Never generic "Upgrade to Pro" (except for ai-models variants where Pro is the product). |
| **Dismiss** | Always "Not now". Neutral, no guilt. |
| **Tone** | Helpful confidence. The product is quietly on the user's side. Not commanding, not scolding, not creepy. |
| **Context** | Topic and audience are used in titles and bodies when they do real work — connecting the nudge to what the user cares about. Never forced in as decoration. |
| **Tier modifiers** | None. Same copy for all users regardless of country or tier. |
| **Product undermining** | Never imply the current free version is bad. Frame Pro features as enhancements, not fixes. |

---

## Function: `generateCopy(feature)`

### Algorithm

1. Read `topic` and `audience` from `state.user`.
2. Truncate `topic` to 4 words + `"..."` if it exceeds 4 words.
3. Look up the sub-feature candidates for `feature.id`.
4. For each candidate, count how many of its trigger signals are in `state.activeSignals`.
5. Pick the candidate with the highest match count.
6. If no signals match any candidate, fall back to the first candidate.
7. Return `{ title, body, cta }` from the selected candidate.

---

## Sub-Feature Variants (20 total)

### ai-models (3 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| advanced-models | text-edit, edit-streak-3, edit-count-5, edit-after-preview, deck-regenerate | Your {topic} deck could be better on the first try | Pro AI models generate sharper copy and more polished layouts without the back-and-forth. | Upgrade to Pro |
| ai-credits | insert-slide-prompt, deck-regenerate | Don't lose momentum on your {topic} deck | You're running low on credits. Upgrade to keep generating without interruptions. | Upgrade to Pro |
| project-knowledge | doc-upload, doc-upload-long, prompt-brand | Make your {topic} slides even more accurate | Upload your documents and the AI tailors every slide to your specific material. | Get Project Knowledge |

### brand-kit (4 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| brand-fonts | style-change | Set your fonts once for the whole deck | Brand Kit locks in your typeface and applies it across every slide automatically. | Get Brand Kit |
| brand-colors | theme-global, layout-slide | Your {topic} deck should look like it came from your brand | Brand Kit applies your exact colors across every slide so {audience} sees a polished, on-brand presentation. | Get Brand Kit |
| brand-assets | insert-media, prompt-brand | Your {topic} deck is missing your brand assets | Upload your logo and images once to Brand Kit and they're always ready when you need them. | Get Brand Kit |
| brand-voice | text-edit, insert-title, insert-list | Make sure {audience} hears your brand's voice in every slide | Set your tone once in Brand Kit and every AI-generated slide in your {topic} deck sounds like you. | Get Brand Kit |

### unbranded (2 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| unbranded-links | share-link-copy, play-preview | Before you share your {topic} deck with {audience} | Remove the watermark so your presentation looks fully yours when they open it. | Remove Watermark |
| unbranded-export | export-click, export-download | Your {topic} export will carry our watermark | Remove it for a polished file you can send directly to {audience}. | Remove Watermark |

### export (3 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| ppt-export | export-click, export-download | Take your {topic} deck offline | Export to PowerPoint so you can edit, email, or present it anywhere. | Unlock Exports |
| pdf-export | play-preview, share-link-copy | Send {audience} a polished PDF of your {topic} deck | Export a presentation-ready PDF that's perfect for email or print. | Unlock Exports |
| embed | share-link-copy | Your {topic} presentation could live on your website | Embed it directly on any page so {audience} can view it live and interactive. | Unlock Embeds |

### invite-collab (4 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| guests | share-link-copy, prompt-team | Get feedback before this reaches {audience} | Invite guests to view and comment, all in one place. | Invite Collaborators |
| workspace | prompt-team, invite-attempt | Your team should be building this {topic} deck with you | Add them to a shared workspace where everyone can edit and comment together. | Invite Collaborators |
| present-remotely | play-preview | Present your {topic} deck live to {audience} | Share a link and your audience follows along in real time as you present. | Get Live Presenting |
| version-history | undo-redo, deck-regenerate, edit-streak-3 | Keep a safety net for your {topic} deck | Version History tracks every edit for 30 days so you can undo anything, anytime. | Get Version History |

### analytics (3 variants)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| page-views | share-link-copy, play-preview | Know when {audience} opens your {topic} deck | Analytics shows exactly who viewed it and when. | Try Analytics |
| slide-engagement | share-link-copy | Find out which slides {audience} actually cared about | See exactly where they spent the most time in your {topic} deck. | Try Analytics |
| demographics | export-click, export-download | See who's viewing your {topic} deck | Analytics shows where your viewers are and what devices they're using. | Try Analytics |

### hire-team (1 variant)

| Sub-feature | Trigger signals | Title | Body | CTA |
|---|---|---|---|---|
| hire-team | edit-streak-3, undo-redo, deck-regenerate, edit-count-5, doc-upload-long | Let our team build your {topic} deck for {audience} | You focus on the message, we handle the design and polish. | Talk to Our Team |

---

## Topic Truncation

If `state.user.topic` is longer than 4 words, it is truncated to the first 4 words with `"..."` appended.

Examples:
- `"AI in healthcare"` → `"AI in healthcare"` (3 words, no truncation)
- `"The future of sustainable energy solutions"` → `"The future of sustainable..."` (truncated at 4 words)

This keeps nudge titles and bodies concise and scannable.

---

## Behavior Notes

- **Copy is generated at fire time**, not pre-computed. Each call to `generateCopy` reads the current `state.user` values, so if the user context changes between milestones, copy reflects the latest state.
- **Sub-feature selection is signal-driven.** The same feature can produce different copy depending on what the user was doing. A brand-kit nudge for someone changing fonts says different things than one for someone uploading media.
- **Fallback is always the first candidate.** If no signals match any sub-feature, the first sub-feature in the list is used. This means the list ordering matters — the most common/general variant should be first.
- **The CTA is part of the copy output.** `buildNudgeCardHTML` reads `copy.cta` to render the button label. If `copy.cta` is missing (e.g., from the fallback path), it falls back to "Upgrade to Pro" for pro features or "Talk to Our Team" for services.

---

## Cross-References

- **MilestoneSelector** (spec 05) — Calls `generateCopy(feature)` inside `fireMilestone()`.
- **Renderer** (spec 08) — `renderNudgePreview()` and `buildNudgeCardHTML()` consume the copy output (title, body, cta) to display the nudge card.
- **Context Profiler** (spec 03) — Provides `topic` and `audience` used for copy personalization.

# Smart Nudge System

A milestone-driven upgrade nudge system for [presentations.ai](https://presentations.ai). Determines which Pro feature to nudge, when, and with what copy — personalized through 3-layer context profiling, a relevance filter, and a signal-to-feature scoring matrix.

**Goal:** Convert free users to Pro purchases in the first 1-2 sessions by showing the right nudge at the right moment.

## How It Works

```
User Action → Signal Collector → Context Profiler → Relevance Filter → Scoring Engine → Milestone Selector → Guardrails → Copy Engine → Nudge Card
```

1. Every user action (editing text, sharing a link, uploading a doc) emits signals
2. Signals carry per-feature weights — some boost specific features, some boost all
3. A relevance filter removes features that don't fit the user's role + prompt context
4. The highest-scoring relevant feature that clears the threshold (14) fires as a nudge
5. Guardrails prevent over-nudging (session cap, cooldown, activity pause)
6. The copy engine picks a contextual sub-feature variant based on what the user was doing

## Features (7)

| Feature | Type | Nudge When... |
|---------|------|---------------|
| Better AI Models | Pro | User is editing/fixing AI output, running low on credits, uploading docs |
| Brand Kit | Pro | User is changing fonts, colors, uploading media, editing copy tone |
| Remove Watermark | Pro | User is about to share or export |
| PowerPoint/PDF Export | Pro | User tries to download or needs offline delivery |
| Invite Collaborators | Pro | User mentions team, tries to invite, previews for remote presenting |
| Viewer Analytics | Pro | User shares links, wants to track engagement |
| Hire Our Team | Service | User is struggling — repeated edits, undo/redo, long docs |

## Try It

**Simulator:** Open `simulator/index.html` in a browser (or serve locally for LLM features):

```bash
python3 -m http.server 8080
# → http://localhost:8080/simulator/index.html
```

Click **Randomise Everything** to see the full flow — random user, random prompt, random actions, and the resulting nudge.

**Optional:** Run [Ollama](https://ollama.com) with Gemma 2 for live AI-powered prompt analysis:

```bash
ollama run gemma2
```

## Project Structure

```
config/          Tunable JSON configs (signal weights, mindset vectors, guardrails)
docs/            Design references (nudge card component, design prompt)
simulator/       Interactive HTML simulators (no build tools, vanilla JS)
specs/           Engineering specs (9 files, one per engine)
```

Legacy v1 simulators + plans are preserved on branch `archive/v1` (frozen, never moves). Not on main. Check out with `git checkout archive/v1` if needed.

## Specs

Start with the system overview, then dive into individual engines:

| Spec | Engine | What It Covers |
|------|--------|----------------|
| [00](specs/00-system-overview.md) | System Overview | Architecture, features, scoring math, copy framework |
| [01](specs/01-nudge-state.md) | Nudge State | State schema and ownership rules |
| [02](specs/02-signal-collector.md) | Signal Collector | Product events to signal mapping |
| [03](specs/03-context-profiler.md) | Context Profiler | 3-layer profiling (mindset, stakes, prompt synthesis) |
| [04](specs/04-scoring-engine.md) | Scoring Engine | Direct + universal scoring math |
| [05](specs/05-milestone-selector.md) | Milestone Selector | Relevance filter, ranking, threshold, no-fallback rule |
| [06](specs/06-guardrails.md) | Guardrails | Session cap, cooldown, intent floor, activity pause |
| [07](specs/07-copy-engine.md) | Copy Engine | 20 contextual sub-feature copy variants |
| [08](specs/08-renderer.md) | Renderer | Nudge card component (pro + service variants) |

## Config Files

| File | What It Controls |
|------|-----------------|
| `direct-signal-map.json` | Signal → per-feature weight mappings |
| `universal-signal-map.json` | Signal → universal weight (applied ×0.4 to all features) |
| `mindset-vectors.json` | 40 role × stakes vectors (13 roles × 3 stakes + fallback) |
| `prompt-synthesis-examples.json` | 30+ pre-computed prompt → feature score mappings |
| `context-layers.json` | Audience stakes classification (high/low external, internal) |
| `guardrails.json` | Thresholds, caps, cooldowns, timing |
| `feature-contributors.json` | Feature-centric reference view of all scoring inputs |

## Copy Framework

Every nudge follows these rules:

- **Title** names the pain, not the feature. Tone: helpful confidence.
- **Body** is one sentence. Connects pain to solution. Uses topic/audience when natural.
- **CTA** always names the feature: "Get Brand Kit", "Try Analytics", "Remove Watermark".
- **Tone** is the product quietly on your side. Not commanding, not scolding.
- Same copy for all users regardless of country or tier.

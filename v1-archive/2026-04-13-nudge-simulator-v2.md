# Nudge Simulator v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Rebuild the milestone simulator as a clean, modular single-page app with proper separation of concerns — each engine as an independent JS module wired through a shared state bus.

**Architecture:** Single HTML file with six JS engine modules (SignalCollector, ContextProfiler, ScoringEngine, MilestoneSelector, Guardrails, CopyEngine) communicating through a central NudgeState object. A lightweight Coordinator watches state changes and triggers re-renders. UI organized as panels per engine.

**Tech Stack:** Vanilla HTML/CSS/JS. No build tools. Single file for portability. Google Fonts (Montserrat + Roboto + PT Mono). Paper design system (light theme from current simulator).

**Reference files:**
- Spec: `/Users/tejasdeck/Nudge System Design/specs/00-system-overview.md`
- Current simulator: `/Users/tejasdeck/Nudge System Design/milestone-simulator.html`

---

## File Structure

```
/Users/tejasdeck/Nudge System Design/
├── simulator/
│   └── index.html           # The unified modular simulator (single file, ~2000 lines)
│                             # Sections:
│                             #   1. <style> — Paper design system CSS
│                             #   2. <body>  — Layout shell + panel containers
│                             #   3. <script> — Engine modules in order:
│                             #      - CONFIG (all tunable values)
│                             #      - FEATURES (9 feature definitions)
│                             #      - ACTIONS (user action definitions)
│                             #      - NudgeState (central state object)
│                             #      - SignalCollector (event → signal)
│                             #      - ContextProfiler (3-layer profiling)
│                             #      - ScoringEngine (direct + universal math)
│                             #      - MilestoneSelector (rank + threshold)
│                             #      - Guardrails (caps, cooldowns, floor)
│                             #      - CopyEngine (personalized copy + tier)
│                             #      - Coordinator (wires engines + triggers renders)
│                             #      - Renderer (all UI panel render functions)
│                             #      - Init (bootstrap)
├── config/
│   ├── direct-signal-map.json
│   ├── universal-signal-map.json
│   ├── mindset-vectors.json
│   ├── prompt-synthesis-examples.json
│   └── guardrails.json
└── specs/
    └── 00-system-overview.md  # (already exists)
```

The config JSON files are the canonical source of all tunable values. The simulator embeds them inline as JS objects (copy-pasted from the JSONs) so it remains a single portable HTML file.

---

### Task 1: Config JSON Files

All tunable values, extracted from the current simulator and updated for v2 (9 features including hire-team, mindset vectors from role × audience).

**Files:**
- Create: `config/direct-signal-map.json`
- Create: `config/universal-signal-map.json`
- Create: `config/mindset-vectors.json`
- Create: `config/prompt-synthesis-examples.json`
- Create: `config/guardrails.json`

- [x] **Step 1: Create direct-signal-map.json**

All ~40+ signal → feature weight mappings. Carried forward from the current simulator's `DIRECT_MAP`, with `hire-team` weights added.

```json
{
  "_doc": "Signal → { featureId: weight }. Each signal maps to specific features.",

  "manual-edit":        { "ai-models": 1, "pres-refresh": 1 },
  "edits-5plus":        { "ai-models": 5, "pres-refresh": 2, "hire-team": 3 },
  "re-edit-3x":         { "ai-models": 5, "pres-refresh": 3, "hire-team": 4 },
  "format-edits":       { "ai-models": 4, "brand-kit": 2, "hire-team": 2 },
  "undo-redo":          { "ai-models": 4, "pres-refresh": 3, "hire-team": 4 },
  "style-change":       { "brand-kit": 4, "ai-models": 2, "hire-team": 2 },
  "slide-delete":       { "ai-models": 2, "pres-refresh": 2 },

  "slides-15plus":      { "ai-models": 3, "gen-speed": 5, "invite-collab": 3 },
  "media-added":        { "ai-models": 3 },
  "slide-duplicate":    { "unbranded": 2, "pres-refresh": 2 },
  "manual-slide-add":   { "unbranded": 3, "ai-models": 2 },
  "slide-reorder":      { "ai-models": 3, "pres-refresh": 3 },
  "data-content":       { "analytics": 5 },

  "slideshow":          { "unbranded": 4, "export": 4 },
  "slideshow-then-edit": { "ai-models": 4, "pres-refresh": 4, "hire-team": 2 },
  "idle-on-slide":      { "ai-models": 3, "pres-refresh": 3 },
  "template-switch":    { "unbranded": 5, "brand-kit": 3, "hire-team": 3 },

  "share-clicked":      { "unbranded": 5, "analytics": 4, "export": 3 },
  "link-copied":        { "unbranded": 4, "analytics": 4 },
  "export-attempt":     { "export": 5 },

  "brand-mention":      { "brand-kit": 5 },
  "team-language":      { "invite-collab": 5 },
  "started-blank":      { "unbranded": 4, "ai-models": 3 },
  "deck-edited":        { "unbranded": 2, "export": 3 },

  "new-deck-session2":  { "unbranded": 3, "pres-refresh": 4, "gen-speed": 3 },
  "deck-switch":        { "brand-kit": 3, "pres-refresh": 3 },
  "gate-hit":           {},
  "time-20":            { "ai-models": 3, "gen-speed": 4 },

  "stakes-high-external":  { "unbranded": 3, "analytics": 2, "brand-kit": 2, "hire-team": 2 },
  "stakes-low-external":   { "unbranded": 2, "brand-kit": 1 },
  "stakes-internal":       { "gen-speed": 2, "ai-models": 2, "invite-collab": 2 },

  "prompt-synthesis":      {},

  "bought-export":      { "export": 4 },
  "multi-deck":         { "brand-kit": 3, "pres-refresh": 3 },

  "deck-veteran":       { "brand-kit": 3, "pres-refresh": 3, "gen-speed": 2 },
  "deck-sharer":        { "analytics": 3, "unbranded": 2, "invite-collab": 2 },
  "deck-publisher":     { "analytics": 2, "unbranded": 3 },

  "acq-paid":           { "gen-speed": 2, "export": 2 },
  "acq-referral":       { "invite-collab": 3 },

  "pricing-visit":      {}
}
```

- [x] **Step 2: Create universal-signal-map.json**

```json
{
  "_doc": "Signals that boost ALL features equally. Applied at UNIVERSAL_MULTIPLIER (0.4x).",
  "credits-low": 3,
  "credits-zero": 5,
  "returning-user": 4,
  "pricing-visit": 3,
  "bought-export": 4,
  "time-15": 3,
  "multi-deck": 3,
  "zero-dismissals": 1,
  "gate-hit": 3,
  "export-attempt": 2,
  "company-domain": 2,
  "tier-1-country": 2,
  "deck-veteran": 3,
  "acq-paid": 2,
  "acq-referral": 3
}
```

- [x] **Step 3: Create mindset-vectors.json**

The new Layer 1: role × audience → per-feature weight vector. Replaces the flat `MINDSET_MAP` from the current simulator.

```json
{
  "_doc": "Layer 1 mindset vectors. Key = 'role|audienceStakes'. Value = per-feature weights (0-5). audienceStakes is one of: high-external, low-external, internal.",

  "Leadership|high-external":   { "unbranded": 4, "analytics": 4, "export": 3, "brand-kit": 3, "ai-models": 2, "hire-team": 2, "gen-speed": 1, "invite-collab": 1, "pres-refresh": 0 },
  "Leadership|low-external":    { "unbranded": 3, "brand-kit": 3, "export": 3, "analytics": 2, "ai-models": 2, "hire-team": 1, "gen-speed": 1, "invite-collab": 1, "pres-refresh": 0 },
  "Leadership|internal":        { "gen-speed": 3, "invite-collab": 3, "pres-refresh": 2, "ai-models": 2, "export": 1, "unbranded": 1, "brand-kit": 1, "analytics": 0, "hire-team": 0 },

  "Sales|high-external":        { "analytics": 4, "unbranded": 4, "export": 3, "brand-kit": 3, "ai-models": 2, "hire-team": 2, "gen-speed": 1, "invite-collab": 1, "pres-refresh": 0 },
  "Sales|low-external":         { "unbranded": 3, "analytics": 3, "export": 3, "brand-kit": 2, "ai-models": 2, "hire-team": 1, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0 },
  "Sales|internal":             { "gen-speed": 2, "ai-models": 2, "invite-collab": 2, "pres-refresh": 2, "export": 1, "unbranded": 1, "brand-kit": 0, "analytics": 0, "hire-team": 0 },

  "Marketing|high-external":    { "brand-kit": 4, "unbranded": 4, "analytics": 3, "export": 3, "ai-models": 2, "hire-team": 1, "gen-speed": 1, "invite-collab": 1, "pres-refresh": 0 },
  "Marketing|low-external":     { "brand-kit": 4, "unbranded": 3, "export": 2, "analytics": 2, "ai-models": 2, "hire-team": 1, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0 },
  "Marketing|internal":         { "brand-kit": 3, "gen-speed": 2, "invite-collab": 2, "ai-models": 2, "pres-refresh": 1, "unbranded": 1, "export": 1, "analytics": 0, "hire-team": 0 },

  "Product|high-external":      { "unbranded": 3, "export": 3, "ai-models": 3, "brand-kit": 2, "analytics": 2, "invite-collab": 2, "hire-team": 1, "gen-speed": 1, "pres-refresh": 0 },
  "Product|low-external":       { "ai-models": 3, "unbranded": 2, "export": 2, "invite-collab": 2, "brand-kit": 1, "gen-speed": 1, "analytics": 1, "hire-team": 0, "pres-refresh": 0 },
  "Product|internal":           { "invite-collab": 4, "gen-speed": 3, "pres-refresh": 3, "ai-models": 2, "export": 1, "unbranded": 0, "brand-kit": 0, "analytics": 0, "hire-team": 0 },

  "Design|high-external":       { "brand-kit": 5, "unbranded": 4, "export": 3, "ai-models": 2, "analytics": 2, "hire-team": 1, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0 },
  "Design|low-external":        { "brand-kit": 4, "unbranded": 4, "export": 3, "ai-models": 2, "analytics": 1, "hire-team": 0, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0 },
  "Design|internal":            { "brand-kit": 3, "invite-collab": 2, "pres-refresh": 2, "ai-models": 2, "gen-speed": 1, "unbranded": 1, "export": 0, "analytics": 0, "hire-team": 0 },

  "Engineering|high-external":  { "ai-models": 3, "export": 3, "unbranded": 2, "invite-collab": 2, "gen-speed": 2, "brand-kit": 1, "analytics": 1, "hire-team": 1, "pres-refresh": 0 },
  "Engineering|low-external":   { "ai-models": 3, "gen-speed": 2, "export": 2, "invite-collab": 2, "unbranded": 1, "brand-kit": 0, "analytics": 0, "hire-team": 0, "pres-refresh": 0 },
  "Engineering|internal":       { "invite-collab": 3, "gen-speed": 3, "ai-models": 2, "pres-refresh": 2, "export": 1, "unbranded": 0, "brand-kit": 0, "analytics": 0, "hire-team": 0 },

  "Data Analytics|high-external": { "analytics": 4, "export": 4, "ai-models": 3, "unbranded": 2, "brand-kit": 1, "invite-collab": 1, "hire-team": 1, "gen-speed": 1, "pres-refresh": 0 },
  "Data Analytics|low-external":  { "analytics": 3, "export": 3, "ai-models": 2, "unbranded": 2, "brand-kit": 1, "gen-speed": 1, "invite-collab": 0, "hire-team": 0, "pres-refresh": 0 },
  "Data Analytics|internal":      { "analytics": 3, "gen-speed": 2, "ai-models": 2, "invite-collab": 2, "pres-refresh": 2, "export": 1, "unbranded": 0, "brand-kit": 0, "hire-team": 0 },

  "Consulting|high-external":   { "unbranded": 3, "brand-kit": 3, "export": 3, "ai-models": 2, "analytics": 2, "hire-team": 2, "invite-collab": 1, "gen-speed": 1, "pres-refresh": 0 },
  "Consulting|low-external":    { "unbranded": 3, "brand-kit": 2, "export": 3, "ai-models": 2, "analytics": 1, "hire-team": 1, "gen-speed": 1, "invite-collab": 1, "pres-refresh": 0 },
  "Consulting|internal":        { "invite-collab": 3, "gen-speed": 2, "pres-refresh": 2, "ai-models": 2, "export": 1, "unbranded": 1, "brand-kit": 0, "analytics": 0, "hire-team": 0 },

  "Operations|high-external":   { "export": 3, "unbranded": 2, "ai-models": 2, "gen-speed": 2, "invite-collab": 2, "brand-kit": 1, "analytics": 1, "hire-team": 1, "pres-refresh": 0 },
  "Operations|low-external":    { "gen-speed": 2, "export": 2, "ai-models": 2, "invite-collab": 2, "unbranded": 1, "brand-kit": 0, "analytics": 0, "hire-team": 0, "pres-refresh": 0 },
  "Operations|internal":        { "gen-speed": 3, "invite-collab": 3, "pres-refresh": 2, "ai-models": 2, "export": 1, "unbranded": 0, "brand-kit": 0, "analytics": 0, "hire-team": 0 },

  "Finance|high-external":      { "analytics": 3, "export": 4, "unbranded": 3, "ai-models": 2, "brand-kit": 2, "gen-speed": 1, "invite-collab": 1, "hire-team": 1, "pres-refresh": 0 },
  "Finance|low-external":       { "export": 3, "analytics": 2, "unbranded": 2, "ai-models": 2, "brand-kit": 1, "gen-speed": 1, "invite-collab": 0, "hire-team": 0, "pres-refresh": 0 },
  "Finance|internal":           { "gen-speed": 2, "ai-models": 2, "invite-collab": 2, "export": 2, "pres-refresh": 2, "analytics": 1, "unbranded": 0, "brand-kit": 0, "hire-team": 0 },

  "Creator|high-external":      { "brand-kit": 4, "unbranded": 4, "export": 3, "ai-models": 3, "analytics": 2, "hire-team": 1, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0 },
  "Creator|low-external":       { "brand-kit": 4, "unbranded": 3, "ai-models": 3, "export": 2, "analytics": 1, "gen-speed": 1, "hire-team": 0, "invite-collab": 0, "pres-refresh": 0 },
  "Creator|internal":           { "brand-kit": 3, "ai-models": 2, "pres-refresh": 2, "gen-speed": 2, "invite-collab": 1, "unbranded": 1, "export": 0, "analytics": 0, "hire-team": 0 },

  "Teacher|high-external":      { "export": 4, "gen-speed": 3, "ai-models": 3, "unbranded": 2, "pres-refresh": 2, "hire-team": 1, "brand-kit": 1, "analytics": 0, "invite-collab": 0 },
  "Teacher|low-external":       { "export": 3, "gen-speed": 3, "ai-models": 2, "pres-refresh": 2, "unbranded": 2, "brand-kit": 1, "hire-team": 0, "analytics": 0, "invite-collab": 0 },
  "Teacher|internal":           { "export": 3, "gen-speed": 3, "pres-refresh": 3, "ai-models": 2, "unbranded": 1, "invite-collab": 1, "brand-kit": 0, "analytics": 0, "hire-team": 0 },

  "Student|high-external":      { "export": 4, "ai-models": 3, "unbranded": 3, "gen-speed": 2, "invite-collab": 2, "brand-kit": 1, "hire-team": 1, "analytics": 0, "pres-refresh": 0 },
  "Student|low-external":       { "export": 3, "ai-models": 2, "gen-speed": 2, "unbranded": 2, "invite-collab": 1, "brand-kit": 0, "hire-team": 0, "analytics": 0, "pres-refresh": 0 },
  "Student|internal":           { "gen-speed": 3, "ai-models": 2, "invite-collab": 2, "export": 1, "pres-refresh": 1, "unbranded": 0, "brand-kit": 0, "analytics": 0, "hire-team": 0 },

  "_fallback":                  { "ai-models": 1, "gen-speed": 1, "export": 1, "unbranded": 1, "brand-kit": 0, "analytics": 0, "invite-collab": 0, "hire-team": 0, "pres-refresh": 0 }
}
```

- [x] **Step 4: Create prompt-synthesis-examples.json**

Carry forward from current simulator's `PROMPT_SYNTHESIS` object, adding `hire-team` scores. Include rich, weak, and urgent prompt categories.

```json
{
  "_doc": "Simulated LLM prompt synthesis output. In production, LLM generates this per user. Scale: 0-5.",

  "Series A pitch for fintech startup":
    { "unbranded": 5, "analytics": 4, "export": 4, "brand-kit": 4, "ai-models": 3, "invite-collab": 3, "gen-speed": 2, "pres-refresh": 1, "hire-team": 1 },
  "Seed round deck for healthtech":
    { "unbranded": 5, "analytics": 4, "export": 4, "brand-kit": 3, "ai-models": 3, "invite-collab": 3, "gen-speed": 2, "pres-refresh": 2, "hire-team": 1 },
  "Product demo for enterprise AI tool":
    { "brand-kit": 4, "unbranded": 4, "ai-models": 4, "analytics": 3, "export": 3, "invite-collab": 2, "gen-speed": 2, "pres-refresh": 1, "hire-team": 1 },

  "Enterprise SaaS proposal for Fortune 500":
    { "analytics": 5, "unbranded": 5, "export": 4, "brand-kit": 4, "ai-models": 3, "invite-collab": 3, "gen-speed": 2, "pres-refresh": 1, "hire-team": 1 },
  "Partnership pitch to retail chain":
    { "unbranded": 4, "analytics": 4, "export": 4, "brand-kit": 3, "ai-models": 3, "invite-collab": 2, "gen-speed": 2, "pres-refresh": 1, "hire-team": 1 },
  "ROI case study for CFO":
    { "ai-models": 4, "analytics": 4, "export": 4, "unbranded": 4, "brand-kit": 2, "invite-collab": 2, "gen-speed": 1, "pres-refresh": 1, "hire-team": 0 },

  "Q1 business review":
    { "pres-refresh": 4, "gen-speed": 4, "invite-collab": 3, "ai-models": 3, "export": 2, "brand-kit": 2, "unbranded": 1, "analytics": 1, "hire-team": 0 },
  "Product roadmap for H2":
    { "invite-collab": 4, "pres-refresh": 3, "gen-speed": 3, "ai-models": 3, "export": 2, "brand-kit": 1, "unbranded": 1, "analytics": 1, "hire-team": 0 },
  "Team restructuring proposal":
    { "ai-models": 4, "invite-collab": 3, "export": 3, "analytics": 2, "gen-speed": 2, "unbranded": 2, "brand-kit": 1, "pres-refresh": 1, "hire-team": 0 },
  "OKR review and planning":
    { "pres-refresh": 4, "invite-collab": 4, "gen-speed": 3, "ai-models": 3, "export": 2, "analytics": 2, "brand-kit": 1, "unbranded": 1, "hire-team": 0 },

  "Design portfolio for senior role":
    { "brand-kit": 5, "unbranded": 5, "export": 4, "ai-models": 3, "analytics": 3, "pres-refresh": 2, "gen-speed": 1, "invite-collab": 1, "hire-team": 1 },
  "Agency credentials deck":
    { "brand-kit": 5, "unbranded": 5, "analytics": 4, "export": 4, "invite-collab": 3, "pres-refresh": 3, "ai-models": 3, "gen-speed": 1, "hire-team": 1 },
  "Brand identity presentation":
    { "brand-kit": 5, "unbranded": 4, "export": 3, "ai-models": 3, "analytics": 2, "invite-collab": 2, "pres-refresh": 2, "gen-speed": 1, "hire-team": 1 },

  "Introduction to machine learning":
    { "export": 4, "ai-models": 4, "pres-refresh": 4, "gen-speed": 3, "unbranded": 2, "invite-collab": 1, "brand-kit": 1, "analytics": 1, "hire-team": 0 },
  "Data visualization workshop":
    { "ai-models": 4, "export": 4, "pres-refresh": 3, "gen-speed": 3, "unbranded": 2, "invite-collab": 2, "brand-kit": 1, "analytics": 1, "hire-team": 0 },
  "Research methodology lecture":
    { "export": 4, "pres-refresh": 4, "ai-models": 3, "gen-speed": 3, "unbranded": 2, "invite-collab": 1, "brand-kit": 1, "analytics": 1, "hire-team": 0 },

  "Final thesis defense":
    { "export": 5, "ai-models": 4, "unbranded": 4, "gen-speed": 3, "invite-collab": 2, "brand-kit": 2, "analytics": 1, "pres-refresh": 1, "hire-team": 2 },
  "Startup pitch for entrepreneurship class":
    { "unbranded": 3, "ai-models": 3, "export": 3, "brand-kit": 3, "invite-collab": 3, "gen-speed": 2, "analytics": 2, "pres-refresh": 1, "hire-team": 1 },
  "Capstone project presentation":
    { "export": 4, "ai-models": 4, "invite-collab": 3, "unbranded": 3, "gen-speed": 3, "brand-kit": 2, "analytics": 1, "pres-refresh": 1, "hire-team": 1 },

  "pitch deck":
    { "unbranded": 2, "export": 2, "ai-models": 1, "brand-kit": 1, "analytics": 1, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0, "hire-team": 0 },
  "startup stuff":
    { "ai-models": 1, "gen-speed": 1, "unbranded": 1, "export": 1, "brand-kit": 0, "analytics": 0, "invite-collab": 0, "pres-refresh": 0, "hire-team": 0 },
  "sales presentation":
    { "unbranded": 2, "export": 2, "analytics": 1, "ai-models": 1, "brand-kit": 1, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0, "hire-team": 0 },
  "deck for client meeting":
    { "unbranded": 2, "export": 2, "brand-kit": 1, "analytics": 1, "ai-models": 1, "gen-speed": 1, "invite-collab": 1, "pres-refresh": 0, "hire-team": 0 },
  "slides for meeting":
    { "gen-speed": 2, "ai-models": 1, "export": 1, "invite-collab": 1, "pres-refresh": 1, "unbranded": 0, "brand-kit": 0, "analytics": 0, "hire-team": 0 },
  "quarterly update slides":
    { "pres-refresh": 3, "gen-speed": 2, "invite-collab": 2, "ai-models": 1, "export": 1, "brand-kit": 1, "unbranded": 0, "analytics": 0, "hire-team": 0 },
  "portfolio presentation":
    { "brand-kit": 2, "unbranded": 2, "export": 2, "ai-models": 1, "analytics": 1, "gen-speed": 1, "invite-collab": 0, "pres-refresh": 0, "hire-team": 0 },
  "make a presentation":
    { "ai-models": 1, "gen-speed": 1, "export": 1, "unbranded": 0, "brand-kit": 0, "analytics": 0, "invite-collab": 0, "pres-refresh": 0, "hire-team": 0 },
  "lecture slides":
    { "export": 2, "pres-refresh": 2, "gen-speed": 1, "ai-models": 1, "unbranded": 1, "invite-collab": 0, "brand-kit": 0, "analytics": 0, "hire-team": 0 },
  "presentation for class":
    { "export": 2, "ai-models": 1, "gen-speed": 1, "unbranded": 1, "invite-collab": 1, "brand-kit": 0, "analytics": 0, "pres-refresh": 0, "hire-team": 0 },
  "help me with a ppt":
    { "ai-models": 1, "gen-speed": 1, "export": 0, "unbranded": 0, "brand-kit": 0, "analytics": 0, "invite-collab": 0, "pres-refresh": 0, "hire-team": 2 },

  "investor meeting tomorrow need a deck":
    { "gen-speed": 5, "ai-models": 5, "export": 5, "unbranded": 4, "analytics": 3, "brand-kit": 2, "invite-collab": 1, "pres-refresh": 0, "hire-team": 5 },
  "urgent proposal for client demo Friday":
    { "gen-speed": 5, "export": 5, "ai-models": 4, "unbranded": 4, "analytics": 3, "brand-kit": 3, "invite-collab": 2, "pres-refresh": 0, "hire-team": 4 },
  "board deck due end of day":
    { "gen-speed": 5, "ai-models": 5, "export": 4, "unbranded": 3, "invite-collab": 3, "brand-kit": 2, "analytics": 2, "pres-refresh": 0, "hire-team": 5 },
  "client pitch deck needed by tonight":
    { "gen-speed": 5, "ai-models": 4, "export": 4, "unbranded": 4, "brand-kit": 4, "analytics": 2, "invite-collab": 1, "pres-refresh": 0, "hire-team": 4 },
  "guest lecture tomorrow on AI ethics":
    { "gen-speed": 4, "export": 4, "ai-models": 4, "pres-refresh": 3, "unbranded": 2, "invite-collab": 1, "brand-kit": 1, "analytics": 0, "hire-team": 2 },
  "group project due tomorrow":
    { "gen-speed": 4, "export": 4, "ai-models": 3, "invite-collab": 4, "unbranded": 2, "brand-kit": 1, "analytics": 0, "pres-refresh": 0, "hire-team": 3 }
}
```

- [x] **Step 5: Create guardrails.json**

```json
{
  "sessionCap": 3,
  "cooldownMs": 60000,
  "threshold": 14,
  "maxScore": 30,
  "universalMultiplier": 0.4,
  "intentFloor": 3,
  "activityPauseMs": 3000
}
```

- [x] **Step 6: Commit config files**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add config/
git commit -m "Add v2 config files: signal maps, mindset vectors, prompt synthesis, guardrails"
```

---

### Task 2: HTML Shell + CSS Design System

The page layout, CSS variables, panel structure, and all visual styling. No JavaScript — just the empty skeleton with placeholder panels.

**Files:**
- Create: `simulator/index.html` (HTML + CSS only, ~350 lines)

- [x] **Step 1: Create the HTML shell with layout**

Three-column layout: left sidebar (user context + prompt analysis), center main area (guardrail bar + score matrix + nudge preview + milestone feed), and right sidebar (actions + signals).

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nudge Simulator v2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Roboto:wght@300;400;500;600;700&family=PT+Mono&display=swap" rel="stylesheet">
</head>
<body>
  <div class="header">
    <h1>Nudge Simulator v2</h1>
    <p>Milestone-driven, per-feature scoring. Each action adds signals that score toward specific Pro features. Highest scorer above threshold fires.</p>
  </div>
  <div class="layout">
    <div class="left-col">
      <div class="panel" id="panel-user">
        <div class="panel-title">User Context</div>
        <div id="user-context"></div>
        <button class="reshuffle-btn" onclick="resetSimulator()">Reshuffle User</button>
      </div>
      <div class="panel" id="panel-prompt">
        <div class="panel-title">Prompt Analysis</div>
        <div id="prompt-analysis"></div>
      </div>
    </div>
    <div class="center-col">
      <div class="panel" id="panel-guardrails">
        <div class="panel-title">Guardrails</div>
        <div class="guardrail-bar" id="guardrail-bar"></div>
      </div>
      <div class="panel" id="panel-matrix">
        <div class="panel-title">Feature Score Matrix</div>
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Direct</th>
              <th>Uni (×0.4)</th>
              <th>Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="matrix-body"></tbody>
        </table>
      </div>
      <div class="panel" id="panel-nudge-preview">
        <div class="panel-title">Nudge Preview</div>
        <div id="nudge-preview"></div>
      </div>
      <div class="panel" id="panel-feed">
        <div class="panel-title">Milestone Feed</div>
        <div id="feed-content"></div>
      </div>
    </div>
    <div class="right-col">
      <div class="panel" id="panel-actions">
        <div class="panel-title">Actions</div>
        <div id="action-grid"></div>
      </div>
      <div class="panel" id="panel-signals">
        <div class="panel-title">Active Signals</div>
        <div id="signal-list"></div>
      </div>
    </div>
  </div>
  <div class="nudge-overlay" id="nudge-overlay">
    <div class="nudge-modal" id="nudge-modal"></div>
  </div>
</body>
</html>
```

- [x] **Step 2: Add the CSS design system**

Carry forward the Paper design system from the current simulator (`:root` variables, panel styles, matrix table, action buttons, nudge card, guardrail bar, signal list, tooltips, modal overlay). Insert as `<style>` block in `<head>`.

Copy the full `<style>` block from the current simulator (`milestone-simulator.html` lines 11-748) as the starting point, then:
- Add styles for the hire-team nudge card variant (different accent color, "Talk to our team" CTA)
- Add a `.nudge-ui.service` variant class with a distinct border/accent (e.g., warm orange instead of purple)
- Ensure the 9th feature row fits the matrix table

- [x] **Step 3: Verify the shell renders**

```bash
open "/Users/tejasdeck/Nudge System Design/simulator/index.html"
```

Expected: Browser shows the two-column layout with empty panels labeled "User Context", "Actions", "Active Signals", "Guardrails", "Feature Score Matrix", "Nudge Preview", "Milestone Feed". No JS errors in console.

- [x] **Step 4: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Add simulator HTML shell with Paper design system CSS"
```

---

### Task 3: Config + Features + Actions (JS Data Layer)

Embed all config data and define the 9 features and ~30 user actions. This is the data layer — no engine logic yet.

**Files:**
- Modify: `simulator/index.html` (add `<script>` block)

- [x] **Step 1: Add the CONFIG object**

At the top of the `<script>` block, embed all config values from the JSON files:

```javascript
// ══════════════════════════════════════════════════════
// CONFIG — All tunable values. Edit here, not in engine logic.
// ══════════════════════════════════════════════════════

const CONFIG = {
  THRESHOLD: 14,
  MAX_SCORE: 30,
  UNIVERSAL_MULTIPLIER: 0.4,
  SESSION_CAP: 3,
  COOLDOWN_MS: 60000,
  INTENT_FLOOR: 3,
  ACTIVITY_PAUSE_MS: 3000,
};
```

- [x] **Step 2: Add FEATURES array**

9 features including hire-team:

```javascript
const FEATURES = [
  { id: 'ai-models', name: 'Better AI Models', icon: '🧠', type: 'pro', verb: 'Upgrade to a better AI model', does: 'uses Standard or Advanced AI models for higher quality slides and smarter content' },
  { id: 'brand-kit', name: 'Brand Kit', icon: '🎨', type: 'pro', verb: 'Set up your Brand Kit', does: 'applies your custom brand colors and fonts across all slides' },
  { id: 'unbranded', name: 'Unbranded Pro Templates', icon: '📐', type: 'pro', verb: 'Use unbranded templates', does: 'gives you professional templates without the Presentations.AI watermark' },
  { id: 'export', name: 'PowerPoint/PDF Export', icon: '📄', type: 'pro', verb: 'Export your deck', does: 'downloads your deck as a PowerPoint or PDF file' },
  { id: 'invite-collab', name: 'Invite Collaborators', icon: '👥', type: 'pro', verb: 'Invite collaborators', does: 'lets others view, comment, and edit your deck in real time' },
  { id: 'analytics', name: 'Viewer Analytics', icon: '📈', type: 'pro', verb: 'Turn on analytics', does: 'tracks who opened your deck, which slides they viewed, and for how long' },
  { id: 'gen-speed', name: 'Generation Speed', icon: '⚡', type: 'pro', verb: 'Upgrade generation speed', does: 'generates your presentations at Medium or Fast speed instead of Slow' },
  { id: 'pres-refresh', name: 'Presentation Refresh', icon: '🔄', type: 'pro', verb: 'Refresh your presentation', does: 'regenerates and updates your presentation with improved content or structure' },
  { id: 'hire-team', name: 'Hire Our Team', icon: '🤝', type: 'service', verb: 'Let us build it for you', does: 'our team creates a polished presentation for you' },
];
```

- [x] **Step 3: Add ACTIONS array**

Carry forward from current simulator, same structure:

```javascript
const ACTIONS = [
  // Editing actions
  { id: 'edit-slide', label: 'Edit a slide', signals: ['manual-edit'], cat: 'edit' },
  { id: 'edit-3x', label: 'Re-edit same slide 3x', signals: ['manual-edit', 're-edit-3x'], cat: 'edit' },
  { id: 'edit-5plus', label: 'Make 5+ edits', signals: ['manual-edit', 'edits-5plus'], cat: 'edit' },
  { id: 'format-edits', label: 'Formatting edits', signals: ['format-edits', 'manual-edit'], cat: 'edit' },
  { id: 'resize-move', label: 'Resize/move elements', signals: ['format-edits', 'manual-edit'], cat: 'edit' },
  { id: 'undo-redo', label: 'Undo/redo repeatedly', signals: ['undo-redo', 'manual-edit'], cat: 'edit' },
  { id: 'change-font', label: 'Change font/style', signals: ['style-change', 'manual-edit'], cat: 'edit' },
  { id: 'delete-slide', label: 'Delete a slide', signals: ['slide-delete', 'manual-edit'], cat: 'edit' },
  // Content actions
  { id: 'add-chart', label: 'Add a chart/graph', signals: ['data-content'], cat: 'content' },
  { id: 'add-image', label: 'Add an image/media', signals: ['media-added'], cat: 'content' },
  { id: 'duplicate-slide', label: 'Duplicate a slide', signals: ['slide-duplicate'], cat: 'content' },
  { id: 'add-slide', label: 'Add a new slide manually', signals: ['manual-slide-add'], cat: 'content' },
  { id: 'reorder-slides', label: 'Reorder slides', signals: ['slide-reorder'], cat: 'content' },
  { id: 'gen-15-slides', label: 'Generate 15+ slides', signals: ['slides-15plus'], cat: 'content' },
  // Navigation & preview
  { id: 'play-slideshow', label: 'Play slideshow', signals: ['slideshow'], cat: 'preview' },
  { id: 'edit-after-preview', label: 'Edit after preview', signals: ['slideshow-then-edit', 'manual-edit'], cat: 'preview' },
  { id: 'idle-30s', label: 'Idle 30+ sec on a slide', signals: ['idle-on-slide'], cat: 'preview' },
  { id: 'change-template', label: 'Change template/layout', signals: ['template-switch'], cat: 'preview' },
  // Sharing & export
  { id: 'click-share', label: 'Click share', signals: ['share-clicked'], cat: 'share' },
  { id: 'copy-link', label: 'Copy deck link', signals: ['link-copied', 'share-clicked'], cat: 'share' },
  { id: 'download-attempt', label: 'Try to download (paywall)', signals: ['export-attempt'], cat: 'share' },
  // Prompt & creation
  { id: 'mention-brand', label: 'Mention brand in prompt', signals: ['brand-mention'], cat: 'prompt' },
  { id: 'mention-team', label: 'Use "we/our/team" in prompt', signals: ['team-language'], cat: 'prompt' },
  { id: 'mention-metrics', label: 'Use data/metrics in prompt', signals: ['data-content'], cat: 'prompt' },
  { id: 'deck-complete', label: 'Complete deck', signals: ['deck-edited'], cat: 'prompt' },
  { id: 'started-blank', label: 'Start from blank', signals: ['started-blank'], cat: 'prompt' },
  // Session & journey
  { id: 'start-new-deck', label: 'Start 2nd deck', signals: ['multi-deck', 'new-deck-session2'], cat: 'session' },
  { id: 'switch-decks', label: 'Switch between decks', signals: ['deck-switch', 'multi-deck'], cat: 'session' },
  { id: 'time-15', label: 'Spend 15+ min', signals: ['time-15'], cat: 'session' },
  { id: 'time-20', label: 'Spend 20+ min', signals: ['time-20', 'time-15'], cat: 'session' },
  { id: 'visit-pricing', label: 'Visit pricing page', signals: ['pricing-visit'], cat: 'session' },
  { id: 'gate-hit', label: 'Click a Pro feature (gate hit)', signals: ['gate-hit'], cat: 'session' },
];
```

- [x] **Step 4: Add signal maps (DIRECT_MAP, UNIVERSAL_MAP, MINDSET_VECTORS, PROMPT_SYNTHESIS)**

Embed the data from the config JSON files as JS objects. These are the scoring tables the engines will read.

Copy `DIRECT_MAP` from `config/direct-signal-map.json` (removing the `_doc` key).
Copy `UNIVERSAL_MAP` from `config/universal-signal-map.json`.
Copy `MINDSET_VECTORS` from `config/mindset-vectors.json` (removing `_doc` and `_fallback`, keeping `_fallback` as a separate `MINDSET_FALLBACK` const).
Copy `PROMPT_SYNTHESIS` from `config/prompt-synthesis-examples.json` (removing `_doc`).

- [x] **Step 5: Add ROLES, AUDIENCES, TOPICS, and user generation data**

Carry forward from current simulator. Same structure — roles map to archetypes, audiences and topics are per-archetype pools.

```javascript
const ROLES = [
  { label: 'Leadership', archetype: 'Founder' },
  { label: 'Sales', archetype: 'Sales' },
  { label: 'Marketing', archetype: 'Sales' },
  { label: 'Product', archetype: 'Corporate' },
  { label: 'Design', archetype: 'Creative' },
  { label: 'Engineering', archetype: 'Corporate' },
  { label: 'Data Analytics', archetype: 'Corporate' },
  { label: 'Consulting', archetype: 'Corporate' },
  { label: 'Operations', archetype: 'Corporate' },
  { label: 'Finance', archetype: 'Corporate' },
  { label: 'Creator', archetype: 'Creative' },
  { label: 'Teacher', archetype: 'Educator' },
  { label: 'Student', archetype: 'Student' },
];
```

Plus `AUDIENCES`, `TOPICS`, `COMPANY_DOMAINS`, `TIER_1`, `TIER_2` — same as current simulator.

- [x] **Step 6: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Add config, features, actions, and signal maps to simulator"
```

---

### Task 4: NudgeState + SignalCollector + ContextProfiler

The state object, user generation, and 3-layer context profiling with the new mindset vectors.

**Files:**
- Modify: `simulator/index.html`

- [x] **Step 1: Add NudgeState object**

```javascript
// ══════════════════════════════════════════════════════
// NUDGE STATE — Central shared state. Engines read/write their slice.
// ══════════════════════════════════════════════════════

let state = {
  user: {},
  activeSignals: new Set(),
  signalLog: [],
  featureScores: {},
  milestonesThisSession: 0,
  featuresShownThisSession: new Set(),
  lastMilestoneTime: 0,
  milestoneLog: [],
};
```

- [x] **Step 2: Add SignalCollector — generateUser() function**

Carry forward from current simulator's `generateUser()`. This is the Signal Collector for the simulator — it generates a random user profile and writes initial signals to `state.activeSignals`.

Key changes from current simulator:
- Use `state.user` and `state.activeSignals` instead of global `user` and `activeSignals`
- Remove the old `MINDSET_MAP` (flat role → mindset)
- Layer 1 now uses `MINDSET_VECTORS` lookup

```javascript
// ══════════════════════════════════════════════════════
// SIGNAL COLLECTOR — Generates user, writes initial signals
// ══════════════════════════════════════════════════════

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateUser() {
  const role = pick(ROLES);
  const arch = role.archetype;
  // ... (same random generation as current simulator for credits, session, etc.)

  state.user = {
    name: pick(['Raj', 'Maria', 'Alex', 'Priya', 'James', 'Sofia', 'Chen', 'Fatima', 'David', 'Anya']),
    role: role.label,
    archetype: arch,
    audience: pick(AUDIENCES[arch]),
    topic: pick(TOPICS[arch]),
    // ... email, country, tier, credits, session, deckHistory, acqChannel
  };

  state.activeSignals = new Set();
  profileUser(); // Layer 1 + 2 + 3
  addStateSignals(); // credits, returning, domain, etc.
}
```

- [x] **Step 3: Add ContextProfiler — profileUser() function**

The new 3-layer profiling with mindset vectors.

```javascript
// ══════════════════════════════════════════════════════
// CONTEXT PROFILER — 3-layer: Mindset + Stakes + Prompt Synthesis
// ══════════════════════════════════════════════════════

function profileUser() {
  const u = state.user;

  // ── LAYER 1: Mindset (role × audience stakes) ──
  const audienceStakes = getAudienceStakes(u.audience);
  const mindsetKey = u.role + '|' + audienceStakes;
  const mindsetVector = MINDSET_VECTORS[mindsetKey] || MINDSET_FALLBACK;
  u.mindsetVector = mindsetVector;
  u.audienceStakes = audienceStakes;

  // Write mindset as a direct signal — the ScoringEngine will read the vector
  DIRECT_MAP['mindset-vector'] = mindsetVector;
  state.activeSignals.add('mindset-vector');

  // ── LAYER 2: Audience Stakes (secondary signal) ──
  const HIGH_STAKES = ['Investors', 'VCs', 'Board members', 'Angel investors', 'Enterprise clients', 'C-suite buyers'];
  const LOW_STAKES = ['Prospects', 'Potential clients', 'Recruiters', 'Art directors'];

  if (HIGH_STAKES.includes(u.audience)) state.activeSignals.add('stakes-high-external');
  else if (LOW_STAKES.includes(u.audience)) state.activeSignals.add('stakes-low-external');
  else state.activeSignals.add('stakes-internal');

  // ── LAYER 3: Prompt Synthesis (simulated LLM output) ──
  const synthesis = PROMPT_SYNTHESIS[u.topic];
  if (synthesis) {
    u.promptSynthesis = synthesis;
    DIRECT_MAP['prompt-synthesis'] = synthesis;
    state.activeSignals.add('prompt-synthesis');
  }
}

function getAudienceStakes(audience) {
  const HIGH = ['Investors', 'VCs', 'Board members', 'Angel investors', 'Enterprise clients', 'C-suite buyers'];
  const LOW = ['Prospects', 'Potential clients', 'Recruiters', 'Art directors'];
  if (HIGH.includes(audience)) return 'high-external';
  if (LOW.includes(audience)) return 'low-external';
  return 'internal';
}

function addStateSignals() {
  const u = state.user;
  if (u.credits < 30) state.activeSignals.add('credits-low');
  if (u.credits === 0) state.activeSignals.add('credits-zero');
  if (u.sessionNum > 1) state.activeSignals.add('returning-user');
  if (u.boughtExport) state.activeSignals.add('bought-export');
  if (u.dismissals === 0) state.activeSignals.add('zero-dismissals');
  if (u.isCompanyDomain) state.activeSignals.add('company-domain');
  if (u.countryTier === 1) state.activeSignals.add('tier-1-country');
  if (u.decksCompleted >= 5) state.activeSignals.add('deck-veteran');
  if (u.decksShared >= 2) state.activeSignals.add('deck-sharer');
  if (u.decksPublished >= 1) state.activeSignals.add('deck-publisher');
  if (u.acqChannel === 'paid') state.activeSignals.add('acq-paid');
  if (u.acqChannel === 'referral') state.activeSignals.add('acq-referral');
}
```

- [x] **Step 4: Verify — open browser, reshuffle user, check console**

```bash
open "/Users/tejasdeck/Nudge System Design/simulator/index.html"
```

Expected: User context panel populates with randomized user. Console shows no errors. Active signals panel shows initial context signals (mindset-vector, stakes-*, prompt-synthesis, plus any state signals).

- [x] **Step 5: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Add NudgeState, SignalCollector, and 3-layer ContextProfiler"
```

---

### Task 5: ScoringEngine + MilestoneSelector + Guardrails

The core decision pipeline: calculate per-feature scores, pick the winner, check guardrails.

**Files:**
- Modify: `simulator/index.html`

- [x] **Step 1: Add ScoringEngine — calculateScores() function**

Same algorithm as current simulator, now reading from `state.activeSignals` and scoring all 9 features.

```javascript
// ══════════════════════════════════════════════════════
// SCORING ENGINE — Per-feature scoring: Direct + Universal × 0.4
// ══════════════════════════════════════════════════════

function calculateScores() {
  const scores = {};

  FEATURES.forEach(f => {
    let direct = 0;
    let universal = 0;
    const directSignals = [];
    const universalSignals = [];

    state.activeSignals.forEach(sig => {
      if (DIRECT_MAP[sig] && DIRECT_MAP[sig][f.id]) {
        direct += DIRECT_MAP[sig][f.id];
        directSignals.push({ name: sig, weight: DIRECT_MAP[sig][f.id] });
      }
      if (UNIVERSAL_MAP[sig]) {
        universal += UNIVERSAL_MAP[sig];
        universalSignals.push({ name: sig, weight: UNIVERSAL_MAP[sig] });
      }
    });

    const universalContrib = universal * CONFIG.UNIVERSAL_MULTIPLIER;
    const total = direct + universalContrib;

    scores[f.id] = {
      direct,
      universalRaw: universal,
      universalContrib: Math.round(universalContrib * 10) / 10,
      total: Math.round(total * 10) / 10,
      directSignals,
      universalSignals,
    };
  });

  state.featureScores = scores;
  return scores;
}
```

- [x] **Step 2: Add Guardrails — checkGuardrails() function**

```javascript
// ══════════════════════════════════════════════════════
// GUARDRAILS — Can block, cannot change selection
// ══════════════════════════════════════════════════════

function checkGuardrails(featureId) {
  const reasons = [];
  let pass = true;

  if (state.milestonesThisSession >= CONFIG.SESSION_CAP) {
    reasons.push('Session cap reached (' + state.milestonesThisSession + '/' + CONFIG.SESSION_CAP + ')');
    pass = false;
  }

  const now = Date.now();
  if (now - state.lastMilestoneTime < CONFIG.COOLDOWN_MS && state.lastMilestoneTime > 0) {
    const remaining = Math.ceil((CONFIG.COOLDOWN_MS - (now - state.lastMilestoneTime)) / 1000);
    reasons.push('Cooldown active (' + remaining + 's)');
    pass = false;
  }

  if (state.featuresShownThisSession.has(featureId)) {
    reasons.push('Feature already shown this session');
    pass = false;
  }

  let intentFloor = 0;
  state.activeSignals.forEach(sig => {
    if (UNIVERSAL_MAP[sig]) intentFloor += UNIVERSAL_MAP[sig];
  });
  if (intentFloor < CONFIG.INTENT_FLOOR) {
    reasons.push('Global intent too low (' + intentFloor + '/' + CONFIG.INTENT_FLOOR + ')');
    pass = false;
  }

  return { pass, reasons };
}
```

- [x] **Step 3: Add MilestoneSelector — evaluateAndFire() + fireMilestone()**

```javascript
// ══════════════════════════════════════════════════════
// MILESTONE SELECTOR — Rank features, pick highest, check guardrails
// ══════════════════════════════════════════════════════

function evaluateAndFire() {
  const scores = calculateScores();

  const ranked = FEATURES
    .map(f => ({ ...f, ...scores[f.id] }))
    .filter(f => f.total >= CONFIG.THRESHOLD)
    .filter(f => !state.featuresShownThisSession.has(f.id))
    .sort((a, b) => b.total - a.total);

  if (ranked.length === 0) return;

  const top = ranked[0];
  const gr = checkGuardrails(top.id);

  if (gr.pass) {
    fireMilestone(top);
  }
}

function fireMilestone(feature) {
  state.milestonesThisSession++;
  state.featuresShownThisSession.add(feature.id);
  state.lastMilestoneTime = Date.now();

  const copy = generateCopy(feature);

  state.milestoneLog.unshift({
    feature: feature,
    copy: copy,
    score: feature.total,
    direct: feature.direct,
    universal: feature.universalContrib,
    directSignals: feature.directSignals,
    universalSignals: feature.universalSignals,
    time: new Date().toLocaleTimeString(),
  });

  renderNudgePreview(feature, copy);
  renderFeed();
  renderMatrix();
  renderGuardrails();
}
```

- [x] **Step 4: Add performAction() — wires action buttons to the pipeline**

```javascript
// ══════════════════════════════════════════════════════
// COORDINATOR — Wires actions to the engine pipeline
// ══════════════════════════════════════════════════════

function performAction(actionId) {
  const action = ACTIONS.find(a => a.id === actionId);
  if (!action) return;

  action.signals.forEach(s => state.activeSignals.add(s));

  const btn = document.getElementById('act-' + actionId);
  if (btn) btn.classList.add('done');

  renderSignals();
  renderMatrix();
  renderGuardrails();
  evaluateAndFire();
}
```

- [x] **Step 5: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Add ScoringEngine, MilestoneSelector, Guardrails, and Coordinator"
```

---

### Task 6: CopyEngine

Personalized copy generation with topic, audience, and country tier modifiers. Updated for 9 features including hire-team.

**Files:**
- Modify: `simulator/index.html`

- [x] **Step 1: Add generateCopy() function**

```javascript
// ══════════════════════════════════════════════════════
// COPY ENGINE — Personalized copy per feature + tier modifier
// ══════════════════════════════════════════════════════

function generateCopy(feature) {
  const u = state.user;
  const topic = u.topic.split(' ').length > 4
    ? u.topic.split(' ').slice(0, 4).join(' ') + '...'
    : u.topic;

  const copies = {
    'ai-models': {
      title: 'Upgrade to a better AI model',
      body: 'Generate higher quality slides for your ' + topic + ' deck. Better AI means sharper content, smarter layouts, and more polished output for ' + u.audience + '.',
    },
    'brand-kit': {
      title: 'Set up your Brand Kit',
      body: 'Apply your brand colors and fonts across every slide. Your ' + topic + ' deck looks like yours, not a template.',
    },
    'unbranded': {
      title: 'Use unbranded Pro templates',
      body: 'Professional templates without the Presentations.AI watermark. ' + u.audience + ' see your content, not our branding.',
    },
    'export': {
      title: 'Export your deck',
      body: 'Download your ' + topic + ' deck as a PowerPoint or PDF. Ready to email to ' + u.audience + ', present offline, or print.',
    },
    'invite-collab': {
      title: 'Invite collaborators',
      body: 'Add people to your ' + topic + ' deck for real-time editing. Get a second opinion before it goes to ' + u.audience + '.',
    },
    'analytics': {
      title: 'Turn on viewer analytics',
      body: 'See who in ' + u.audience + ' opened your ' + topic + ' deck, which slides they viewed, and how long they spent.',
    },
    'gen-speed': {
      title: 'Upgrade generation speed',
      body: 'Generate your ' + topic + ' deck at Medium or Fast speed instead of Slow. Less waiting, faster iteration.',
    },
    'pres-refresh': {
      title: 'Refresh your presentation',
      body: 'Regenerate your ' + topic + ' deck with improved content and structure. A fresh version without starting from scratch.',
    },
    'hire-team': {
      title: 'Let us build it for you',
      body: 'Our team will create a polished ' + topic + ' deck for ' + u.audience + '. You focus on the message, we handle the design.',
    },
  };

  const base = copies[feature.id] || { title: feature.verb, body: feature.does + '.' };

  // Tier modifier
  if (u.countryTier === 2) {
    const valueAppend = {
      'ai-models': ' Save hours of manual editing.',
      'brand-kit': ' Set it once, reuse across every deck — no redesign work.',
      'unbranded': ' Look established without hiring a designer.',
      'export': ' Send it anywhere — no workarounds needed.',
      'invite-collab': ' Get feedback in one place instead of email chains.',
      'analytics': ' Know exactly who engaged — no guessing.',
      'gen-speed': ' Get your deck ready in minutes, not hours.',
      'pres-refresh': ' Update your deck without rebuilding from zero.',
      'hire-team': ' Save days of work for less than you think.',
    };
    if (valueAppend[feature.id]) base.body += valueAppend[feature.id];
  } else {
    const qualityAppend = {
      'ai-models': ' Enterprise-grade AI for polished, boardroom-ready output.',
      'brand-kit': ' Pixel-perfect brand consistency across your entire library.',
      'unbranded': ' Clean, professional finish that matches your brand standards.',
      'export': ' Presentation-ready files that look exactly as designed.',
      'invite-collab': ' Streamlined review workflow for your team.',
      'analytics': ' Detailed engagement insights for data-driven follow-ups.',
      'gen-speed': ' Priority generation so your workflow stays uninterrupted.',
      'pres-refresh': ' AI-powered content refresh with structure preserved.',
      'hire-team': ' White-glove service from our expert presentation team.',
    };
    if (qualityAppend[feature.id]) base.body += qualityAppend[feature.id];
  }

  return base;
}
```

- [x] **Step 2: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Add CopyEngine with tier modifiers and hire-team copy"
```

---

### Task 7: Renderer — All UI Panel Render Functions

All render functions that read from state and update the DOM. Each function renders one panel.

**Files:**
- Modify: `simulator/index.html`

- [x] **Step 1: Add renderUserContext()**

Carry forward from current simulator, reading from `state.user`. Add `Mindset Vector` row showing the role × audience key used.

```javascript
// ══════════════════════════════════════════════════════
// RENDERER — One function per panel
// ══════════════════════════════════════════════════════

function renderUserContext() {
  const u = state.user;
  const rows = [
    ['Name', u.name],
    ['Email', u.name.toLowerCase() + u.email, u.isCompanyDomain],
    ['Country', u.country + ' (Tier ' + u.countryTier + ')', u.countryTier === 1],
    ['Role', u.role],
    ['Archetype', u.archetype, true],
    ['Audience', u.audience],
    ['Audience Stakes', u.audienceStakes, u.audienceStakes === 'high-external'],
    ['Mindset Key', u.role + ' | ' + u.audienceStakes],
    ['Topic', u.topic],
    ['Credits', u.credits + ' / 100'],
    ['Session', u.sessionNum === 1 ? '1st visit' : 'Session ' + u.sessionNum],
    ['Deck history', u.decksCompleted + ' made · ' + u.decksShared + ' shared · ' + u.decksPublished + ' published', u.decksCompleted >= 5],
    ['Acquisition', u.acqChannel === 'paid' ? 'Paid ad' : u.acqChannel === 'referral' ? 'Referral' : 'Organic', u.acqChannel !== 'organic'],
    ['Bought export', u.boughtExport ? 'Yes ($4.99)' : 'No'],
    ['Past dismissals', u.dismissals],
  ];

  document.getElementById('user-context').innerHTML = rows.map(r =>
    '<div class="user-row"><span class="user-label">' + r[0] + '</span><span class="user-value' + (r[2] ? ' highlight' : '') + '">' + r[1] + '</span></div>'
  ).join('');
}
```

- [x] **Step 2: Add renderActions() with hover tooltips**

Carry forward from current simulator. Shows action buttons grouped by category with score impact tooltips on hover.

```javascript
function getActionImpact(action) {
  const featureMap = {};
  const universals = [];
  action.signals.forEach(sig => {
    if (DIRECT_MAP[sig]) {
      Object.entries(DIRECT_MAP[sig]).forEach(([fId, weight]) => {
        featureMap[fId] = (featureMap[fId] || 0) + weight;
      });
    }
    if (UNIVERSAL_MAP[sig]) {
      universals.push({ signal: sig, weight: UNIVERSAL_MAP[sig] });
    }
  });
  const directImpacts = Object.entries(featureMap)
    .map(([fId, weight]) => {
      const f = FEATURES.find(feat => feat.id === fId);
      return { name: f ? f.name : fId, icon: f ? f.icon : '', weight };
    })
    .sort((a, b) => b.weight - a.weight);
  return { directImpacts, universals };
}

function buildTooltipHTML(action) {
  // Same as current simulator — builds hover tooltip showing score impact per feature
  const impact = getActionImpact(action);
  let html = '<div class="action-tooltip"><div class="tooltip-title">Score Impact</div>';
  if (impact.directImpacts.length === 0 && impact.universals.length === 0) {
    return html + '<div class="tooltip-empty">No scoring impact</div></div>';
  }
  impact.directImpacts.forEach(d => {
    const cls = d.weight >= 5 ? 'high' : d.weight >= 3 ? 'med' : 'low';
    html += '<div class="tooltip-row"><span class="tooltip-feature">' + d.icon + ' ' + d.name + '</span><span class="tooltip-weight ' + cls + '">+' + d.weight + '</span></div>';
  });
  if (impact.universals.length > 0) {
    html += '<div class="tooltip-divider"></div><div class="tooltip-uni-label">Universal (x0.4 all features)</div>';
    impact.universals.forEach(u => {
      html += '<div class="tooltip-row"><span class="tooltip-feature" style="color:var(--text-muted)">' + u.signal.replace(/-/g, ' ') + '</span><span class="tooltip-weight low">+' + u.weight + '</span></div>';
    });
  }
  return html + '</div>';
}

function renderActions() {
  const grid = document.getElementById('action-grid');
  const catLabels = { edit: 'Editing', content: 'Content', preview: 'Navigation & Preview', share: 'Sharing & Export', prompt: 'Prompt & Creation', session: 'Session & Journey' };
  const cats = ['edit', 'content', 'preview', 'share', 'prompt', 'session'];
  grid.innerHTML = cats.map(cat => {
    const actions = ACTIONS.filter(a => a.cat === cat);
    return '<div class="action-cat-label">' + catLabels[cat] + '</div><div class="action-cat-grid">' +
      actions.map(a => '<button class="action-btn" id="act-' + a.id + '" onclick="performAction(\'' + a.id + '\')">' + a.label + buildTooltipHTML(a) + '</button>').join('') +
      '</div>';
  }).join('');
}
```

- [x] **Step 3: Add renderSignals()**

Shows all currently active signals with type labels (DIR / UNI / D+U).

```javascript
function renderSignals() {
  // Same structure as current simulator — filters activeSignals, shows type badge
  // Use the same ALL_SIGNALS reference list from the current simulator's renderSignals()
  // Add 'mindset-vector' to the list with label 'Mindset Vector (L1)' and type 'direct'
  // ... (full implementation carried from current simulator, reading state.activeSignals)
}
```

- [x] **Step 4: Add renderMatrix()**

Score matrix table with bar visualization, threshold line, NEXT/QUEUED/SHOWN badges. Now shows 9 rows (including hire-team).

Carry forward from current simulator's `renderMatrix()`, reading from `state.featureScores`. The hire-team row gets a distinct badge color (warm orange) when it's the top scorer.

- [x] **Step 5: Add renderGuardrails()**

Guardrail status bar showing milestones fired, cooldown, features shown, intent floor.

```javascript
function renderGuardrails() {
  const now = Date.now();
  const cooldownLeft = state.lastMilestoneTime > 0 ? Math.max(0, Math.ceil((CONFIG.COOLDOWN_MS - (now - state.lastMilestoneTime)) / 1000)) : 0;
  let intentFloor = 0;
  state.activeSignals.forEach(sig => { if (UNIVERSAL_MAP[sig]) intentFloor += UNIVERSAL_MAP[sig]; });

  document.getElementById('guardrail-bar').innerHTML = [
    { label: 'Milestones fired', value: state.milestonesThisSession + '/' + CONFIG.SESSION_CAP, status: state.milestonesThisSession >= CONFIG.SESSION_CAP ? 'blocked' : state.milestonesThisSession >= 2 ? 'warn' : 'ok' },
    { label: 'Cooldown', value: cooldownLeft > 0 ? cooldownLeft + 's' : 'Ready', status: cooldownLeft > 0 ? 'warn' : 'ok' },
    { label: 'Features shown', value: state.featuresShownThisSession.size + '/' + FEATURES.length, status: 'ok' },
    { label: 'Intent floor', value: intentFloor >= CONFIG.INTENT_FLOOR ? 'Pass (' + intentFloor + ')' : 'Low (' + intentFloor + ')', status: intentFloor >= CONFIG.INTENT_FLOOR ? 'ok' : 'blocked' },
  ].map(g => '<div class="gr-item"><span>' + g.label + '</span><span class="gr-value ' + g.status + '">' + g.value + '</span></div>').join('');
}
```

- [x] **Step 6: Add renderNudgePreview() + renderFeed() + nudge modal**

Two render targets for a milestone fire:
1. Inline preview below the matrix (nudge card + "why this fired" breakdown)
2. Modal overlay (same content, dismissable)

The nudge card has two variants:
- Pro features: purple accent, "Upgrade to Pro" CTA, PRO badge
- hire-team: warm orange accent, "Talk to our team" CTA, SERVICE badge

```javascript
function buildNudgeCardHTML(feature, copy) {
  const isService = feature.type === 'service';
  const tagLabel = isService ? 'Service' : 'Milestone';
  const ctaLabel = isService ? 'Talk to our team' : 'Upgrade to Pro';
  const badgeLabel = isService ? 'SERVICE' : 'PRO';
  const cssClass = isService ? 'nudge-ui service' : 'nudge-ui';

  return '<div class="' + cssClass + '">' +
    '<div class="nudge-ui-header">' +
      '<div class="nudge-ui-icon">' + feature.icon + '</div>' +
      '<div class="nudge-ui-tag">' + tagLabel + '</div>' +
    '</div>' +
    '<div class="nudge-ui-body">' +
      '<div class="nudge-ui-title">' + copy.title + '</div>' +
      '<div class="nudge-ui-desc">' + copy.body + '</div>' +
      '<div class="nudge-ui-actions">' +
        '<button class="nudge-ui-cta' + (isService ? ' service' : '') + '">' + ctaLabel + '</button>' +
        '<button class="nudge-ui-dismiss">Not now</button>' +
      '</div>' +
    '</div>' +
    '<div class="nudge-ui-footer">' +
      '<span class="nudge-ui-pro-badge' + (isService ? ' service' : '') + '">' + badgeLabel + '</span>' +
      '<span class="nudge-ui-feature-label">' + feature.name + '</span>' +
    '</div>' +
  '</div>';
}
```

Plus `renderNudgePreview()`, `renderFeed()`, `closeNudgeModal()`, `skipCooldown()` — carry forward from current simulator, updated to use `state.*` and the two-variant card.

- [x] **Step 7: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Add Renderer: all UI panel render functions with hire-team variant"
```

---

### Task 8: Init + Reset + Final Wiring

Bootstrap the simulator, wire up reset, and verify the complete flow.

**Files:**
- Modify: `simulator/index.html`

- [x] **Step 1: Add resetSimulator() and init**

```javascript
// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════

function resetSimulator() {
  state = {
    user: {},
    activeSignals: new Set(),
    signalLog: [],
    featureScores: {},
    milestonesThisSession: 0,
    featuresShownThisSession: new Set(),
    lastMilestoneTime: 0,
    milestoneLog: [],
  };

  generateUser();
  renderUserContext();
  renderActions();
  renderSignals();
  calculateScores();
  renderMatrix();
  renderGuardrails();
  renderFeed();
  document.getElementById('nudge-preview').innerHTML =
    '<div class="nudge-preview-empty">No milestone triggered yet. Perform actions to build up feature scores.</div>';
}

resetSimulator();
```

- [x] **Step 2: Verify full flow in browser**

```bash
open "/Users/tejasdeck/Nudge System Design/simulator/index.html"
```

Test sequence:
1. Page loads → user context shows randomized profile with Mindset Key and Audience Stakes
2. Click "Reshuffle User" → new profile, scores reset, signals clear
3. Click "Edit a slide" → manual-edit signal appears, ai-models and pres-refresh scores bump
4. Click "Re-edit same slide 3x" → hire-team score should rise noticeably
5. Click "Click share" → unbranded and analytics scores jump, if above threshold a milestone fires
6. Milestone fires → modal appears with nudge card + "why this fired" breakdown
7. Dismiss → modal closes, feature shown as "SHOWN" in matrix
8. Fire 3 milestones → guardrail bar shows "3/3 BLOCKED"
9. Reshuffle → verify hire-team appears as top scorer for an urgent + struggling user profile

- [x] **Step 3: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Wire init, reset, and complete simulator v2 flow"
```

---

### Task 9: Final Polish + Commit

Clean up any visual issues, verify the Paper design system looks right, add the skip-cooldown button for testing.

**Files:**
- Modify: `simulator/index.html`

- [x] **Step 1: Visual polish pass in browser**

Open the simulator and check:
- Score matrix fits 9 rows without overflow
- Hire-team row has distinct warm orange accent when it's the NEXT pick
- Nudge card variants look distinct (Pro = purple, Service = orange)
- Mindset Key and Audience Stakes rows in user context are readable
- Action tooltips show hire-team weight where applicable
- Mobile: not required, but ensure it doesn't break catastrophically on narrow screens

Fix any CSS issues found.

- [x] **Step 2: Add skip-cooldown button to nudge modal**

```javascript
function skipCooldown() {
  state.lastMilestoneTime = 0;
  closeNudgeModal();
  renderGuardrails();
}
```

Add a "Skip Cooldown" button in the modal controls (same as current simulator).

- [x] **Step 3: Final commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add simulator/index.html
git commit -m "Polish simulator v2: visual fixes, skip-cooldown, hire-team styling"
```

- [x] **Step 4: Verify git log**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git log --oneline
```

Expected commits on `rewrite/v2`:
```
Polish simulator v2: visual fixes, skip-cooldown, hire-team styling
Wire init, reset, and complete simulator v2 flow
Add Renderer: all UI panel render functions with hire-team variant
Add CopyEngine with tier modifiers and hire-team copy
Add ScoringEngine, MilestoneSelector, Guardrails, and Coordinator
Add NudgeState, SignalCollector, and 3-layer ContextProfiler
Add config, features, actions, and signal maps to simulator
Add simulator HTML shell with Paper design system CSS
Add v2 config files: signal maps, mindset vectors, prompt synthesis, guardrails
```

---

### Task 10: Post-Plan Additions (Implemented)

Features added after the original plan was executed.

- [x] **Step 1: Prompt Analysis panel**

Added `renderPromptAnalysis()` function showing the raw user prompt with a shuffle button (&#x21BB;) and LLM signal extraction bar chart (0-5 per feature). Includes explanation of how prompt-synthesis feeds into scoring.

- [x] **Step 2: Prompt shuffler**

Added `shufflePrompt()` function that cycles through all available prompts in PROMPT_SYNTHESIS for the same user profile. Re-runs Layer 3 profiling, rebuilds signals from active actions, and re-renders all affected panels.

- [x] **Step 3: Activity pause guardrail**

Added `isUserActive` to state, activity pause check in `checkGuardrails()`, clickable toggle in guardrail bar, and `toggleUserActive()` function. When user is "active," nudges are held until they go idle.

- [x] **Step 4: Feedback loop wiring**

Wired nudge card buttons: "Not now" calls `handleDismiss()` (increments dismissals, removes zero-dismissals signal), "Upgrade to Pro" calls `handleUpgrade()` (sets isProUser, kills all nudges), "Talk to our team" routes to service booking flow.

- [x] **Step 5: Pro user kill switch guardrail**

Added Pro user check as the first guardrail in `checkGuardrails()` — returns immediately with blocked if `state.user.isProUser === true`. Added "Pro user" indicator to guardrail status bar.

- [x] **Step 6: 3-column layout**

Changed grid from `320px 1fr` to `300px 1fr 300px`. Moved Actions and Active Signals to a new right column. Added `.center-col` CSS class. Increased max-width to 1600px.

- [x] **Step 7: Per-engine spec files**

Created specs/01-nudge-state.md through specs/08-renderer.md — detailed specs for each engine matching the actual implementation.

- [x] **Step 8: Missing config files**

Created config/context-layers.json (audience stakes classification) and config/copy-templates.json (externalized copy templates with tier modifiers).

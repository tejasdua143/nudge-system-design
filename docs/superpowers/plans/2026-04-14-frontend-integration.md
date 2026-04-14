# Frontend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the nudge scoring engine into the presentations.ai editor so real user actions fire nudges during the creation flow.

**Architecture:** Clone the frontend repo into `frontend/`, port all simulator engine logic as TypeScript modules, create a `useNudgeEngine` React hook, build modal + debug panel components, and wire editor interactions to nudge signals.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, React hooks, PAIDS design system tokens, Framer Motion

**Spec:** `docs/superpowers/specs/2026-04-14-frontend-integration-design.md`

---

## File Structure

```
frontend/                              ← cloned from nudge-system-design-base
  src/
    lib/
      nudge-types.ts                   ← TypeScript interfaces
      nudge-config.ts                  ← all config data ported from simulator
      nudge-profiler.ts                ← context profiling + keyword synthesis
      nudge-engine.ts                  ← scoring, guardrails, copy, milestone selector
    hooks/
      use-nudge-engine.ts              ← React hook wrapping the engine
    components/
      nudge-modal.tsx                  ← full overlay nudge card
      nudge-debug-panel.tsx            ← collapsible floating debug panel
    app/create/
      editor/
        page.tsx                       ← modified: wire signals + render modal/debug
```

---

### Task 1: Clone Frontend Repo

- [ ] **Step 1: Clone the repo into frontend/**

```bash
cd "/Users/tejasdeck/Nudge System Design"
gh repo clone tejasdua143/nudge-system-design-base frontend
```

- [ ] **Step 2: Remove the cloned repo's .git (we track it in our repo)**

```bash
rm -rf frontend/.git
```

- [ ] **Step 3: Install dependencies**

```bash
cd frontend && npm install
```

- [ ] **Step 4: Verify it runs**

```bash
cd "/Users/tejasdeck/Nudge System Design/frontend" && npm run dev
```

Open http://localhost:3000/create in browser. Verify the create flow works (name → email → role → prompt → editor).

- [ ] **Step 5: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/
git commit -m "Clone nudge-system-design-base into frontend/"
```

---

### Task 2: Nudge Types (`nudge-types.ts`)

All TypeScript interfaces for the nudge engine.

**Files:**
- Create: `frontend/src/lib/nudge-types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// frontend/src/lib/nudge-types.ts

export interface Feature {
  id: string;
  name: string;
  icon: string;
  type: 'pro' | 'service';
  verb: string;
  does: string;
}

export interface SignalEntry {
  name: string;
  weight: number;
}

export interface FeatureScore {
  direct: number;
  universalRaw: number;
  universalContrib: number;
  total: number;
  directSignals: SignalEntry[];
  universalSignals: SignalEntry[];
}

export interface NudgeCopy {
  title: string;
  body: string;
}

export interface Milestone {
  feature: Feature & FeatureScore;
  copy: NudgeCopy;
  score: number;
  direct: number;
  universal: number;
  directSignals: SignalEntry[];
  universalSignals: SignalEntry[];
  time: string;
}

export interface NudgeUser {
  name: string;
  role: string;
  archetype: string;
  audience: string;
  topic: string;
  email: string;
  isCompanyDomain: boolean;
  country: string;
  countryTier: 1 | 2;
  credits: number;
  sessionNum: number;
  boughtExport: boolean;
  dismissals: number;
  decksCompleted: number;
  decksShared: number;
  decksPublished: number;
  acqChannel: 'organic' | 'paid' | 'referral';
  // Derived
  mindsetVector?: Record<string, number>;
  audienceStakes?: 'high-external' | 'low-external' | 'internal';
  promptSynthesis?: Record<string, number>;
  isProUser?: boolean;
}

export interface NudgeState {
  user: NudgeUser;
  activeSignals: Set<string>;
  featureScores: Record<string, FeatureScore>;
  milestonesThisSession: number;
  featuresShownThisSession: Set<string>;
  lastMilestoneTime: number;
  milestoneLog: Milestone[];
  isUserActive: boolean;
}

export interface GuardrailResult {
  pass: boolean;
  reasons: string[];
}

export interface NudgeConfig {
  THRESHOLD: number;
  MAX_SCORE: number;
  UNIVERSAL_MULTIPLIER: number;
  SESSION_CAP: number;
  COOLDOWN_MS: number;
  INTENT_FLOOR: number;
  ACTIVITY_PAUSE_MS: number;
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/lib/nudge-types.ts
git commit -m "Add nudge TypeScript types"
```

---

### Task 3: Nudge Config (`nudge-config.ts`)

Port all config data from the simulator: features, signal maps, mindset vectors, prompt synthesis, roles, audiences, topics, countries.

**Files:**
- Create: `frontend/src/lib/nudge-config.ts`

- [ ] **Step 1: Create the config file**

Port from `simulator/index.html` sections 1-5 (CONFIG, FEATURES, DIRECT_MAP, UNIVERSAL_MAP, MINDSET_VECTORS, PROMPT_SYNTHESIS, ROLES, AUDIENCES, TOPICS, COMPANY_DOMAINS, TIER_1, TIER_2, MINDSET_FALLBACK).

All values must be identical to the simulator. Use typed exports:

```typescript
// frontend/src/lib/nudge-config.ts
import type { Feature, NudgeConfig } from './nudge-types';

export const CONFIG: NudgeConfig = {
  THRESHOLD: 14,
  MAX_SCORE: 30,
  UNIVERSAL_MULTIPLIER: 0.4,
  SESSION_CAP: 3,
  COOLDOWN_MS: 60000,
  INTENT_FLOOR: 3,
  ACTIVITY_PAUSE_MS: 3000,
};

export const FEATURES: Feature[] = [
  { id: 'ai-models', name: 'Better AI Models', icon: '🧠', type: 'pro', verb: 'Upgrade to a better AI model', does: 'uses Standard or Advanced AI models for higher quality slides and smarter content' },
  // ... all 9 features exactly as simulator
];

export const DIRECT_MAP: Record<string, Record<string, number>> = {
  'manual-edit': { 'ai-models': 1, 'pres-refresh': 1 },
  // ... all entries exactly as simulator, including doc-uploaded and doc-long
};

export const UNIVERSAL_MAP: Record<string, number> = {
  'credits-low': 3,
  // ... all entries exactly as simulator, including doc-uploaded
};

export const MINDSET_VECTORS: Record<string, Record<string, number>> = {
  'Leadership|high-external': { /* ... */ },
  // ... all 39 entries + fallback
};
export const MINDSET_FALLBACK: Record<string, number> = { /* ... */ };

export const PROMPT_SYNTHESIS: Record<string, Record<string, number>> = {
  'Series A pitch for fintech startup': { /* ... */ },
  // ... all 30+ entries
};

export const ROLES = [
  { label: 'Leadership', archetype: 'Founder' },
  // ... all 13 roles
] as const;

export const AUDIENCES: Record<string, string[]> = {
  Founder: ['Investors', 'VCs', 'Board members', 'Angel investors'],
  // ... all 6 archetype pools
};

export const TOPICS: Record<string, string[]> = {
  Founder: ['Series A pitch for fintech startup', /* ... */],
  // ... all 6 archetype pools
};

export const COMPANY_DOMAINS: Record<string, string[]> = { /* ... */ };
export const TIER_1 = ['US', 'UK', 'Canada', /* ... */];
export const TIER_2 = ['India', 'Brazil', 'Indonesia', /* ... */];
```

Copy every value from the simulator. Do not abbreviate or summarize — every signal map entry, every mindset vector, every prompt synthesis example must be included.

- [ ] **Step 2: Verify no missing entries**

Count entries in the simulator and compare with the TypeScript file:
- FEATURES: 9
- DIRECT_MAP: ~42 entries (including doc-uploaded, doc-long)
- UNIVERSAL_MAP: ~16 entries (including doc-uploaded)
- MINDSET_VECTORS: 39 + 1 fallback
- PROMPT_SYNTHESIS: 30+ entries
- ROLES: 13

- [ ] **Step 3: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/lib/nudge-config.ts
git commit -m "Add nudge config: signal maps, features, mindset vectors, prompt synthesis"
```

---

### Task 4: Nudge Profiler (`nudge-profiler.ts`)

Context profiling: mindset vectors, audience stakes, prompt synthesis, keyword fallback, state signals.

**Files:**
- Create: `frontend/src/lib/nudge-profiler.ts`

- [ ] **Step 1: Create the profiler**

Port from simulator sections 7-8 (SignalCollector + ContextProfiler). These are pure functions — no React, no DOM.

```typescript
// frontend/src/lib/nudge-profiler.ts
import type { NudgeUser } from './nudge-types';
import {
  ROLES, AUDIENCES, TOPICS, COMPANY_DOMAINS, TIER_1, TIER_2,
  MINDSET_VECTORS, MINDSET_FALLBACK, PROMPT_SYNTHESIS, DIRECT_MAP,
} from './nudge-config';

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a fully randomized user (for direct navigation fallback) */
export function generateRandomUser(): NudgeUser {
  // Same logic as simulator's generateUser()
  // Pick role → archetype → audience/topic, randomize credits/session/country/etc.
  // Return complete NudgeUser object
  const role = pick(ROLES);
  const arch = role.archetype;
  const credits = pick([100, 85, 72, 55, 42, 30, 18, 8, 0]);
  const sessionNum = pick([1, 1, 1, 2, 2, 3]);
  const boughtExport = pick([false, false, false, false, true]);
  const dismissals = pick([0, 0, 0, 1, 2]);

  const DECK_HISTORY: Record<number, { completed: number; shared: number; published: number }> = {
    1: { completed: pick([1, 1, 1, 2]), shared: pick([0, 0, 0, 1]), published: pick([0, 0, 0]) },
    2: { completed: pick([2, 3, 4, 5]), shared: pick([0, 1, 1, 2]), published: pick([0, 0, 1]) },
    3: { completed: pick([3, 5, 7, 10]), shared: pick([1, 2, 3, 4]), published: pick([0, 1, 2, 3]) },
  };
  const deckHistory = DECK_HISTORY[Math.min(sessionNum, 3)];

  const email = pick(COMPANY_DOMAINS[arch] || COMPANY_DOMAINS['Corporate']);
  const isCompanyDomain = !/@gmail\.com|@outlook\.com|@yahoo\.com|@hotmail\.com/.test(email);

  const allCountries = [...TIER_1, ...TIER_2, ...TIER_2];
  const country = pick(allCountries);
  const countryTier = TIER_1.includes(country) ? 1 as const : 2 as const;

  const acqChannel = pick(['organic', 'organic', 'organic', 'organic', 'organic',
    'paid', 'paid', 'paid', 'referral', 'referral'] as const);

  return {
    name: pick(['Raj', 'Maria', 'Alex', 'Priya', 'James', 'Sofia', 'Chen', 'Fatima', 'David', 'Anya']),
    role: role.label,
    archetype: arch,
    audience: pick(AUDIENCES[arch] || AUDIENCES['Corporate']),
    topic: pick(TOPICS[arch] || TOPICS['Corporate']),
    email,
    isCompanyDomain,
    country,
    countryTier,
    credits,
    sessionNum,
    boughtExport,
    dismissals,
    decksCompleted: deckHistory.completed,
    decksShared: deckHistory.shared,
    decksPublished: deckHistory.published,
    acqChannel,
  };
}

/** Hydrate a user from create flow data + randomized fields */
export function hydrateUser(flowData: { name?: string; email?: string; role?: string; prompt?: string; fileName?: string | null }): NudgeUser {
  const base = generateRandomUser();

  if (flowData.name) base.name = flowData.name;
  if (flowData.email) {
    base.email = flowData.email;
    base.isCompanyDomain = !/@gmail\.com|@outlook\.com|@yahoo\.com|@hotmail\.com/.test(flowData.email);
  }
  if (flowData.role) {
    base.role = flowData.role;
    const roleEntry = ROLES.find(r => r.label === flowData.role);
    if (roleEntry) {
      base.archetype = roleEntry.archetype;
      base.audience = pick(AUDIENCES[roleEntry.archetype] || AUDIENCES['Corporate']);
    }
  }
  if (flowData.prompt) base.topic = flowData.prompt;

  return base;
}

/** Get audience stakes classification */
export function getAudienceStakes(audience: string): 'high-external' | 'low-external' | 'internal' {
  const HIGH = ['Investors', 'VCs', 'Board members', 'Angel investors', 'Enterprise clients', 'C-suite buyers'];
  const LOW = ['Prospects', 'Potential clients', 'Recruiters', 'Art directors'];
  if (HIGH.includes(audience)) return 'high-external';
  if (LOW.includes(audience)) return 'low-external';
  return 'internal';
}

/** Run 3-layer context profiling and return initial signals */
export function profileUser(user: NudgeUser): Set<string> {
  const signals = new Set<string>();

  // Layer 1: Mindset vector
  const audienceStakes = getAudienceStakes(user.audience);
  const mindsetKey = user.role + '|' + audienceStakes;
  const mindsetVector = MINDSET_VECTORS[mindsetKey] || MINDSET_FALLBACK;
  user.mindsetVector = mindsetVector;
  user.audienceStakes = audienceStakes;
  DIRECT_MAP['mindset-vector'] = mindsetVector;
  signals.add('mindset-vector');

  // Layer 2: Audience stakes
  const HIGH_STAKES = ['Investors', 'VCs', 'Board members', 'Angel investors', 'Enterprise clients', 'C-suite buyers'];
  const LOW_STAKES = ['Prospects', 'Potential clients', 'Recruiters', 'Art directors'];
  if (HIGH_STAKES.includes(user.audience)) signals.add('stakes-high-external');
  else if (LOW_STAKES.includes(user.audience)) signals.add('stakes-low-external');
  else signals.add('stakes-internal');

  // Layer 3: Prompt synthesis (lookup or keyword fallback)
  let synthesis = PROMPT_SYNTHESIS[user.topic];
  if (!synthesis) synthesis = synthesizeFromKeywords(user.topic);
  user.promptSynthesis = synthesis;
  DIRECT_MAP['prompt-synthesis'] = synthesis;
  signals.add('prompt-synthesis');

  // State signals
  if (user.credits < 30) signals.add('credits-low');
  if (user.credits === 0) signals.add('credits-zero');
  if (user.sessionNum > 1) signals.add('returning-user');
  if (user.boughtExport) signals.add('bought-export');
  if (user.dismissals === 0) signals.add('zero-dismissals');
  if (user.isCompanyDomain) signals.add('company-domain');
  if (user.countryTier === 1) signals.add('tier-1-country');
  if (user.decksCompleted >= 5) signals.add('deck-veteran');
  if (user.decksShared >= 2) signals.add('deck-sharer');
  if (user.decksPublished >= 1) signals.add('deck-publisher');
  if (user.acqChannel === 'paid') signals.add('acq-paid');
  if (user.acqChannel === 'referral') signals.add('acq-referral');

  return signals;
}

/** Keyword-based prompt synthesis fallback */
export function synthesizeFromKeywords(prompt: string): Record<string, number> {
  const p = (prompt || '').toLowerCase();
  const scores: Record<string, number> = {
    'ai-models': 0, 'brand-kit': 0, 'unbranded': 0, 'export': 0,
    'invite-collab': 0, 'analytics': 0, 'gen-speed': 0, 'pres-refresh': 0, 'hire-team': 0,
  };

  const keywords: Record<string, string[]> = {
    'ai-models':     ['quality', 'better', 'improve', 'upgrade', 'ai', 'smart', 'polished', 'professional'],
    'brand-kit':     ['brand', 'logo', 'colors', 'identity', 'company', 'style', 'design system'],
    'unbranded':     ['professional', 'clean', 'client', 'enterprise', 'investor', 'watermark', 'template'],
    'export':        ['download', 'pdf', 'powerpoint', 'pptx', 'email', 'offline', 'print', 'send'],
    'invite-collab': ['team', 'collaborate', 'together', 'review', 'feedback', 'we ', 'our '],
    'analytics':     ['track', 'analytics', 'metrics', 'engagement', 'data', 'measure', 'roi'],
    'gen-speed':     ['fast', 'quick', 'speed', 'slow', 'waiting', 'generate'],
    'pres-refresh':  ['update', 'refresh', 'redo', 'restructure', 'revise', 'iterate', 'new version'],
    'hire-team':     ['help me', 'struggle', "can't", 'complicated', 'too hard', 'do it for', 'build it for'],
  };

  const urgencyWords = ['tomorrow', 'tonight', 'urgent', 'asap', 'deadline', 'due', 'rush', 'needed by', 'end of day'];
  const hasUrgency = urgencyWords.some(w => p.includes(w));

  for (const [featureId, kws] of Object.entries(keywords)) {
    let matches = 0;
    kws.forEach(kw => { if (p.includes(kw)) matches++; });
    scores[featureId] = Math.min(matches * 2, 5);
  }

  if (hasUrgency) {
    scores['export'] = Math.min(scores['export'] + 3, 5);
    scores['hire-team'] = Math.min(scores['hire-team'] + 3, 5);
    scores['ai-models'] = Math.min(scores['ai-models'] + 2, 5);
  }

  return scores;
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/lib/nudge-profiler.ts
git commit -m "Add nudge profiler: context layers, keyword synthesis, user hydration"
```

---

### Task 5: Nudge Engine (`nudge-engine.ts`)

Pure scoring functions: calculateScores, checkGuardrails, evaluateAndFire, generateCopy.

**Files:**
- Create: `frontend/src/lib/nudge-engine.ts`

- [ ] **Step 1: Create the engine**

Port from simulator sections 9-12 (ScoringEngine, MilestoneSelector, Guardrails, CopyEngine). Pure functions — no React, no DOM, no timers.

```typescript
// frontend/src/lib/nudge-engine.ts
import type { NudgeState, FeatureScore, GuardrailResult, Milestone, NudgeCopy } from './nudge-types';
import { CONFIG, FEATURES, DIRECT_MAP, UNIVERSAL_MAP } from './nudge-config';

/** Calculate per-feature scores from active signals */
export function calculateScores(activeSignals: Set<string>): Record<string, FeatureScore> {
  const scores: Record<string, FeatureScore> = {};

  for (const f of FEATURES) {
    let direct = 0;
    let universal = 0;
    const directSignals: { name: string; weight: number }[] = [];
    const universalSignals: { name: string; weight: number }[] = [];

    activeSignals.forEach(sig => {
      if (DIRECT_MAP[sig]?.[f.id]) {
        direct += DIRECT_MAP[sig][f.id];
        directSignals.push({ name: sig, weight: DIRECT_MAP[sig][f.id] });
      }
      if (UNIVERSAL_MAP[sig]) {
        universal += UNIVERSAL_MAP[sig];
        universalSignals.push({ name: sig, weight: UNIVERSAL_MAP[sig] });
      }
    });

    const universalContrib = universal * CONFIG.UNIVERSAL_MULTIPLIER;
    const total = Math.max(0, direct + universalContrib);

    scores[f.id] = {
      direct,
      universalRaw: universal,
      universalContrib: Math.round(universalContrib * 10) / 10,
      total: Math.round(total * 10) / 10,
      directSignals,
      universalSignals,
    };
  }

  return scores;
}

/** Check guardrails — returns pass/fail with reasons */
export function checkGuardrails(state: NudgeState, featureId: string): GuardrailResult {
  const reasons: string[] = [];
  let pass = true;

  if (state.user.isProUser) {
    return { pass: false, reasons: ['User is Pro — all nudges disabled'] };
  }

  if (state.milestonesThisSession >= CONFIG.SESSION_CAP) {
    reasons.push(`Session cap reached (${state.milestonesThisSession}/${CONFIG.SESSION_CAP})`);
    pass = false;
  }

  const now = Date.now();
  if (now - state.lastMilestoneTime < CONFIG.COOLDOWN_MS && state.lastMilestoneTime > 0) {
    const remaining = Math.ceil((CONFIG.COOLDOWN_MS - (now - state.lastMilestoneTime)) / 1000);
    reasons.push(`Cooldown active (${remaining}s)`);
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
    reasons.push(`Global intent too low (${intentFloor} < ${CONFIG.INTENT_FLOOR})`);
    pass = false;
  }

  if (state.isUserActive) {
    reasons.push(`User is active (needs ${CONFIG.ACTIVITY_PAUSE_MS / 1000}s idle)`);
    pass = false;
  }

  return { pass, reasons };
}

/** Evaluate scores and return milestone to fire (or null) */
export function evaluateAndFire(state: NudgeState): Milestone | null {
  const scores = calculateScores(state.activeSignals);
  state.featureScores = scores;

  const ranked = FEATURES
    .map(f => ({ ...f, ...scores[f.id] }))
    .filter(f => f.total >= CONFIG.THRESHOLD)
    .filter(f => !state.featuresShownThisSession.has(f.id))
    .sort((a, b) => b.total - a.total);

  if (ranked.length === 0) return null;

  const top = ranked[0];
  const gr = checkGuardrails(state, top.id);
  if (!gr.pass) return null;

  // Fire milestone
  state.milestonesThisSession++;
  state.featuresShownThisSession.add(top.id);
  state.lastMilestoneTime = Date.now();

  const copy = generateCopy(top, state.user);

  const milestone: Milestone = {
    feature: top,
    copy,
    score: top.total,
    direct: top.direct,
    universal: top.universalContrib,
    directSignals: top.directSignals,
    universalSignals: top.universalSignals,
    time: new Date().toLocaleTimeString(),
  };

  state.milestoneLog.unshift(milestone);
  return milestone;
}

/** Generate personalized nudge copy */
export function generateCopy(feature: { id: string }, user: { topic: string; audience: string; countryTier: number }): NudgeCopy {
  const topic = user.topic.split(' ').length > 4
    ? user.topic.split(' ').slice(0, 4).join(' ') + '...'
    : user.topic;

  const copies: Record<string, NudgeCopy> = {
    'ai-models': { title: 'Upgrade to a better AI model', body: `Generate higher quality slides for your ${topic} deck. Better AI means sharper content, smarter layouts, and more polished output for ${user.audience}.` },
    'brand-kit': { title: 'Set up your Brand Kit', body: `Apply your brand colors and fonts across every slide. Your ${topic} deck looks like yours, not a template.` },
    'unbranded': { title: 'Use unbranded Pro templates', body: `Professional templates without the Presentations.AI watermark. ${user.audience} see your content, not our branding.` },
    'export': { title: 'Export your deck', body: `Download your ${topic} deck as a PowerPoint or PDF. Ready to email to ${user.audience}, present offline, or print.` },
    'invite-collab': { title: 'Invite collaborators', body: `Add people to your ${topic} deck for real-time editing. Get a second opinion before it goes to ${user.audience}.` },
    'analytics': { title: 'Turn on viewer analytics', body: `See who in ${user.audience} opened your ${topic} deck, which slides they viewed, and how long they spent.` },
    'gen-speed': { title: 'Upgrade generation speed', body: `Generate your ${topic} deck at Medium or Fast speed instead of Slow. Less waiting, faster iteration.` },
    'pres-refresh': { title: 'Refresh your presentation', body: `Regenerate your ${topic} deck with improved content and structure. A fresh version without starting from scratch.` },
    'hire-team': { title: 'Let us build it for you', body: `Our team will create a polished ${topic} deck for ${user.audience}. You focus on the message, we handle the design.` },
  };

  const base = copies[feature.id] || { title: 'Upgrade', body: 'Unlock this feature.' };

  if (user.countryTier === 2) {
    const append: Record<string, string> = {
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
    if (append[feature.id]) base.body += append[feature.id];
  } else {
    const append: Record<string, string> = {
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
    if (append[feature.id]) base.body += append[feature.id];
  }

  return base;
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/lib/nudge-engine.ts
git commit -m "Add nudge engine: scoring, guardrails, milestone selector, copy engine"
```

---

### Task 6: React Hook (`use-nudge-engine.ts`)

The React hook that wraps the pure engine with state management, timers, and signal firing.

**Files:**
- Create: `frontend/src/hooks/use-nudge-engine.ts`

- [ ] **Step 1: Create the hook**

```typescript
// frontend/src/hooks/use-nudge-engine.ts
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { NudgeState, Milestone } from '@/lib/nudge-types';
import { CONFIG } from '@/lib/nudge-config';
import { hydrateUser, generateRandomUser, profileUser } from '@/lib/nudge-profiler';
import { calculateScores, evaluateAndFire } from '@/lib/nudge-engine';

interface UseNudgeEngineOptions {
  userContext?: {
    name?: string;
    email?: string;
    role?: string;
    prompt?: string;
    fileName?: string | null;
  };
}

export function useNudgeEngine(options: UseNudgeEngineOptions = {}) {
  const [state, setState] = useState<NudgeState>(() => {
    const user = options.userContext && (options.userContext.name || options.userContext.email)
      ? hydrateUser(options.userContext)
      : generateRandomUser();

    const signals = profileUser(user);

    // Add doc-uploaded if file was uploaded
    if (options.userContext?.fileName) {
      signals.add('doc-uploaded');
    }

    const featureScores = calculateScores(signals);

    return {
      user,
      activeSignals: signals,
      featureScores,
      milestonesThisSession: 0,
      featuresShownThisSession: new Set(),
      lastMilestoneTime: 0,
      milestoneLog: [],
      isUserActive: false,
    };
  });

  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Time-based signals
  const mountTimeRef = useRef(Date.now());
  const time15FiredRef = useRef(false);
  const time20FiredRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - mountTimeRef.current;
      if (elapsed >= 15 * 60 * 1000 && !time15FiredRef.current) {
        time15FiredRef.current = true;
        fireSignal('time-15');
      }
      if (elapsed >= 20 * 60 * 1000 && !time20FiredRef.current) {
        time20FiredRef.current = true;
        fireSignal('time-20');
      }
    }, 30000); // check every 30s
    return () => clearInterval(interval);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, []);

  const fireSignal = useCallback((signal: string) => {
    setState(prev => {
      const next = { ...prev, activeSignals: new Set(prev.activeSignals) };
      next.activeSignals.add(signal);
      next.isUserActive = true;
      next.featureScores = calculateScores(next.activeSignals);
      return next;
    });

    // Debounce activity pause
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    activityTimerRef.current = setTimeout(() => {
      setState(prev => {
        const next = { ...prev, isUserActive: false };
        // Don't fire if modal is already showing
        if (activeMilestone) return next;
        const milestone = evaluateAndFire(next);
        if (milestone) {
          setActiveMilestone(milestone);
          // Start auto-dismiss timer
          if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
          autoDismissTimerRef.current = setTimeout(() => {
            setActiveMilestone(null);
          }, 10000);
        }
        return { ...next, featureScores: calculateScores(next.activeSignals) };
      });
    }, CONFIG.ACTIVITY_PAUSE_MS);
  }, [activeMilestone]);

  const dismissNudge = useCallback(() => {
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    setActiveMilestone(null);
    setState(prev => {
      const next = { ...prev, activeSignals: new Set(prev.activeSignals) };
      next.user = { ...next.user, dismissals: next.user.dismissals + 1 };
      next.activeSignals.delete('zero-dismissals');
      next.featureScores = calculateScores(next.activeSignals);
      return next;
    });
  }, []);

  const upgradeNudge = useCallback(() => {
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    setActiveMilestone(null);
    setState(prev => ({
      ...prev,
      user: { ...prev.user, isProUser: true },
    }));
  }, []);

  return {
    fireSignal,
    state,
    activeMilestone,
    dismissNudge,
    upgradeNudge,
  };
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/hooks/use-nudge-engine.ts
git commit -m "Add useNudgeEngine React hook with activity pause and auto-dismiss"
```

---

### Task 7: Nudge Modal (`nudge-modal.tsx`)

Full-screen overlay nudge card using PAIDS design tokens.

**Files:**
- Create: `frontend/src/components/nudge-modal.tsx`

- [ ] **Step 1: Create the modal component**

```typescript
// frontend/src/components/nudge-modal.tsx
'use client';

import { motion, AnimatePresence } from 'motion/react';
import type { Milestone } from '@/lib/nudge-types';

interface NudgeModalProps {
  milestone: Milestone | null;
  onDismiss: () => void;
  onUpgrade: () => void;
}

export function NudgeModal({ milestone, onDismiss, onUpgrade }: NudgeModalProps) {
  if (!milestone) return null;

  const isService = milestone.feature.type === 'service';
  const tagLabel = isService ? 'Service' : 'Milestone';
  const ctaLabel = isService ? 'Talk to our team' : 'Upgrade to Pro';
  const badgeLabel = isService ? 'SERVICE' : 'PRO';

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          style={{ zIndex: 'var(--z-modal)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="w-full max-w-md rounded-[var(--radius-xl)] bg-bg-primary shadow-elevation-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[length:var(--text-xl)]">{milestone.feature.icon}</span>
                <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-wide text-text-tertiary">
                  {tagLabel}
                </span>
              </div>
              <span className={`rounded-[var(--radius-sm)] px-2 py-0.5 text-[length:var(--text-2xs)] font-bold uppercase tracking-wider ${
                isService
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
              }`}>
                {badgeLabel}
              </span>
            </div>

            {/* Body */}
            <div className="px-6 pb-5">
              <h3 className="text-[length:var(--text-lg)] font-semibold leading-[var(--leading-heading)] text-text-primary mb-2">
                {milestone.copy.title}
              </h3>
              <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary mb-6">
                {milestone.copy.body}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={onUpgrade}
                  className={`flex-1 rounded-[var(--radius-md)] px-4 py-2.5 text-[length:var(--text-base)] font-semibold text-white transition-colors ${
                    isService
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-bg-brand hover:bg-bg-brand-hover'
                  }`}
                >
                  {ctaLabel}
                </button>
                <button
                  onClick={onDismiss}
                  className="rounded-[var(--radius-md)] px-4 py-2.5 text-[length:var(--text-base)] font-medium text-text-secondary transition-colors hover:bg-bg-secondary"
                >
                  Not now
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 border-t border-border-tertiary px-6 py-3">
              <span className={`text-[length:var(--text-2xs)] font-bold uppercase tracking-wider ${
                isService ? 'text-orange-600 dark:text-orange-400' : 'text-purple-600 dark:text-purple-400'
              }`}>
                {badgeLabel}
              </span>
              <span className="text-[length:var(--text-xs)] text-text-tertiary">
                {milestone.feature.name}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/components/nudge-modal.tsx
git commit -m "Add NudgeModal component with Pro/Service variants"
```

---

### Task 8: Debug Panel (`nudge-debug-panel.tsx`)

Collapsible floating panel showing engine state.

**Files:**
- Create: `frontend/src/components/nudge-debug-panel.tsx`

- [ ] **Step 1: Create the debug panel**

Build a floating collapsible panel (bottom-left) that shows: user context, active signals (with DIR/UNI/D+U badges), feature scores (9-row table with bars), guardrails status, and milestone log.

Use PAIDS tokens for styling. The panel should:
- Start collapsed (just a small "Debug" button)
- Expand to ~400px wide, max-height 80vh with scroll
- Use monospace font for scores
- Stay below the nudge modal z-index (use `--z-overlay` not `--z-modal`)

The component takes `state: NudgeState` as prop and renders all sections.

Content mirrors the simulator panels but styled with PAIDS tokens.

- [ ] **Step 2: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/components/nudge-debug-panel.tsx
git commit -m "Add NudgeDebugPanel with scores, signals, guardrails, milestone log"
```

---

### Task 9: Wire Signals into Editor

Modify the editor page to import the hook, wire actions, and render modal + debug panel.

**Files:**
- Modify: `frontend/src/app/create/editor/page.tsx`

- [ ] **Step 1: Import nudge components and hook**

At the top of the editor page, add:

```typescript
import { useNudgeEngine } from '@/hooks/use-nudge-engine';
import { useCreateFlow } from '../create-flow-context';
import { NudgeModal } from '@/components/nudge-modal';
import { NudgeDebugPanel } from '@/components/nudge-debug-panel';
```

- [ ] **Step 2: Initialize the hook in the editor component**

Inside `NewEditorPage()`, after existing state declarations:

```typescript
// Nudge engine
const { data: flowData } = useCreateFlow();
const {
  fireSignal,
  state: nudgeState,
  activeMilestone,
  dismissNudge,
  upgradeNudge,
} = useNudgeEngine({
  userContext: {
    name: flowData.name,
    email: flowData.email,
    role: flowData.role,
    prompt: flowData.prompt,
    fileName: flowData.fileName,
  },
});

// Edit tracking counters
const editCountPerSlide = useRef(new Map<number, number>());
const totalEditsRef = useRef(0);
const hasPlayedSlideshowRef = useRef(false);
```

- [ ] **Step 3: Wire slide editing signals**

When a user clicks on a slide content area, fire editing signals. Find the slide click handler (the `<div>` with the slide content) and add:

```typescript
// Inside the slide render, on the content div onClick:
onClick={() => {
  // Existing logic (set active slide, etc.)
  // ...

  // Fire nudge signals
  fireSignal('manual-edit');
  totalEditsRef.current++;
  if (totalEditsRef.current >= 5) fireSignal('edits-5plus');

  const slideEdits = editCountPerSlide.current.get(slide.id) || 0;
  editCountPerSlide.current.set(slide.id, slideEdits + 1);
  if (slideEdits + 1 >= 3) fireSignal('re-edit-3x');

  if (hasPlayedSlideshowRef.current) fireSignal('slideshow-then-edit');
}}
```

- [ ] **Step 4: Wire toolbar/button signals**

Find the existing editor buttons and add `fireSignal` calls:

- **Insert dropdown items** (chart, image, media, text, etc.):
  - Chart/diagram/table → `fireSignal('data-content')`
  - Media/image → `fireSignal('media-added')`

- **Filmstrip actions**:
  - New slide "+" → `fireSignal('manual-slide-add')`
  - Duplicate → `fireSignal('slide-duplicate')`
  - Delete → `fireSignal('slide-delete'); fireSignal('manual-edit')`
  - Drag reorder → `fireSignal('slide-reorder')`

- **Top bar buttons**:
  - Undo/redo → `fireSignal('undo-redo'); fireSignal('manual-edit')`
  - Share → `fireSignal('share-clicked')`
  - Present → `fireSignal('slideshow'); hasPlayedSlideshowRef.current = true`
  - Export/download → `fireSignal('export-attempt')`

- **Theme panel** → `fireSignal('template-switch')`
- **Font/style changes** → `fireSignal('style-change'); fireSignal('manual-edit')`

- [ ] **Step 5: Add slide count signal**

After the slide generation animation completes, if slides.length >= 15:

```typescript
// After generation completes:
if (slides.length >= 15) fireSignal('slides-15plus');
```

- [ ] **Step 6: Add idle-on-slide detection**

```typescript
// Track idle time on active slide
const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  idleTimerRef.current = setTimeout(() => {
    fireSignal('idle-on-slide');
  }, 30000);
  return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
}, [activeSlide]);
```

- [ ] **Step 7: Render modal and debug panel**

At the end of the editor JSX, before the closing `</div>`:

```tsx
{/* Nudge Modal */}
<NudgeModal
  milestone={activeMilestone}
  onDismiss={dismissNudge}
  onUpgrade={upgradeNudge}
/>

{/* Debug Panel */}
<NudgeDebugPanel state={nudgeState} />
```

- [ ] **Step 8: Commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add frontend/src/app/create/editor/page.tsx
git commit -m "Wire nudge signals to editor actions, add modal + debug panel"
```

---

### Task 10: Test Full Flow

- [ ] **Step 1: Start the dev server**

```bash
cd "/Users/tejasdeck/Nudge System Design/frontend" && npm run dev
```

- [ ] **Step 2: Test the create flow**

Open http://localhost:3000/create
1. Enter name, email, role → Continue
2. Enter a prompt (e.g., "investor pitch for Series A") → optionally upload a file → Generate
3. Verify editor loads

- [ ] **Step 3: Test nudge firing**

In the editor:
1. Open the debug panel (bottom-left)
2. Click on slides (edits) — watch manual-edit signal appear and ai-models/pres-refresh scores rise
3. Click multiple times on the same slide — watch re-edit-3x fire
4. Click the share button — watch share-clicked, unbranded/analytics scores jump
5. Wait 3s after last action — if a score crossed 14 with guardrails passing, the modal should appear
6. Click "Not now" — modal closes, dismissals increment in debug panel
7. Repeat actions to fire more milestones — verify session cap at 3

- [ ] **Step 4: Test edge cases**

1. Navigate directly to http://localhost:3000/create/editor — verify randomized user loads
2. Fire 3 milestones → verify 4th is blocked
3. Click "Upgrade to Pro" → verify all nudges stop
4. Check debug panel shows accurate state throughout

- [ ] **Step 5: Final commit**

```bash
cd "/Users/tejasdeck/Nudge System Design"
git add -A
git commit -m "Complete frontend integration: nudge engine wired to editor"
```

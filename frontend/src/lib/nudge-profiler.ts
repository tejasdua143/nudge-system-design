import type { NudgeUser } from './nudge-types';
import { ROLES, AUDIENCES, TOPICS, COMPANY_DOMAINS, TIER_1, TIER_2, MINDSET_VECTORS, MINDSET_FALLBACK, PROMPT_SYNTHESIS, DIRECT_MAP } from './nudge-config';

// ══════════════════════════════════════════════════════════════════════════════
// Feature IDs (used by synthesizeFromKeywords to seed scores)
// ══════════════════════════════════════════════════════════════════════════════

const FEATURE_IDS = [
  'ai-models', 'brand-kit', 'unbranded', 'export',
  'invite-collab', 'analytics', 'gen-speed', 'pres-refresh', 'hire-team',
];

// ══════════════════════════════════════════════════════════════════════════════
// Utility
// ══════════════════════════════════════════════════════════════════════════════

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ══════════════════════════════════════════════════════════════════════════════
// generateRandomUser — fully randomized user (ported from generateUser())
// ══════════════════════════════════════════════════════════════════════════════

export function generateRandomUser(): NudgeUser {
  const role = pick(ROLES);
  const arch = role.archetype;
  const credits = pick([100, 85, 72, 55, 42, 30, 18, 8, 0] as const);
  const sessionNum = pick([1, 1, 1, 2, 2, 3] as const);
  const boughtExport = pick([false, false, false, false, true] as const);
  const dismissals = pick([0, 0, 0, 1, 2] as const);

  // Deck history — correlate with session number
  const DECK_HISTORY: Record<number, { completed: number; shared: number; published: number }> = {
    1: { completed: pick([1, 1, 1, 2] as const), shared: pick([0, 0, 0, 1] as const), published: pick([0, 0, 0] as const) },
    2: { completed: pick([2, 3, 4, 5] as const), shared: pick([0, 1, 1, 2] as const), published: pick([0, 0, 1] as const) },
    3: { completed: pick([3, 5, 7, 10] as const), shared: pick([1, 2, 3, 4] as const), published: pick([0, 1, 2, 3] as const) },
  };
  const deckHistory = DECK_HISTORY[Math.min(sessionNum, 3)];

  // Company domain
  const email = pick(COMPANY_DOMAINS[arch] || COMPANY_DOMAINS['Corporate']);
  const isCompanyDomain = !/@gmail\.com|@outlook\.com|@yahoo\.com|@hotmail\.com/.test(email);

  // Country / Tier
  const allCountries = [...TIER_1, ...TIER_2, ...TIER_2];
  const country = pick(allCountries);
  const countryTier: 1 | 2 = TIER_1.includes(country) ? 1 : 2;

  // Acquisition channel
  const acqChannel = pick([
    'organic', 'organic', 'organic', 'organic', 'organic',
    'paid', 'paid', 'paid',
    'referral', 'referral',
  ] as const);

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

// ══════════════════════════════════════════════════════════════════════════════
// hydrateUser — create user from create-flow data, randomize missing fields
// ══════════════════════════════════════════════════════════════════════════════

export function hydrateUser(flowData: {
  name?: string;
  email?: string;
  role?: string;
  prompt?: string;
  fileName?: string | null;
}): NudgeUser {
  // Start with a fully random base user
  const user = generateRandomUser();

  // Override name if provided
  if (flowData.name) {
    user.name = flowData.name;
  }

  // Override email if provided, re-derive isCompanyDomain
  if (flowData.email) {
    user.email = flowData.email;
    user.isCompanyDomain = !/@gmail\.com|@outlook\.com|@yahoo\.com|@hotmail\.com/.test(flowData.email);
  }

  // Override role if provided, re-derive archetype and audience
  if (flowData.role) {
    const matchedRole = ROLES.find((r) => r.label === flowData.role);
    if (matchedRole) {
      user.role = matchedRole.label;
      user.archetype = matchedRole.archetype;
      user.audience = pick(AUDIENCES[matchedRole.archetype] || AUDIENCES['Corporate']);
    } else {
      user.role = flowData.role;
    }
  }

  // Override topic from prompt if provided
  if (flowData.prompt) {
    user.topic = flowData.prompt;
  }

  return user;
}

// ══════════════════════════════════════════════════════════════════════════════
// getAudienceStakes — classify audience into stakes tier
// ══════════════════════════════════════════════════════════════════════════════

export function getAudienceStakes(audience: string): 'high-external' | 'low-external' | 'internal' {
  const HIGH = ['Investors', 'VCs', 'Board members', 'Angel investors', 'Enterprise clients', 'C-suite buyers'];
  const LOW = ['Prospects', 'Potential clients', 'Recruiters', 'Art directors'];
  if (HIGH.includes(audience)) return 'high-external';
  if (LOW.includes(audience)) return 'low-external';
  return 'internal';
}

// ══════════════════════════════════════════════════════════════════════════════
// profileUser — 3-layer context profiling + state signals, returns initial signals
// ══════════════════════════════════════════════════════════════════════════════

export function profileUser(user: NudgeUser): Set<string> {
  const signals = new Set<string>();

  // ── LAYER 1: Mindset (role x audience stakes) ──
  const audienceStakes = getAudienceStakes(user.audience);
  const mindsetKey = user.role + '|' + audienceStakes;
  const mindsetVector = MINDSET_VECTORS[mindsetKey] || MINDSET_FALLBACK;
  user.mindsetVector = mindsetVector;
  user.audienceStakes = audienceStakes;

  // Write mindset as a direct signal
  DIRECT_MAP['mindset-vector'] = mindsetVector;
  signals.add('mindset-vector');

  // ── LAYER 2: Audience Stakes ──
  const HIGH_STAKES = ['Investors', 'VCs', 'Board members', 'Angel investors', 'Enterprise clients', 'C-suite buyers'];
  const LOW_STAKES = ['Prospects', 'Potential clients', 'Recruiters', 'Art directors'];
  if (HIGH_STAKES.includes(user.audience)) signals.add('stakes-high-external');
  else if (LOW_STAKES.includes(user.audience)) signals.add('stakes-low-external');
  else signals.add('stakes-internal');

  // ── LAYER 3: Prompt Synthesis ──
  let synthesis = PROMPT_SYNTHESIS[user.topic];
  if (!synthesis) {
    // Keyword-based fallback for prompts not in the lookup table
    synthesis = synthesizeFromKeywords(user.topic);
  }
  user.promptSynthesis = synthesis;
  DIRECT_MAP['prompt-synthesis'] = synthesis;
  signals.add('prompt-synthesis');

  // ── State signals (ported from addStateSignals) ──
  if (user.credits < 30) signals.add('credits-low');
  if (user.credits === 0) signals.add('credits-zero');
  if (user.sessionNum > 1) signals.add('returning-user');
  if (user.boughtExport) signals.add('bought-export');
  if (user.dismissals === 0) signals.add('zero-dismissals');
  if (user.isCompanyDomain) signals.add('company-domain');
  if (user.countryTier === 1) signals.add('tier-1-country');

  // Deck history signals
  if (user.decksCompleted >= 5) signals.add('deck-veteran');
  if (user.decksShared >= 2) signals.add('deck-sharer');
  if (user.decksPublished >= 1) signals.add('deck-publisher');

  // Acquisition channel signals
  if (user.acqChannel === 'paid') signals.add('acq-paid');
  if (user.acqChannel === 'referral') signals.add('acq-referral');

  return signals;
}

// ══════════════════════════════════════════════════════════════════════════════
// synthesizeFromKeywords — keyword-based prompt synthesis fallback
// ══════════════════════════════════════════════════════════════════════════════

export function synthesizeFromKeywords(prompt: string): Record<string, number> {
  const p = (prompt || '').toLowerCase();
  const scores: Record<string, number> = {};
  FEATURE_IDS.forEach((id) => { scores[id] = 0; });

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

  // Urgency boosters
  const urgencyWords = ['tomorrow', 'tonight', 'urgent', 'asap', 'deadline', 'due', 'rush', 'needed by', 'end of day'];
  const hasUrgency = urgencyWords.some((w) => p.indexOf(w) !== -1);

  Object.keys(keywords).forEach((featureId) => {
    let matches = 0;
    keywords[featureId].forEach((kw) => {
      if (p.indexOf(kw) !== -1) matches++;
    });
    scores[featureId] = Math.min(matches * 2, 5);
  });

  // Urgency boosts export, hire-team, ai-models (not gen-speed — speed isn't about urgency)
  if (hasUrgency) {
    scores['export'] = Math.min(scores['export'] + 3, 5);
    scores['hire-team'] = Math.min(scores['hire-team'] + 3, 5);
    scores['ai-models'] = Math.min(scores['ai-models'] + 2, 5);
  }

  return scores;
}

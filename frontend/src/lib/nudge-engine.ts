import type { NudgeState, FeatureScore, GuardrailResult, Milestone, NudgeCopy } from './nudge-types';
import { CONFIG, FEATURES, DIRECT_MAP, UNIVERSAL_MAP } from './nudge-config';

// ══════════════════════════════════════════════════════════════════════════════
// ScoringEngine — calculateScores()
// ══════════════════════════════════════════════════════════════════════════════

export function calculateScores(
  activeSignals: Set<string>
): Record<string, FeatureScore> {
  const scores: Record<string, FeatureScore> = {};

  FEATURES.forEach((f) => {
    let direct = 0;
    let universal = 0;
    const directSignals: { name: string; weight: number }[] = [];
    const universalSignals: { name: string; weight: number }[] = [];

    activeSignals.forEach((sig) => {
      // Direct
      if (DIRECT_MAP[sig] && DIRECT_MAP[sig][f.id]) {
        direct += DIRECT_MAP[sig][f.id];
        directSignals.push({ name: sig, weight: DIRECT_MAP[sig][f.id] });
      }
      // Universal
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
  });

  return scores;
}

// ══════════════════════════════════════════════════════════════════════════════
// Guardrails — checkGuardrails()
// ══════════════════════════════════════════════════════════════════════════════

export function checkGuardrails(
  state: NudgeState,
  featureId: string
): GuardrailResult {
  const reasons: string[] = [];
  let pass = true;

  // Pro user kill switch
  if (state.user.isProUser) {
    reasons.push('User is Pro — all nudges disabled');
    pass = false;
    return { pass, reasons };
  }

  // Session cap
  if (state.milestonesThisSession >= CONFIG.SESSION_CAP) {
    reasons.push(
      'Session cap reached (' +
        state.milestonesThisSession +
        '/' +
        CONFIG.SESSION_CAP +
        ')'
    );
    pass = false;
  }

  // Cooldown
  const now = Date.now();
  if (
    now - state.lastMilestoneTime < CONFIG.COOLDOWN_MS &&
    state.lastMilestoneTime > 0
  ) {
    const remaining = Math.ceil(
      (CONFIG.COOLDOWN_MS - (now - state.lastMilestoneTime)) / 1000
    );
    reasons.push('Cooldown active (' + remaining + 's)');
    pass = false;
  }

  // Feature already shown
  if (state.featuresShownThisSession.has(featureId)) {
    reasons.push('Feature already shown this session');
    pass = false;
  }

  // Intent floor — sum of universal signals
  let intentFloor = 0;
  state.activeSignals.forEach((sig) => {
    if (UNIVERSAL_MAP[sig]) intentFloor += UNIVERSAL_MAP[sig];
  });
  if (intentFloor < CONFIG.INTENT_FLOOR) {
    reasons.push(
      'Global intent too low (' + intentFloor + ' < ' + CONFIG.INTENT_FLOOR + ')'
    );
    pass = false;
  }

  // Activity pause — user must be idle before nudge fires
  if (state.isUserActive) {
    reasons.push(
      'User is active (needs ' + CONFIG.ACTIVITY_PAUSE_MS / 1000 + 's idle)'
    );
    pass = false;
  }

  return { pass, reasons };
}

// ══════════════════════════════════════════════════════════════════════════════
// CopyEngine — generateCopy()
// ══════════════════════════════════════════════════════════════════════════════

export function generateCopy(
  feature: { id: string },
  user: { topic: string; audience: string; countryTier: number }
): NudgeCopy {
  const topic =
    user.topic.split(' ').length > 4
      ? user.topic.split(' ').slice(0, 4).join(' ') + '...'
      : user.topic;

  const copies: Record<string, NudgeCopy> = {
    'ai-models': {
      title: 'Upgrade to a better AI model',
      body:
        'Generate higher quality slides for your ' +
        topic +
        ' deck. Better AI means sharper content, smarter layouts, and more polished output for ' +
        user.audience +
        '.',
    },
    'brand-kit': {
      title: 'Set up your Brand Kit',
      body:
        'Apply your brand colors and fonts across every slide. Your ' +
        topic +
        ' deck looks like yours, not a template.',
    },
    'unbranded': {
      title: 'Use unbranded Pro templates',
      body:
        'Professional templates without the Presentations.AI watermark. ' +
        user.audience +
        ' see your content, not our branding.',
    },
    'export': {
      title: 'Export your deck',
      body:
        'Download your ' +
        topic +
        ' deck as a PowerPoint or PDF. Ready to email to ' +
        user.audience +
        ', present offline, or print.',
    },
    'invite-collab': {
      title: 'Invite collaborators',
      body:
        'Add people to your ' +
        topic +
        ' deck for real-time editing. Get a second opinion before it goes to ' +
        user.audience +
        '.',
    },
    'analytics': {
      title: 'Turn on viewer analytics',
      body:
        'See who in ' +
        user.audience +
        ' opened your ' +
        topic +
        ' deck, which slides they viewed, and how long they spent.',
    },
    'gen-speed': {
      title: 'Upgrade generation speed',
      body:
        'Generate your ' +
        topic +
        ' deck at Medium or Fast speed instead of Slow. Less waiting, faster iteration.',
    },
    'pres-refresh': {
      title: 'Refresh your presentation',
      body:
        'Regenerate your ' +
        topic +
        ' deck with improved content and structure. A fresh version without starting from scratch.',
    },
    'hire-team': {
      title: 'Let us build it for you',
      body:
        'Our team will create a polished ' +
        topic +
        ' deck for ' +
        user.audience +
        '. You focus on the message, we handle the design.',
    },
  };

  const base = copies[feature.id] || { title: feature.id, body: '' };

  // Tier modifiers
  if (user.countryTier === 2) {
    // Tier 2: value-focused append
    const valueAppend: Record<string, string> = {
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
    if (valueAppend[feature.id]) base.body = base.body + valueAppend[feature.id];
  } else {
    // Tier 1: quality-focused append
    const qualityAppend: Record<string, string> = {
      'ai-models': ' Enterprise-grade AI for polished, boardroom-ready output.',
      'brand-kit': ' Pixel-perfect brand consistency across your entire library.',
      'unbranded':
        ' Clean, professional finish that matches your brand standards.',
      'export': ' Presentation-ready files that look exactly as designed.',
      'invite-collab': ' Streamlined review workflow for your team.',
      'analytics': ' Detailed engagement insights for data-driven follow-ups.',
      'gen-speed': ' Priority generation so your workflow stays uninterrupted.',
      'pres-refresh': ' AI-powered content refresh with structure preserved.',
      'hire-team': ' White-glove service from our expert presentation team.',
    };
    if (qualityAppend[feature.id])
      base.body = base.body + qualityAppend[feature.id];
  }

  return base;
}

// ══════════════════════════════════════════════════════════════════════════════
// MilestoneSelector — evaluateAndFire()
// MUTATES state (same as simulator)
// ══════════════════════════════════════════════════════════════════════════════

export function evaluateAndFire(state: NudgeState): Milestone | null {
  const scores = calculateScores(state.activeSignals);

  // Persist scores on state
  state.featureScores = scores;

  // Rank features by score, filter above threshold and not already shown
  const ranked = FEATURES.map((f) => ({ ...f, ...scores[f.id] }))
    .filter((f) => f.total >= CONFIG.THRESHOLD)
    .filter((f) => !state.featuresShownThisSession.has(f.id))
    .sort((a, b) => b.total - a.total);

  if (ranked.length === 0) return null;

  // Try to fire top scorer
  const top = ranked[0];
  const gr = checkGuardrails(state, top.id);

  if (!gr.pass) return null;

  // Fire milestone — mutate state
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

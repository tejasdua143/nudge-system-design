import type { Feature, NudgeConfig } from './nudge-types';

// ══════════════════════════════════════════════════════════════════════════════
// 1. CONFIG — All tunable values
// ══════════════════════════════════════════════════════════════════════════════

export const CONFIG: NudgeConfig = {
  THRESHOLD: 14,
  MAX_SCORE: 30,
  UNIVERSAL_MULTIPLIER: 0.4,
  SESSION_CAP: 3,
  COOLDOWN_MS: 60000,
  INTENT_FLOOR: 3,
  ACTIVITY_PAUSE_MS: 3000,
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. FEATURES — 9 feature definitions
// ══════════════════════════════════════════════════════════════════════════════

export const FEATURES: Feature[] = [
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

// ══════════════════════════════════════════════════════════════════════════════
// 4. Signal Maps — DIRECT_MAP, UNIVERSAL_MAP, MINDSET_VECTORS, PROMPT_SYNTHESIS
// ══════════════════════════════════════════════════════════════════════════════

// Direct signal map: signal -> { featureId: weight }
export const DIRECT_MAP: Record<string, Record<string, number>> = {
  'manual-edit':           { 'ai-models': 1, 'pres-refresh': 1 },
  'edits-5plus':           { 'ai-models': 5, 'pres-refresh': 2, 'hire-team': 3 },
  're-edit-3x':            { 'ai-models': 5, 'pres-refresh': 3, 'hire-team': 4 },
  'format-edits':          { 'ai-models': 4, 'brand-kit': 2, 'hire-team': 2 },
  'undo-redo':             { 'ai-models': 4, 'pres-refresh': 3, 'hire-team': 4 },
  'style-change':          { 'brand-kit': 4, 'ai-models': 2, 'hire-team': 2 },
  'slide-delete':          { 'ai-models': 2, 'pres-refresh': 2 },

  'slides-15plus':         { 'ai-models': 3, 'gen-speed': 5, 'invite-collab': 3 },
  'media-added':           { 'ai-models': 3 },
  'slide-duplicate':       { 'unbranded': 2, 'pres-refresh': 2 },
  'manual-slide-add':      { 'unbranded': 3, 'ai-models': 2 },
  'slide-reorder':         { 'ai-models': 3, 'pres-refresh': 3 },
  'data-content':          { 'analytics': 5 },

  'slideshow':             { 'unbranded': 4, 'export': 4 },
  'slideshow-then-edit':   { 'ai-models': 4, 'pres-refresh': 4, 'hire-team': 2 },
  'idle-on-slide':         { 'ai-models': 3, 'pres-refresh': 3 },
  'template-switch':       { 'unbranded': 5, 'brand-kit': 3, 'hire-team': 3 },

  'share-clicked':         { 'unbranded': 5, 'analytics': 4, 'export': 3 },
  'link-copied':           { 'unbranded': 4, 'analytics': 4 },
  'export-attempt':        { 'export': 5 },

  'brand-mention':         { 'brand-kit': 5 },
  'team-language':         { 'invite-collab': 5 },
  'started-blank':         { 'unbranded': 4, 'ai-models': 3 },
  'deck-edited':           { 'unbranded': 2, 'export': 3 },

  'new-deck-session2':     { 'unbranded': 3, 'pres-refresh': 4, 'gen-speed': 3 },
  'deck-switch':           { 'brand-kit': 3, 'pres-refresh': 3 },
  'gate-hit':              {},
  'time-20':               { 'ai-models': 3, 'gen-speed': 4 },

  'stakes-high-external':  { 'unbranded': 3, 'analytics': 2, 'brand-kit': 2, 'hire-team': 2 },
  'stakes-low-external':   { 'unbranded': 2, 'brand-kit': 1 },
  'stakes-internal':       { 'gen-speed': 2, 'ai-models': 2, 'invite-collab': 2 },

  'prompt-synthesis':      {},  // populated at runtime from PROMPT_SYNTHESIS lookup

  'bought-export':         { 'export': 4 },
  'multi-deck':            { 'brand-kit': 3, 'pres-refresh': 3 },

  'deck-veteran':          { 'brand-kit': 3, 'pres-refresh': 3, 'gen-speed': 2 },
  'deck-sharer':           { 'analytics': 3, 'unbranded': 2, 'invite-collab': 2 },
  'deck-publisher':        { 'analytics': 2, 'unbranded': 3 },

  'acq-paid':              { 'gen-speed': 2, 'export': 2 },
  'acq-referral':          { 'invite-collab': 3 },

  'pricing-visit':         {},

  // Document upload signals
  'doc-uploaded':          { 'export': 4, 'brand-kit': 3, 'unbranded': 3, 'pres-refresh': 3, 'hire-team': 2, 'analytics': 2, 'invite-collab': 2, 'ai-models': -2 },
  'doc-long':              { 'hire-team': 4, 'pres-refresh': 3, 'gen-speed': 3, 'export': 2 },

  // Mindset vector signal (populated at runtime from MINDSET_VECTORS lookup)
  'mindset-vector':        {},
};

// Universal signals: signal -> base score (applied at CONFIG.UNIVERSAL_MULTIPLIER to all features)
export const UNIVERSAL_MAP: Record<string, number> = {
  'credits-low':      3,
  'credits-zero':     5,
  'returning-user':   4,
  'pricing-visit':    3,
  'bought-export':    4,
  'time-15':          3,
  'multi-deck':       3,
  'zero-dismissals':  1,
  'gate-hit':         3,
  'export-attempt':   2,
  'company-domain':   2,
  'tier-1-country':   2,
  'deck-veteran':     3,
  'acq-paid':         2,
  'acq-referral':     3,
  'doc-uploaded':     3,
};

// Mindset vectors: 'role|audienceStakes' -> per-feature weights (0-5)
export const MINDSET_VECTORS: Record<string, Record<string, number>> = {
  'Leadership|high-external':      { 'unbranded': 4, 'analytics': 4, 'export': 3, 'brand-kit': 3, 'ai-models': 2, 'hire-team': 2, 'gen-speed': 1, 'invite-collab': 1, 'pres-refresh': 0 },
  'Leadership|low-external':       { 'unbranded': 3, 'brand-kit': 3, 'export': 3, 'analytics': 2, 'ai-models': 2, 'hire-team': 1, 'gen-speed': 1, 'invite-collab': 1, 'pres-refresh': 0 },
  'Leadership|internal':           { 'gen-speed': 3, 'invite-collab': 3, 'pres-refresh': 2, 'ai-models': 2, 'export': 1, 'unbranded': 1, 'brand-kit': 1, 'analytics': 0, 'hire-team': 0 },

  'Sales|high-external':           { 'analytics': 4, 'unbranded': 4, 'export': 3, 'brand-kit': 3, 'ai-models': 2, 'hire-team': 2, 'gen-speed': 1, 'invite-collab': 1, 'pres-refresh': 0 },
  'Sales|low-external':            { 'unbranded': 3, 'analytics': 3, 'export': 3, 'brand-kit': 2, 'ai-models': 2, 'hire-team': 1, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0 },
  'Sales|internal':                { 'gen-speed': 2, 'ai-models': 2, 'invite-collab': 2, 'pres-refresh': 2, 'export': 1, 'unbranded': 1, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },

  'Marketing|high-external':       { 'brand-kit': 4, 'unbranded': 4, 'analytics': 3, 'export': 3, 'ai-models': 2, 'hire-team': 1, 'gen-speed': 1, 'invite-collab': 1, 'pres-refresh': 0 },
  'Marketing|low-external':        { 'brand-kit': 4, 'unbranded': 3, 'export': 2, 'analytics': 2, 'ai-models': 2, 'hire-team': 1, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0 },
  'Marketing|internal':            { 'brand-kit': 3, 'gen-speed': 2, 'invite-collab': 2, 'ai-models': 2, 'pres-refresh': 1, 'unbranded': 1, 'export': 1, 'analytics': 0, 'hire-team': 0 },

  'Product|high-external':         { 'unbranded': 3, 'export': 3, 'ai-models': 3, 'brand-kit': 2, 'analytics': 2, 'invite-collab': 2, 'hire-team': 1, 'gen-speed': 1, 'pres-refresh': 0 },
  'Product|low-external':          { 'ai-models': 3, 'unbranded': 2, 'export': 2, 'invite-collab': 2, 'brand-kit': 1, 'gen-speed': 1, 'analytics': 1, 'hire-team': 0, 'pres-refresh': 0 },
  'Product|internal':              { 'invite-collab': 4, 'gen-speed': 3, 'pres-refresh': 3, 'ai-models': 2, 'export': 1, 'unbranded': 0, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },

  'Design|high-external':          { 'brand-kit': 5, 'unbranded': 4, 'export': 3, 'ai-models': 2, 'analytics': 2, 'hire-team': 1, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0 },
  'Design|low-external':           { 'brand-kit': 4, 'unbranded': 4, 'export': 3, 'ai-models': 2, 'analytics': 1, 'hire-team': 0, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0 },
  'Design|internal':               { 'brand-kit': 3, 'invite-collab': 2, 'pres-refresh': 2, 'ai-models': 2, 'gen-speed': 1, 'unbranded': 1, 'export': 0, 'analytics': 0, 'hire-team': 0 },

  'Engineering|high-external':     { 'ai-models': 3, 'export': 3, 'unbranded': 2, 'invite-collab': 2, 'gen-speed': 2, 'brand-kit': 1, 'analytics': 1, 'hire-team': 1, 'pres-refresh': 0 },
  'Engineering|low-external':      { 'ai-models': 3, 'gen-speed': 2, 'export': 2, 'invite-collab': 2, 'unbranded': 1, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0, 'pres-refresh': 0 },
  'Engineering|internal':          { 'invite-collab': 3, 'gen-speed': 3, 'ai-models': 2, 'pres-refresh': 2, 'export': 1, 'unbranded': 0, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },

  'Data Analytics|high-external':  { 'analytics': 4, 'export': 4, 'ai-models': 3, 'unbranded': 2, 'brand-kit': 1, 'invite-collab': 1, 'hire-team': 1, 'gen-speed': 1, 'pres-refresh': 0 },
  'Data Analytics|low-external':   { 'analytics': 3, 'export': 3, 'ai-models': 2, 'unbranded': 2, 'brand-kit': 1, 'gen-speed': 1, 'invite-collab': 0, 'hire-team': 0, 'pres-refresh': 0 },
  'Data Analytics|internal':       { 'analytics': 3, 'gen-speed': 2, 'ai-models': 2, 'invite-collab': 2, 'pres-refresh': 2, 'export': 1, 'unbranded': 0, 'brand-kit': 0, 'hire-team': 0 },

  'Consulting|high-external':      { 'unbranded': 3, 'brand-kit': 3, 'export': 3, 'ai-models': 2, 'analytics': 2, 'hire-team': 2, 'invite-collab': 1, 'gen-speed': 1, 'pres-refresh': 0 },
  'Consulting|low-external':       { 'unbranded': 3, 'brand-kit': 2, 'export': 3, 'ai-models': 2, 'analytics': 1, 'hire-team': 1, 'gen-speed': 1, 'invite-collab': 1, 'pres-refresh': 0 },
  'Consulting|internal':           { 'invite-collab': 3, 'gen-speed': 2, 'pres-refresh': 2, 'ai-models': 2, 'export': 1, 'unbranded': 1, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },

  'Operations|high-external':      { 'export': 3, 'unbranded': 2, 'ai-models': 2, 'gen-speed': 2, 'invite-collab': 2, 'brand-kit': 1, 'analytics': 1, 'hire-team': 1, 'pres-refresh': 0 },
  'Operations|low-external':       { 'gen-speed': 2, 'export': 2, 'ai-models': 2, 'invite-collab': 2, 'unbranded': 1, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0, 'pres-refresh': 0 },
  'Operations|internal':           { 'gen-speed': 3, 'invite-collab': 3, 'pres-refresh': 2, 'ai-models': 2, 'export': 1, 'unbranded': 0, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },

  'Finance|high-external':         { 'analytics': 3, 'export': 4, 'unbranded': 3, 'ai-models': 2, 'brand-kit': 2, 'gen-speed': 1, 'invite-collab': 1, 'hire-team': 1, 'pres-refresh': 0 },
  'Finance|low-external':          { 'export': 3, 'analytics': 2, 'unbranded': 2, 'ai-models': 2, 'brand-kit': 1, 'gen-speed': 1, 'invite-collab': 0, 'hire-team': 0, 'pres-refresh': 0 },
  'Finance|internal':              { 'gen-speed': 2, 'ai-models': 2, 'invite-collab': 2, 'export': 2, 'pres-refresh': 2, 'analytics': 1, 'unbranded': 0, 'brand-kit': 0, 'hire-team': 0 },

  'Creator|high-external':         { 'brand-kit': 4, 'unbranded': 4, 'export': 3, 'ai-models': 3, 'analytics': 2, 'hire-team': 1, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0 },
  'Creator|low-external':          { 'brand-kit': 4, 'unbranded': 3, 'ai-models': 3, 'export': 2, 'analytics': 1, 'gen-speed': 1, 'hire-team': 0, 'invite-collab': 0, 'pres-refresh': 0 },
  'Creator|internal':              { 'brand-kit': 3, 'ai-models': 2, 'pres-refresh': 2, 'gen-speed': 2, 'invite-collab': 1, 'unbranded': 1, 'export': 0, 'analytics': 0, 'hire-team': 0 },

  'Teacher|high-external':         { 'export': 4, 'gen-speed': 3, 'ai-models': 3, 'unbranded': 2, 'pres-refresh': 2, 'hire-team': 1, 'brand-kit': 1, 'analytics': 0, 'invite-collab': 0 },
  'Teacher|low-external':          { 'export': 3, 'gen-speed': 3, 'ai-models': 2, 'pres-refresh': 2, 'unbranded': 2, 'brand-kit': 1, 'hire-team': 0, 'analytics': 0, 'invite-collab': 0 },
  'Teacher|internal':              { 'export': 3, 'gen-speed': 3, 'pres-refresh': 3, 'ai-models': 2, 'unbranded': 1, 'invite-collab': 1, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },

  'Student|high-external':         { 'export': 4, 'ai-models': 3, 'unbranded': 3, 'gen-speed': 2, 'invite-collab': 2, 'brand-kit': 1, 'hire-team': 1, 'analytics': 0, 'pres-refresh': 0 },
  'Student|low-external':          { 'export': 3, 'ai-models': 2, 'gen-speed': 2, 'unbranded': 2, 'invite-collab': 1, 'brand-kit': 0, 'hire-team': 0, 'analytics': 0, 'pres-refresh': 0 },
  'Student|internal':              { 'gen-speed': 3, 'ai-models': 2, 'invite-collab': 2, 'export': 1, 'pres-refresh': 1, 'unbranded': 0, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },
};

export const MINDSET_FALLBACK: Record<string, number> = { 'ai-models': 1, 'gen-speed': 1, 'export': 1, 'unbranded': 1, 'brand-kit': 0, 'analytics': 0, 'invite-collab': 0, 'hire-team': 0, 'pres-refresh': 0 };

// Prompt synthesis: topic -> per-feature relevance scores (simulated LLM output)
export const PROMPT_SYNTHESIS: Record<string, Record<string, number>> = {
  // Founder topics
  'Series A pitch for fintech startup':
    { 'unbranded': 5, 'analytics': 4, 'export': 4, 'brand-kit': 4, 'ai-models': 3, 'invite-collab': 3, 'gen-speed': 2, 'pres-refresh': 1, 'hire-team': 1 },
  'Seed round deck for healthtech':
    { 'unbranded': 5, 'analytics': 4, 'export': 4, 'brand-kit': 3, 'ai-models': 3, 'invite-collab': 3, 'gen-speed': 2, 'pres-refresh': 2, 'hire-team': 1 },
  'Product demo for enterprise AI tool':
    { 'brand-kit': 4, 'unbranded': 4, 'ai-models': 4, 'analytics': 3, 'export': 3, 'invite-collab': 2, 'gen-speed': 2, 'pres-refresh': 1, 'hire-team': 1 },

  // Sales topics
  'Enterprise SaaS proposal for Fortune 500':
    { 'analytics': 5, 'unbranded': 5, 'export': 4, 'brand-kit': 4, 'ai-models': 3, 'invite-collab': 3, 'gen-speed': 2, 'pres-refresh': 1, 'hire-team': 1 },
  'Partnership pitch to retail chain':
    { 'unbranded': 4, 'analytics': 4, 'export': 4, 'brand-kit': 3, 'ai-models': 3, 'invite-collab': 2, 'gen-speed': 2, 'pres-refresh': 1, 'hire-team': 1 },
  'ROI case study for CFO':
    { 'ai-models': 4, 'analytics': 4, 'export': 4, 'unbranded': 4, 'brand-kit': 2, 'invite-collab': 2, 'gen-speed': 1, 'pres-refresh': 1, 'hire-team': 0 },

  // Corporate topics
  'Q1 business review':
    { 'pres-refresh': 4, 'gen-speed': 4, 'invite-collab': 3, 'ai-models': 3, 'export': 2, 'brand-kit': 2, 'unbranded': 1, 'analytics': 1, 'hire-team': 0 },
  'Product roadmap for H2':
    { 'invite-collab': 4, 'pres-refresh': 3, 'gen-speed': 3, 'ai-models': 3, 'export': 2, 'brand-kit': 1, 'unbranded': 1, 'analytics': 1, 'hire-team': 0 },
  'Team restructuring proposal':
    { 'ai-models': 4, 'invite-collab': 3, 'export': 3, 'analytics': 2, 'gen-speed': 2, 'unbranded': 2, 'brand-kit': 1, 'pres-refresh': 1, 'hire-team': 0 },
  'OKR review and planning':
    { 'pres-refresh': 4, 'invite-collab': 4, 'gen-speed': 3, 'ai-models': 3, 'export': 2, 'analytics': 2, 'brand-kit': 1, 'unbranded': 1, 'hire-team': 0 },

  // Creative topics
  'Design portfolio for senior role':
    { 'brand-kit': 5, 'unbranded': 5, 'export': 4, 'ai-models': 3, 'analytics': 3, 'pres-refresh': 2, 'gen-speed': 1, 'invite-collab': 1, 'hire-team': 1 },
  'Agency credentials deck':
    { 'brand-kit': 5, 'unbranded': 5, 'analytics': 4, 'export': 4, 'invite-collab': 3, 'pres-refresh': 3, 'ai-models': 3, 'gen-speed': 1, 'hire-team': 1 },
  'Brand identity presentation':
    { 'brand-kit': 5, 'unbranded': 4, 'export': 3, 'ai-models': 3, 'analytics': 2, 'invite-collab': 2, 'pres-refresh': 2, 'gen-speed': 1, 'hire-team': 1 },

  // Educator topics
  'Introduction to machine learning':
    { 'export': 4, 'ai-models': 4, 'pres-refresh': 4, 'gen-speed': 3, 'unbranded': 2, 'invite-collab': 1, 'brand-kit': 1, 'analytics': 1, 'hire-team': 0 },
  'Data visualization workshop':
    { 'ai-models': 4, 'export': 4, 'pres-refresh': 3, 'gen-speed': 3, 'unbranded': 2, 'invite-collab': 2, 'brand-kit': 1, 'analytics': 1, 'hire-team': 0 },
  'Research methodology lecture':
    { 'export': 4, 'pres-refresh': 4, 'ai-models': 3, 'gen-speed': 3, 'unbranded': 2, 'invite-collab': 1, 'brand-kit': 1, 'analytics': 1, 'hire-team': 0 },

  // Student topics
  'Final thesis defense':
    { 'export': 5, 'ai-models': 4, 'unbranded': 4, 'gen-speed': 3, 'invite-collab': 2, 'brand-kit': 2, 'analytics': 1, 'pres-refresh': 1, 'hire-team': 2 },
  'Startup pitch for entrepreneurship class':
    { 'unbranded': 3, 'ai-models': 3, 'export': 3, 'brand-kit': 3, 'invite-collab': 3, 'gen-speed': 2, 'analytics': 2, 'pres-refresh': 1, 'hire-team': 1 },
  'Capstone project presentation':
    { 'export': 4, 'ai-models': 4, 'invite-collab': 3, 'unbranded': 3, 'gen-speed': 3, 'brand-kit': 2, 'analytics': 1, 'pres-refresh': 1, 'hire-team': 1 },

  // Weak / vague prompts
  'pitch deck':
    { 'unbranded': 2, 'export': 2, 'ai-models': 1, 'brand-kit': 1, 'analytics': 1, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0, 'hire-team': 0 },
  'startup stuff':
    { 'ai-models': 1, 'gen-speed': 1, 'unbranded': 1, 'export': 1, 'brand-kit': 0, 'analytics': 0, 'invite-collab': 0, 'pres-refresh': 0, 'hire-team': 0 },
  'sales presentation':
    { 'unbranded': 2, 'export': 2, 'analytics': 1, 'ai-models': 1, 'brand-kit': 1, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0, 'hire-team': 0 },
  'deck for client meeting':
    { 'unbranded': 2, 'export': 2, 'brand-kit': 1, 'analytics': 1, 'ai-models': 1, 'gen-speed': 1, 'invite-collab': 1, 'pres-refresh': 0, 'hire-team': 0 },
  'slides for meeting':
    { 'gen-speed': 2, 'ai-models': 1, 'export': 1, 'invite-collab': 1, 'pres-refresh': 1, 'unbranded': 0, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },
  'quarterly update slides':
    { 'pres-refresh': 3, 'gen-speed': 2, 'invite-collab': 2, 'ai-models': 1, 'export': 1, 'brand-kit': 1, 'unbranded': 0, 'analytics': 0, 'hire-team': 0 },
  'portfolio presentation':
    { 'brand-kit': 2, 'unbranded': 2, 'export': 2, 'ai-models': 1, 'analytics': 1, 'gen-speed': 1, 'invite-collab': 0, 'pres-refresh': 0, 'hire-team': 0 },
  'make a presentation':
    { 'ai-models': 1, 'gen-speed': 1, 'export': 1, 'unbranded': 0, 'brand-kit': 0, 'analytics': 0, 'invite-collab': 0, 'pres-refresh': 0, 'hire-team': 0 },
  'lecture slides':
    { 'export': 2, 'pres-refresh': 2, 'gen-speed': 1, 'ai-models': 1, 'unbranded': 1, 'invite-collab': 0, 'brand-kit': 0, 'analytics': 0, 'hire-team': 0 },
  'presentation for class':
    { 'export': 2, 'ai-models': 1, 'gen-speed': 1, 'unbranded': 1, 'invite-collab': 1, 'brand-kit': 0, 'analytics': 0, 'pres-refresh': 0, 'hire-team': 0 },
  'help me with a ppt':
    { 'ai-models': 1, 'gen-speed': 1, 'export': 0, 'unbranded': 0, 'brand-kit': 0, 'analytics': 0, 'invite-collab': 0, 'pres-refresh': 0, 'hire-team': 2 },

  // Urgent prompts
  'investor meeting tomorrow need a deck':
    { 'gen-speed': 5, 'ai-models': 5, 'export': 5, 'unbranded': 4, 'analytics': 3, 'brand-kit': 2, 'invite-collab': 1, 'pres-refresh': 0, 'hire-team': 5 },
  'urgent proposal for client demo Friday':
    { 'gen-speed': 5, 'export': 5, 'ai-models': 4, 'unbranded': 4, 'analytics': 3, 'brand-kit': 3, 'invite-collab': 2, 'pres-refresh': 0, 'hire-team': 4 },
  'board deck due end of day':
    { 'gen-speed': 5, 'ai-models': 5, 'export': 4, 'unbranded': 3, 'invite-collab': 3, 'brand-kit': 2, 'analytics': 2, 'pres-refresh': 0, 'hire-team': 5 },
  'client pitch deck needed by tonight':
    { 'gen-speed': 5, 'ai-models': 4, 'export': 4, 'unbranded': 4, 'brand-kit': 4, 'analytics': 2, 'invite-collab': 1, 'pres-refresh': 0, 'hire-team': 4 },
  'guest lecture tomorrow on AI ethics':
    { 'gen-speed': 4, 'export': 4, 'ai-models': 4, 'pres-refresh': 3, 'unbranded': 2, 'invite-collab': 1, 'brand-kit': 1, 'analytics': 0, 'hire-team': 2 },
  'group project due tomorrow':
    { 'gen-speed': 4, 'export': 4, 'ai-models': 3, 'invite-collab': 4, 'unbranded': 2, 'brand-kit': 1, 'analytics': 0, 'pres-refresh': 0, 'hire-team': 3 },
};

// ══════════════════════════════════════════════════════════════════════════════
// 5. ROLES, AUDIENCES, TOPICS, and user generation data
// ══════════════════════════════════════════════════════════════════════════════

export const ROLES = [
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
] as const;

export const AUDIENCES: Record<string, string[]> = {
  Founder: ['Investors', 'VCs', 'Board members', 'Angel investors'],
  Sales: ['Enterprise clients', 'Prospects', 'C-suite buyers'],
  Corporate: ['Leadership team', 'Executives', 'Stakeholders', 'Cross-functional team'],
  Creative: ['Potential clients', 'Recruiters', 'Art directors'],
  Educator: ['Students', 'Corporate trainees', 'Workshop attendees'],
  Student: ['Professor', 'Panel judges', 'Classmates'],
};

export const TOPICS: Record<string, string[]> = {
  Founder: ['Series A pitch for fintech startup', 'Seed round deck for healthtech', 'Product demo for enterprise AI tool', 'pitch deck', 'startup stuff', 'investor meeting tomorrow need a deck'],
  Sales: ['Enterprise SaaS proposal for Fortune 500', 'Partnership pitch to retail chain', 'ROI case study for CFO', 'sales presentation', 'deck for client meeting', 'urgent proposal for client demo Friday'],
  Corporate: ['Q1 business review', 'Product roadmap for H2', 'Team restructuring proposal', 'OKR review and planning', 'slides for meeting', 'quarterly update slides', 'board deck due end of day'],
  Creative: ['Design portfolio for senior role', 'Agency credentials deck', 'Brand identity presentation', 'portfolio presentation', 'make a presentation', 'client pitch deck needed by tonight'],
  Educator: ['Introduction to machine learning', 'Data visualization workshop', 'Research methodology lecture', 'lecture slides', 'guest lecture tomorrow on AI ethics'],
  Student: ['Final thesis defense', 'Startup pitch for entrepreneurship class', 'Capstone project presentation', 'presentation for class', 'help me with a ppt', 'group project due tomorrow'],
};

export const COMPANY_DOMAINS: Record<string, string[]> = {
  Founder: ['@startup.io', '@startup.io', '@gmail.com'],
  Sales: ['@salesforce.com', '@hubspot.com', '@company.com', '@gmail.com'],
  Corporate: ['@deloitte.com', '@jpmorgan.com', '@company.com', '@gmail.com'],
  Creative: ['@agency.co', '@studio.design', '@gmail.com', '@gmail.com'],
  Educator: ['@stanford.edu', '@university.edu', '@gmail.com'],
  Student: ['@university.edu', '@gmail.com', '@gmail.com', '@gmail.com'],
};

export const TIER_1: string[] = ['US', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Sweden', 'Switzerland', 'Japan', 'Singapore'];
export const TIER_2: string[] = ['India', 'Brazil', 'Indonesia', 'Philippines', 'Mexico', 'Nigeria', 'Vietnam', 'Colombia', 'Egypt', 'Bangladesh', 'Pakistan', 'Kenya'];

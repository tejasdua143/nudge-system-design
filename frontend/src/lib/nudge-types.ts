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

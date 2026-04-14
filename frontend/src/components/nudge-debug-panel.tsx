'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { NudgeState } from '@/lib/nudge-types';
import { FEATURES, CONFIG, DIRECT_MAP, UNIVERSAL_MAP } from '@/lib/nudge-config';

interface NudgeDebugPanelProps {
  state: NudgeState;
}

function getSignalBadge(signal: string): { label: string; color: string } {
  const inDirect = signal in DIRECT_MAP;
  const inUniversal = signal in UNIVERSAL_MAP;
  if (inDirect && inUniversal) return { label: 'D+U', color: 'bg-green-500/20 text-green-400' };
  if (inDirect) return { label: 'DIR', color: 'bg-purple-500/20 text-purple-400' };
  if (inUniversal) return { label: 'UNI', color: 'bg-blue-500/20 text-blue-400' };
  return { label: '???', color: 'bg-bg-muted text-text-tertiary' };
}

function formatCooldown(lastTime: number): { label: string; status: 'ok' | 'blocked' } {
  const elapsed = Date.now() - lastTime;
  const remaining = CONFIG.COOLDOWN_MS - elapsed;
  if (remaining <= 0) return { label: 'Ready', status: 'ok' };
  return { label: `${Math.ceil(remaining / 1000)}s`, status: 'blocked' };
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[length:var(--text-2xs)] font-medium uppercase tracking-widest text-text-tertiary mb-[var(--space-2)] mt-[var(--space-4)]">
      {children}
    </h3>
  );
}

function StatusDot({ status }: { status: 'ok' | 'blocked' | 'warn' }) {
  const colors = {
    ok: 'bg-green-500',
    blocked: 'bg-red-500',
    warn: 'bg-yellow-500',
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} />;
}

export default function NudgeDebugPanel({ state }: NudgeDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortedFeatures = useMemo(() => {
    return FEATURES.map((f) => {
      const score = state.featureScores[f.id];
      return {
        ...f,
        direct: score?.direct ?? 0,
        universalContrib: score?.universalContrib ?? 0,
        total: score?.total ?? 0,
      };
    }).sort((a, b) => b.total - a.total);
  }, [state.featureScores]);

  const topAboveThreshold = sortedFeatures.find((f) => f.total >= CONFIG.THRESHOLD);

  const cooldown = formatCooldown(state.lastMilestoneTime);

  // Compute intent floor status
  const maxDirect = Math.max(...sortedFeatures.map((f) => f.direct), 0);
  const intentStatus: 'ok' | 'blocked' = maxDirect >= CONFIG.INTENT_FLOOR ? 'ok' : 'blocked';

  const guardrails = [
    {
      label: 'Pro user',
      value: state.user.isProUser ? 'Yes' : 'No',
      status: state.user.isProUser ? ('warn' as const) : ('ok' as const),
    },
    {
      label: 'Milestones fired',
      value: `${state.milestonesThisSession}/${CONFIG.SESSION_CAP}`,
      status:
        state.milestonesThisSession >= CONFIG.SESSION_CAP
          ? ('blocked' as const)
          : state.milestonesThisSession >= CONFIG.SESSION_CAP - 1
            ? ('warn' as const)
            : ('ok' as const),
    },
    {
      label: 'Cooldown',
      value: cooldown.label,
      status: cooldown.status === 'ok' ? ('ok' as const) : ('blocked' as const),
    },
    {
      label: 'Features shown',
      value: `${state.featuresShownThisSession.size}/${FEATURES.length}`,
      status:
        state.featuresShownThisSession.size >= FEATURES.length
          ? ('blocked' as const)
          : ('ok' as const),
    },
    {
      label: 'Intent floor',
      value: intentStatus === 'ok' ? 'Pass' : 'Low',
      status: intentStatus,
    },
    {
      label: 'Activity',
      value: state.isUserActive ? 'Active' : 'Idle',
      status: state.isUserActive ? ('ok' as const) : ('blocked' as const),
    },
  ];

  const reversedMilestones = [...state.milestoneLog].reverse();

  return (
    <div className="fixed bottom-4 left-4" style={{ zIndex: 'var(--z-overlay)' }}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[400px] max-h-[80vh] overflow-y-auto bg-bg-elevated shadow-elevation-3 rounded-[var(--radius-lg)] border border-border-default p-[var(--space-4)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-[var(--space-3)]">
              <span className="text-[length:var(--text-base)] font-semibold text-text-primary">
                Nudge Debug
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-tertiary hover:text-text-primary text-[length:var(--text-xs)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* 1. User Context */}
            <SectionHeader>User Context</SectionHeader>
            <div className="grid grid-cols-2 gap-x-[var(--space-3)] gap-y-[var(--space-1)] text-[length:var(--text-xs)]">
              {([
                ['Name', state.user.name],
                ['Role', state.user.role],
                ['Archetype', state.user.archetype],
                ['Audience', state.user.audience],
                ['Stakes', state.user.audienceStakes ?? '—'],
                ['Topic', state.user.topic],
                ['Country', `${state.user.country} (Tier ${state.user.countryTier})`],
                ['Credits', String(state.user.credits)],
                ['Session', String(state.user.sessionNum)],
                ['Acq Channel', state.user.acqChannel],
                ['Pro User', state.user.isProUser ? 'Yes' : 'No'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="contents">
                  <span className="text-text-tertiary">{label}</span>
                  <span className="text-text-secondary font-[family-name:var(--font-family-mono)] truncate">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* 2. Active Signals */}
            <SectionHeader>Active Signals ({state.activeSignals.size})</SectionHeader>
            <div className="flex flex-wrap gap-[var(--space-1)]">
              {Array.from(state.activeSignals).map((signal) => {
                const badge = getSignalBadge(signal);
                return (
                  <span
                    key={signal}
                    className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-xs)] bg-bg-muted px-[var(--space-2)] py-0.5 text-[length:var(--text-3xs)] text-text-secondary"
                  >
                    <span
                      className={`rounded-[var(--radius-xs)] px-1 py-px text-[length:var(--text-3xs)] font-bold ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <span className="font-[family-name:var(--font-family-mono)]">{signal}</span>
                  </span>
                );
              })}
              {state.activeSignals.size === 0 && (
                <span className="text-[length:var(--text-xs)] text-text-tertiary italic">
                  No active signals
                </span>
              )}
            </div>

            {/* 3. Feature Scores */}
            <SectionHeader>Feature Scores</SectionHeader>
            <div className="space-y-[var(--space-1)]">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_3rem_3rem_3rem_4rem] gap-[var(--space-1)] text-[length:var(--text-3xs)] text-text-tertiary uppercase tracking-wide px-[var(--space-2)]">
                <span>Feature</span>
                <span className="text-right">Dir</span>
                <span className="text-right">Uni</span>
                <span className="text-right">Tot</span>
                <span />
              </div>
              {sortedFeatures.map((f) => {
                const isAboveThreshold = f.total >= CONFIG.THRESHOLD;
                const isNext = topAboveThreshold?.id === f.id;
                const barWidth = Math.min((f.total / CONFIG.MAX_SCORE) * 100, 100);
                return (
                  <div
                    key={f.id}
                    className={`grid grid-cols-[1fr_3rem_3rem_3rem_4rem] items-center gap-[var(--space-1)] rounded-[var(--radius-xs)] px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-xs)] ${
                      isAboveThreshold
                        ? 'bg-bg-brand/8 text-text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    <span className="flex items-center gap-[var(--space-1)] min-w-0">
                      <span className="shrink-0">{f.icon}</span>
                      <span className="truncate">{f.name}</span>
                      {isNext && (
                        <span className="shrink-0 rounded-[var(--radius-xs)] bg-bg-brand/20 px-1 py-px text-[length:var(--text-3xs)] font-bold text-text-brand">
                          NEXT
                        </span>
                      )}
                    </span>
                    <span className="text-right font-[family-name:var(--font-family-mono)]">
                      {f.direct.toFixed(1)}
                    </span>
                    <span className="text-right font-[family-name:var(--font-family-mono)]">
                      {f.universalContrib.toFixed(1)}
                    </span>
                    <span className="text-right font-[family-name:var(--font-family-mono)] font-semibold">
                      {f.total.toFixed(1)}
                    </span>
                    <div className="h-1.5 rounded-full bg-bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isAboveThreshold ? 'bg-bg-brand' : 'bg-text-tertiary/40'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-[var(--space-2)] mt-[var(--space-1)] px-[var(--space-2)]">
                <div className="h-px flex-1 bg-border-default" />
                <span className="text-[length:var(--text-3xs)] text-text-tertiary font-[family-name:var(--font-family-mono)]">
                  threshold = {CONFIG.THRESHOLD}
                </span>
                <div className="h-px flex-1 bg-border-default" />
              </div>
            </div>

            {/* 4. Guardrails */}
            <SectionHeader>Guardrails</SectionHeader>
            <div className="grid grid-cols-2 gap-[var(--space-2)]">
              {guardrails.map((g) => (
                <div
                  key={g.label}
                  className="flex items-center gap-[var(--space-2)] rounded-[var(--radius-xs)] bg-bg-muted px-[var(--space-2)] py-[var(--space-1)]"
                >
                  <StatusDot status={g.status} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[length:var(--text-3xs)] text-text-tertiary truncate">
                      {g.label}
                    </div>
                    <div className="text-[length:var(--text-xs)] text-text-secondary font-[family-name:var(--font-family-mono)]">
                      {g.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Milestone Log */}
            <SectionHeader>Milestone Log ({state.milestoneLog.length})</SectionHeader>
            {reversedMilestones.length === 0 ? (
              <span className="text-[length:var(--text-xs)] text-text-tertiary italic">
                No milestones fired yet
              </span>
            ) : (
              <div className="space-y-[var(--space-1)]">
                {reversedMilestones.map((m, i) => (
                  <div
                    key={`${m.feature.id}-${m.time}-${i}`}
                    className="flex items-center gap-[var(--space-2)] rounded-[var(--radius-xs)] bg-bg-muted px-[var(--space-2)] py-[var(--space-1)]"
                  >
                    <span className="text-[length:var(--text-base)] shrink-0">
                      {m.feature.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[length:var(--text-xs)] text-text-primary truncate">
                        {m.feature.name}
                      </div>
                      <div className="text-[length:var(--text-3xs)] text-text-tertiary font-[family-name:var(--font-family-mono)]">
                        score {m.score.toFixed(1)} &middot;{' '}
                        {new Date(m.time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(true)}
            className="rounded-[var(--radius-lg)] bg-bg-elevated/80 backdrop-blur-sm border border-border-default shadow-elevation-1 px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer font-[family-name:var(--font-family-mono)]"
          >
            Nudge Debug
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

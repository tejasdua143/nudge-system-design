'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { NudgeState, Milestone } from '@/lib/nudge-types';
import { CONFIG } from '@/lib/nudge-config';
import { hydrateUser, generateRandomUser, profileUser } from '@/lib/nudge-profiler';
import { calculateScores, evaluateAndFire } from '@/lib/nudge-engine';

// ══════════════════════════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════════════════════════

export interface UserContext {
  name?: string;
  email?: string;
  role?: string;
  prompt?: string;
  fileName?: string | null;
}

// ══════════════════════════════════════════════════════════════════════════════
// Hook
// ══════════════════════════════════════════════════════════════════════════════

export function useNudgeEngine(userContext?: UserContext) {
  // ── Initialize state once ──
  const [state, setState] = useState<NudgeState>(() => {
    const user = userContext
      ? hydrateUser(userContext)
      : generateRandomUser();

    const initialSignals = profileUser(user);

    if (userContext?.fileName) {
      initialSignals.add('doc-uploaded');
    }

    const featureScores = calculateScores(initialSignals);

    return {
      user,
      activeSignals: initialSignals,
      featureScores,
      milestonesThisSession: 0,
      featuresShownThisSession: new Set<string>(),
      lastMilestoneTime: 0,
      milestoneLog: [],
      isUserActive: false,
    };
  });

  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  // ── Refs for timers and tracking ──
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const firedTimeSignalsRef = useRef<Set<string>>(new Set());

  // Ref to track activeMilestone without stale closures
  const activeMilestoneRef = useRef<Milestone | null>(null);
  activeMilestoneRef.current = activeMilestone;

  // ── dismissNudge ──
  const dismissNudge = useCallback(() => {
    // Clear auto-dismiss timer
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }

    setActiveMilestone(null);

    setState((prev) => {
      const nextUser = { ...prev.user, dismissals: prev.user.dismissals + 1 };
      const nextSignals = new Set(prev.activeSignals);
      nextSignals.delete('zero-dismissals');

      const nextScores = calculateScores(nextSignals);

      return {
        ...prev,
        user: nextUser,
        activeSignals: nextSignals,
        featureScores: nextScores,
      };
    });
  }, []);

  // ── upgradeNudge ──
  const upgradeNudge = useCallback(() => {
    // Clear auto-dismiss timer
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }

    setActiveMilestone(null);

    setState((prev) => ({
      ...prev,
      user: { ...prev.user, isProUser: true },
    }));
  }, []);

  // ── fireSignal ──
  const fireSignal = useCallback((signal: string) => {
    // Add signal, mark user active
    setState((prev) => {
      const nextSignals = new Set(prev.activeSignals);
      nextSignals.add(signal);

      return {
        ...prev,
        activeSignals: nextSignals,
        isUserActive: true,
      };
    });

    // Clear any existing activity debounce timer
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }

    // Start 3s debounce — after idle, clear isUserActive and evaluate
    activityTimerRef.current = setTimeout(() => {
      // Modal-open guard: don't evaluate while a milestone is showing
      if (activeMilestoneRef.current) return;

      setState((prev) => {
        const nextState: NudgeState = { ...prev, isUserActive: false };
        const milestone = evaluateAndFire(nextState);

        if (milestone) {
          setActiveMilestone(milestone);

          // Auto-dismiss after 10s
          if (autoDismissTimerRef.current) {
            clearTimeout(autoDismissTimerRef.current);
          }
          autoDismissTimerRef.current = setTimeout(() => {
            dismissNudge();
          }, 10_000);
        }

        return nextState;
      });
    }, CONFIG.ACTIVITY_PAUSE_MS);
  }, [dismissNudge]);

  // ── Time-based signals: check every 30s ──
  useEffect(() => {
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - sessionStartRef.current;
      const elapsedMinutes = elapsed / 60_000;

      if (elapsedMinutes >= 15 && !firedTimeSignalsRef.current.has('time-15')) {
        firedTimeSignalsRef.current.add('time-15');
        fireSignal('time-15');
      }

      if (elapsedMinutes >= 20 && !firedTimeSignalsRef.current.has('time-20')) {
        firedTimeSignalsRef.current.add('time-20');
        fireSignal('time-20');
      }
    }, 30_000);

    return () => clearInterval(intervalId);
  }, [fireSignal]);

  // ── Cleanup all timers on unmount ──
  useEffect(() => {
    return () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, []);

  return {
    state,
    activeMilestone,
    fireSignal,
    dismissNudge,
    upgradeNudge,
  };
}

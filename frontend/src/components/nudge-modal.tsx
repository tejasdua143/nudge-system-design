'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { Milestone } from '@/lib/nudge-types';

interface NudgeModalProps {
  milestone: Milestone | null;
  onDismiss: () => void;
  onUpgrade: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ease: [0.19, 1, 0.22, 1] as [number, number, number, number], duration: 0.5 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { ease: [0.19, 1, 0.22, 1] as [number, number, number, number], duration: 0.3 },
  },
};

export function NudgeModal({ milestone, onDismiss, onUpgrade }: NudgeModalProps) {
  if (!milestone) return null;

  const isPro = milestone.feature.type === 'pro';

  const accentLabel = isPro ? 'PRO' : 'SERVICE';
  const tagLabel = isPro ? 'Milestone' : 'Service';
  const ctaLabel = isPro ? 'Upgrade to Pro' : 'Talk to our team';

  const badgeBg = isPro
    ? 'bg-bg-brand text-white'
    : 'bg-orange-600 text-white';

  const ctaClasses = isPro
    ? 'bg-bg-brand hover:bg-bg-brand-hover text-white'
    : 'bg-orange-600 hover:bg-orange-700 text-white';

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          key="nudge-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          style={{ zIndex: 'var(--z-modal)' } as React.CSSProperties}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onDismiss}
        >
          <motion.div
            key="nudge-card"
            className="relative mx-4 flex w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-xl)] bg-bg-primary shadow-2xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4">
              {/* Feature icon */}
              {milestone.feature.icon && (
                <span className="text-[length:var(--text-lg)]">
                  {milestone.feature.icon}
                </span>
              )}

              {/* Tag */}
              <span className="rounded-[var(--radius-sm)] bg-bg-primary px-2 py-0.5 text-[length:var(--text-2xs)] font-medium uppercase tracking-wide text-text-secondary ring-1 ring-border-tertiary">
                {tagLabel}
              </span>

              {/* Badge – pushed to the right */}
              <span
                className={`ml-auto rounded-[var(--radius-sm)] px-2 py-0.5 text-[length:var(--text-2xs)] font-bold uppercase tracking-wider ${badgeBg}`}
              >
                {accentLabel}
              </span>
            </div>

            {/* ── Body ───────────────────────────────────── */}
            <div className="flex flex-col gap-4 px-6 pb-6">
              <h2 className="text-[length:var(--text-lg)] font-semibold text-text-primary">
                {milestone.copy.title}
              </h2>

              <p className="text-[length:var(--text-base)] leading-relaxed text-text-secondary">
                {milestone.copy.body}
              </p>

              {/* Buttons */}
              <div className="mt-2 flex flex-col gap-2">
                <button
                  type="button"
                  className={`w-full cursor-pointer rounded-[var(--radius-md)] px-4 py-2.5 text-[length:var(--text-base)] font-medium transition-colors ${ctaClasses}`}
                  onClick={onUpgrade}
                >
                  {ctaLabel}
                </button>

                <button
                  type="button"
                  className="w-full cursor-pointer rounded-[var(--radius-md)] px-4 py-2.5 text-[length:var(--text-base)] font-medium text-text-tertiary transition-colors hover:text-text-secondary"
                  onClick={onDismiss}
                >
                  Not now
                </button>
              </div>
            </div>

            {/* ── Footer ─────────────────────────────────── */}
            <div className="flex items-center gap-2 border-t border-border-tertiary px-6 py-4">
              <span
                className={`rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[length:var(--text-2xs)] font-bold uppercase tracking-wider ${badgeBg}`}
              >
                {accentLabel}
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

"use client";

import { createContext, useContext, useState, useCallback } from "react";

/* Transition config — entrance (push left) */
const TRANSITION = {
  offsetX: 40,          // px the page enters from (rightward)
  blur: 8,              // starting blur in px
  opacity: 0,           // starting opacity
  spring: {
    type: "spring" as const,
    visualDuration: 0.25,
    bounce: 0.2,
  },
};

/* Dismiss config — sheet dismiss (slide down) */
const DISMISS = {
  offsetY: 600,         // px the page slides down to
  blur: 4,              // ending blur in px
  spring: {
    type: "spring" as const,
    visualDuration: 0.35,
    bounce: 0,
  },
};

interface TransitionContextValue {
  enter: typeof TRANSITION;
  dismiss: typeof DISMISS;
  isDismissing: boolean;
  triggerDismiss: (onComplete: () => void) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isDismissing, setIsDismissing] = useState(false);

  const triggerDismiss = useCallback((onComplete: () => void) => {
    setIsDismissing(true);
    setTimeout(onComplete, DISMISS.spring.visualDuration * 1000 + 50);
  }, []);

  return (
    <TransitionContext.Provider value={{ enter: TRANSITION, dismiss: DISMISS, isDismissing, triggerDismiss }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionParams() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransitionParams must be used within TransitionProvider");
  return ctx;
}

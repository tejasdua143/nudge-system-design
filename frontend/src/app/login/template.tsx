/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Login Page Transition
 *
 * Read top-to-bottom. Triggered on every route change.
 *
 *  ENTER (every page):
 *    0ms   page enters from right (translateX), blurred, transparent
 *  250ms   page settles at center, blur clears, fully opaque
 *
 *  DISMISS (api-key → developer):
 *    0ms   page slides down, blurs out, fades to transparent
 *  350ms   navigation fires after animation completes
 * ───────────────────────────────────────────────────────── */

"use client";

import { motion } from "motion/react";
import { useTransitionParams } from "./transition-context";

export default function LoginTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { enter, dismiss, isDismissing } = useTransitionParams();

  return (
    <motion.div
      initial={{
        x: enter.offsetX,
        y: 0,
        filter: `blur(${enter.blur}px)`,
        opacity: enter.opacity,
      }}
      animate={
        isDismissing
          ? {
              y: dismiss.offsetY,
              filter: `blur(${dismiss.blur}px)`,
              opacity: 0,
            }
          : {
              x: 0,
              y: 0,
              filter: "blur(0px)",
              opacity: 1,
            }
      }
      transition={
        isDismissing
          ? (dismiss.spring as any)
          : (enter.spring as any)
      }
    >
      {children}
    </motion.div>
  );
}

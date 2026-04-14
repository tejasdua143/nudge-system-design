"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, CircleNotch, Check } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { usePersistedDialKit } from "@/hooks/use-persisted-dialkit";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Claim Card
 *
 *    0ms   idle — card has hover tilt + shimmer on appear
 *  click   "claiming" phase begins
 *           → button shows spinner + "Claiming…"
 *           → card shrinks to claimScale with earthquake shake
 *           → shake translates (shakeX, shakeY) + rotates (shakeRotation)
 *           → shake frequency increases over claimDuration
 *  +dur    "claimed" phase
 *           → button shows checkmark + "Claimed"
 *           → card pops back to 1.0 with spring overshoot
 *  +pop    navigate to /login/api-key
 * ───────────────────────────────────────────────────────── */

const SCALE = 1.13;
const TILT_STRENGTH = 15.5;
const GLOW_OPACITY = 0.76;
const PERSPECTIVE = 200;

const REST_SHADOW = [
  "0px 11px 24px -10px rgba(0,0,0,0.39)",
  "0px 0px 0px 1px rgba(0,0,0,0.07)",
  "inset 0 0 0px 1px var(--shadow-inner-1)",
  "inset 0 0 0px 1px var(--shadow-inner-2)",
].join(", ");

const HOVER_SHADOW = [
  "0px 30px 32px -4px rgba(0,0,0,0.15)",
  "0px 0px 0px 1px rgba(0,0,0,0.1)",
  "inset 0 0 0px 1px var(--shadow-inner-1)",
  "inset 0 0 0px 1px var(--shadow-inner-2)",
].join(", ");

type ClaimPhase = "idle" | "claiming" | "claimed";

// ── Confetti burst behind the card ──
const CONFETTI_COLORS = [
  "#FF9F43", "#FECA57", "#FF6B6B", "#48DBFB",
  "#FF9FF3", "#54A0FF", "#5F27CD", "#01A3A4",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  gravity: number;
  friction: number;
};

function createParticles(cx: number, cy: number, count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    return {
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2, // bias upward
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      width: 4 + Math.random() * 4,
      height: 3 + Math.random() * 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      opacity: 1,
      gravity: 0.12 + Math.random() * 0.05,
      friction: 0.98,
    };
  });
}

function animateConfetti(
  canvas: HTMLCanvasElement,
  particles: Particle[],
  onDone: () => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let raf = 0;

  function draw() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const p of particles) {
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      if (p.opacity <= 0) continue;
      alive = true;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = Math.max(0, p.opacity);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      ctx!.restore();
    }

    if (alive) {
      raf = requestAnimationFrame(draw);
    } else {
      onDone();
    }
  }

  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

export default function ClaimCreditPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const [shimmerDone, setShimmerDone] = useState(false);
  const [phase, setPhase] = useState<ClaimPhase>("idle");
  const router = useRouter();
  const rafRef = useRef<number>(0);
  const playRef = useRef<(navigate: boolean) => void>(() => {});
  const hoveringRef = useRef(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const params = usePersistedDialKit("Claim Animation", {
    shake: {
      claimDuration: [1500, 500, 3000],
      claimScale: [0.7, 0.4, 0.95],
      shakeX: [4, 0, 20],
      shakeY: [2, 0, 20],
      shakeRotation: [0, 0, 20],
      shakeSpeed: [20, 4, 30],
    },
    pop: {
      popDuration: [500, 200, 1500],
      popOvershoot: [1.05, 1.0, 1.3],
    },
    play: { type: "action" as const, label: "Play / Replay" },
  }, {
    onAction: (action) => {
      if (action === "play") {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const card = cardRef.current;
        if (card) {
          card.style.transform = "";
          card.style.transition = "none";
        }
        setPhase("claiming");
        requestAnimationFrame(() => {
          playRef.current(false);
        });
      }
    },
  });

  useEffect(() => {
    const shimmer = shimmerRef.current;
    if (!shimmer) return;
    const onEnd = () => setShimmerDone(true);
    shimmer.addEventListener("animationend", onEnd);
    return () => shimmer.removeEventListener("animationend", onEnd);
  }, []);

  // JS-driven claim animation using requestAnimationFrame
  // navigate=false for preview/replay, navigate=true for real claim
  const runClaimAnimation = useCallback((navigate: boolean) => {
    const card = cardRef.current!;
    if (!card) return;

    // Cancel any running animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const duration = params.shake.claimDuration;
    const targetScale = params.shake.claimScale;
    const maxX = params.shake.shakeX;
    const maxY = params.shake.shakeY;
    const maxRot = params.shake.shakeRotation;
    const speed = params.shake.shakeSpeed;
    const popDur = params.pop.popDuration;
    const overshoot = params.pop.popOvershoot;

    const startTime = performance.now();

    function animateClaim(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Scale eases down
      const scale = 1 - progress * (1 - targetScale);

      // Shake intensity ramps up with progress (quadratic)
      const intensity = progress * progress;

      // Frequency increases with progress
      const freq = speed * (1 + progress * 2);
      const t = elapsed / 1000;

      // Pseudo-random shake using sin waves at different frequencies
      const tx = Math.sin(t * freq) * maxX * intensity;
      const ty = Math.cos(t * freq * 1.3) * maxY * intensity;
      const rot = Math.sin(t * freq * 0.7) * maxRot * intensity;

      card.style.transform = `scale(${scale}) translate(${tx}px, ${ty}px) rotate(${rot}deg)`;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateClaim);
      } else {
        // Claiming done — fire confetti + start pop animation
        setPhase("claimed");
        setShowConfetti(true);

        // Fire confetti from the card center
        const canvas = confettiRef.current;
        if (canvas) {
          const cardRect = card.getBoundingClientRect();
          const wrapRect = canvas.parentElement!.getBoundingClientRect();
          canvas.width = wrapRect.width;
          canvas.height = wrapRect.height;
          const cx = cardRect.left - wrapRect.left + cardRect.width / 2;
          const cy = cardRect.top - wrapRect.top + cardRect.height / 2;
          const particles = createParticles(cx, cy, 60);
          animateConfetti(canvas, particles, () => setShowConfetti(false));
        }

        const popStart = performance.now();

        function animatePop(now: number) {
          const popElapsed = now - popStart;
          const popProgress = Math.min(popElapsed / popDur, 1);

          // Spring-like pop: overshoot then settle
          let popScale: number;
          if (popProgress < 0.4) {
            const sub = popProgress / 0.4;
            popScale = targetScale + (overshoot - targetScale) * sub;
          } else if (popProgress < 0.7) {
            const sub = (popProgress - 0.4) / 0.3;
            popScale = overshoot - (overshoot - 0.98) * sub;
          } else {
            const sub = (popProgress - 0.7) / 0.3;
            popScale = 0.98 + (1 - 0.98) * sub;
          }

          const popRot = rot * (1 - popProgress);
          const popTx = tx * (1 - popProgress);
          const popTy = ty * (1 - popProgress);

          card.style.transform = `scale(${popScale}) translate(${popTx}px, ${popTy}px) rotate(${popRot}deg)`;

          if (popProgress < 1) {
            rafRef.current = requestAnimationFrame(animatePop);
          } else {
            card.style.transform = "scale(1)";
            if (navigate) {
              setTimeout(() => {
                router.push("/login/api-key");
              }, 200);
            } else {
              // Preview mode — reset to idle after pop
              setTimeout(() => {
                setPhase("idle");
              }, 400);
            }
          }
        }

        rafRef.current = requestAnimationFrame(animatePop);
      }
    }

    rafRef.current = requestAnimationFrame(animateClaim);
  }, [params, router]);

  // Keep ref in sync for DialKit action callback
  playRef.current = runClaimAnimation;

  const handleClaim = useCallback(() => {
    if (phase !== "idle") return;
    const card = cardRef.current;
    if (!card) return;

    setPhase("claiming");
    card.style.transition = "none";
    runClaimAnimation(true);
  }, [phase, runClaimAnimation]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (phase !== "idle") return;
    const card = cardRef.current;
    if (!card) return;

    // Smooth transition into the hover state
    hoveringRef.current = false;
    card.style.transition = "transform 0.25s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.25s cubic-bezier(0.33, 1, 0.68, 1)";

    // After the initial ease-in, disable transition for responsive tracking
    setTimeout(() => {
      hoveringRef.current = true;
    }, 250);
  }, [phase]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (phase !== "idle") return;
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card || !glow) return;

      // After initial ease-in, disable transition for responsive tracking
      if (hoveringRef.current) {
        card.style.transition = "none";
      }

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = (x - centerX) / centerX;
      const offsetY = (y - centerY) / centerY;
      const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);

      card.style.transform = `scale3d(${SCALE}, ${SCALE}, ${SCALE}) rotate3d(${-offsetY}, ${offsetX}, 0, ${Math.log(distance + 1) * TILT_STRENGTH}deg)`;
      card.style.boxShadow = HOVER_SHADOW;

      glow.style.opacity = String(GLOW_OPACITY);
      glow.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.6), transparent 60%)`;
    },
    [phase]
  );

  const handleMouseLeave = useCallback(() => {
    if (phase !== "idle") return;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    // Restore smooth transition for the return to rest
    card.style.transition = "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.4s cubic-bezier(0.33, 1, 0.68, 1)";
    card.style.transform = "";
    card.style.boxShadow = REST_SHADOW;
    glow.style.opacity = "0";
  }, [phase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col items-center gap-11">
        {/* Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <Gift className="size-8 text-text-brand" weight="duotone" />
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Claim free credit
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            You have a free credit waiting for you. Use it to explore the
            API, test endpoints, and build your first integration. This credit
            expires 14 days after claiming.
          </p>
        </div>

        {/* Credit card */}
        <div
          className="relative flex items-center justify-center overflow-visible p-16 -m-16"
          style={{ perspective: `${PERSPECTIVE}px` }}
        >
          {/* Confetti canvas — behind the card, masked top-solid → bottom-transparent */}
          <canvas
            ref={confettiRef}
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex: 0,
              maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
            }}
          />
          <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-10 h-32 w-48 cursor-pointer overflow-hidden rounded-[var(--radius-card)]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 110% 120%, white, #ffecd0 6%, #ffd9a0 13%, #ffc571 19%, #ffb241 26%, #f97330 49%, #ffb241 74%, transparent), linear-gradient(90deg, #f8f6f2, #f8f6f2)",
              boxShadow: REST_SHADOW,
              transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <div className="absolute bottom-2.5 right-3 text-right">
              <p className="text-[length:var(--text-2xs)] leading-none text-black/47">
                credit
              </p>
              <p className="text-[length:var(--text-2xl)] font-medium leading-none text-black/47">
                200
              </p>
            </div>
            {/* Glow overlay */}
            <div
              ref={glowRef}
              className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
              style={{ transition: "opacity 0.3s ease-out" }}
            />
            {/* Shimmer on appear */}
            {!shimmerDone && (
              <div
                ref={shimmerRef}
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                  backgroundImage:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 55%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "300% 0",
                  filter: "blur(5px)",
                  animation: "card-shimmer 1.5s ease-in-out 0.5s 1 forwards",
                }}
              />
            )}
          </div>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="md"
          className="w-full"
          disabled={phase !== "idle"}
          onClick={handleClaim}
        >
          {phase === "idle" && "Claim"}
          {phase === "claiming" && (
            <>
              <CircleNotch className="size-4 animate-spin" weight="bold" />
              Claiming…
            </>
          )}
          {phase === "claimed" && (
            <>
              <Check className="size-4" weight="bold" />
              Claimed
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

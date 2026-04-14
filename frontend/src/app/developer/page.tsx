"use client";

import { useState } from "react";
import {
  CheckCircle,
  ArrowRight,
  ArrowSquareOut,
  Code,
  ForkKnife,
  PokerChip,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Onboarding steps                                                          */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { label: "Join the Presentations AI Developer Console", done: true },
  { label: "Generate your API keys", done: true },
  { label: "Claim your $200 credit", done: true },
  { label: "Begin creating presentations with the API", done: false, current: true },
  { label: "Upgrade your plan", done: false },
];

/* Gradient per hovered step index (null = default) */
const GRADIENTS: Record<number, string> = {
  0: "radial-gradient(ellipse at 110% 120%, white, #d0f5e0 6%, #a0e8c0 13%, #60d090 19%, #30b868 26%, #22a55b 49%, #30b868 74%, transparent), linear-gradient(90deg, #fafafa, #fafafa)",
  1: "radial-gradient(ellipse at 110% 120%, white, #ffecd0 6%, #ffd9a0 13%, #ffc571 19%, #ffb241 26%, #f97330 49%, #ffb241 74%, transparent), linear-gradient(90deg, #fafafa, #fafafa)",
  2: "radial-gradient(ellipse at 110% 120%, white, #fff4d0 6%, #ffe9a0 13%, #ffd971 19%, #f5c841 26%, #eab308 49%, #f5c841 74%, transparent), linear-gradient(90deg, #fafafa, #fafafa)",
  3: "radial-gradient(ellipse at 110% 120%, white, #ffecd0 6%, #ffd9a0 13%, #ffc571 19%, #ffb241 26%, #f97330 49%, #ffb241 74%, transparent), linear-gradient(90deg, #fafafa, #fafafa)",
  4: "radial-gradient(ellipse at 110% 120%, white, #e0d0ff 6%, #c4a0ff 13%, #a871ff 19%, #8c41ff 26%, #7c3aed 49%, #8c41ff 74%, transparent), linear-gradient(90deg, #fafafa, #fafafa)",
};

const DEFAULT_GRADIENT =
  "radial-gradient(ellipse at 110% 120%, white, #ffecd0 6%, #ffd9a0 13%, #ffc571 19%, #ffb241 26%, #f97330 49%, #ffb241 74%, transparent), linear-gradient(90deg, #fafafa, #fafafa)";

/* -------------------------------------------------------------------------- */
/*  Plans                                                                     */
/* -------------------------------------------------------------------------- */

const PLANS = [
  {
    name: "Starter",
    price: "$199/mo",
    description: "For testing and early integrations with 2000 credits monthly.",
    credits: "2,000",
    variant: "tertiary" as const,
  },
  {
    name: "Growth",
    price: "$499/mo",
    description: "For production workflows and customer-facing use cases",
    credits: "6,000",
    variant: "primary" as const,
  },
  {
    name: "Scale",
    price: "$1,999/mo",
    description: "For high-volume or mission-critical usage",
    credits: "6,000",
    variant: "tertiary" as const,
  },
];

/* -------------------------------------------------------------------------- */
/*  Endpoints                                                                 */
/* -------------------------------------------------------------------------- */

const ENDPOINTS = [
  {
    name: "/Topic",
    description: "Generates a presentation on a topic using AI.",
  },
  {
    name: "/File",
    description: "Generates a presentation from an uploaded file using AI analysis.",
  },
  {
    name: "/SingleSlide",
    description: "Creates a single slide on a topic using AI.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Quicklinks                                                                */
/* -------------------------------------------------------------------------- */

const QUICKLINKS = [
  {
    icon: Code,
    title: "Developer docs",
    description: "Get started with Presentations AI developer console",
  },
  {
    icon: ForkKnife,
    title: "Cookbooks",
    description: "Practical example and best practices",
  },
  {
    icon: PokerChip,
    title: "Help center",
    description: "Visit our help center for a quick API guide.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function DeveloperDashboardPage() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
      <main className="flex flex-1 flex-col overflow-hidden rounded-xl bg-bg-primary shadow-elevation-3">
        {/* Header */}
        <div className="flex h-[63px] items-center border-b border-border-secondary px-6">
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Home
          </h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Section: Get started */}
          <section className="flex flex-col items-center gap-4 px-6 py-8">
            <div className="w-full max-w-3xl">
              <h2 className="text-[length:var(--text-md)] font-medium text-text-primary">
                Get started with presentations AI
              </h2>
            </div>
            <div className="flex w-full max-w-3xl overflow-hidden rounded-lg bg-bg-elevated p-1 shadow-elevation-2">
              <div className="flex w-full">
                {/* Gradient image area */}
                <div className="relative flex-1 overflow-hidden rounded-md border border-border-tertiary">
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      backgroundImage:
                        hoveredStep !== null
                          ? GRADIENTS[hoveredStep]
                          : DEFAULT_GRADIENT,
                    }}
                  />
                  {/* Placeholder presentation cards */}
                  <div className="relative flex items-center justify-center gap-5 py-16">
                    <div className="h-[136px] w-[174px] rounded bg-white/60 shadow-elevation-1" />
                    <div className="h-[136px] w-[174px] rounded bg-white shadow-elevation-1" />
                    <div className="h-[136px] w-[174px] rounded bg-white/60 shadow-elevation-1" />
                  </div>
                </div>

                {/* Steps */}
                <div className="flex w-[400px] shrink-0 flex-col gap-1 p-4">
                  {STEPS.map((step, i) => (
                    <div key={i}>
                      <button
                        className="group/step flex w-full items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-bg-elevated-hover"
                        onMouseEnter={() => setHoveredStep(i)}
                        onMouseLeave={() => setHoveredStep(null)}
                      >
                        <CheckCircle
                          weight={step.done ? "fill" : "regular"}
                          className={cn(
                            "size-5 shrink-0",
                            step.done
                              ? "text-green-600"
                              : "text-text-tertiary"
                          )}
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <span
                            className={cn(
                              "text-left text-[length:var(--text-base)]",
                              step.done
                                ? "text-text-secondary line-through"
                                : step.current
                                  ? "font-medium text-text-primary decoration-border-brand underline-offset-2 group-hover/step:underline"
                                  : "text-text-primary decoration-border-brand underline-offset-2 group-hover/step:underline"
                            )}
                          >
                            {step.label}
                          </span>
                          {!step.done && (
                            <ArrowRight className="size-4 shrink-0 text-text-tertiary group-hover/step:text-text-brand" />
                          )}
                        </div>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div className="mx-2 h-px bg-border-tertiary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Upgrade your plan */}
          <section className="flex flex-col items-center px-6 py-6">
            <div className="flex w-full max-w-3xl flex-col gap-3">
              <h2 className="text-[length:var(--text-md)] font-medium text-text-primary">
                Upgrade your plan
              </h2>
              <div className="flex gap-5">
                {PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className="flex flex-1 flex-col gap-6 overflow-hidden rounded-lg bg-bg-elevated p-3 shadow-elevation-2"
                  >
                    {/* Placeholder image */}
                    <div className="size-[60px] rounded bg-bg-secondary" />

                    <div className="flex flex-col gap-3">
                      {/* Plan info */}
                      <div className="flex flex-col gap-1 text-[length:var(--text-base)]">
                        <div className="flex items-center gap-1 font-medium">
                          <span className="text-text-primary">{plan.name}</span>
                          <span className="text-text-primary">·</span>
                          <span className="text-text-brand">{plan.price}</span>
                        </div>
                        <p className="text-text-secondary">{plan.description}</p>
                      </div>

                      {/* Credits */}
                      <p className="text-[length:var(--text-base)]">
                        <span className="font-medium text-text-primary">
                          {plan.credits}{" "}
                        </span>
                        <span className="text-text-tertiary">credits/mo</span>
                      </p>
                    </div>

                    <Button variant={plan.variant} size="sm" className="self-start">
                      Upgrade to {plan.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Our end points */}
          <section className="flex flex-col items-center px-6 py-6">
            <div className="flex w-full max-w-3xl flex-col gap-3">
              <h2 className="text-[length:var(--text-md)] font-medium text-text-primary">
                Our end points
              </h2>
              <div className="flex gap-5">
                {ENDPOINTS.map((ep) => (
                  <div
                    key={ep.name}
                    className="flex flex-1 flex-col overflow-hidden rounded-lg bg-bg-elevated shadow-elevation-2 hover:shadow-elevation-3"
                  >
                    <div className="flex items-start gap-1 p-3">
                      <div className="flex flex-1 flex-col gap-1 text-[length:var(--text-base)]">
                        <span className="font-medium text-text-primary">
                          {ep.name}
                        </span>
                        <span className="line-clamp-3 text-text-secondary">
                          {ep.description}
                        </span>
                      </div>
                      <ArrowSquareOut className="size-5 shrink-0 text-text-secondary" />
                    </div>
                    {/* Footer card */}
                    <div className="mt-auto ml-2 h-[152px] rounded-tl bg-bg-secondary shadow-elevation-1" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Quicklinks */}
          <section className="flex flex-col items-center px-6 py-6 pb-12">
            <div className="flex w-full max-w-3xl flex-col gap-3">
              <h2 className="text-[length:var(--text-md)] font-medium text-text-primary">
                Quicklinks
              </h2>
              <div className="flex gap-5">
                {QUICKLINKS.map((link) => (
                  <button
                    key={link.title}
                    className="group/link flex flex-1 cursor-pointer flex-col gap-3 overflow-hidden rounded-lg bg-bg-elevated p-3 text-left shadow-elevation-2 hover:shadow-elevation-3"
                  >
                    <link.icon
                      weight="duotone"
                      className="size-6 text-text-brand"
                    />
                    <div className="flex flex-col gap-1 text-[length:var(--text-base)]">
                      <span className="font-medium text-text-primary decoration-border-brand underline-offset-2 group-hover/link:underline">
                        {link.title}
                      </span>
                      <span className="text-text-secondary">
                        {link.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
  );
}

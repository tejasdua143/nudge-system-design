import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-[length:var(--text-base)] font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[length:var(--focus-ring-width)] focus-visible:ring-border-brand-secondary focus-visible:ring-offset-1 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        tertiary: "",
        link: "underline-offset-4 hover:underline",
        // shadcn backward compat aliases
        default: "",
        destructive: "",
        outline: "",
        ghost: "",
      },
      tone: {
        default: "",
        danger: "",
        magic: "",
      },
      size: {
        lg: "h-11 px-5 py-2.5 text-[length:var(--text-base)] has-[>svg]:px-4",
        md: "h-9 px-3.5 py-2 text-[length:var(--text-base)] has-[>svg]:px-3",
        sm: "h-7 px-2.5 py-1 text-[length:var(--text-xs)] gap-1 has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        // shadcn backward compat aliases
        default: "h-9 px-3.5 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-[length:var(--text-xs)] has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    compoundVariants: [
      // === PRIMARY + DEFAULT (brand) ===
      {
        variant: ["primary", "default"],
        tone: "default",
        className:
          "bg-bg-brand text-text-white shadow-elevation-1 hover:bg-bg-brand-hover active:bg-bg-brand-pressed",
      },
      // === PRIMARY + DANGER ===
      {
        variant: ["primary", "destructive"],
        tone: "danger",
        className:
          "bg-bg-danger text-text-white shadow-elevation-1 hover:bg-bg-danger-hover active:bg-bg-danger-pressed",
      },
      // === PRIMARY + MAGIC ===
      {
        variant: ["primary"],
        tone: "magic",
        className:
          "bg-gradient-to-r from-[var(--gradient-brand-start)] via-[var(--gradient-brand-mid)] to-[var(--gradient-brand-end)] text-text-white shadow-elevation-1 hover:opacity-90 active:opacity-80",
      },
      // === SECONDARY + DEFAULT ===
      {
        variant: ["secondary", "outline"],
        tone: "default",
        className:
          "bg-bg-elevated text-text-primary border border-border-primary-inverted shadow-elevation-1 hover:bg-bg-elevated-hover",
      },
      // === SECONDARY + DANGER ===
      {
        variant: ["secondary"],
        tone: "danger",
        className:
          "bg-bg-elevated text-text-danger-primary border border-border-danger shadow-elevation-1 hover:bg-bg-danger-inverted",
      },
      // === TERTIARY + DEFAULT ===
      {
        variant: ["tertiary"],
        tone: "default",
        className:
          "bg-bg-elevated text-text-primary shadow-button-rest hover:bg-bg-elevated-hover",
      },
      // === TERTIARY + DANGER ===
      {
        variant: ["tertiary"],
        tone: "danger",
        className:
          "bg-bg-elevated text-text-danger-primary shadow-button-rest hover:bg-bg-danger-inverted",
      },
      // === GHOST + DEFAULT ===
      {
        variant: ["ghost"],
        tone: "default",
        className:
          "bg-transparent text-text-primary hover:bg-bg-elevated-hover",
      },
      // === GHOST + DANGER ===
      {
        variant: ["ghost"],
        tone: "danger",
        className:
          "bg-transparent text-text-danger-primary hover:bg-bg-danger-inverted",
      },
      // === LINK + DEFAULT ===
      {
        variant: "link",
        tone: "default",
        className: "text-text-brand hover:text-text-brand-hover",
      },
      // === LINK + DANGER ===
      {
        variant: "link",
        tone: "danger",
        className: "text-text-danger-primary hover:text-text-danger-hover",
      },
      // === Legacy: destructive variant auto-maps to danger tone ===
      {
        variant: "destructive",
        tone: "default",
        className:
          "bg-bg-danger text-text-white shadow-elevation-1 hover:bg-bg-danger-hover active:bg-bg-danger-pressed",
      },
    ],
    defaultVariants: {
      variant: "primary",
      tone: "default",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  tone = "default",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={cn(buttonVariants({ variant, tone, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

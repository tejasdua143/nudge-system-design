"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Mail } from "lucide-react"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"
import { getIcon, LEADING_ICON_OPTIONS, TRAILING_ICON_OPTIONS } from "@/components/docs/icon-picker"

export function ButtonDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          {
            type: "select",
            name: "variant",
            label: "Variant",
            options: ["primary", "secondary", "tertiary", "link"],
          },
          {
            type: "select",
            name: "tone",
            label: "Tone",
            options: ["default", "danger", "magic"],
          },
          {
            type: "select",
            name: "size",
            label: "Size",
            options: ["sm", "md", "lg", "icon"],
          },
          { type: "boolean", name: "disabled", label: "Disabled" },
          { type: "text", name: "children", label: "Label", defaultValue: "Button" },
          {
            type: "select",
            name: "leadingIcon",
            label: "Leading Icon",
            options: LEADING_ICON_OPTIONS,
            defaultValue: "none",
          },
          {
            type: "select",
            name: "trailingIcon",
            label: "Trailing Icon",
            options: TRAILING_ICON_OPTIONS,
            defaultValue: "none",
          },
        ]}
        render={(props) => {
          const LeadingIcon = getIcon(props.leadingIcon as string)
          const TrailingIcon = getIcon(props.trailingIcon as string)
          const isIcon = props.size === "icon"

          return (
            <Button
              variant={props.variant as "primary" | "secondary" | "tertiary" | "link"}
              tone={props.tone as "default" | "danger" | "magic"}
              size={props.size as "sm" | "md" | "lg" | "icon"}
              disabled={props.disabled as boolean}
            >
              {isIcon ? (
                <Mail />
              ) : (
                <>
                  {LeadingIcon ? <LeadingIcon /> : null}
                  {(props.children as string) || "Button"}
                  {TrailingIcon ? <TrailingIcon /> : null}
                </>
              )}
            </Button>
          )
        }}
      />

      <Separator />

      {/* ── Variant × Tone matrix ── */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Variants
        </p>
        <div className="flex flex-col gap-4">
          {/* Primary */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Primary</span>
            <Button variant="primary">Default</Button>
            <Button variant="primary" tone="danger">Danger</Button>
            <Button variant="primary" tone="magic">Magic</Button>
          </div>
          {/* Secondary */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Secondary</span>
            <Button variant="secondary">Default</Button>
            <Button variant="secondary" tone="danger">Danger</Button>
          </div>
          {/* Tertiary */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Tertiary</span>
            <Button variant="tertiary">Default</Button>
            <Button variant="tertiary" tone="danger">Danger</Button>
          </div>
          {/* Link */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Link</span>
            <Button variant="link">Default</Button>
            <Button variant="link" tone="danger">Danger</Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Sizes ── */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Sizes
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Primary</span>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Mail /></Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Secondary</span>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary" size="md">Medium</Button>
            <Button variant="secondary" size="lg">Large</Button>
            <Button variant="secondary" size="icon"><Mail /></Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Tertiary</span>
            <Button variant="tertiary" size="sm">Small</Button>
            <Button variant="tertiary" size="md">Medium</Button>
            <Button variant="tertiary" size="lg">Large</Button>
            <Button variant="tertiary" size="icon"><Mail /></Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── States ── */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          States
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Primary</span>
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
            <Button disabled><Loader2 className="animate-spin" /> Loading</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Secondary</span>
            <Button variant="secondary">Default</Button>
            <Button variant="secondary" disabled>Disabled</Button>
            <Button variant="secondary" disabled><Loader2 className="animate-spin" /> Loading</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-[length:var(--text-xs)] text-text-secondary">Tertiary</span>
            <Button variant="tertiary">Default</Button>
            <Button variant="tertiary" disabled>Disabled</Button>
            <Button variant="tertiary" disabled><Loader2 className="animate-spin" /> Loading</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

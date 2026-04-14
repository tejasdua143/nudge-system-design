"use client"

import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic } from "lucide-react"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function ToggleDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          {
            type: "select",
            name: "variant",
            label: "Variant",
            options: ["default", "outline"],
          },
          {
            type: "select",
            name: "size",
            label: "Size",
            options: ["default", "sm", "lg"],
          },
          { type: "boolean", name: "disabled", label: "Disabled" },
        ]}
        render={(props) => (
          <Toggle
            variant={props.variant as "default" | "outline"}
            size={props.size as "default" | "sm" | "lg"}
            disabled={props.disabled as boolean}
            aria-label="Toggle bold"
          >
            <Bold />
          </Toggle>
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Toggle aria-label="Toggle bold"><Bold /></Toggle>
            <Toggle aria-label="Toggle italic"><Italic /></Toggle>
          </div>
          <div className="flex gap-2">
            <Toggle variant="outline" aria-label="Toggle bold"><Bold /></Toggle>
            <Toggle variant="outline" aria-label="Toggle italic"><Italic /></Toggle>
          </div>
        </div>
      </div>
    </div>
  )
}

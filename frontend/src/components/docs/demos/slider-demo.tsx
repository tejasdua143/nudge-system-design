"use client"

import { Slider } from "@/components/ui/slider"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function SliderDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          { type: "number", name: "value", label: "Value", defaultValue: 50, min: 0, max: 100, step: 1 },
          { type: "number", name: "max", label: "Max", defaultValue: 100, min: 1, max: 200, step: 1 },
          { type: "number", name: "step", label: "Step", defaultValue: 1, min: 1, max: 50, step: 1 },
          { type: "boolean", name: "disabled", label: "Disabled" },
        ]}
        render={(props) => (
          <Slider
            value={[props.value as number]}
            max={props.max as number}
            step={props.step as number}
            disabled={props.disabled as boolean}
            className="w-full max-w-sm"
          />
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="flex flex-col gap-6 max-w-sm">
          <Slider defaultValue={[50]} max={100} step={1} />
          <Slider defaultValue={[25, 75]} max={100} step={1} />
        </div>
      </div>
    </div>
  )
}

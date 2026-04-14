"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface SelectControl {
  type: "select"
  name: string
  label: string
  options: string[]
  defaultValue?: string
}

interface BooleanControl {
  type: "boolean"
  name: string
  label: string
  defaultValue?: boolean
}

interface TextControl {
  type: "text"
  name: string
  label: string
  defaultValue?: string
}

interface NumberControl {
  type: "number"
  name: string
  label: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
}

export type PlaygroundControl =
  | SelectControl
  | BooleanControl
  | TextControl
  | NumberControl

interface ComponentPlaygroundProps {
  controls: PlaygroundControl[]
  render: (values: Record<string, unknown>) => React.ReactNode
}

function getDefaultValues(controls: PlaygroundControl[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const control of controls) {
    switch (control.type) {
      case "select":
        values[control.name] = control.defaultValue ?? control.options[0]
        break
      case "boolean":
        values[control.name] = control.defaultValue ?? false
        break
      case "text":
        values[control.name] = control.defaultValue ?? ""
        break
      case "number":
        values[control.name] = control.defaultValue ?? 0
        break
    }
  }
  return values
}

export function ComponentPlayground({ controls, render }: ComponentPlaygroundProps) {
  const [values, setValues] = useState(() => getDefaultValues(controls))

  const update = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Controls */}
        <div className="shrink-0 space-y-3 sm:w-48">
          <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground">
            Controls
          </p>
          {controls.map((control) => (
            <div key={control.name} className="space-y-1.5">
              <Label className="text-[length:var(--text-xs)]">{control.label}</Label>
              {control.type === "select" && (
                <Select
                  value={values[control.name] as string}
                  onValueChange={(v) => update(control.name, v)}
                >
                  <SelectTrigger size="sm" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {control.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {control.type === "boolean" && (
                <div>
                  <Switch
                    checked={values[control.name] as boolean}
                    onCheckedChange={(v) => update(control.name, v)}
                  />
                </div>
              )}
              {control.type === "text" && (
                <Input
                  value={values[control.name] as string}
                  onChange={(e) => update(control.name, e.target.value)}
                  className="h-8 text-[length:var(--text-xs)]"
                />
              )}
              {control.type === "number" && (
                <Input
                  type="number"
                  value={values[control.name] as number}
                  onChange={(e) => update(control.name, Number(e.target.value))}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  className="h-8 text-[length:var(--text-xs)]"
                />
              )}
            </div>
          ))}
        </div>

        {/* Separator */}
        <Separator orientation="vertical" className="hidden sm:block" />
        <Separator className="sm:hidden" />

        {/* Preview */}
        <div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-8">
          {render(values)}
        </div>
      </div>
    </div>
  )
}

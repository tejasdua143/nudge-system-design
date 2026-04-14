"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function ProgressDemo() {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          { type: "number", name: "value", label: "Value", defaultValue: 50, min: 0, max: 100, step: 1 },
        ]}
        render={(props) => (
          <Progress value={props.value as number} className="w-full max-w-sm" />
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <Progress value={progress} className="w-[60%]" />
      </div>
    </div>
  )
}

"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function TextareaDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          { type: "text", name: "placeholder", label: "Placeholder", defaultValue: "Type your message here..." },
          { type: "boolean", name: "disabled", label: "Disabled" },
        ]}
        render={(props) => (
          <Textarea
            placeholder={props.placeholder as string}
            disabled={props.disabled as boolean}
            className="max-w-sm"
          />
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="grid gap-2 max-w-sm">
          <Label htmlFor="message">Your message</Label>
          <Textarea id="message" placeholder="Type your message here..." />
        </div>
      </div>
    </div>
  )
}

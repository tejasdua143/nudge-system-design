"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function CheckboxDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          { type: "boolean", name: "checked", label: "Checked", defaultValue: false },
          { type: "boolean", name: "disabled", label: "Disabled" },
        ]}
        render={(props) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={props.checked as boolean}
              disabled={props.disabled as boolean}
            />
            <Label>Checkbox</Label>
          </div>
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="marketing" defaultChecked />
            <Label htmlFor="marketing">Receive marketing emails</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled">Disabled option</Label>
          </div>
        </div>
      </div>
    </div>
  )
}

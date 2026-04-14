"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function SwitchDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          { type: "boolean", name: "checked", label: "Checked", defaultValue: false },
          { type: "boolean", name: "disabled", label: "Disabled" },
        ]}
        render={(props) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={props.checked as boolean}
              disabled={props.disabled as boolean}
            />
            <Label>Switch</Label>
          </div>
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="notifications" defaultChecked />
            <Label htmlFor="notifications">Notifications</Label>
          </div>
        </div>
      </div>
    </div>
  )
}

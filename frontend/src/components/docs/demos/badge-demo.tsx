"use client"

import { Badge } from "@/components/ui/badge"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function BadgeDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          {
            type: "select",
            name: "variant",
            label: "Variant",
            options: ["default", "secondary", "outline", "destructive"],
          },
          { type: "text", name: "children", label: "Label", defaultValue: "Badge" },
        ]}
        render={(props) => (
          <Badge
            variant={props.variant as "default" | "secondary" | "outline" | "destructive"}
          >
            {(props.children as string) || "Badge"}
          </Badge>
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>
    </div>
  )
}

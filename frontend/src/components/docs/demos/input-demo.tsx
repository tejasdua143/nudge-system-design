"use client"

import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"
import { getIcon, LEADING_ICON_OPTIONS, TRAILING_ICON_OPTIONS } from "@/components/docs/icon-picker"

export function InputDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          {
            type: "select",
            name: "type",
            label: "Type",
            options: ["text", "email", "password", "number", "search", "url"],
          },
          { type: "text", name: "placeholder", label: "Placeholder", defaultValue: "Enter text..." },
          { type: "boolean", name: "disabled", label: "Disabled" },
          {
            type: "select",
            name: "leadingIcon",
            label: "Leading Icon",
            options: ["none", "Search", "Mail", "Lock", "User", "Calendar"],
            defaultValue: "none",
          },
          {
            type: "select",
            name: "trailingIcon",
            label: "Trailing Icon",
            options: ["none", "Eye", "X", "ChevronDown", "Search"],
            defaultValue: "none",
          },
        ]}
        render={(props) => {
          const LeadingIcon = getIcon(props.leadingIcon as string)
          const TrailingIcon = getIcon(props.trailingIcon as string)
          const hasLeading = !!LeadingIcon
          const hasTrailing = !!TrailingIcon
          const disabled = props.disabled as boolean

          if (!hasLeading && !hasTrailing) {
            return (
              <Input
                type={props.type as string}
                placeholder={props.placeholder as string}
                disabled={disabled}
                className="max-w-sm"
              />
            )
          }

          return (
            <InputGroup
              className="max-w-sm"
              data-disabled={disabled || undefined}
            >
              {hasLeading && (
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <LeadingIcon className="size-4" />
                  </InputGroupText>
                </InputGroupAddon>
              )}
              <InputGroupInput
                type={props.type as string}
                placeholder={props.placeholder as string}
                disabled={disabled}
              />
              {hasTrailing && (
                <InputGroupAddon align="inline-end">
                  <InputGroupText>
                    <TrailingIcon className="size-4" />
                  </InputGroupText>
                </InputGroupAddon>
              )}
            </InputGroup>
          )
        }}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="grid gap-2">
            <Label htmlFor="text">Text</Label>
            <Input id="text" type="text" placeholder="Enter text..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="disabled-input">Disabled</Label>
            <Input id="disabled-input" disabled placeholder="Disabled input" />
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useThemeConfig } from "@/hooks/use-theme-config"
import { RADIUS_PRESETS, COLOR_PRESETS } from "@/lib/theme-presets"
import { cn } from "@/lib/utils"

export function ThemeConfigPanel() {
  const { radius, colorName, customHex, changeRadius, changeColor, changeCustomHex } =
    useThemeConfig()

  const isCustom = customHex && !colorName
  const hexPreview =
    customHex && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(customHex)
      ? customHex
      : undefined

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="size-10 rounded-full shadow-lg"
          >
            <Settings2 className="size-4" />
            <span className="sr-only">Theme settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" sideOffset={12} className="w-80">
          <div className="space-y-3">
            <Label className="text-[length:var(--text-xs)] uppercase tracking-wider text-muted-foreground">
              Accent Color
            </Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  title={preset.name}
                  onClick={() => changeColor(preset.name)}
                  className={cn(
                    "size-8 rounded-full border-2 transition-all",
                    colorName === preset.name
                      ? "border-foreground scale-110"
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                  style={{ backgroundColor: preset.swatch }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-8 shrink-0 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: hexPreview ?? "transparent",
                  borderColor: isCustom
                    ? "var(--foreground)"
                    : hexPreview
                      ? "var(--border)"
                      : "var(--border)",
                }}
              />
              <Input
                placeholder="#3b82f6"
                value={customHex}
                onChange={(e) => changeCustomHex(e.target.value)}
                className="h-8 font-mono text-[length:var(--text-xs)]"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label className="text-[length:var(--text-xs)] uppercase tracking-wider text-muted-foreground">
              Corner Radius
            </Label>
            <div className="flex gap-1.5">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => changeRadius(preset.value)}
                  className={cn(
                    "flex-1 rounded-md border px-2 py-1.5 text-[length:var(--text-xs)] font-medium transition-colors",
                    radius === preset.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div
                className="size-10 border-2 border-primary bg-primary/10"
                style={{ borderRadius: radius }}
              />
              <span className="text-[length:var(--text-xs)] text-muted-foreground font-mono">
                --radius: {radius}
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

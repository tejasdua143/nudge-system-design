"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

export function ToggleGroupDemo() {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" aria-label="Toggle bold"><Bold /></ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic"><Italic /></ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline"><Underline /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline">
        <ToggleGroupItem value="bold" aria-label="Toggle bold"><Bold /></ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic"><Italic /></ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline"><Underline /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

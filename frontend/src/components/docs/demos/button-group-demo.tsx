"use client"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ChevronDown } from "lucide-react"

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="tertiary">Save</Button>
      <Button variant="tertiary" size="icon">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  )
}

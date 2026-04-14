import { Kbd } from "@/components/ui/kbd"

export function KbdDemo() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
      <div className="flex gap-1">
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </div>
      <Kbd>Enter</Kbd>
      <Kbd>Shift</Kbd>
    </div>
  )
}

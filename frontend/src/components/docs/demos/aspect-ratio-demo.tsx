import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioDemo() {
  return (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center">
        <span className="text-muted-foreground text-[length:var(--text-base)]">16:9 Aspect Ratio</span>
      </AspectRatio>
    </div>
  )
}

import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Inbox } from "lucide-react"

export function EmptyDemo() {
  return (
    <Empty>
      <Inbox className="size-12 text-muted-foreground" />
      <EmptyTitle>No results found</EmptyTitle>
      <EmptyDescription>Try adjusting your search or filters to find what you are looking for.</EmptyDescription>
    </Empty>
  )
}

"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function ToastDemo() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => toast("Default toast notification")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Success!")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.info("For your information")}>
        Info
      </Button>
    </div>
  )
}

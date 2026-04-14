import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-1 text-[length:var(--text-md)] shadow-[inset_0_0_0_1px_var(--border-secondary),0_1px_4px_-1px_var(--shadow-drop-2)] transition-[color,box-shadow] outline-none md:text-[length:var(--text-base)]",
        "text-text-primary placeholder:text-text-tertiary",
        "selection:bg-bg-brand-selected selection:text-text-primary",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-[length:var(--text-base)] file:font-medium",
        "focus-visible:shadow-[inset_0_0_0_1px_var(--border-brand),0_0_0_3px_var(--border-brand-secondary)]",
        "aria-invalid:shadow-[inset_0_0_0_1px_var(--border-danger),0_0_0_3px_var(--border-danger-secondary)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }

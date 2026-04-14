"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          boxShadow: "inset 0 0 0 1px var(--shadow-inner-1), 0 0 0 1px var(--shadow-drop-2), 0 1px 2px 0 var(--shadow-drop-2), 0 4px 6px 0 var(--shadow-drop-2), 0 24px 40px -16px var(--shadow-drop-2)",
          borderRadius: "6px",
          border: "none",
        },
        classNames: {
          toast: "!p-3",
          actionButton: "!bg-transparent !text-text-brand !text-[length:var(--text-xs)] !font-medium !px-2 !py-1 !rounded-[6px] !h-auto hover:!bg-bg-elevated-hover",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "transparent",
          "--border-radius": "6px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

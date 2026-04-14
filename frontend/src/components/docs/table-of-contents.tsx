"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  {
    name: "Design Tokens",
    items: [
      { id: "color-variables", label: "Color Variables" },
      { id: "elevation", label: "Elevation" },
      { id: "typography", label: "Typography" },
    ],
  },
  {
    name: "Forms & Inputs",
    items: [
      { id: "button", label: "Button" },
      { id: "button-group", label: "Button Group" },
      { id: "checkbox", label: "Checkbox" },
      { id: "combobox", label: "Combobox" },
      { id: "field", label: "Field" },
      { id: "form", label: "Form" },
      { id: "input", label: "Input" },
      { id: "input-group", label: "Input Group" },
      { id: "input-otp", label: "Input OTP" },
      { id: "label", label: "Label" },
      { id: "native-select", label: "Native Select" },
      { id: "radio-group", label: "Radio Group" },
      { id: "select", label: "Select" },
      { id: "slider", label: "Slider" },
      { id: "switch", label: "Switch" },
      { id: "textarea", label: "Textarea" },
      { id: "toggle", label: "Toggle" },
      { id: "toggle-group", label: "Toggle Group" },
    ],
  },
  {
    name: "Layout",
    items: [
      { id: "aspect-ratio", label: "Aspect Ratio" },
      { id: "card", label: "Card" },
      { id: "empty", label: "Empty" },
      { id: "resizable", label: "Resizable" },
      { id: "scroll-area", label: "Scroll Area" },
      { id: "separator", label: "Separator" },
    ],
  },
  {
    name: "Navigation",
    items: [
      { id: "breadcrumb", label: "Breadcrumb" },
      { id: "context-menu", label: "Context Menu" },
      { id: "dropdown-menu", label: "Dropdown Menu" },
      { id: "menubar", label: "Menubar" },
      { id: "navigation-menu", label: "Navigation Menu" },
      { id: "pagination", label: "Pagination" },
      { id: "sidebar", label: "Sidebar" },
      { id: "tabs", label: "Tabs" },
    ],
  },
  {
    name: "Display & Data",
    items: [
      { id: "accordion", label: "Accordion" },
      { id: "alert", label: "Alert" },
      { id: "avatar", label: "Avatar" },
      { id: "badge", label: "Badge" },
      { id: "calendar", label: "Calendar" },
      { id: "carousel", label: "Carousel" },
      { id: "chart", label: "Chart" },
      { id: "collapsible", label: "Collapsible" },
      { id: "kbd", label: "Kbd" },
      { id: "progress", label: "Progress" },
      { id: "skeleton", label: "Skeleton" },
      { id: "spinner", label: "Spinner" },
      { id: "table", label: "Table" },
    ],
  },
  {
    name: "Dialogs & Overlays",
    items: [
      { id: "alert-dialog", label: "Alert Dialog" },
      { id: "command", label: "Command" },
      { id: "dialog", label: "Dialog" },
      { id: "drawer", label: "Drawer" },
      { id: "hover-card", label: "Hover Card" },
      { id: "popover", label: "Popover" },
      { id: "sheet", label: "Sheet" },
      { id: "tooltip", label: "Tooltip" },
    ],
  },
  {
    name: "Feedback",
    items: [
      { id: "sonner", label: "Sonner" },
      { id: "toast", label: "Toast" },
    ],
  },
]

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const ids = CATEGORIES.flatMap((c) => c.items.map((i) => i.id))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r border-border bg-background p-6 hidden lg:block">
      <div className="mb-4">
        <a href="/" className="text-[length:var(--text-base)] text-muted-foreground hover:text-foreground">
          &larr; Home
        </a>
      </div>
      <h2 className="text-[length:var(--text-base)] font-semibold mb-4">Components</h2>
      <nav className="space-y-4">
        {CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3 className="text-[length:var(--text-xs)] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {category.name}
            </h3>
            <ul className="space-y-0.5">
              {category.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className={cn(
                      "block text-[length:var(--text-base)] py-0.5 px-2 rounded-sm transition-colors",
                      activeId === item.id
                        ? "text-foreground bg-accent font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

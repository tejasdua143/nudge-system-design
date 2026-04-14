"use client"

const COLOR_GROUPS = [
  {
    label: "Background",
    colors: [
      { variable: "--bg-primary", tailwind: "bg-bg-primary" },
      { variable: "--bg-primary-inverted", tailwind: "bg-bg-primary-inverted" },
      { variable: "--bg-secondary", tailwind: "bg-bg-secondary" },
      { variable: "--bg-secondary-inverted", tailwind: "bg-bg-secondary-inverted" },
      { variable: "--bg-tertiary", tailwind: "bg-bg-tertiary" },
      { variable: "--bg-tertiary-inverted", tailwind: "bg-bg-tertiary-inverted" },
      { variable: "--bg-quaternary", tailwind: "bg-bg-quaternary" },
      { variable: "--bg-elevated", tailwind: "bg-bg-elevated" },
      { variable: "--bg-elevated-hover", tailwind: "bg-bg-elevated-hover" },
    ],
  },
  {
    label: "Background — Brand",
    colors: [
      { variable: "--bg-brand", tailwind: "bg-bg-brand" },
      { variable: "--bg-brand-hover", tailwind: "bg-bg-brand-hover" },
      { variable: "--bg-brand-pressed", tailwind: "bg-bg-brand-pressed" },
      { variable: "--bg-brand-selected", tailwind: "bg-bg-brand-selected" },
      { variable: "--bg-brand-inverted", tailwind: "bg-bg-brand-inverted" },
    ],
  },
  {
    label: "Background — Status",
    colors: [
      { variable: "--bg-danger", tailwind: "bg-bg-danger" },
      { variable: "--bg-danger-hover", tailwind: "bg-bg-danger-hover" },
      { variable: "--bg-danger-pressed", tailwind: "bg-bg-danger-pressed" },
      { variable: "--bg-danger-inverted", tailwind: "bg-bg-danger-inverted" },
      { variable: "--bg-warning", tailwind: "bg-bg-warning" },
      { variable: "--bg-warning-inverted", tailwind: "bg-bg-warning-inverted" },
      { variable: "--bg-success", tailwind: "bg-bg-success" },
      { variable: "--bg-success-inverted", tailwind: "bg-bg-success-inverted" },
      { variable: "--bg-info", tailwind: "bg-bg-info" },
      { variable: "--bg-info-inverted", tailwind: "bg-bg-info-inverted" },
    ],
  },
  {
    label: "Text",
    colors: [
      { variable: "--text-primary", tailwind: "text-text-primary" },
      { variable: "--text-primary-inverted", tailwind: "text-text-primary-inverted" },
      { variable: "--text-secondary", tailwind: "text-text-secondary" },
      { variable: "--text-secondary-inverted", tailwind: "text-text-secondary-inverted" },
      { variable: "--text-tertiary", tailwind: "text-text-tertiary" },
      { variable: "--text-white", tailwind: "text-text-white" },
    ],
  },
  {
    label: "Text — Brand & Status",
    colors: [
      { variable: "--text-brand", tailwind: "text-text-brand" },
      { variable: "--text-brand-secondary", tailwind: "text-text-brand-secondary" },
      { variable: "--text-brand-hover", tailwind: "text-text-brand-hover" },
      { variable: "--text-danger-primary", tailwind: "text-text-danger-primary" },
      { variable: "--text-danger-secondary", tailwind: "text-text-danger-secondary" },
      { variable: "--text-danger-hover", tailwind: "text-text-danger-hover" },
      { variable: "--text-warning-primary", tailwind: "text-text-warning-primary" },
      { variable: "--text-warning-secondary", tailwind: "text-text-warning-secondary" },
      { variable: "--text-success-primary", tailwind: "text-text-success-primary" },
      { variable: "--text-success-secondary", tailwind: "text-text-success-secondary" },
      { variable: "--text-info-primary", tailwind: "text-text-info-primary" },
      { variable: "--text-info-secondary", tailwind: "text-text-info-secondary" },
    ],
  },
  {
    label: "Border",
    colors: [
      { variable: "--border-tertiary", tailwind: "border-border-tertiary" },
      { variable: "--border-secondary", tailwind: "border-border-secondary" },
      { variable: "--border-primary", tailwind: "border-border-primary" },
      { variable: "--border-brand", tailwind: "border-border-brand" },
      { variable: "--border-brand-secondary", tailwind: "border-border-brand-secondary" },
      { variable: "--border-primary-inverted", tailwind: "border-border-primary-inverted" },
      { variable: "--border-secondary-inverted", tailwind: "border-border-secondary-inverted" },
    ],
  },
  {
    label: "Border — Status",
    colors: [
      { variable: "--border-danger", tailwind: "border-border-danger" },
      { variable: "--border-danger-secondary", tailwind: "border-border-danger-secondary" },
      { variable: "--border-warning-secondary", tailwind: "border-border-warning-secondary" },
      { variable: "--border-success-secondary", tailwind: "border-border-success-secondary" },
      { variable: "--border-info-secondary", tailwind: "border-border-info-secondary" },
    ],
  },
  {
    label: "Shadow",
    colors: [
      { variable: "--shadow-drop-1", tailwind: "shadow-drop-1" },
      { variable: "--shadow-drop-2", tailwind: "shadow-drop-2" },
      { variable: "--shadow-drop-3", tailwind: "shadow-drop-3" },
      { variable: "--shadow-inner-1", tailwind: "shadow-inner-1" },
      { variable: "--shadow-inner-2", tailwind: "shadow-inner-2" },
    ],
  },
  {
    label: "Source — Brand",
    colors: [
      { variable: "--paids-brand-50", tailwind: "bg-paids-brand-50" },
      { variable: "--paids-brand-100", tailwind: "bg-paids-brand-100" },
      { variable: "--paids-brand-200", tailwind: "bg-paids-brand-200" },
      { variable: "--paids-brand-300", tailwind: "bg-paids-brand-300" },
      { variable: "--paids-brand-400", tailwind: "bg-paids-brand-400" },
      { variable: "--paids-brand-500", tailwind: "bg-paids-brand-500" },
      { variable: "--paids-brand-600", tailwind: "bg-paids-brand-600" },
      { variable: "--paids-brand-700", tailwind: "bg-paids-brand-700" },
      { variable: "--paids-brand-800", tailwind: "bg-paids-brand-800" },
      { variable: "--paids-brand-900", tailwind: "bg-paids-brand-900" },
      { variable: "--paids-brand-950", tailwind: "bg-paids-brand-950" },
    ],
  },
  {
    label: "Source — Neutral",
    colors: [
      { variable: "--paids-neutral-50", tailwind: "bg-paids-neutral-50" },
      { variable: "--paids-neutral-100", tailwind: "bg-paids-neutral-100" },
      { variable: "--paids-neutral-200", tailwind: "bg-paids-neutral-200" },
      { variable: "--paids-neutral-300", tailwind: "bg-paids-neutral-300" },
      { variable: "--paids-neutral-400", tailwind: "bg-paids-neutral-400" },
      { variable: "--paids-neutral-500", tailwind: "bg-paids-neutral-500" },
      { variable: "--paids-neutral-600", tailwind: "bg-paids-neutral-600" },
      { variable: "--paids-neutral-700", tailwind: "bg-paids-neutral-700" },
      { variable: "--paids-neutral-800", tailwind: "bg-paids-neutral-800" },
      { variable: "--paids-neutral-900", tailwind: "bg-paids-neutral-900" },
      { variable: "--paids-neutral-950", tailwind: "bg-paids-neutral-950" },
    ],
  },
  {
    label: "Source — Red",
    colors: [
      { variable: "--paids-red-50", tailwind: "bg-paids-red-50" },
      { variable: "--paids-red-100", tailwind: "bg-paids-red-100" },
      { variable: "--paids-red-200", tailwind: "bg-paids-red-200" },
      { variable: "--paids-red-300", tailwind: "bg-paids-red-300" },
      { variable: "--paids-red-400", tailwind: "bg-paids-red-400" },
      { variable: "--paids-red-500", tailwind: "bg-paids-red-500" },
      { variable: "--paids-red-600", tailwind: "bg-paids-red-600" },
      { variable: "--paids-red-700", tailwind: "bg-paids-red-700" },
      { variable: "--paids-red-800", tailwind: "bg-paids-red-800" },
      { variable: "--paids-red-900", tailwind: "bg-paids-red-900" },
      { variable: "--paids-red-950", tailwind: "bg-paids-red-950" },
    ],
  },
  {
    label: "Source — Green",
    colors: [
      { variable: "--paids-green-50", tailwind: "bg-paids-green-50" },
      { variable: "--paids-green-100", tailwind: "bg-paids-green-100" },
      { variable: "--paids-green-200", tailwind: "bg-paids-green-200" },
      { variable: "--paids-green-300", tailwind: "bg-paids-green-300" },
      { variable: "--paids-green-400", tailwind: "bg-paids-green-400" },
      { variable: "--paids-green-500", tailwind: "bg-paids-green-500" },
      { variable: "--paids-green-600", tailwind: "bg-paids-green-600" },
      { variable: "--paids-green-700", tailwind: "bg-paids-green-700" },
      { variable: "--paids-green-800", tailwind: "bg-paids-green-800" },
      { variable: "--paids-green-900", tailwind: "bg-paids-green-900" },
      { variable: "--paids-green-950", tailwind: "bg-paids-green-950" },
    ],
  },
  {
    label: "Source — Blue",
    colors: [
      { variable: "--paids-blue-50", tailwind: "bg-paids-blue-50" },
      { variable: "--paids-blue-100", tailwind: "bg-paids-blue-100" },
      { variable: "--paids-blue-200", tailwind: "bg-paids-blue-200" },
      { variable: "--paids-blue-300", tailwind: "bg-paids-blue-300" },
      { variable: "--paids-blue-400", tailwind: "bg-paids-blue-400" },
      { variable: "--paids-blue-500", tailwind: "bg-paids-blue-500" },
      { variable: "--paids-blue-600", tailwind: "bg-paids-blue-600" },
      { variable: "--paids-blue-700", tailwind: "bg-paids-blue-700" },
      { variable: "--paids-blue-800", tailwind: "bg-paids-blue-800" },
      { variable: "--paids-blue-900", tailwind: "bg-paids-blue-900" },
      { variable: "--paids-blue-950", tailwind: "bg-paids-blue-950" },
    ],
  },
  {
    label: "Source — Yellow",
    colors: [
      { variable: "--paids-yellow-50", tailwind: "bg-paids-yellow-50" },
      { variable: "--paids-yellow-100", tailwind: "bg-paids-yellow-100" },
      { variable: "--paids-yellow-200", tailwind: "bg-paids-yellow-200" },
      { variable: "--paids-yellow-300", tailwind: "bg-paids-yellow-300" },
      { variable: "--paids-yellow-400", tailwind: "bg-paids-yellow-400" },
      { variable: "--paids-yellow-500", tailwind: "bg-paids-yellow-500" },
      { variable: "--paids-yellow-600", tailwind: "bg-paids-yellow-600" },
      { variable: "--paids-yellow-700", tailwind: "bg-paids-yellow-700" },
      { variable: "--paids-yellow-800", tailwind: "bg-paids-yellow-800" },
      { variable: "--paids-yellow-900", tailwind: "bg-paids-yellow-900" },
      { variable: "--paids-yellow-950", tailwind: "bg-paids-yellow-950" },
    ],
  },
]

export function ColorVariablesDemo() {
  return (
    <div className="space-y-6">
      {COLOR_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-text-secondary mb-3">
            {group.label}
          </p>
          {group.label.startsWith("Source") ? (
            <div className="flex gap-1">
              {group.colors.map((color) => (
                <div key={color.variable} className="flex-1 group relative">
                  <div
                    className="h-10 rounded-md border border-border-tertiary first:rounded-l-lg last:rounded-r-lg"
                    style={{ backgroundColor: `var(${color.variable})` }}
                  />
                  <p className="mt-1 text-center text-[length:var(--text-2xs)] text-text-tertiary font-mono">
                    {color.variable.split("-").pop()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {group.colors.map((color) => (
                <div
                  key={color.variable}
                  className="flex items-center gap-3 rounded-md border border-border-tertiary p-2"
                >
                  <div
                    className="size-8 shrink-0 rounded-md border border-border-tertiary"
                    style={{ backgroundColor: `var(${color.variable})` }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[length:var(--text-xs)] font-medium text-text-primary">
                      {color.variable}
                    </p>
                    <p className="truncate text-[length:var(--text-2xs)] text-text-tertiary font-mono">
                      {color.tailwind}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

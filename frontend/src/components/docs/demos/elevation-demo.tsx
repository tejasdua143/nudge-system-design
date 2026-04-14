const ELEVATIONS = [
  {
    level: "Elevation 1",
    className: "shadow-elevation-1",
    description: "Buttons, inputs, cards — subtle depth",
  },
  {
    level: "Elevation 2",
    className: "shadow-elevation-2",
    description: "Raised cards, dropdowns — moderate depth",
  },
  {
    level: "Elevation 3",
    className: "shadow-elevation-3",
    description: "Popovers, hover cards — prominent depth",
  },
  {
    level: "Elevation 4",
    className: "shadow-elevation-4",
    description: "Modals, dialogs — maximum depth",
  },
]

export function ElevationDemo() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {ELEVATIONS.map((elevation) => (
        <div key={elevation.level} className="flex flex-col items-center gap-3">
          <div
            className={`${elevation.className} h-24 w-full rounded-lg bg-bg-elevated`}
          />
          <div className="text-center">
            <p className="text-[length:var(--text-base)] font-medium text-text-primary">
              {elevation.level}
            </p>
            <p className="text-[length:var(--text-xs)] text-text-tertiary font-mono">
              {elevation.className}
            </p>
            <p className="mt-1 text-[length:var(--text-xs)] text-text-secondary">
              {elevation.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

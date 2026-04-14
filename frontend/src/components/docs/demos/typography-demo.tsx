import { Separator } from "@/components/ui/separator"

const TYPE_SCALE = [
  { className: "text-[length:var(--text-4xl)]", label: "text-[length:var(--text-4xl)]", size: "36px" },
  { className: "text-[length:var(--text-3xl)]", label: "text-[length:var(--text-3xl)]", size: "30px" },
  { className: "text-[length:var(--text-2xl)]", label: "text-[length:var(--text-2xl)]", size: "24px" },
  { className: "text-[length:var(--text-xl)]", label: "text-[length:var(--text-xl)]", size: "20px" },
  { className: "text-[length:var(--text-lg)]", label: "text-[length:var(--text-lg)]", size: "18px" },
  { className: "text-[length:var(--text-md)]", label: "text-[length:var(--text-md)]", size: "16px" },
  { className: "text-[length:var(--text-base)]", label: "text-[length:var(--text-base)]", size: "14px" },
  { className: "text-[length:var(--text-xs)]", label: "text-[length:var(--text-xs)]", size: "12px" },
]

const FONT_WEIGHTS = [
  { className: "font-normal", label: "font-normal", weight: "400" },
  { className: "font-medium", label: "font-medium", weight: "500" },
  { className: "font-semibold", label: "font-semibold", weight: "600" },
  { className: "font-bold", label: "font-bold", weight: "700" },
]

const TRACKING = [
  { className: "tracking-tighter", label: "tracking-tighter", value: "-0.05em" },
  { className: "tracking-tight", label: "tracking-tight", value: "-0.025em" },
  { className: "tracking-normal", label: "tracking-normal", value: "0em" },
  { className: "tracking-wide", label: "tracking-wide", value: "0.025em" },
  { className: "tracking-wider", label: "tracking-wider", value: "0.05em" },
  { className: "tracking-widest", label: "tracking-widest", value: "0.1em" },
]

const LEADING = [
  { className: "leading-none", label: "leading-none", value: "1" },
  { className: "leading-tight", label: "leading-tight", value: "1.25" },
  { className: "leading-normal", label: "leading-normal", value: "1.5" },
  { className: "leading-relaxed", label: "leading-relaxed", value: "1.625" },
  { className: "leading-loose", label: "leading-loose", value: "2" },
]

const TEXT_COLORS = [
  { className: "text-foreground", label: "text-foreground" },
  { className: "text-muted-foreground", label: "text-muted-foreground" },
  { className: "text-primary", label: "text-primary" },
  { className: "text-destructive", label: "text-destructive" },
  { className: "text-accent-foreground", label: "text-accent-foreground" },
]

export function TypographyDemo() {
  return (
    <div className="space-y-6">
      {/* Type Scale */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Type Scale
        </p>
        <div className="space-y-3">
          {TYPE_SCALE.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-4">
              <p className={item.className}>
                The quick brown fox
              </p>
              <span className="shrink-0 text-[length:var(--text-xs)] text-muted-foreground font-mono">
                {item.label} ({item.size})
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Font Weights */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Font Weights
        </p>
        <div className="space-y-2">
          {FONT_WEIGHTS.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-4">
              <p className={`text-[length:var(--text-lg)] ${item.className}`}>
                The quick brown fox jumps over the lazy dog
              </p>
              <span className="shrink-0 text-[length:var(--text-xs)] text-muted-foreground font-mono">
                {item.label} ({item.weight})
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tracking */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Letter Spacing
        </p>
        <div className="space-y-2">
          {TRACKING.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-4">
              <p className={`text-[length:var(--text-md)] ${item.className}`}>
                The quick brown fox jumps over the lazy dog
              </p>
              <span className="shrink-0 text-[length:var(--text-xs)] text-muted-foreground font-mono">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Leading */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Line Height
        </p>
        <div className="space-y-4">
          {LEADING.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-4">
              <p className={`text-[length:var(--text-base)] max-w-md border-l-2 border-border pl-3 ${item.className}`}>
                The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
              </p>
              <span className="shrink-0 text-[length:var(--text-xs)] text-muted-foreground font-mono">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Text Colors */}
      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Text Colors
        </p>
        <div className="space-y-2">
          {TEXT_COLORS.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-4">
              <p className={`text-[length:var(--text-lg)] font-medium ${item.className}`}>
                The quick brown fox
              </p>
              <span className="shrink-0 text-[length:var(--text-xs)] text-muted-foreground font-mono">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

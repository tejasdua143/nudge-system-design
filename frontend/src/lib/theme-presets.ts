export interface RadiusPreset {
  label: string
  value: string
}

export interface ColorPreset {
  name: string
  swatch: string
  light: Record<string, string>
  dark: Record<string, string>
}

export const RADIUS_PRESETS: RadiusPreset[] = [
  { label: "None", value: "0rem" },
  { label: "Small", value: "0.25rem" },
  { label: "Medium", value: "0.5rem" },
  { label: "Large", value: "0.75rem" },
  { label: "Full", value: "1rem" },
]

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Neutral",
    swatch: "oklch(0.205 0 0)",
    light: {
      "--primary": "oklch(0.205 0 0)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.97 0 0)",
      "--accent-foreground": "oklch(0.205 0 0)",
      "--ring": "oklch(0.708 0 0)",
    },
    dark: {
      "--primary": "oklch(0.922 0 0)",
      "--primary-foreground": "oklch(0.205 0 0)",
      "--accent": "oklch(0.269 0 0)",
      "--accent-foreground": "oklch(0.985 0 0)",
      "--ring": "oklch(0.556 0 0)",
    },
  },
  {
    name: "Blue",
    swatch: "oklch(0.488 0.243 264)",
    light: {
      "--primary": "oklch(0.488 0.243 264)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.932 0.032 264)",
      "--accent-foreground": "oklch(0.35 0.2 264)",
      "--ring": "oklch(0.488 0.243 264)",
    },
    dark: {
      "--primary": "oklch(0.65 0.2 264)",
      "--primary-foreground": "oklch(0.15 0.02 264)",
      "--accent": "oklch(0.25 0.06 264)",
      "--accent-foreground": "oklch(0.9 0.05 264)",
      "--ring": "oklch(0.65 0.2 264)",
    },
  },
  {
    name: "Green",
    swatch: "oklch(0.517 0.174 142)",
    light: {
      "--primary": "oklch(0.517 0.174 142)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.932 0.032 142)",
      "--accent-foreground": "oklch(0.35 0.15 142)",
      "--ring": "oklch(0.517 0.174 142)",
    },
    dark: {
      "--primary": "oklch(0.65 0.17 142)",
      "--primary-foreground": "oklch(0.15 0.02 142)",
      "--accent": "oklch(0.25 0.05 142)",
      "--accent-foreground": "oklch(0.9 0.04 142)",
      "--ring": "oklch(0.65 0.17 142)",
    },
  },
  {
    name: "Orange",
    swatch: "oklch(0.646 0.222 41)",
    light: {
      "--primary": "oklch(0.646 0.222 41)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.94 0.04 41)",
      "--accent-foreground": "oklch(0.4 0.18 41)",
      "--ring": "oklch(0.646 0.222 41)",
    },
    dark: {
      "--primary": "oklch(0.7 0.19 41)",
      "--primary-foreground": "oklch(0.15 0.03 41)",
      "--accent": "oklch(0.27 0.06 41)",
      "--accent-foreground": "oklch(0.9 0.04 41)",
      "--ring": "oklch(0.7 0.19 41)",
    },
  },
  {
    name: "Red",
    swatch: "oklch(0.577 0.245 27)",
    light: {
      "--primary": "oklch(0.577 0.245 27)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.94 0.04 27)",
      "--accent-foreground": "oklch(0.4 0.2 27)",
      "--ring": "oklch(0.577 0.245 27)",
    },
    dark: {
      "--primary": "oklch(0.65 0.2 27)",
      "--primary-foreground": "oklch(0.15 0.03 27)",
      "--accent": "oklch(0.27 0.06 27)",
      "--accent-foreground": "oklch(0.9 0.04 27)",
      "--ring": "oklch(0.65 0.2 27)",
    },
  },
  {
    name: "Violet",
    swatch: "oklch(0.491 0.27 292)",
    light: {
      "--primary": "oklch(0.491 0.27 292)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.93 0.04 292)",
      "--accent-foreground": "oklch(0.35 0.2 292)",
      "--ring": "oklch(0.491 0.27 292)",
    },
    dark: {
      "--primary": "oklch(0.65 0.22 292)",
      "--primary-foreground": "oklch(0.15 0.03 292)",
      "--accent": "oklch(0.26 0.07 292)",
      "--accent-foreground": "oklch(0.9 0.04 292)",
      "--ring": "oklch(0.65 0.22 292)",
    },
  },
  {
    name: "Rose",
    swatch: "oklch(0.552 0.216 354)",
    light: {
      "--primary": "oklch(0.552 0.216 354)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--accent": "oklch(0.94 0.035 354)",
      "--accent-foreground": "oklch(0.4 0.18 354)",
      "--ring": "oklch(0.552 0.216 354)",
    },
    dark: {
      "--primary": "oklch(0.65 0.18 354)",
      "--primary-foreground": "oklch(0.15 0.02 354)",
      "--accent": "oklch(0.26 0.06 354)",
      "--accent-foreground": "oklch(0.9 0.04 354)",
      "--ring": "oklch(0.65 0.18 354)",
    },
  },
]

export const CUSTOM_COLOR_VARS = [
  "--primary",
  "--primary-foreground",
  "--accent",
  "--accent-foreground",
  "--ring",
] as const

export const DEFAULT_RADIUS = "0.25rem"
export const DEFAULT_COLOR = "Neutral"

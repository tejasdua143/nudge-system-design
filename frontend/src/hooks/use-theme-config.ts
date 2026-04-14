"use client"

import { useState, useEffect, useCallback } from "react"
import {
  RADIUS_PRESETS,
  COLOR_PRESETS,
  CUSTOM_COLOR_VARS,
  DEFAULT_RADIUS,
  DEFAULT_COLOR,
  type ColorPreset,
} from "@/lib/theme-presets"

const STORAGE_KEY_RADIUS = "theme-radius"
const STORAGE_KEY_COLOR = "theme-color"
const STORAGE_KEY_HEX = "theme-custom-hex"

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark")
}

function applyRadius(value: string) {
  document.documentElement.style.setProperty("--radius", value)
}

function applyColorPreset(preset: ColorPreset) {
  const vars = isDarkMode() ? preset.dark : preset.light
  for (const [prop, value] of Object.entries(vars)) {
    document.documentElement.style.setProperty(prop, value)
  }
}

function clearAllColorOverrides() {
  for (const prop of CUSTOM_COLOR_VARS) {
    document.documentElement.style.removeProperty(prop)
  }
}

function applyCustomHex(hex: string) {
  const dark = isDarkMode()
  document.documentElement.style.setProperty("--primary", hex)
  document.documentElement.style.setProperty(
    "--primary-foreground",
    dark ? "#0a0a0a" : "#fafafa"
  )
  document.documentElement.style.setProperty(
    "--accent",
    `color-mix(in oklch, ${hex} ${dark ? "15%" : "8%"}, ${dark ? "black" : "white"})`
  )
  document.documentElement.style.setProperty("--accent-foreground", hex)
  document.documentElement.style.setProperty("--ring", hex)
}

export function useThemeConfig() {
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [colorName, setColorName] = useState(DEFAULT_COLOR)
  const [customHex, setCustomHex] = useState("")

  useEffect(() => {
    const savedRadius = localStorage.getItem(STORAGE_KEY_RADIUS)
    const savedColor = localStorage.getItem(STORAGE_KEY_COLOR)
    const savedHex = localStorage.getItem(STORAGE_KEY_HEX)

    const r =
      savedRadius && RADIUS_PRESETS.some((p) => p.value === savedRadius)
        ? savedRadius
        : DEFAULT_RADIUS

    setRadius(r)
    applyRadius(r)

    if (savedHex && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(savedHex)) {
      setCustomHex(savedHex)
      setColorName("")
      applyCustomHex(savedHex)
    } else {
      const c =
        savedColor && COLOR_PRESETS.some((p) => p.name === savedColor)
          ? savedColor
          : DEFAULT_COLOR
      setColorName(c)
      const preset = COLOR_PRESETS.find((p) => p.name === c)
      if (preset) applyColorPreset(preset)
    }
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (customHex) {
        applyCustomHex(customHex)
      } else {
        const preset = COLOR_PRESETS.find((p) => p.name === colorName)
        if (preset) applyColorPreset(preset)
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [colorName, customHex])

  const changeRadius = useCallback((value: string) => {
    setRadius(value)
    applyRadius(value)
    localStorage.setItem(STORAGE_KEY_RADIUS, value)
  }, [])

  const changeColor = useCallback((name: string) => {
    clearAllColorOverrides()
    setColorName(name)
    setCustomHex("")
    localStorage.removeItem(STORAGE_KEY_HEX)
    const preset = COLOR_PRESETS.find((p) => p.name === name)
    if (preset) applyColorPreset(preset)
    localStorage.setItem(STORAGE_KEY_COLOR, name)
  }, [])

  const changeCustomHex = useCallback((hex: string) => {
    setCustomHex(hex)
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      clearAllColorOverrides()
      setColorName("")
      applyCustomHex(hex)
      localStorage.setItem(STORAGE_KEY_HEX, hex)
      localStorage.removeItem(STORAGE_KEY_COLOR)
    }
  }, [])

  return { radius, colorName, customHex, changeRadius, changeColor, changeCustomHex }
}

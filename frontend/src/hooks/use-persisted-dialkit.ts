"use client";

import { useEffect, useRef } from "react";
import { useDialKit, DialStore, type DialConfig } from "dialkit";
import type { UseDialOptions, ResolvedValues } from "dialkit";

const STORAGE_PREFIX = "dialkit:";

function loadFromStorage(name: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${name}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(name: string, values: Record<string, unknown>) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(values));
  } catch {
    // storage full or unavailable
  }
}

export function usePersistedDialKit<T extends DialConfig>(
  name: string,
  config: T,
  options?: UseDialOptions
): ResolvedValues<T> {
  const params = useDialKit(name, config, options);
  const restoredRef = useRef(false);

  // Restore saved values on mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const saved = loadFromStorage(name);
    if (!saved) return;

    const panel = DialStore.getPanel(name);
    if (!panel) return;

    for (const control of panel.controls) {
      restoreControl(name, control.path, saved);
    }
  }, [name]);

  // Save on every change
  useEffect(() => {
    const unsub = DialStore.subscribe(name, () => {
      const values = DialStore.getValues(name);
      saveToStorage(name, values);
    });
    return unsub;
  }, [name]);

  return params;
}

function restoreControl(
  panelId: string,
  path: string,
  saved: Record<string, unknown>
) {
  const value = saved[path];
  if (value !== undefined) {
    DialStore.updateValue(panelId, path, value as never);
  }
}

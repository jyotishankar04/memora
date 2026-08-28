"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, type Settings } from "@/lib/settings";

type Group = Omit<Settings, "connectedAccounts">;

/** Loads one settings group and persists field changes with optimistic UI + revert-on-failure. */
export function useSettingsGroup<K extends keyof Group>(group: K) {
  const [value, setValue] = useState<Group[K] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSettings()
      .then((settings) => setValue(settings[group]))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function set<F extends keyof Group[K]>(field: F, fieldValue: Group[K][F]) {
    if (!value) return;
    const previous = value;
    setValue({ ...value, [field]: fieldValue });
    setError(null);
    try {
      const updated = await updateSettings({ [group]: { [field]: fieldValue } } as Partial<Group>);
      setValue(updated[group]);
    } catch (err) {
      setValue(previous);
      setError(err instanceof Error ? err.message : "Couldn't save that change. Please try again.");
    }
  }

  return { value, loading, error, set };
}

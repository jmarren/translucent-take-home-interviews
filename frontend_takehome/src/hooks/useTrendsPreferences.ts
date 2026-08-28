import { useState } from "react";
import { TrendDimension, TrendGranularity } from "./useMultiSeriesTrend";
import { MovingAverageWindow } from "../trends/trendMovingAverage";

export interface TrendsPreferences {
  dimension: TrendDimension;
  granularity: TrendGranularity;
  popEnabled: boolean;
  movingAverage: MovingAverageWindow;
}

export interface TrendsPreferencesState extends TrendsPreferences {
  setDimension: (value: TrendDimension) => void;
  setGranularity: (value: TrendGranularity) => void;
  setPopEnabled: (value: boolean) => void;
  setMovingAverage: (value: MovingAverageWindow) => void;
}

const STORAGE_PREFIX = "denial-dashboard:trends:";

function loadStored<T extends string>(
  key: string,
  valid: readonly T[],
  fallback: T,
): T {
  try {
    const stored = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (stored && valid.includes(stored as T)) return stored as T;
  } catch {
    // localStorage unavailable (private browsing, etc.) -- fall back to default.
  }
  return fallback;
}

function loadStoredBoolean(key: string, fallback: boolean): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // localStorage unavailable (private browsing, etc.) -- fall back to default.
  }
  return fallback;
}

function loadStoredMovingAverage(
  key: string,
  fallback: MovingAverageWindow,
): MovingAverageWindow {
  try {
    const stored = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (stored === "off") return "off";
    if (stored === "3") return 3;
    if (stored === "6") return 6;
  } catch {
    // localStorage unavailable (private browsing, etc.) -- fall back to default.
  }
  return fallback;
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, value);
  } catch {
    // Ignore write failures (private browsing, storage full, etc.).
  }
}

// Persists the Trends page's own controls (dimension/granularity/PoP) in
// localStorage, following the exact useState + loadStored-fallback +
// write-through-in-try/catch pattern used by useChartType/useThemePreferences,
// so these choices survive a reload like every other display preference.
export function useTrendsPreferences(): TrendsPreferencesState {
  const [dimension, setDimensionState] = useState<TrendDimension>(() =>
    loadStored("dimension", ["department", "reason", "payer"], "department"),
  );
  const [granularity, setGranularityState] = useState<TrendGranularity>(() =>
    loadStored("granularity", ["month", "quarter", "week"], "month"),
  );
  const [popEnabled, setPopEnabledState] = useState<boolean>(() =>
    loadStoredBoolean("pop-enabled", false),
  );
  const [movingAverage, setMovingAverageState] = useState<MovingAverageWindow>(
    () => loadStoredMovingAverage("moving-average", "off"),
  );

  function setDimension(value: TrendDimension) {
    setDimensionState(value);
    writeStored("dimension", value);
  }

  function setGranularity(value: TrendGranularity) {
    setGranularityState(value);
    writeStored("granularity", value);
  }

  function setPopEnabled(value: boolean) {
    setPopEnabledState(value);
    writeStored("pop-enabled", String(value));
  }

  function setMovingAverage(value: MovingAverageWindow) {
    setMovingAverageState(value);
    writeStored("moving-average", String(value));
  }

  return {
    dimension,
    granularity,
    popEnabled,
    movingAverage,
    setDimension,
    setGranularity,
    setPopEnabled,
    setMovingAverage,
  };
}

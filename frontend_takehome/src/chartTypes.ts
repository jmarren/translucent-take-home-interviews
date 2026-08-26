import { useState } from 'react';

export interface ChartTypeOption<T extends string> {
  value: T;
  label: string;
}

// Categorical cards (aggregate by a fixed set of category values, e.g.
// denial reason or department) can all render the same "category -> total"
// shape as a vertical bar, a pie, or a plain sorted table -- all three read
// the identical aggregated data with no reshaping.
export type CategoricalChartType = 'bar' | 'pie' | 'table';

export const CATEGORICAL_CHART_TYPES: ChartTypeOption<CategoricalChartType>[] = [
  { value: 'bar', label: 'Bar chart' },
  { value: 'pie', label: 'Pie chart' },
  { value: 'table', label: 'Table' },
];

// Time-series cards (aggregate by month) are a different data shape --
// ordered points along a continuous axis, not independent categories -- so
// they get their own option set. A pie chart doesn't meaningfully answer
// "how did this change over time," so it's deliberately excluded here
// rather than offered for consistency with the categorical cards.
export type TimeSeriesChartType = 'area' | 'line' | 'bar';

export const TIME_SERIES_CHART_TYPES: ChartTypeOption<TimeSeriesChartType>[] = [
  { value: 'area', label: 'Area chart' },
  { value: 'line', label: 'Line chart' },
  { value: 'bar', label: 'Bar chart' },
];

const STORAGE_PREFIX = 'denial-dashboard:chart-type:';

function loadStoredChartType<T extends string>(
  key: string,
  options: ChartTypeOption<T>[],
  fallback: T
): T {
  try {
    const stored = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (stored && options.some((o) => o.value === stored)) return stored as T;
  } catch {
    // localStorage unavailable (private browsing, etc.) -- fall back to default.
  }
  return fallback;
}

// Persists a per-card chart-type choice in localStorage, following the same
// useState + loadStored*()-fallback + write-through-in-try/catch pattern as
// every other user preference in this app (see useThemePreferences.ts), so
// the choice survives reloads like font/palette/radius/nav-mode already do.
export function useChartType<T extends string>(
  key: string,
  options: ChartTypeOption<T>[],
  defaultValue: T
): [T, (value: T) => void] {
  const [chartType, setChartTypeState] = useState<T>(() =>
    loadStoredChartType(key, options, defaultValue)
  );

  function setChartType(value: T) {
    setChartTypeState(value);
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, value);
    } catch {
      // Ignore write failures (private browsing, storage full, etc.).
    }
  }

  return [chartType, setChartType];
}

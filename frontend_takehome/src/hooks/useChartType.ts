import { useState } from "react";
import { State } from "./state";
import { makeLoader, makeLocalStorageState } from "./localStorageState";

export interface ChartTypeOption<T extends string> {
  value: T;
  label: string;
}

// Categorical cards (aggregate by a fixed set of category values, e.g.
// denial reason or department) can all render the same "category -> total"
// shape as a bar (horizontal or vertical), a pie, or a plain sorted table
// -- all four read the identical aggregated data with no reshaping.
// "bar" specifically means horizontal bars (Recharts' own `layout:
// 'vertical'`, confusingly -- that names the *category axis's* direction,
// not which way the bars extend) -- "vertical-bar" is the other
// orientation, bars standing upright with category names along the X-axis.
export type CategoricalChartType = "bar" | "vertical-bar" | "pie" | "table";

export const CATEGORICAL_CHART_TYPES: ChartTypeOption<CategoricalChartType>[] = [
  { value: "bar", label: "Horizontal Bar" },
  { value: "vertical-bar", label: "Vertical Bar" },
  { value: "pie", label: "Pie" },
  { value: "table", label: "Table" },
];

// Time-series cards (aggregate by month) are a different data shape --
// ordered points along a continuous axis, not independent categories -- so
// they get their own option set. A pie chart doesn't meaningfully answer
// "how did this change over time," so it's deliberately excluded here
// rather than offered for consistency with the categorical cards.
export type TimeSeriesChartType = "area" | "line" | "bar";

export const TIME_SERIES_CHART_TYPES: ChartTypeOption<TimeSeriesChartType>[] = [
  { value: "area", label: "Area" },
  { value: "line", label: "Line" },
  { value: "bar", label: "Bar" },
];

const STORAGE_PREFIX = "denial-dashboard:chart-type:";

// Persists a per-card chart-type choice in localStorage, following the same
// State<T> + makeLoader() + makeLocalStorageState() pattern as every other
// user preference in this app -- see useThemePreferences.ts -- so the
// choice survives reloads like every other display preference. Unlike
// those hooks (one fixed preference object each), this one is a reusable
// factory -- each card instance supplies its own storage key and option
// list, since the choice, valid options, and default all vary per card.
export function useChartType<T extends string>(
  key: string,
  options: ChartTypeOption<T>[],
  defaultValue: T,
): State<T> {
  const storageKey = STORAGE_PREFIX + key;
  const loadStoredChartType = makeLoader<T>(
    storageKey,
    (stored) => options.find((o) => o.value === stored)?.value,
    defaultValue,
  );
  const chartTypeState = useState<T>(loadStoredChartType);

  return makeLocalStorageState<T>(chartTypeState, storageKey, (value) => value);
}

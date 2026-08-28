import { useState } from "react";
import { TrendDimension, TrendGranularity } from "./useMultiSeriesTrend";
import { MovingAverageWindow } from "../trends/trendMovingAverage";
import { State } from "./state";
import { makeLoader, makeLocalStorageState } from "./localStorageState";

export interface TrendDimensionOption {
  value: TrendDimension;
  label: string;
}

export const TREND_DIMENSIONS: TrendDimensionOption[] = [
  { value: "department", label: "Department" },
  { value: "reason", label: "Reason" },
  { value: "payer", label: "Payer" },
];

export interface TrendGranularityOption {
  value: TrendGranularity;
  label: string;
}

export const TREND_GRANULARITIES: TrendGranularityOption[] = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
];

export interface TrendsPreferences {
  dimension: State<TrendDimension>;
  granularity: State<TrendGranularity>;
  popEnabled: State<boolean>;
  movingAverage: State<MovingAverageWindow>;
}

const DIMENSION_STORAGE_KEY = "denial-dashboard:trends:dimension";
const GRANULARITY_STORAGE_KEY = "denial-dashboard:trends:granularity";
const POP_ENABLED_STORAGE_KEY = "denial-dashboard:trends:pop-enabled";
const MOVING_AVERAGE_STORAGE_KEY = "denial-dashboard:trends:moving-average";

const loadStoredDimension = makeLoader<TrendDimension>(
  DIMENSION_STORAGE_KEY,
  (stored) => TREND_DIMENSIONS.find((d) => d.value === stored)?.value,
  "department",
);

const loadStoredGranularity = makeLoader<TrendGranularity>(
  GRANULARITY_STORAGE_KEY,
  (stored) => TREND_GRANULARITIES.find((g) => g.value === stored)?.value,
  "month",
);

const loadStoredPopEnabled = makeLoader<boolean>(
  POP_ENABLED_STORAGE_KEY,
  (stored) => (stored === "true" ? true : stored === "false" ? false : undefined),
  false,
);

const loadStoredMovingAverage = makeLoader<MovingAverageWindow>(
  MOVING_AVERAGE_STORAGE_KEY,
  (stored) => {
    if (stored === "off") return "off";
    if (stored === "3") return 3;
    if (stored === "6") return 6;
    return undefined;
  },
  "off",
);

// Persists the Trends page's own controls (dimension/granularity/PoP) in
// localStorage, following the same State<T> + makeLoader() +
// makeLocalStorageState() pattern as every other user preference in this
// app -- see useThemePreferences.ts -- so these choices survive a reload
// like every other display preference.
export function useTrendsPreferences(): TrendsPreferences {
  const [dimension, setDimensionState] = useState<TrendDimension>(loadStoredDimension);
  const [granularity, setGranularityState] = useState<TrendGranularity>(loadStoredGranularity);
  const [popEnabled, setPopEnabledState] = useState<boolean>(loadStoredPopEnabled);
  const [movingAverage, setMovingAverageState] = useState<MovingAverageWindow>(loadStoredMovingAverage);

  return {
    dimension: makeLocalStorageState<TrendDimension>(
      dimension,
      setDimensionState,
      DIMENSION_STORAGE_KEY,
      (value) => value,
    ),
    granularity: makeLocalStorageState<TrendGranularity>(
      granularity,
      setGranularityState,
      GRANULARITY_STORAGE_KEY,
      (value) => value,
    ),
    popEnabled: makeLocalStorageState<boolean>(
      popEnabled,
      setPopEnabledState,
      POP_ENABLED_STORAGE_KEY,
      (value) => String(value),
    ),
    movingAverage: makeLocalStorageState<MovingAverageWindow>(
      movingAverage,
      setMovingAverageState,
      MOVING_AVERAGE_STORAGE_KEY,
      (value) => String(value),
    ),
  };
}

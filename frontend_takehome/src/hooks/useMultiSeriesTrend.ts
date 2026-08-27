import { useMemo } from "react";
import {
  Denial,
  DEPARTMENTS,
  PAYERS,
  REASONS,
  MetricId,
  metricValue,
} from "../types";
import { Bucket, bucketByMonth, bucketByQuarter, bucketByWeek } from "../trendBuckets";

export type TrendDimension = "department" | "reason" | "payer";

export type TrendGranularity = "month" | "quarter" | "week";

export interface MultiSeriesPoint {
  bucketKey: string;
  bucketLabel: string;
  [seriesName: string]: string | number;
}

export interface MultiSeriesTrendConfig {
  granularity: TrendGranularity;
  dimension: TrendDimension;
  metric: MetricId;
}

export interface MultiSeriesTrendResult {
  points: MultiSeriesPoint[];
  seriesNames: string[];
}

// The canonical value list per dimension, not "whatever appears in the
// data" -- keeps line count/order/color stable as filters and buckets
// change, matching the app's existing convention of hardcoding filter
// dropdown option lists (see DEPARTMENTS/PAYERS/REASONS in types.ts).
function seriesNamesFor(dimension: TrendDimension): readonly string[] {
  switch (dimension) {
    case "department":
      return DEPARTMENTS;
    case "payer":
      return PAYERS;
    case "reason":
      return REASONS;
  }
}

function dimensionValue(denial: Denial, dimension: TrendDimension): string {
  switch (dimension) {
    case "department":
      return denial.department;
    case "payer":
      return denial.payer;
    case "reason":
      return denial.reason;
  }
}

export function bucketForGranularity(
  granularity: TrendGranularity,
): (dateStr: string) => Bucket {
  switch (granularity) {
    case "week":
      return bucketByWeek;
    case "quarter":
      return bucketByQuarter;
    case "month":
      return bucketByMonth;
  }
}

export function useMultiSeriesTrend(
  data: Denial[],
  config: MultiSeriesTrendConfig,
): MultiSeriesTrendResult {
  return useMemo(() => {
    const seriesNames = seriesNamesFor(config.dimension);
    const bucketFor = bucketForGranularity(config.granularity);

    const bucketLabels = new Map<string, string>();
    const totals = new Map<string, Map<string, number>>();

    for (const denial of data) {
      const bucket = bucketFor(denial.date);
      bucketLabels.set(bucket.key, bucket.label);

      const seriesTotals = totals.get(bucket.key) ?? new Map<string, number>();
      const series = dimensionValue(denial, config.dimension);
      seriesTotals.set(
        series,
        (seriesTotals.get(series) ?? 0) + metricValue(denial, config.metric),
      );
      totals.set(bucket.key, seriesTotals);
    }

    const points: MultiSeriesPoint[] = Array.from(
      bucketLabels,
      ([bucketKey, bucketLabel]) => {
        const seriesTotals = totals.get(bucketKey) ?? new Map<string, number>();
        const point: MultiSeriesPoint = { bucketKey, bucketLabel };
        for (const name of seriesNames) {
          point[name] = seriesTotals.get(name) ?? 0;
        }
        return point;
      },
    ).sort((a, b) => (a.bucketKey > b.bucketKey ? 1 : -1));

    return { points, seriesNames: [...seriesNames] };
  }, [data, config.granularity, config.dimension, config.metric]);
}

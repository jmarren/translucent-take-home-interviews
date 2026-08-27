import { MultiSeriesPoint } from "./hooks/useMultiSeriesTrend";

export type MovingAverageWindow = "off" | 3 | 6;

// Trailing simple moving average over `window` buckets, computed per series
// independently and written back into that series' own key -- the chart
// keeps rendering one line per series either way, it's just plotting the
// smoothed value instead of the raw one. The first `window - 1` points of
// each series keep their raw value rather than being averaged over a
// shorter partial window, which would understate how smoothed the rest of
// the line is and put a discontinuous kink right where the real window
// kicks in.
export function withMovingAverages(
  points: MultiSeriesPoint[],
  seriesNames: string[],
  window: MovingAverageWindow,
): MultiSeriesPoint[] {
  if (window === "off") return points;

  return points.map((point, index) => {
    if (index < window - 1) return point;

    const smoothed: MultiSeriesPoint = { ...point };
    for (const name of seriesNames) {
      let sum = 0;
      for (let i = index - window + 1; i <= index; i++) {
        sum += Number(points[i][name] ?? 0);
      }
      smoothed[name] = sum / window;
    }
    return smoothed;
  });
}

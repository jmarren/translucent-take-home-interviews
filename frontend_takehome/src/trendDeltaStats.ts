export interface DeltaHeadline {
  current: number;
  previous: number;
  pctChange: number;
}

export interface DeltaMover {
  name: string;
  delta: number;
  pctChange: number;
}

export interface DeltaStats {
  headline: DeltaHeadline;
  topMovers: DeltaMover[];
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : Infinity;
  return ((current - previous) / previous) * 100;
}

function sum(totals: Map<string, number>): number {
  return Array.from(totals.values()).reduce((total, value) => total + value, 0);
}

// Ranks movers by absolute dollar change, not percent change -- a reason
// going from $50 to $150 is "+200%" but immaterial, and dollar magnitude
// matches how this app already ranks everything else (SummaryStats,
// CategoryCard, TimeSeriesCard all sum/rank by dollar amount).
export function computeDeltaStats(
  currentTotals: Map<string, number>,
  previousTotals: Map<string, number>,
  seriesNames: readonly string[]
): DeltaStats {
  const current = sum(currentTotals);
  const previous = sum(previousTotals);

  const movers = seriesNames.map((name) => {
    const currentValue = currentTotals.get(name) ?? 0;
    const previousValue = previousTotals.get(name) ?? 0;
    return {
      name,
      delta: currentValue - previousValue,
      pctChange: pctChange(currentValue, previousValue),
    };
  });

  const topMovers = movers
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);

  return {
    headline: { current, previous, pctChange: pctChange(current, previous) },
    topMovers,
  };
}

import { Denial, MetricId, metricValue } from "./types";
import { PeriodId, periodStart, startOfDay } from "./periods";
import { TrendGranularity, bucketForGranularity } from "./hooks/useMultiSeriesTrend";

export interface DateRange {
  start: Date;
  end: Date;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

function lastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

// The current period's range is [periodStart(periodId), referenceDate] --
// "today" is the most recent denial date in the dataset, same convention as
// filterByPeriod. "all" has no bounded start, so it has no defined range
// here -- callers must check hasPreviousPeriod() first.
export function currentPeriodRange(
  periodId: PeriodId,
  referenceDate: Date,
): DateRange | null {
  const start = periodStart(periodId, referenceDate);
  if (!start) return null;
  return { start, end: startOfDay(referenceDate) };
}

// "All Time" has no natural previous period -- any window we picked (a prior
// 12 months? the first half of the dataset?) would be an invented comparison
// the user didn't ask for, not a period-over-period comparison of the filter
// they actually chose. Callers should disable PoP entirely for this case.
export function hasPreviousPeriod(periodId: PeriodId): boolean {
  return periodId !== "all";
}

// The previous period is the same-length window immediately preceding the
// current one (e.g. "this quarter" -> "last quarter", the 3 calendar months
// before it -- not "the same 3 months one year back").
export function previousPeriodRange(
  periodId: PeriodId,
  referenceDate: Date,
): DateRange | null {
  const today = startOfDay(referenceDate);
  switch (periodId) {
    case "last-30": {
      const currentStart = addDays(today, -29);
      return {
        start: addDays(currentStart, -30),
        end: addDays(currentStart, -1),
      };
    }
    case "this-month": {
      const lastMonthDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      return {
        start: lastMonthDate,
        end: lastDayOfMonth(
          lastMonthDate.getFullYear(),
          lastMonthDate.getMonth(),
        ),
      };
    }
    case "this-quarter": {
      const quarterMonth = Math.floor(today.getMonth() / 3) * 3;
      const lastQuarterStart = new Date(
        today.getFullYear(),
        quarterMonth - 3,
        1,
      );
      const lastQuarterEnd = lastDayOfMonth(
        lastQuarterStart.getFullYear(),
        lastQuarterStart.getMonth() + 2,
      );
      return { start: lastQuarterStart, end: lastQuarterEnd };
    }
    case "this-year":
      return {
        start: new Date(today.getFullYear() - 1, 0, 1),
        end: new Date(today.getFullYear() - 1, 11, 31),
      };
    case "all":
    default:
      return null;
  }
}

function filterByRange(denials: Denial[], range: DateRange): Denial[] {
  const startStr = toDateStr(range.start);
  const endStr = toDateStr(range.end);
  return denials.filter((d) => d.date >= startStr && d.date <= endStr);
}

export interface PositionBucket {
  position: number;
  positionLabel: string;
  totalsBySeries: Map<string, number>;
}

function positionLabelPrefix(granularity: TrendGranularity): string {
  switch (granularity) {
    case "week":
      return "Wk";
    case "quarter":
      return "Quarter";
    case "month":
      return "Month";
  }
}

// Buckets a period's denials by month/week/quarter, then re-indexes each
// bucket by its ordinal position within the period (0, 1, 2...) instead of
// its absolute calendar key -- this is what lets "month 1 of this quarter"
// line up with "month 1 of last quarter" on a shared x-axis regardless of
// which actual months they fall on.
function bucketByPosition(
  denials: Denial[],
  granularity: TrendGranularity,
  dimension: (denial: Denial) => string,
  metric: MetricId,
): PositionBucket[] {
  const bucketFor = bucketForGranularity(granularity);
  const order: string[] = [];
  const totals = new Map<string, Map<string, number>>();

  for (const denial of denials) {
    const bucket = bucketFor(denial.date);
    if (!totals.has(bucket.key)) {
      totals.set(bucket.key, new Map());
      order.push(bucket.key);
    }
    const seriesTotals = totals.get(bucket.key)!;
    const series = dimension(denial);
    seriesTotals.set(
      series,
      (seriesTotals.get(series) ?? 0) + metricValue(denial, metric),
    );
  }

  order.sort();

  const prefix = positionLabelPrefix(granularity);
  return order.map((key, index) => ({
    position: index,
    positionLabel: `${prefix} ${index + 1}`,
    totalsBySeries: totals.get(key)!,
  }));
}

export interface PopSeriesResult {
  currentBuckets: PositionBucket[];
  previousBuckets: PositionBucket[];
}

export function buildPopBuckets(
  allDenials: Denial[],
  periodId: PeriodId,
  referenceDate: Date,
  granularity: TrendGranularity,
  dimension: (denial: Denial) => string,
  metric: MetricId,
): PopSeriesResult | null {
  const currentRange = currentPeriodRange(periodId, referenceDate);
  const previousRange = previousPeriodRange(periodId, referenceDate);
  if (!currentRange || !previousRange) return null;

  return {
    currentBuckets: bucketByPosition(
      filterByRange(allDenials, currentRange),
      granularity,
      dimension,
      metric,
    ),
    previousBuckets: bucketByPosition(
      filterByRange(allDenials, previousRange),
      granularity,
      dimension,
      metric,
    ),
  };
}

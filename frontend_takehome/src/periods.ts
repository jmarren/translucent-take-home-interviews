import { Denial } from './types';

export const PERIODS = [
  { id: 'all', label: 'All Time' },
  { id: 'last-30', label: 'Last 30 Days' },
  { id: 'this-month', label: 'This Month' },
  { id: 'this-quarter', label: 'This Quarter' },
  { id: 'this-year', label: 'This Year' },
] as const;

export type PeriodId = (typeof PERIODS)[number]['id'];

export const DEFAULT_PERIOD: PeriodId = PERIODS[0].id;

export function isValidPeriodId(id: string | null): id is PeriodId {
  return !!id && PERIODS.some((p) => p.id === id);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function periodStart(periodId: PeriodId, referenceDate: Date): Date | null {
  const today = startOfDay(referenceDate);
  switch (periodId) {
    case 'last-30': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return start;
    }
    case 'this-month':
      return new Date(today.getFullYear(), today.getMonth(), 1);
    case 'this-quarter': {
      const quarterMonth = Math.floor(today.getMonth() / 3) * 3;
      return new Date(today.getFullYear(), quarterMonth, 1);
    }
    case 'this-year':
      return new Date(today.getFullYear(), 0, 1);
    case 'all':
    default:
      return null;
  }
}

/**
 * "Today" for period filtering is anchored to the most recent denial date in the
 * dataset, not the real calendar date, so period filters return meaningful results
 * against this fixed mock dataset instead of always resolving to zero rows.
 */
export function getReferenceDate(denials: Denial[]): Date {
  if (denials.length === 0) return new Date();
  const latest = denials.reduce((max, d) => (d.date > max ? d.date : max), denials[0].date);
  return new Date(`${latest}T00:00:00`);
}

export function filterByPeriod(denials: Denial[], periodId: PeriodId, referenceDate: Date): Denial[] {
  const start = periodStart(periodId, referenceDate);
  if (!start) return denials;
  const startStr = start.toISOString().slice(0, 10);
  return denials.filter((d) => d.date >= startStr);
}

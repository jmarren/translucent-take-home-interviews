export interface Denial {
  id: string;
  department: string;
  amount: number;
  reason: string;
  date: string;
  payer: string;
}

export const METRICS = [
  { id: "amount", label: "Dollar Amount" },
  { id: "count", label: "Denial Count" },
] as const;

export type MetricId = (typeof METRICS)[number]["id"];

export const DEFAULT_METRIC: MetricId = METRICS[0].id;

export function isValidMetricId(id: string | null): id is MetricId {
  return !!id && METRICS.some((m) => m.id === id);
}

// Every chart in the app aggregates denials by summing one of these two
// per-denial values -- dollar amount, or a flat 1 (so summing yields a
// count). Keeping this in one place means every aggregation site (category
// totals, monthly trend, multi-series trend, PoP deltas, summary stats)
// switches metrics identically instead of each reimplementing the branch.
export function metricValue(denial: Denial, metric: MetricId): number {
  return metric === "count" ? 1 : denial.amount;
}

export const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
] as const;

export const PAYERS = ['Medicare', 'Humana', 'Cigna', 'BCBS', 'Aetna'] as const;

export const REASONS = [
  'Authorization missing',
  'Coding error',
  'Duplicate claim',
  'Expired coverage',
  'Invalid CPT',
  'Medical necessity',
  'Missing info',
  'Out of network',
] as const;

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Denial } from '../types';
import { TimeSeriesChartType, TIME_SERIES_CHART_TYPES, useChartType } from '../chartTypes';
import ChartTypeSelect from './ChartTypeSelect';

interface MonthTotal {
  monthKey: string;
  month: string;
  amount: number;
}

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export interface TimeSeriesCardConfig {
  /** localStorage key + command-palette identity for this card's chart-type choice. */
  chartTypeKey: string;
  defaultChartType: TimeSeriesChartType;
  title: string;
  ariaLabel: string;
  chartTypeAriaLabel: string;
  caption: string;
  /** Buckets a denial into a "YYYY-MM" period key -- defaults to grouping by month via `date`. */
  groupByMonth?: (denial: Denial) => string;
}

interface TimeSeriesCardProps {
  data: Denial[];
  loading?: boolean;
  config: TimeSeriesCardConfig;
}

function defaultGroupByMonth(denial: Denial): string {
  return denial.date.slice(0, 7); // "YYYY-MM"
}

function useMonthlyTrend(data: Denial[], groupByMonth: (denial: Denial) => string): MonthTotal[] {
  return useMemo(() => {
    const monthTotals = new Map<string, number>();
    for (const d of data) {
      const monthKey = groupByMonth(d);
      monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + d.amount);
    }
    return Array.from(monthTotals, ([monthKey, amount]) => {
      const monthIndex = Number(monthKey.slice(5, 7)) - 1;
      return { monthKey, month: MONTH_LABELS[monthIndex] ?? monthKey, amount };
    }).sort((a, b) => (a.monthKey > b.monthKey ? 1 : -1));
  }, [data, groupByMonth]);
}

function AreaView({ trend }: { trend: MonthTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b7fa6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#5b7fa6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tickFormatter={currency}
          tick={{ fontSize: 11 }}
          width={64}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number) => [currency(value), 'Total amount']}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ''}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#5b7fa6"
          strokeWidth={2}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function LineView({ trend }: { trend: MonthTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tickFormatter={currency}
          tick={{ fontSize: 11 }}
          width={64}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number) => [currency(value), 'Total amount']}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ''}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#5b7fa6"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function BarByMonthView({ trend }: { trend: MonthTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tickFormatter={currency}
          tick={{ fontSize: 11 }}
          width={64}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number) => [currency(value), 'Total amount']}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ''}
        />
        <Bar dataKey="amount" fill="#5b7fa6" name="Denied amount" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function TimeSeriesCard({ data, loading = false, config }: TimeSeriesCardProps) {
  const groupByMonth = config.groupByMonth ?? defaultGroupByMonth;
  const trend = useMonthlyTrend(data, groupByMonth);
  const [chartType, setChartType] = useChartType<TimeSeriesChartType>(
    config.chartTypeKey,
    TIME_SERIES_CHART_TYPES,
    config.defaultChartType
  );

  if (!loading && trend.length <= 1) return null;

  return (
    <section className="trend-sparkline-card chart-card-exhibit" aria-label={config.ariaLabel}>
      <div className="chart-card-header">
        <h2 className="chart-card-title">{config.title}</h2>
        <ChartTypeSelect
          ariaLabel={config.chartTypeAriaLabel}
          value={chartType}
          options={TIME_SERIES_CHART_TYPES}
          onChange={setChartType}
        />
      </div>
      <div className="chart-card-body trend-sparkline-body">
        <div style={{ width: '100%' }}>
          {loading ? (
            <div className="chart-skeleton" style={{ height: 280 }} aria-hidden="true" />
          ) : chartType === 'line' ? (
            <LineView trend={trend} />
          ) : chartType === 'bar' ? (
            <BarByMonthView trend={trend} />
          ) : (
            <AreaView trend={trend} />
          )}
        </div>
      </div>
      <p className="chart-card-caption">{config.caption}</p>
    </section>
  );
}

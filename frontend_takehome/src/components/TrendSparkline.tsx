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

interface TrendSparklineProps {
  data: Denial[];
  loading?: boolean;
}

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

function useMonthlyTrend(data: Denial[]): MonthTotal[] {
  return useMemo(() => {
    const monthTotals = new Map<string, number>();
    for (const d of data) {
      const monthKey = d.date.slice(0, 7); // "YYYY-MM"
      monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + d.amount);
    }
    return Array.from(monthTotals, ([monthKey, amount]) => {
      const monthIndex = Number(monthKey.slice(5, 7)) - 1;
      return { monthKey, month: MONTH_LABELS[monthIndex] ?? monthKey, amount };
    }).sort((a, b) => (a.monthKey > b.monthKey ? 1 : -1));
  }, [data]);
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

export default function TrendSparkline({ data, loading = false }: TrendSparklineProps) {
  const trend = useMonthlyTrend(data);
  const [chartType, setChartType] = useChartType<TimeSeriesChartType>(
    'trend',
    TIME_SERIES_CHART_TYPES,
    'area'
  );

  if (!loading && trend.length <= 1) return null;

  return (
    <section
      className="trend-sparkline-card chart-card-exhibit"
      aria-label="Denied amount trend over time"
    >
      <div className="chart-card-header">
        <h2 className="chart-card-title">Trend</h2>
        <ChartTypeSelect
          ariaLabel="Chart type for Trend"
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
      <p className="chart-card-caption">
        Monthly denied dollar total across the filtered range.
      </p>
    </section>
  );
}

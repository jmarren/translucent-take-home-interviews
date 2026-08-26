import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Denial } from '../types';
import { CategoricalChartType, CATEGORICAL_CHART_TYPES, useChartType } from '../chartTypes';
import ChartTypeSelect from './ChartTypeSelect';

interface DenialChartProps {
  data: Denial[];
}

interface ReasonTotal {
  reason: string;
  amount: number;
}

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const SLICE_COLORS = ['#5b7fa6', '#2c423f', '#4c5b61', '#8a5a44', '#b08d3e', '#829191', '#949b96', '#c5c5c5'];

function useReasonTotals(data: Denial[]): ReasonTotal[] {
  return useMemo(() => {
    const totals = new Map<string, number>();
    for (const d of data) {
      totals.set(d.reason, (totals.get(d.reason) ?? 0) + d.amount);
    }
    return Array.from(totals, ([reason, amount]) => ({ reason, amount }));
  }, [data]);
}

function BarView({ chartData }: { chartData: ReasonTotal[] }) {
  return (
    <div style={{ width: '100%', maxWidth: 720, flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={currency}
            domain={[0, (dataMax: number) => dataMax * 1.15]}
          />
          <YAxis type="category" dataKey="reason" width={140} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value: number) => [currency(value), 'Total amount']} />
          <Bar dataKey="amount" fill="#5b7fa6" name="Denied amount" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PieView({ chartData }: { chartData: ReasonTotal[] }) {
  const total = useMemo(() => chartData.reduce((sum, d) => sum + d.amount, 0), [chartData]);
  return (
    <div style={{ width: '100%', maxWidth: 432 }}>
      <ResponsiveContainer width="100%" aspect={1}>
        <PieChart margin={{ top: 8, right: 32, left: 32, bottom: 8 }}>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="reason"
            cx="50%"
            cy="50%"
            outerRadius="55%"
            label={({ reason, amount }) => `${((amount / total) * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.reason} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, _name, item) => [currency(value), item?.payload?.reason]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function TableView({ chartData }: { chartData: ReasonTotal[] }) {
  const sorted = useMemo(() => [...chartData].sort((a, b) => b.amount - a.amount), [chartData]);
  return (
    <table className="chart-card-table">
      <caption className="visually-hidden">Total denied amount by reason</caption>
      <thead>
        <tr>
          <th scope="col">Reason</th>
          <th scope="col">Total amount</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.reason}>
            <td>{row.reason}</td>
            <td>{currency(row.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function DenialChart({ data }: DenialChartProps) {
  const chartData = useReasonTotals(data);
  const [chartType, setChartType] = useChartType<CategoricalChartType>(
    'reason',
    CATEGORICAL_CHART_TYPES,
    'bar'
  );

  return (
    <section className="reason-chart-card chart-card-exhibit" aria-label="Denial breakdown chart">
      <div className="chart-card-header">
        <h2 className="chart-card-title">Reasons</h2>
        <ChartTypeSelect
          ariaLabel="Chart type for Reasons"
          value={chartType}
          options={CATEGORICAL_CHART_TYPES}
          onChange={setChartType}
        />
      </div>
      <div className="chart-card-body">
        {chartData.length === 0 ? (
          <p>No denial data to display.</p>
        ) : chartType === 'pie' ? (
          <PieView chartData={chartData} />
        ) : chartType === 'table' ? (
          <TableView chartData={chartData} />
        ) : (
          <BarView chartData={chartData} />
        )}
      </div>
      <p className="chart-card-caption">Total denied dollars grouped by stated denial reason.</p>
    </section>
  );
}

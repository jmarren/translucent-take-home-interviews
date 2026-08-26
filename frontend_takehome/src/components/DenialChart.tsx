import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Denial } from '../types';

interface DenialChartProps {
  data: Denial[];
}

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function DenialChart({ data }: DenialChartProps) {
  const chartData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const d of data) {
      totals.set(d.reason, (totals.get(d.reason) ?? 0) + d.amount);
    }
    return Array.from(totals, ([reason, amount]) => ({ reason, amount }));
  }, [data]);

  return (
    <section className="reason-chart-card" aria-label="Denial breakdown chart">
      <h2 className="chart-card-title">Reasons</h2>
      <div className="chart-card-body">
        {chartData.length === 0 ? (
          <p>No denial data to display.</p>
        ) : (
          <div style={{ width: '100%', maxWidth: 576 }}>
            <ResponsiveContainer width="100%" aspect={1}>
              <BarChart data={chartData} margin={{ top: 8, right: 24, left: 16, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reason" angle={-30} textAnchor="end" interval={0} height={70} />
                <YAxis tickFormatter={currency} domain={[0, (dataMax: number) => dataMax * 1.15]} />
                <Tooltip formatter={(value: number) => [currency(value), 'Total amount']} />
                <Bar dataKey="amount" fill="#2c423f" name="Denied amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

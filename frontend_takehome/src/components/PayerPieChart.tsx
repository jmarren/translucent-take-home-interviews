import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Denial } from '../types';

interface PayerPieChartProps {
  data: Denial[];
  loading?: boolean;
}

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

// Same reasoning as DEPARTMENT_COLORS in DepartmentPieChart: the app's base
// palette (index.css `:root`) is too few/too closely related to safely
// distinguish 5 categorical slices, so this extends it with a few more
// restrained, low-saturation hues (distinct from the ones DepartmentPieChart
// picked, so the two charts don't visually alias each other) rather than
// reusing that chart's colors verbatim.
const PAYER_COLORS: Record<string, string> = {
  Medicare: '#2c423f', // --dark-slate-grey
  Humana: '#6b4d6b', // muted plum
  Cigna: '#4c5b61', // --iron-grey
  BCBS: '#7a6a3f', // muted bronze/khaki
  Aetna: '#3f6b63', // muted teal
};

const FALLBACK_COLOR = '#949b96'; // --grey-olive-2

export default function PayerPieChart({ data, loading = false }: PayerPieChartProps) {
  const chartData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const d of data) {
      totals.set(d.payer, (totals.get(d.payer) ?? 0) + d.amount);
    }
    return Array.from(totals, ([payer, amount]) => ({ payer, amount }));
  }, [data]);

  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.amount, 0),
    [chartData]
  );

  return (
    <section className="chart-card-exhibit" aria-label="Denial breakdown by payer chart">
      <h2 className="chart-card-title">Payers</h2>
      <div className="chart-card-body">
        <div style={{ width: '100%', maxWidth: 432 }}>
          {loading ? (
            <div className="chart-skeleton chart-skeleton-round" aria-hidden="true" />
          ) : chartData.length === 0 ? (
            <p>No denial data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" aspect={1}>
              <PieChart margin={{ top: 8, right: 32, left: 32, bottom: 8 }}>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="payer"
                  cx="50%"
                  cy="50%"
                  outerRadius="55%"
                  label={({ payer, amount }) =>
                    `${payer}: ${((amount / total) * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.payer}
                      fill={PAYER_COLORS[entry.payer] ?? FALLBACK_COLOR}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [currency(value), 'Total amount']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <p className="chart-card-caption">Total denied dollars grouped by payer, filed vs. total.</p>
    </section>
  );
}

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Denial } from '../types';

interface DepartmentPieChartProps {
  data: Denial[];
  loading?: boolean;
}

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

// Extends the app's existing low-chroma palette (index.css `:root`) with a
// small number of additional restrained hues. The base palette alone
// (silver/iron-grey/grey-olive/grey-olive-2/dark-slate-grey/beige) is a set
// of closely related greys and greens that are hard to tell apart at a
// glance, and worse for colorblind users — not safe as 6 distinct
// categorical pie slices. These extra hues stay muted/low-saturation to
// match the app's aesthetic rather than introducing bright, clashing colors.
const DEPARTMENT_COLORS: Record<string, string> = {
  Cardiology: '#2c423f', // --dark-slate-grey
  Neurology: '#4c5b61', // --iron-grey
  Oncology: '#8a5a44', // muted terracotta
  Orthopedics: '#5b7fa6', // muted slate blue
  Pediatrics: '#b08d3e', // muted gold/ochre
  Radiology: '#829191', // --grey-olive
};

const FALLBACK_COLOR = '#949b96'; // --grey-olive-2

export default function DepartmentPieChart({ data, loading = false }: DepartmentPieChartProps) {
  const chartData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const d of data) {
      totals.set(d.department, (totals.get(d.department) ?? 0) + d.amount);
    }
    return Array.from(totals, ([department, amount]) => ({ department, amount }));
  }, [data]);

  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.amount, 0),
    [chartData]
  );

  return (
    <section className="chart-card-exhibit" aria-label="Denial breakdown by department chart">
      <h2 className="chart-card-title">Departments</h2>
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
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  outerRadius="55%"
                  label={({ department, amount }) =>
                    `${department}: ${((amount / total) * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.department}
                      fill={DEPARTMENT_COLORS[entry.department] ?? FALLBACK_COLOR}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [currency(value), 'Total amount']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <p className="chart-card-caption">Total denied dollars grouped by department, filed vs. total.</p>
    </section>
  );
}

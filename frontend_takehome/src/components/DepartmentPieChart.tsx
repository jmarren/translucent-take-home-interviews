import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Denial } from '../types';
import { CategoricalChartType, CATEGORICAL_CHART_TYPES, useChartType } from '../chartTypes';
import ChartTypeSelect from './ChartTypeSelect';

interface DepartmentPieChartProps {
  data: Denial[];
}

interface DepartmentTotal {
  department: string;
  amount: number;
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

function useDepartmentTotals(data: Denial[]): DepartmentTotal[] {
  return useMemo(() => {
    const totals = new Map<string, number>();
    for (const d of data) {
      totals.set(d.department, (totals.get(d.department) ?? 0) + d.amount);
    }
    return Array.from(totals, ([department, amount]) => ({ department, amount }));
  }, [data]);
}

function PieView({ chartData }: { chartData: DepartmentTotal[] }) {
  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.amount, 0),
    [chartData]
  );
  return (
    <div style={{ width: '100%', maxWidth: 432 }}>
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
    </div>
  );
}

function BarView({ chartData }: { chartData: DepartmentTotal[] }) {
  return (
    <div style={{ width: '100%', maxWidth: 432, flex: 1, minHeight: 0 }}>
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
          <YAxis type="category" dataKey="department" width={100} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value: number) => [currency(value), 'Total amount']} />
          <Bar dataKey="amount" name="Denied amount" radius={[0, 3, 3, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.department}
                fill={DEPARTMENT_COLORS[entry.department] ?? FALLBACK_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TableView({ chartData }: { chartData: DepartmentTotal[] }) {
  const sorted = useMemo(() => [...chartData].sort((a, b) => b.amount - a.amount), [chartData]);
  return (
    <table className="chart-card-table">
      <caption className="visually-hidden">Total denied amount by department</caption>
      <thead>
        <tr>
          <th scope="col">Department</th>
          <th scope="col">Total amount</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.department}>
            <td>{row.department}</td>
            <td>{currency(row.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function DepartmentPieChart({ data }: DepartmentPieChartProps) {
  const chartData = useDepartmentTotals(data);
  const [chartType, setChartType] = useChartType<CategoricalChartType>(
    'department',
    CATEGORICAL_CHART_TYPES,
    'pie'
  );

  return (
    <section className="chart-card-exhibit" aria-label="Denial breakdown by department chart">
      <div className="chart-card-header">
        <h2 className="chart-card-title">Departments</h2>
        <ChartTypeSelect
          ariaLabel="Dept. breakdown chart type"
          value={chartType}
          options={CATEGORICAL_CHART_TYPES}
          onChange={setChartType}
        />
      </div>
      <div className="chart-card-body">
        {chartData.length === 0 ? (
          <p>No denial data to display.</p>
        ) : chartType === 'bar' ? (
          <BarView chartData={chartData} />
        ) : chartType === 'table' ? (
          <TableView chartData={chartData} />
        ) : (
          <PieView chartData={chartData} />
        )}
      </div>
      <p className="chart-card-caption">Total denied dollars grouped by department, filed vs. total.</p>
    </section>
  );
}

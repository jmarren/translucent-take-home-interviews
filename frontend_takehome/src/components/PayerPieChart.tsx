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

interface PayerPieChartProps {
  data: Denial[];
  loading?: boolean;
}

interface PayerTotal {
  payer: string;
  amount: number;
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

function usePayerTotals(data: Denial[]): PayerTotal[] {
  return useMemo(() => {
    const totals = new Map<string, number>();
    for (const d of data) {
      totals.set(d.payer, (totals.get(d.payer) ?? 0) + d.amount);
    }
    return Array.from(totals, ([payer, amount]) => ({ payer, amount }));
  }, [data]);
}

function PieView({ chartData }: { chartData: PayerTotal[] }) {
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
    </div>
  );
}

function BarView({ chartData }: { chartData: PayerTotal[] }) {
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
          <YAxis type="category" dataKey="payer" width={100} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value: number) => [currency(value), 'Total amount']} />
          <Bar dataKey="amount" name="Denied amount" radius={[0, 3, 3, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.payer}
                fill={PAYER_COLORS[entry.payer] ?? FALLBACK_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TableView({ chartData }: { chartData: PayerTotal[] }) {
  const sorted = useMemo(() => [...chartData].sort((a, b) => b.amount - a.amount), [chartData]);
  return (
    <table className="chart-card-table">
      <caption className="visually-hidden">Total denied amount by payer</caption>
      <thead>
        <tr>
          <th scope="col">Payer</th>
          <th scope="col">Total amount</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.payer}>
            <td>{row.payer}</td>
            <td>{currency(row.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PayerPieChart({ data, loading = false }: PayerPieChartProps) {
  const chartData = usePayerTotals(data);
  const [chartType, setChartType] = useChartType<CategoricalChartType>(
    'payer',
    CATEGORICAL_CHART_TYPES,
    'pie'
  );

  return (
    <section className="chart-card-exhibit" aria-label="Denial breakdown by payer chart">
      <div className="chart-card-header">
        <h2 className="chart-card-title">Payers</h2>
        <ChartTypeSelect
          ariaLabel="Chart type for Payers"
          value={chartType}
          options={CATEGORICAL_CHART_TYPES}
          onChange={setChartType}
        />
      </div>
      <div className="chart-card-body">
        {loading ? (
          <div
            className={chartType === 'bar' ? 'chart-skeleton' : 'chart-skeleton chart-skeleton-round'}
            style={chartType === 'bar' ? { maxWidth: 432, width: '100%', flex: 1, minHeight: 0 } : { maxWidth: 432, width: '100%' }}
            aria-hidden="true"
          />
        ) : chartData.length === 0 ? (
          <p>No denial data to display.</p>
        ) : chartType === 'bar' ? (
          <BarView chartData={chartData} />
        ) : chartType === 'table' ? (
          <TableView chartData={chartData} />
        ) : (
          <PieView chartData={chartData} />
        )}
      </div>
      <p className="chart-card-caption">Total denied dollars grouped by payer, filed vs. total.</p>
    </section>
  );
}

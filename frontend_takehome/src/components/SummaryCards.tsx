import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Denial } from '../types';

interface SummaryCardsProps {
  data: Denial[];
}

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function SummaryCards({ data }: SummaryCardsProps) {
  const stats = useMemo(() => {
    const count = data.length;
    const total = data.reduce((sum, d) => sum + d.amount, 0);
    const average = count === 0 ? 0 : total / count;

    const reasonTotals = new Map<string, number>();
    for (const d of data) {
      reasonTotals.set(d.reason, (reasonTotals.get(d.reason) ?? 0) + d.amount);
    }
    let topReason = '—';
    let topReasonAmount = 0;
    reasonTotals.forEach((amount, reason) => {
      if (amount > topReasonAmount) {
        topReason = reason;
        topReasonAmount = amount;
      }
    });

    return { count, total, average, topReason };
  }, [data]);

  const trend = useMemo(() => {
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

  return (
    <div className="summary-cards" aria-label="Summary statistics">
      <div className="summary-panel">
        <div className="summary-card">
          <span className="summary-card-label">Total Denied</span>
          <span className="summary-card-value">{currency(stats.total)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">Denial Count</span>
          <span className="summary-card-value">{stats.count.toLocaleString()}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">Average Denial</span>
          <span className="summary-card-value">{currency(stats.average)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">Top Reason</span>
          <span className="summary-card-value summary-card-value-text">{stats.topReason}</span>
        </div>
      </div>

      {trend.length > 1 && (
        <section className="trend-sparkline-card" aria-label="Denied amount trend over time">
          <h2 className="chart-card-title">Trend</h2>
          <div className="trend-sparkline-body">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b7fa6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#5b7fa6" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
          </div>
        </section>
      )}
    </div>
  );
}

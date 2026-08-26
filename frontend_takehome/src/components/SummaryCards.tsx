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
    <div className="ledger" aria-label="Summary statistics">
      <dl className="ledger-strip">
        <div className="ledger-entry">
          <dt className="ledger-label">Total Denied</dt>
          <dd className="ledger-value">{currency(stats.total)}</dd>
        </div>
        <div className="ledger-entry">
          <dt className="ledger-label">Denial Count</dt>
          <dd className="ledger-value">{stats.count.toLocaleString()}</dd>
        </div>
        <div className="ledger-entry">
          <dt className="ledger-label">Average Denial</dt>
          <dd className="ledger-value">{currency(stats.average)}</dd>
        </div>
        <div className="ledger-entry ledger-entry-wide">
          <dt className="ledger-label">Top Reason</dt>
          <dd className="ledger-value ledger-value-text">{stats.topReason}</dd>
        </div>
      </dl>

      {trend.length > 1 && (
        <section className="exhibit exhibit-trend" aria-label="Denied amount trend over time">
          <p className="exhibit-tag">Exhibit D</p>
          <h2 className="exhibit-title">Denied Amount Over Time</h2>
          <div className="exhibit-trend-body">
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
          <p className="exhibit-caption">Monthly denied dollar total across the filtered range.</p>
        </section>
      )}
    </div>
  );
}

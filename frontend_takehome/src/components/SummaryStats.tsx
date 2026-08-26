import React, { useMemo } from 'react';
import { Denial } from '../types';

interface SummaryStatsProps {
  data: Denial[];
}

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function SummaryStats({ data }: SummaryStatsProps) {
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

  return (
    <div className="summary-panel" aria-label="Summary statistics">
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
  );
}

import React, { useMemo } from 'react';
import { Denial, MetricId, metricValue } from '../types';

interface SummaryStatsProps {
	data: Denial[];
	metric: MetricId;
}

const currency = (value: number) =>
	`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const plainCount = (value: number) => value.toLocaleString();

export default function SummaryStats({ data, metric }: SummaryStatsProps) {
	const format = metric === 'count' ? plainCount : currency;

	const stats = useMemo(() => {
		const count = data.length;
		const dollarTotal = data.reduce((sum, d) => sum + d.amount, 0);
		const average = count === 0 ? 0 : dollarTotal / count;
		const total = metric === 'count' ? count : dollarTotal;

		const reasonTotals = new Map<string, number>();
		for (const d of data) {
			reasonTotals.set(d.reason, (reasonTotals.get(d.reason) ?? 0) + metricValue(d, metric));
		}
		let topReason = '—';
		let topReasonValue = 0;
		reasonTotals.forEach((value, reason) => {
			if (value > topReasonValue) {
				topReason = reason;
				topReasonValue = value;
			}
		});

		return { count, total, average, topReason };
	}, [data, metric]);

	return (
		<div className="summary-panel" aria-label="Summary statistics">
			<div className="summary-card">
				<span className="summary-card-label">{metric === 'count' ? 'Total Denials' : 'Total Denied'}</span>
				<span className="summary-card-value  summary-card-value-text">{format(stats.total)}</span>
			</div>
			<div className="summary-card">
				<span className="summary-card-label">Denial Count</span>
				<span className="summary-card-value  summary-card-value-text">{stats.count.toLocaleString()}</span>
			</div>
			<div className="summary-card">
				<span className="summary-card-label">Average Denial</span>
				<span className="summary-card-value  summary-card-value-text">{currency(stats.average)}</span>
			</div>
			<div className="summary-card">
				<span className="summary-card-label">Top Reason</span>
				<span className="summary-card-value summary-card-value-text">{stats.topReason}</span>
			</div>
		</div>
	);
}

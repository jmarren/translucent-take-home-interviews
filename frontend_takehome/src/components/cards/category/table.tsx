import React, { useMemo } from 'react';
import { MetricId } from '../../../types';
import { CategoryTotal, formatterFor } from './shared';

export default function TableView({
	chartData,
	categoryLabel,
	metric,
}: {
	chartData: CategoryTotal[];
	categoryLabel: string;
	metric: MetricId;
}) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Total amount';
	const sorted = useMemo(() => [...chartData].sort((a, b) => b.amount - a.amount), [chartData]);
	return (
		<table className="chart-card-table">
			<caption className="visually-hidden">
				{metricLabel} by {categoryLabel.toLowerCase()}
			</caption>
			<thead>
				<tr>
					<th scope="col">{categoryLabel}</th>
					<th scope="col">{metricLabel}</th>
				</tr>
			</thead>
			<tbody>
				{sorted.map((row) => (
					<tr key={row.category}>
						<td>{row.category}</td>
						<td>{format(row.amount)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

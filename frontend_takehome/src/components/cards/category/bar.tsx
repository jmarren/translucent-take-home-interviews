import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { MetricId } from '../../../types';
import { CategoryTotal, formatterFor, colorFor, barChartHeight, BAR_THICKNESS } from './shared';

export default function BarView({
	chartData,
	colors,
	wide,
	metric,
}: {
	chartData: CategoryTotal[];
	colors?: Record<string, string>;
	wide?: boolean;
	metric: MetricId;
}) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Denied amount';
	return (
		<ResponsiveContainer width="100%" height={barChartHeight(chartData.length)}>
			<BarChart
				data={chartData}
				layout="vertical"
				margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
			>
				<CartesianGrid strokeDasharray="3 3" horizontal={false} />
				<XAxis
					type="number"
					tickFormatter={format}
					domain={[0, (dataMax: number) => dataMax * 1.15]}
				/>
				<YAxis type="category" dataKey="category" width={wide ? 140 : 120} tick={{ fontSize: 13 }} />
				<Tooltip formatter={(value: number) => [format(value), metricLabel]} />
				<Bar dataKey="amount" name={metricLabel} radius={[0, 3, 3, 0]} barSize={BAR_THICKNESS}>
					{chartData.map((entry, index) => (
						<Cell key={entry.category} fill={colorFor(entry.category, index, colors)} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
}

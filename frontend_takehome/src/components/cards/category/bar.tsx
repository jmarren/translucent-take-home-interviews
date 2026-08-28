import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { MetricId } from '../../../types';
import { CategoryTotal, formatterFor, colorFor, barChartHeight, BAR_THICKNESS } from './shared';

export default function BarView({
	chartData,
	vizColors,
	wide,
	metric,
	animationsEnabled,
	expanded,
}: {
	chartData: CategoryTotal[];
	vizColors: string[];
	wide?: boolean;
	metric: MetricId;
	animationsEnabled: boolean;
	expanded: boolean;
}) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Denied amount';
	// No name/category in the tooltip -- the category is already the YAxis
	// tick label right next to it, and the metric name just repeats the
	// Metric filter's own current selection, so both would be pure noise.
	return (
		<ResponsiveContainer width="100%" height={expanded ? '100%' : barChartHeight(chartData.length)}>
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
					tickMargin={8} // a few px more than Recharts' default (2), nudging the metric labels down away from the axis line
					tick={{ fontSize: 13 }} // matches the category (YAxis) labels' font size below
				/>
				<YAxis type="category" dataKey="category" width={wide ? 140 : 120} tick={{ fontSize: 13 }} />
				<Tooltip formatter={(value: number) => [format(value), undefined]} labelFormatter={() => ''} />
				<Bar dataKey="amount" name={metricLabel} radius={[0, 3, 3, 0]} barSize={BAR_THICKNESS} isAnimationActive={animationsEnabled}>
					{chartData.map((entry, index) => (
						<Cell key={entry.category} fill={colorFor(index, vizColors)} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
}

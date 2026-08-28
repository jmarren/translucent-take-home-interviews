import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { MetricId } from '../../../types';
import { CategoryTotal, formatterFor, colorFor, VERTICAL_BAR_CHART_HEIGHT } from './shared';

// Same data/coloring as BarView (horizontal bars, category axis vertical)
// -- this is the other orientation, bars standing upright with category
// names along the X-axis. Kept as its own file rather than a `direction`
// prop on BarView, matching the one-file-per-chart-shape pattern already
// used for bar/pie/table here.
export default function VerticalBarView({
	chartData,
	vizColors,
	metric,
	minWidth,
	animationsEnabled,
	expanded,
}: {
	chartData: CategoryTotal[];
	vizColors: string[];
	metric: MetricId;
	minWidth: number;
	animationsEnabled: boolean;
	expanded: boolean;
}) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Denied amount';
	// No name/category in the tooltip -- the category is already the XAxis
	// tick label right below it, and the metric name just repeats the
	// Metric filter's own current selection, so both would be pure noise.
	return (
		<ResponsiveContainer width="100%" height={expanded ? '100%' : VERTICAL_BAR_CHART_HEIGHT} minWidth={minWidth}>
			<BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				{/* interval={0} forces every category to get a tick label --
				    Recharts' default ("preserveEnd") silently drops whichever
				    labels it estimates would overlap rather than showing them
				    cramped, which was making some categories' names vanish
				    entirely. Safe to force here because minWidth (below,
				    verticalBarChartMinWidth) already guarantees the chart is
				    wide enough for every label to actually fit. */}
				<XAxis dataKey="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} interval={0} />
				<YAxis
					tickFormatter={format}
					tick={{ fontSize: 11 }}
					width={64}
					tickLine={false}
					axisLine={false}
					domain={[0, (dataMax: number) => dataMax * 1.15]}
				/>
				<Tooltip formatter={(value: number) => [format(value), undefined]} labelFormatter={() => ''} />
				<Bar dataKey="amount" name={metricLabel} radius={[3, 3, 0, 0]} isAnimationActive={animationsEnabled}>
					{chartData.map((entry, index) => (
						<Cell key={entry.category} fill={colorFor(index, vizColors)} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
}

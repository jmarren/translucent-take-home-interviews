import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricId } from '../../../types';
import { CategoryTotal, formatterFor, colorFor, PIE_LABEL_FONT_SIZE } from './shared';

// Renders category name and percentage as two fixed <tspan> lines instead
// of one plain string -- a single string left Recharts/the browser's own
// text layout to decide where to wrap, which broke different slices at
// different points (e.g. "Radiology:\n46%" vs. "Orthopedics: 54%") for no
// reason a viewer could predict. Every slice now wraps the same way
// regardless of name length.
function renderPieLabel(total: number) {
	return function PieLabel(props: any) {
		const { x, y, textAnchor, fill, category, amount } = props;
		const pct = `${((amount / total) * 100).toFixed(0)}%`;
		return (
			<text x={x} y={y} textAnchor={textAnchor} fill={fill} fontSize={PIE_LABEL_FONT_SIZE}>
				<tspan x={x} dy="-0.3em">{category}</tspan>
				<tspan x={x} dy="1.2em">{pct}</tspan>
			</text>
		);
	};
}

export default function PieView({
	chartData,
	colors,
	metric,
	minWidth,
}: {
	chartData: CategoryTotal[];
	colors?: Record<string, string>;
	metric: MetricId;
	minWidth: number;
}) {
	const format = formatterFor(metric);
	const total = useMemo(() => chartData.reduce((sum, d) => sum + d.amount, 0), [chartData]);

	return (
		<ResponsiveContainer width="100%" height={minWidth} minWidth={minWidth}>
			<PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
				<Pie
					labelLine={false}
					data={chartData}
					dataKey="amount"
					nameKey="category"
					cx="50%"
					cy="50%"
					outerRadius="50%"
					label={renderPieLabel(total)}
				>
					{chartData.map((entry, index) => (
						<Cell key={entry.category} fill={colorFor(entry.category, index, colors)} />
					))}
				</Pie>
				<Tooltip formatter={(value: number, _name, item) => [format(value), item?.payload?.category]} />
			</PieChart>
		</ResponsiveContainer>
	);
}

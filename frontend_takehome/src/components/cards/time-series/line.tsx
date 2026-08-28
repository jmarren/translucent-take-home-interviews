import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricId } from '../../../types';
import { MonthTotal, formatterFor } from './shared';

export default function LineView({ trend, metric, color, animationsEnabled }: { trend: MonthTotal[]; metric: MetricId; color: string; animationsEnabled: boolean }) {
	const format = formatterFor(metric);
	return (
		<ResponsiveContainer width="100%" >
			<LineChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
				<XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
				<YAxis
					tickFormatter={format}
					tick={{ fontSize: 11 }}
					width={64}
					tickLine={false}
					axisLine={false}
				/>
				{/* No metric name in the tooltip value line -- it just repeats
				    the Metric filter's own current selection. labelFormatter
				    (the month) stays, since that's not shown anywhere else
				    on the chart. */}
				<Tooltip
					formatter={(value: number) => [format(value), undefined]}
					labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ''}
				/>
				<Line
					type="monotone"
					dataKey="amount"
					stroke={color}
					strokeWidth={2}
					dot={{ r: 3 }}
					isAnimationActive={animationsEnabled}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}

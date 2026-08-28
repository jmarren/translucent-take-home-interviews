import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricId } from '../../../types';
import { MonthTotal, formatterFor } from './shared';

export default function BarByMonthView({ trend, metric, color, animationsEnabled }: { trend: MonthTotal[]; metric: MetricId; color: string; animationsEnabled: boolean }) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Denied amount';
	return (
		<ResponsiveContainer width="100%" >
			<BarChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
				<XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
				<YAxis
					tickFormatter={format}
					tick={{ fontSize: 11 }}
					width={64}
					tickLine={false}
					axisLine={false}
				/>
				<Tooltip
					formatter={(value: number) => [format(value), metricLabel]}
					labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ''}
				/>
				<Bar dataKey="amount" fill={color} name={metricLabel} radius={[3, 3, 0, 0]} isAnimationActive={animationsEnabled} />
			</BarChart>
		</ResponsiveContainer>
	);
}

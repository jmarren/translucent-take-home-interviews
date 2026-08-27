import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricId } from '../../../types';
import { MonthTotal, formatterFor } from './shared';

export default function BarByMonthView({ trend, metric }: { trend: MonthTotal[]; metric: MetricId }) {
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
				<Bar dataKey="amount" fill="#5b7fa6" name={metricLabel} radius={[3, 3, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}

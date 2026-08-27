import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricId } from '../../../types';
import { MonthTotal, formatterFor } from './shared';

export default function AreaView({ trend, metric }: { trend: MonthTotal[]; metric: MetricId }) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Total amount';
	return (
		<ResponsiveContainer width="100%" >
			<AreaChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
				<defs>
					<linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#5b7fa6" stopOpacity={0.35} />
						<stop offset="100%" stopColor="#5b7fa6" stopOpacity={0} />
					</linearGradient>
				</defs>
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
				<Area
					type="monotone"
					dataKey="amount"
					stroke="#5b7fa6"
					strokeWidth={2}
					fill="url(#trendFill)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}

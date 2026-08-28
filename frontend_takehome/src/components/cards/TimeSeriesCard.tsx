import React, { useMemo } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Denial, MetricId, metricValue } from '../../types';
import { TimeSeriesChartType, TIME_SERIES_CHART_TYPES, useChartType } from '../../chartTypes';
import ChartTypeSelect from '../select/ChartTypeSelect';
import { MonthTotal } from './time-series/shared';
import AreaView from './time-series/area';
import LineView from './time-series/line';
import BarByMonthView from './time-series/bar';

const MONTH_LABELS = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export interface TimeSeriesCardConfig {
	/** localStorage key + command-palette identity for this card's chart-type choice. */
	chartTypeKey: string;
	defaultChartType: TimeSeriesChartType;
	title: string;
	ariaLabel: string;
	chartTypeAriaLabel: string;
	caption: string;
	/** Buckets a denial into a "YYYY-MM" period key -- defaults to grouping by month via `date`. */
	groupByMonth?: (denial: Denial) => string;
}

interface TimeSeriesCardProps {
	data: Denial[];
	loading?: boolean;
	config: TimeSeriesCardConfig;
	metric: MetricId;
	color: string;
	animationsEnabled: boolean;
	expanded: boolean;
	onToggleExpand: () => void;
}

function defaultGroupByMonth(denial: Denial): string {
	return denial.date.slice(0, 7); // "YYYY-MM"
}

function useMonthlyTrend(
	data: Denial[],
	groupByMonth: (denial: Denial) => string,
	metric: MetricId
): MonthTotal[] {
	return useMemo(() => {
		const monthTotals = new Map<string, number>();
		for (const d of data) {
			const monthKey = groupByMonth(d);
			monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + metricValue(d, metric));
		}
		return Array.from(monthTotals, ([monthKey, amount]) => {
			const monthIndex = Number(monthKey.slice(5, 7)) - 1;
			return { monthKey, month: MONTH_LABELS[monthIndex] ?? monthKey, amount };
		}).sort((a, b) => (a.monthKey > b.monthKey ? 1 : -1));
	}, [data, groupByMonth, metric]);
}

export default function TimeSeriesCard({ data, loading = false, config, metric, color, animationsEnabled, expanded, onToggleExpand }: TimeSeriesCardProps) {
	const groupByMonth = config.groupByMonth ?? defaultGroupByMonth;
	const trend = useMonthlyTrend(data, groupByMonth, metric);
	const [chartType, setChartType] = useChartType<TimeSeriesChartType>(
		config.chartTypeKey,
		TIME_SERIES_CHART_TYPES,
		config.defaultChartType
	);

	// A single month has no trend/shape to show -- omit the card entirely
	// rather than rendering a single, meaningless point.
	if (!loading && trend.length <= 1) return null;

	const sectionClassName = [
		'trend-sparkline-card',
		'chart-card-exhibit',
		expanded ? 'chart-card-expanded' : null,
	].filter(Boolean).join(' ');

	return (
		<section className={sectionClassName} aria-label={config.ariaLabel} style={{ backgroundColor: 'white' }}>
			<div className="chart-card-header">
				<h2 className="chart-card-title">{config.title}</h2>
				<div className="chart-card-header-controls">
					<ChartTypeSelect
						ariaLabel={config.chartTypeAriaLabel}
						value={chartType}
						options={TIME_SERIES_CHART_TYPES}
						onChange={setChartType}
					/>
					<button
						type="button"
						className="chart-card-expand-button"
						aria-label={expanded ? 'Collapse' : 'Expand'}
						onClick={onToggleExpand}
					>
						{expanded ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
					</button>
				</div>
			</div>
			<div className="chart-card-body trend-sparkline-body">
				{loading ? (
					<div className="chart-skeleton" style={{ height: 420 }} aria-hidden="true" />
				) : chartType === 'line' ? (
					<LineView trend={trend} metric={metric} color={color} animationsEnabled={animationsEnabled} />
				) : chartType === 'bar' ? (
					<BarByMonthView trend={trend} metric={metric} color={color} animationsEnabled={animationsEnabled} />
				) : (
					<AreaView trend={trend} metric={metric} color={color} animationsEnabled={animationsEnabled} />
				)}
			</div>
			<p className="chart-card-caption">{config.caption}</p>
		</section>
	);
}

import React, { useMemo } from 'react';
import { Denial, MetricId, metricValue } from '../../types';
import { CategoricalChartType, CATEGORICAL_CHART_TYPES, useChartType } from '../../chartTypes';
import ChartTypeSelect from '../select/ChartTypeSelect';
import { CategoryTotal, ASSUMED_PIE_DIAMETER, widestLabelWidth, pieChartHeight } from './category/shared';
import BarView from './category/bar';
import PieView from './category/pie';
import TableView from './category/table';

export interface CategoryCardConfig {
	/** localStorage key + command-palette identity for this card's chart-type choice. */
	chartTypeKey: string;
	defaultChartType: CategoricalChartType;
	/** Card title (<h2>) and the noun used for the table view's column header. */
	title: string;
	/** Noun for the table view's category column, e.g. "Department" -- defaults to `title`. */
	categoryLabel?: string;
	ariaLabel: string;
	chartTypeAriaLabel: string;
	caption: string;
	/** Groups a denial into a category value, e.g. `(d) => d.department`. */
	groupBy: (denial: Denial) => string;
	/** Fixed per-category colors; categories with no entry fall back to a
	 *  positional default. Omit entirely to always assign colors by position. */
	colors?: Record<string, string>;
	/** Widens the bar view's Y-axis to fit longer category labels (e.g.
	 *  "Reasons", whose values run longer than "Departments"/"Payers"). */
	wide?: boolean;
}

interface CategoryCardProps {
	data: Denial[];
	loading?: boolean;
	config: CategoryCardConfig;
	metric: MetricId;
}

function useCategoryTotals(
	data: Denial[],
	groupBy: (denial: Denial) => string,
	metric: MetricId
): CategoryTotal[] {
	return useMemo(() => {
		const totals = new Map<string, number>();
		for (const d of data) {
			const category = groupBy(d);
			totals.set(category, (totals.get(category) ?? 0) + metricValue(d, metric));
		}
		return Array.from(totals, ([category, amount]) => ({ category, amount }));
	}, [data, groupBy, metric]);
}

export default function CategoryCard({ data, loading = false, config, metric }: CategoryCardProps) {
	const chartData = useCategoryTotals(data, config.groupBy, metric);
	const [chartType, setChartType] = useChartType<CategoricalChartType>(
		config.chartTypeKey,
		CATEGORICAL_CHART_TYPES,
		config.defaultChartType
	);
	const categoryLabel = config.categoryLabel ?? config.title;
	// Width and height need separate formulas -- the label's category name
	// varies the *width* margin (widestLabelWidth), but its 2-line stack is
	// a fixed height regardless of content, so the *height* margin doesn't
	// need to scale with the longest category name the way the width does.
	// Recharts sizes a "50%" outerRadius off the smaller of the container's
	// width/height (see PolarUtils.getMaxRadius), so the pie stays a true
	// circle even though this container is wider than it is tall.
	const pieMinWidth = ASSUMED_PIE_DIAMETER + widestLabelWidth(chartData) * 2;
	const pieHeight = pieChartHeight();

	// A single category has nothing to compare against -- omit the card
	// entirely rather than rendering a chart with just one bar/slice/row.
	if (!loading && chartData.length <= 1) return null;

	return (
		<section
			className={chartType === 'pie' ? 'chart-card-exhibit pie-chart-card' : 'chart-card-exhibit'}
			style={{
				backgroundColor: 'white',
				...(chartType === 'pie' ? { maxWidth: pieMinWidth } : null),
			}}
			aria-label={config.ariaLabel}
		>
			<div className="chart-card-header">
				<h2 className="chart-card-title">{config.title}</h2>
				<ChartTypeSelect
					ariaLabel={config.chartTypeAriaLabel}
					value={chartType}
					options={CATEGORICAL_CHART_TYPES}
					onChange={setChartType}
				/>
			</div>
			<div className="chart-card-body" >
				{loading ? (
					<div
						className={chartType === 'pie' ? 'chart-skeleton chart-skeleton-round' : 'chart-skeleton'}
						aria-hidden="true"
					/>
				) : chartType === 'pie' ? (
					<PieView
						chartData={chartData}
						colors={config.colors}
						metric={metric}
						minWidth={pieMinWidth}
						height={pieHeight}
					/>
				) : chartType === 'table' ? (
					<TableView chartData={chartData} categoryLabel={categoryLabel} metric={metric} />
				) : (
					<BarView chartData={chartData} colors={config.colors} wide={config.wide} metric={metric} />
				)}
			</div>
			<p className="chart-card-caption">{config.caption}</p>
		</section>
	);
}

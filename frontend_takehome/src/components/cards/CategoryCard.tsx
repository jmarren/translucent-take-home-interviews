import React, { useMemo } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Denial, MetricId, metricValue } from '../../types';
import { CategoricalChartType, CATEGORICAL_CHART_TYPES, useChartType } from '../../hooks/useChartType';
import { CategoryCardData } from '../BreakdownPage';
import ChartTypeSelect from '../select/ChartTypeSelect';
import { CategoryTotal, ASSUMED_PIE_DIAMETER, widestLabelWidth, pieChartHeight, verticalBarChartMinWidth } from './category/shared';
import BarView from './category/bar';
import VerticalBarView from './category/verticalBar';
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
	/** Widens the bar view's Y-axis to fit longer category labels (e.g.
	 *  "Reasons", whose values run longer than "Departments"/"Payers"). */
	wide?: boolean;
}

interface CategoryCardProps {
	data: CategoryCardData;
	config: CategoryCardConfig;
	expanded: boolean;
	onToggleExpand: () => void;
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

export default function CategoryCard({ data, config, expanded, onToggleExpand }: CategoryCardProps) {
	const { denials, metric, theme } = data;
	const { filteredDenials: denialsData, isInitialLoad: loading } = denials;
	const vizColors = theme.vizPalette.value.colors;
	const animationsEnabled = theme.chartAnimationsEnabled.value;
	const captionsEnabled = theme.chartCaptionsEnabled.value;
	const chartData = useCategoryTotals(denialsData, config.groupBy, metric);
	const chartType = useChartType<CategoricalChartType>(
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
	const verticalBarMinWidth = verticalBarChartMinWidth(chartData);

	// A single category has nothing to compare against -- omit the card
	// entirely rather than rendering a chart with just one bar/slice/row.
	if (!loading && chartData.length <= 1) return null;

	const sectionClassName = [
		'chart-card-exhibit',
		chartType.value === 'pie' ? 'pie-chart-card' : null,
		expanded ? 'chart-card-expanded' : null,
	].filter(Boolean).join(' ');

	return (
		<section
			className={sectionClassName}
			style={{
				backgroundColor: 'white',
				// Expanded lifts both width caps below entirely -- growing to
				// fill the row is the whole point of expanding.
				...(expanded ? null : chartType.value === 'pie' ? { maxWidth: pieMinWidth } : null),
				// Without this, .charts-row's flex: 1 1 360px lets the card
				// shrink below what its own vertical-bar chart needs (via
				// ResponsiveContainer's minWidth), leaving the chart
				// overflowing a too-narrow card instead of the card growing
				// to fit -- unlike the pie's maxWidth above, this is a floor,
				// not a cap, since a vertical bar chart (unlike a pie, which
				// has a fixed natural diameter) should still be free to grow
				// wider than its minimum when the row has the room.
				...(expanded ? null : chartType.value === 'vertical-bar' ? { minWidth: verticalBarMinWidth } : null),
			}}
			aria-label={config.ariaLabel}
		>
			<div className="chart-card-header">
				<h2 className="chart-card-title">{config.title}</h2>
				<div className="chart-card-header-controls">
					<ChartTypeSelect
						ariaLabel={config.chartTypeAriaLabel}
						value={chartType.value}
						options={CATEGORICAL_CHART_TYPES}
						onChange={chartType.set}
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
			<div className="chart-card-body" >
				{loading ? (
					<div
						className={chartType.value === 'pie' ? 'chart-skeleton chart-skeleton-round' : 'chart-skeleton'}
						aria-hidden="true"
					/>
				) : chartType.value === 'pie' ? (
					<PieView
						chartData={chartData}
						vizColors={vizColors}
						metric={metric}
						minWidth={pieMinWidth}
						height={pieHeight}
						animationsEnabled={animationsEnabled}
						expanded={expanded}
					/>
				) : chartType.value === 'table' ? (
					<TableView chartData={chartData} categoryLabel={categoryLabel} metric={metric} />
				) : chartType.value === 'vertical-bar' ? (
					<VerticalBarView chartData={chartData} vizColors={vizColors} metric={metric} minWidth={verticalBarMinWidth} animationsEnabled={animationsEnabled} expanded={expanded} />
				) : (
					<BarView chartData={chartData} vizColors={vizColors} wide={config.wide} metric={metric} animationsEnabled={animationsEnabled} expanded={expanded} />
				)}
			</div>
			{captionsEnabled && <p className="chart-card-caption">{config.caption}</p>}
		</section>
	);
}

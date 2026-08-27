import React, { useMemo } from 'react';
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { Denial, MetricId, metricValue } from '../types';
import { CategoricalChartType, CATEGORICAL_CHART_TYPES, useChartType } from '../chartTypes';
import ChartTypeSelect from './ChartTypeSelect';

interface CategoryTotal {
	category: string;
	amount: number;
}

const currency = (value: number) =>
	`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const count = (value: number) => value.toLocaleString();

function formatterFor(metric: MetricId) {
	return metric === 'count' ? count : currency;
}

// Used when a card doesn't supply its own `colors` map -- assigned by
// position rather than by category value, since a card with no natural
// per-category identity (e.g. denial reason) has no meaningful way to pin
// a specific color to a specific value.
export const DEFAULT_SLICE_COLORS = [
	'#5b7fa6', '#2c423f', '#4c5b61', '#8a5a44', '#b08d3e', '#829191', '#949b96', '#c5c5c5',
];

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
	/** The "Reasons"/"Trend" cards are wider (800px) than the default
	 *  432px card width -- see `.charts-row > .reason-chart-card` in index.css. */
	wide?: boolean;
}

interface CategoryCardProps {
	data: Denial[];
	loading?: boolean;
	config: CategoryCardConfig;
	metric: MetricId;
}

const FALLBACK_COLOR = '#949b96'; // --grey-olive-2

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

function colorFor(category: string, index: number, colors?: Record<string, string>): string {
	if (colors) return colors[category] ?? FALLBACK_COLOR;
	return DEFAULT_SLICE_COLORS[index % DEFAULT_SLICE_COLORS.length];
}

function BarView({
	chartData,
	colors,
	wide,
	metric,
}: {
	chartData: CategoryTotal[];
	colors?: Record<string, string>;
	wide?: boolean;
	metric: MetricId;
}) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Denied amount';
	return (
		// <div style={{ width: '100%', flex: 'stretch', minHeight: 0 }}>
		<ResponsiveContainer width="100%" >
			<BarChart
				data={chartData}
				layout="vertical"
				width={500}
				margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
			>
				<CartesianGrid strokeDasharray="3 3" horizontal={false} />
				<XAxis
					type="number"
					tickFormatter={format}
					domain={[0, (dataMax: number) => dataMax * 1.15]}
				/>
				<YAxis type="category" dataKey="category" width={wide ? 140 : 120} tick={{ fontSize: 13 }} />
				<Tooltip formatter={(value: number) => [format(value), metricLabel]} />
				<Bar dataKey="amount" name={metricLabel} radius={[0, 3, 3, 0]}>
					{chartData.map((entry, index) => (
						<Cell key={entry.category} fill={colorFor(entry.category, index, colors)} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
		// </div>
	);
}

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
			<text x={x} y={y} textAnchor={textAnchor} fill={fill} fontSize={18}>
				<tspan x={x} dy="-0.3em">{category}</tspan>
				<tspan x={x} dy="1.2em">{pct}</tspan>
			</text>
		);
	};
}

function PieView({
	chartData,
	colors,
	metric,
}: {
	chartData: CategoryTotal[];
	colors?: Record<string, string>;
	metric: MetricId;
}) {
	const format = formatterFor(metric);
	const total = useMemo(() => chartData.reduce((sum, d) => sum + d.amount, 0), [chartData]);
	return (
		<ResponsiveContainer width="100%" aspect={1}>
			<PieChart margin={{ top: 8, right: 32, left: 32, bottom: 8 }}>
				<Pie
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

function TableView({
	chartData,
	categoryLabel,
	metric,
}: {
	chartData: CategoryTotal[];
	categoryLabel: string;
	metric: MetricId;
}) {
	const format = formatterFor(metric);
	const metricLabel = metric === 'count' ? 'Denial count' : 'Total amount';
	const sorted = useMemo(() => [...chartData].sort((a, b) => b.amount - a.amount), [chartData]);
	return (
		<table className="chart-card-table">
			<caption className="visually-hidden">
				{metricLabel} by {categoryLabel.toLowerCase()}
			</caption>
			<thead>
				<tr>
					<th scope="col">{categoryLabel}</th>
					<th scope="col">{metricLabel}</th>
				</tr>
			</thead>
			<tbody>
				{sorted.map((row) => (
					<tr key={row.category}>
						<td>{row.category}</td>
						<td>{format(row.amount)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default function CategoryCard({ data, loading = false, config, metric }: CategoryCardProps) {
	const chartData = useCategoryTotals(data, config.groupBy, metric);
	const [chartType, setChartType] = useChartType<CategoricalChartType>(
		config.chartTypeKey,
		CATEGORICAL_CHART_TYPES,
		config.defaultChartType
	);
	const categoryLabel = config.categoryLabel ?? config.title;

	return (
		<section
			className={'chart-card-exhibit'}
			style={{
				backgroundColor: 'white'
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
				) : chartData.length === 0 ? (
					<p>No denial data to display.</p>
				) : chartType === 'pie' ? (
					<PieView chartData={chartData} colors={config.colors} metric={metric} />
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

// style={
// 	chartType === 'pie'
// 		? { maxWidth: 432, width: '100%' }
// 		: { maxWidth: config.colors ? 432 : 720, width: '100%', flex: 1, minHeight: 0 }
// }

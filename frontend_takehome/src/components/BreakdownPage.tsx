import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CategoryCard, { CategoryCardConfig } from './cards/CategoryCard';
import TimeSeriesCard, { TimeSeriesCardConfig } from './cards/TimeSeriesCard';
import DenialsTable from './DenialsTable';
import SummaryStats from './SummaryStats';
import { useDenials } from '../hooks/useDenials';
import { LayoutState } from './Layout';

export const REASON_CARD: CategoryCardConfig = {
	chartTypeKey: 'reason',
	defaultChartType: 'bar',
	title: 'Reasons',
	categoryLabel: 'Reason',
	ariaLabel: 'Denial breakdown chart',
	chartTypeAriaLabel: 'Denial breakdown chart type',
	caption: 'Grouped by stated denial reason.',
	groupBy: (d) => d.reason,
	wide: true,
};

export const DEPARTMENT_CARD: CategoryCardConfig = {
	chartTypeKey: 'department',
	defaultChartType: 'pie',
	title: 'Departments',
	ariaLabel: 'Denial breakdown by department chart',
	chartTypeAriaLabel: 'Dept. breakdown chart type',
	caption: 'Grouped by department, filed vs. total.',
	groupBy: (d) => d.department,
};

export const PAYER_CARD: CategoryCardConfig = {
	chartTypeKey: 'payer',
	defaultChartType: 'pie',
	title: 'Payers',
	ariaLabel: 'Denial breakdown by payer chart',
	chartTypeAriaLabel: 'Insurer breakdown chart type',
	caption: 'Grouped by payer, filed vs. total.',
	groupBy: (d) => d.payer,
};

export const TREND_CARD: TimeSeriesCardConfig = {
	chartTypeKey: 'trend',
	defaultChartType: 'area',
	title: 'Trend',
	ariaLabel: 'Denial trend over time',
	chartTypeAriaLabel: 'Chart type for Trend',
	caption: 'Monthly total across the filtered range.',
};

export default function BreakdownPage() {
	const { filters, theme } = useOutletContext<LayoutState>();
	const { filteredDenials, isInitialLoad, error } = useDenials(filters);
	const vizColors = theme.vizPalette.value.colors;
	const animationsEnabled = theme.chartAnimationsEnabled.value;

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
		<>
			<SummaryStats data={filteredDenials} metric={filters.metric.value} />
			<div className="charts-row">
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={REASON_CARD} metric={filters.metric.value} vizColors={vizColors} animationsEnabled={animationsEnabled} />
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={DEPARTMENT_CARD} metric={filters.metric.value} vizColors={vizColors} animationsEnabled={animationsEnabled} />
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={PAYER_CARD} metric={filters.metric.value} vizColors={vizColors} animationsEnabled={animationsEnabled} />
				<TimeSeriesCard data={filteredDenials} loading={isInitialLoad} config={TREND_CARD} metric={filters.metric.value} color={theme.trendColor.value} animationsEnabled={animationsEnabled} />
			</div>
			<div className="denial-records-section">
				<h2 className="denial-records-heading">Denial-Level Detail</h2>
				<DenialsTable data={filteredDenials} loading={isInitialLoad} />
			</div>
		</>
	);
}

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CategoryCard, { CategoryCardConfig } from './cards/CategoryCard';
import TimeSeriesCard, { TimeSeriesCardConfig } from './cards/TimeSeriesCard';
import DenialsTable from './DenialsTable';
import SummaryStats from './SummaryStats';
import { useDenials } from '../hooks/useDenials';
import { LayoutState } from './Layout';

// Extends the app's existing low-chroma default palette (theme/palettes.ts)
// with a small number of additional restrained hues. The base palette alone
// (silver/ironGrey/greyOlive/greyOlive2/darkSlateGrey/beige) is a set of
// closely related greys and greens that are hard to tell apart at a glance,
// and worse for colorblind users -- not safe as 6 distinct categorical pie
// slices. These extra hues stay muted/low-saturation to match the app's
// aesthetic rather than introducing bright, clashing colors. Fixed hex
// values, not CSS variables -- these need to stay visually distinct
// regardless of which palette theme is active, unlike the rest of the app's
// chrome, which re-themes via the CSS custom properties in index.css.
export const DEPARTMENT_COLORS: Record<string, string> = {
	Cardiology: '#2c423f', // default palette's darkSlateGrey
	Neurology: '#4c5b61', // default palette's ironGrey
	Oncology: '#8a5a44', // muted terracotta
	Orthopedics: '#5b7fa6', // muted slate blue
	Pediatrics: '#b08d3e', // muted gold/ochre
	Radiology: '#829191', // default palette's greyOlive
};

// Same reasoning as DEPARTMENT_COLORS, using a distinct set of hues so the
// two pie cards don't visually alias each other when sitting side by side.
export const PAYER_COLORS: Record<string, string> = {
	Medicare: '#2c423f', // default palette's darkSlateGrey
	Humana: '#6b4d6b', // muted plum
	Cigna: '#4c5b61', // default palette's ironGrey
	BCBS: '#7a6a3f', // muted bronze/khaki
	Aetna: '#3f6b63', // muted teal
};

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
	colors: DEPARTMENT_COLORS,
};

export const PAYER_CARD: CategoryCardConfig = {
	chartTypeKey: 'payer',
	defaultChartType: 'pie',
	title: 'Payers',
	ariaLabel: 'Denial breakdown by payer chart',
	chartTypeAriaLabel: 'Insurer breakdown chart type',
	caption: 'Grouped by payer, filed vs. total.',
	groupBy: (d) => d.payer,
	colors: PAYER_COLORS,
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
	const { filters } = useOutletContext<LayoutState>();
	const { filteredDenials, isInitialLoad, error } = useDenials(filters);

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
		<>
			<SummaryStats data={filteredDenials} metric={filters.metric.value} />
			<div className="charts-row">
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={REASON_CARD} metric={filters.metric.value} />
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={DEPARTMENT_CARD} metric={filters.metric.value} />
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={PAYER_CARD} metric={filters.metric.value} />
				<TimeSeriesCard data={filteredDenials} loading={isInitialLoad} config={TREND_CARD} metric={filters.metric.value} />
			</div>
			<div className="denial-records-section">
				<h2 className="denial-records-heading">Denial-Level Detail</h2>
				<DenialsTable data={filteredDenials} loading={isInitialLoad} />
			</div>
		</>
	);
}

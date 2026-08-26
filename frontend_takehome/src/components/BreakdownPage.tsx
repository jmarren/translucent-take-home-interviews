import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CategoryCard, { CategoryCardConfig } from './CategoryCard';
import TimeSeriesCard, { TimeSeriesCardConfig } from './TimeSeriesCard';
import DenialsTable from './DenialsTable';
import SummaryStats from './SummaryStats';
import { useDenials } from '../useDenials';
import { LayoutState } from './Layout';

// Extends the app's existing low-chroma palette (index.css `:root`) with a
// small number of additional restrained hues. The base palette alone
// (silver/iron-grey/grey-olive/grey-olive-2/dark-slate-grey/beige) is a set
// of closely related greys and greens that are hard to tell apart at a
// glance, and worse for colorblind users -- not safe as 6 distinct
// categorical pie slices. These extra hues stay muted/low-saturation to
// match the app's aesthetic rather than introducing bright, clashing colors.
const DEPARTMENT_COLORS: Record<string, string> = {
  Cardiology: '#2c423f', // --dark-slate-grey
  Neurology: '#4c5b61', // --iron-grey
  Oncology: '#8a5a44', // muted terracotta
  Orthopedics: '#5b7fa6', // muted slate blue
  Pediatrics: '#b08d3e', // muted gold/ochre
  Radiology: '#829191', // --grey-olive
};

// Same reasoning as DEPARTMENT_COLORS, using a distinct set of hues so the
// two pie cards don't visually alias each other when sitting side by side.
const PAYER_COLORS: Record<string, string> = {
  Medicare: '#2c423f', // --dark-slate-grey
  Humana: '#6b4d6b', // muted plum
  Cigna: '#4c5b61', // --iron-grey
  BCBS: '#7a6a3f', // muted bronze/khaki
  Aetna: '#3f6b63', // muted teal
};

export const REASON_CARD: CategoryCardConfig = {
  chartTypeKey: 'reason',
  defaultChartType: 'bar',
  title: 'Reasons',
  categoryLabel: 'Reason',
  ariaLabel: 'Denial breakdown chart',
  chartTypeAriaLabel: 'Chart type for Reasons',
  caption: 'Total denied dollars grouped by stated denial reason.',
  groupBy: (d) => d.reason,
  wide: true,
};

export const DEPARTMENT_CARD: CategoryCardConfig = {
  chartTypeKey: 'department',
  defaultChartType: 'pie',
  title: 'Departments',
  ariaLabel: 'Denial breakdown by department chart',
  chartTypeAriaLabel: 'Dept. breakdown chart type',
  caption: 'Total denied dollars grouped by department, filed vs. total.',
  groupBy: (d) => d.department,
  colors: DEPARTMENT_COLORS,
};

export const PAYER_CARD: CategoryCardConfig = {
  chartTypeKey: 'payer',
  defaultChartType: 'pie',
  title: 'Payers',
  ariaLabel: 'Denial breakdown by payer chart',
  chartTypeAriaLabel: 'Chart type for Payers',
  caption: 'Total denied dollars grouped by payer, filed vs. total.',
  groupBy: (d) => d.payer,
  colors: PAYER_COLORS,
};

const TREND_CARD: TimeSeriesCardConfig = {
  chartTypeKey: 'trend',
  defaultChartType: 'area',
  title: 'Trend',
  ariaLabel: 'Denied amount trend over time',
  chartTypeAriaLabel: 'Chart type for Trend',
  caption: 'Monthly denied dollar total across the filtered range.',
};

export default function BreakdownPage() {
	const { filters } = useOutletContext<LayoutState>();
	const { filteredDenials, isInitialLoad, error } = useDenials(filters);

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
		<>
			<SummaryStats data={filteredDenials} />
			<div className="charts-row">
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={REASON_CARD} />
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={DEPARTMENT_CARD} />
				<CategoryCard data={filteredDenials} loading={isInitialLoad} config={PAYER_CARD} />
				<TimeSeriesCard data={filteredDenials} loading={isInitialLoad} config={TREND_CARD} />
			</div>
			<div className="denial-records-section">
				<h2 className="denial-records-heading">Denial-Level Detail</h2>
				<DenialsTable data={filteredDenials} loading={isInitialLoad} />
			</div>
		</>
	);
}

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import CategoryCard, { CategoryCardConfig } from './cards/CategoryCard';
import TimeSeriesCard, { TimeSeriesCardConfig } from './cards/TimeSeriesCard';
import DenialsTable from './DenialsTable';
import SummaryStats from './SummaryStats';
import { useDenials, UseDenialsResult } from '../hooks/useDenials';
import { ThemePreferences } from '../hooks/useThemePreferences';
import { MetricId } from '../types';
import { LayoutState } from './Layout';

// Bundles the three pieces every CategoryCard instance needs that are
// identical across every card on this page -- the filtered dataset,
// which metric to plot, and the theme preferences a card reads its own
// display settings from (viz colors, chart animations, captions).
// Passed as one prop rather than three so CategoryCard doesn't have to
// re-list them individually, and every call site below shares the exact
// same object instead of re-threading the same three values each time.
export interface CategoryCardData {
	denials: UseDenialsResult;
	metric: MetricId;
	theme: ThemePreferences;
}

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
	const denials = useDenials(filters);
	const { filteredDenials, isInitialLoad, error } = denials;
	const categoryCardData: CategoryCardData = { denials, metric: filters.metric.value, theme };
	const vizColors = theme.vizPalette.value.colors;
	const animationsEnabled = theme.chartAnimationsEnabled.value;
	const captionsEnabled = theme.chartCaptionsEnabled.value;
	// Which card (identified by its own config.chartTypeKey) is expanded to
	// fill the row, if any -- lifted up here rather than kept local to each
	// card, since expanding one card also means hiding its siblings, which
	// only their shared parent can decide.
	const [expandedCard, setExpandedCard] = useState<string | null>(null);

	if (error) return <p role="alert">Error loading denials.</p>;

	const chartsRowClassName = expandedCard ? 'charts-row has-expanded-card' : 'charts-row';

	function isVisible(key: string): boolean {
		return expandedCard === null || expandedCard === key;
	}

	function toggleExpand(key: string): () => void {
		return () => setExpandedCard((current) => (current === key ? null : key));
	}

	return (
		<>
			<SummaryStats data={filteredDenials} metric={filters.metric.value} />
			<div className={chartsRowClassName}>
				{isVisible(REASON_CARD.chartTypeKey) && (
					<CategoryCard data={categoryCardData} config={REASON_CARD} expanded={expandedCard === REASON_CARD.chartTypeKey} onToggleExpand={toggleExpand(REASON_CARD.chartTypeKey)} />
				)}
				{isVisible(DEPARTMENT_CARD.chartTypeKey) && (
					<CategoryCard data={categoryCardData} config={DEPARTMENT_CARD} expanded={expandedCard === DEPARTMENT_CARD.chartTypeKey} onToggleExpand={toggleExpand(DEPARTMENT_CARD.chartTypeKey)} />
				)}
				{isVisible(PAYER_CARD.chartTypeKey) && (
					<CategoryCard data={categoryCardData} config={PAYER_CARD} expanded={expandedCard === PAYER_CARD.chartTypeKey} onToggleExpand={toggleExpand(PAYER_CARD.chartTypeKey)} />
				)}
				{isVisible(TREND_CARD.chartTypeKey) && (
					<TimeSeriesCard data={filteredDenials} loading={isInitialLoad} config={TREND_CARD} metric={filters.metric.value} color={theme.trendColor.value} animationsEnabled={animationsEnabled} captionsEnabled={captionsEnabled} expanded={expandedCard === TREND_CARD.chartTypeKey} onToggleExpand={toggleExpand(TREND_CARD.chartTypeKey)} />
				)}
			</div>
			<div className="denial-records-section">
				<h2 className="denial-records-heading">Denial-Level Detail</h2>
				<DenialsTable data={filteredDenials} loading={isInitialLoad} />
			</div>
		</>
	);
}

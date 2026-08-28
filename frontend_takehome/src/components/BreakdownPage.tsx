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

// Rendered via .map() below so each card's chartTypeKey is only written
// once, rather than once each for visibility, config, expanded, and
// onToggleExpand -- the individual consts above stay separately exported
// too, since Dashboard.test.tsx renders CategoryCard directly against a
// specific one.
const CATEGORY_CARDS: CategoryCardConfig[] = [REASON_CARD, DEPARTMENT_CARD, PAYER_CARD];

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

	// Derives the whole expand/collapse contract for one card's key in a
	// single call -- whether it should render at all while another card is
	// expanded, plus the expanded/onToggleExpand pair every card
	// (CategoryCard and TimeSeriesCard alike) accepts.
	function expandStateFor(key: string) {
		return {
			visible: expandedCard === null || expandedCard === key,
			expanded: expandedCard === key,
			onToggleExpand: () => setExpandedCard((current) => (current === key ? null : key)),
		};
	}

	const trendCardState = expandStateFor(TREND_CARD.chartTypeKey);

	return (
		<>
			<SummaryStats data={filteredDenials} metric={filters.metric.value} />
			<div className={chartsRowClassName}>
				{CATEGORY_CARDS.map((config) => {
					const { visible, expanded, onToggleExpand } = expandStateFor(config.chartTypeKey);
					return visible && (
						<CategoryCard key={config.chartTypeKey} data={categoryCardData} config={config} expanded={expanded} onToggleExpand={onToggleExpand} />
					);
				})}
				{trendCardState.visible && (
					<TimeSeriesCard data={filteredDenials} loading={isInitialLoad} config={TREND_CARD} metric={filters.metric.value} color={theme.trendColor.value} animationsEnabled={animationsEnabled} captionsEnabled={captionsEnabled} expanded={trendCardState.expanded} onToggleExpand={trendCardState.onToggleExpand} />
				)}
			</div>
			<div className="denial-records-section">
				<h2 className="denial-records-heading">Denial-Level Detail</h2>
				<DenialsTable data={filteredDenials} loading={isInitialLoad} />
			</div>
		</>
	);
}

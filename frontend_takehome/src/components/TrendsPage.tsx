import { useOutletContext } from "react-router-dom";
import { useDenials } from "../hooks/useDenials";
import { useTrendsPreferences } from "../trendsPreferences";
import { TimeSeriesChartType, TIME_SERIES_CHART_TYPES, useChartType } from "../chartTypes";
import { LayoutState } from "./Layout";
import TrendsControls from "./TrendsControls";
import MultiSeriesTrendCard from "./MultiSeriesTrendCard";

export default function TrendsPage() {
	const { filters, theme } = useOutletContext<LayoutState>();
	const { filteredDenials, unfilteredByPeriod, referenceDate, isInitialLoad, error } = useDenials(filters);
	const prefs = useTrendsPreferences();
	const [chartType, setChartType] = useChartType<TimeSeriesChartType>(
		"trends-page",
		TIME_SERIES_CHART_TYPES,
		"line"
	);

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
		<div className="trends-page">
			<TrendsControls
				prefs={prefs}
				periodId={filters.period.value}
				chartType={chartType}
				onChartTypeChange={setChartType}
			/>
			<MultiSeriesTrendCard
				data={filteredDenials}
				unfilteredByPeriod={unfilteredByPeriod}
				referenceDate={referenceDate}
				loading={isInitialLoad}
				prefs={prefs}
				periodId={filters.period.value}
				metric={filters.metric.value}
				chartType={chartType}
				vizColors={theme.vizPalette.value.colors}
				animationsEnabled={theme.chartAnimationsEnabled.value}
			/>
		</div>
	);
}

import { useOutletContext } from "react-router-dom";
import { useDenials } from "../hooks/useDenials";
import { useTrendsPreferences } from "../trendsPreferences";
import { LayoutState } from "./Layout";
import TrendsControls from "./TrendsControls";
import MultiSeriesTrendCard from "./MultiSeriesTrendCard";

export default function TrendsPage() {
	const { filters } = useOutletContext<LayoutState>();
	const { filteredDenials, unfilteredByPeriod, referenceDate, isInitialLoad, error } = useDenials(filters);
	const prefs = useTrendsPreferences();

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
		<>
			<TrendsControls prefs={prefs} periodId={filters.period} />
			<MultiSeriesTrendCard
				data={filteredDenials}
				unfilteredByPeriod={unfilteredByPeriod}
				referenceDate={referenceDate}
				loading={isInitialLoad}
				prefs={prefs}
				periodId={filters.period}
				metric={filters.metric}
			/>
		</>
	);
}

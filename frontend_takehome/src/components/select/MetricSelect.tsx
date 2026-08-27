import LabeledSelect from './LabeledSelect';
import { METRICS, MetricId } from '../../types';
import { DashboardFilters } from '../../hooks/useDashboardFilters';

export default function MetricSelect({ filters }: { filters: DashboardFilters }) {
	return (
		<LabeledSelect
			id="metric-filter"
			label="Metric"
			ariaLabel="Metric"
			value={filters.metric.value}
			onChange={(next) => filters.metric.set(next as MetricId)}
			options={METRICS.map((m) => ({ value: m.id, label: m.label }))}
		/>
	);
}

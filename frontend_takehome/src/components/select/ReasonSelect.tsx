import LabeledSelect from './LabeledSelect';
import { REASONS } from '../../types';
import { REASON_ICONS } from '../../categoryIcons';
import { DashboardFilters } from '../../hooks/useDashboardFilters';

const ALL_REASONS = '__all__';

export default function ReasonSelect({ filters }: { filters: DashboardFilters }) {
	return (
		<LabeledSelect
			id="reason-filter"
			label="Reason"
			ariaLabel="Reason"
			value={filters.reason.value || ALL_REASONS}
			onChange={(next) => filters.reason.set(next === ALL_REASONS ? '' : next)}
			options={[
				{ value: ALL_REASONS, label: 'All Reasons' },
				...REASONS.map((reason) => ({ value: reason, label: reason, icon: REASON_ICONS[reason] })),
			]}
		/>
	);
}

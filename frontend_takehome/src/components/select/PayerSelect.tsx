import LabeledSelect from './LabeledSelect';
import { PAYERS } from '../../types';
import { DashboardFilters } from '../../hooks/useDashboardFilters';

const ALL_PAYERS = '__all__';

export default function PayerSelect({ filters }: { filters: DashboardFilters }) {
	return (
		<LabeledSelect
			id="payer-filter"
			label="Payer"
			ariaLabel="Payer"
			value={filters.payer.value || ALL_PAYERS}
			onChange={(next) => filters.payer.set(next === ALL_PAYERS ? '' : next)}
			options={[
				{ value: ALL_PAYERS, label: 'All Payers' },
				...PAYERS.map((payer) => ({ value: payer, label: payer })),
			]}
		/>
	);
}

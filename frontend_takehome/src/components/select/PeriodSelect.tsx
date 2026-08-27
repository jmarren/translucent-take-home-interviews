import LabeledSelect from './LabeledSelect';
import { PERIODS, PeriodId } from '../../periods';
import { DashboardFilters } from '../../hooks/useDashboardFilters';


export default function PeriodSelect({ filters }: { filters: DashboardFilters }) {
	return (
		<LabeledSelect
			id="period-filter"
			label="Period"
			ariaLabel="Period"
			value={filters.period.value}
			onChange={(next) => filters.period.set(next as PeriodId)}
			options={PERIODS.map((p) => ({ value: p.id, label: p.label }))}
		/>
	);
}

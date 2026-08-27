import { Landmark, ShieldPlus, ShieldCheck, Shield, BadgeCheck } from 'lucide-react';
import LabeledSelect from './LabeledSelect';
import { PAYERS } from '../../types';
import { DashboardFilters } from '../../hooks/useDashboardFilters';

const ALL_PAYERS = '__all__';

// Generic Lucide icons, not real payer logos/trademarks -- there's no
// reliable way to source and embed each company's actual brand mark here,
// and an approximation drawn from memory risks misrepresenting it. Purely
// a visual scanning aid in the dropdown, same as DEPARTMENT_ICONS in
// DepartmentSelect.tsx.
const PAYER_ICONS: Record<(typeof PAYERS)[number], typeof Landmark> = {
	Medicare: Landmark,
	Humana: ShieldPlus,
	Cigna: ShieldCheck,
	BCBS: Shield,
	Aetna: BadgeCheck,
};

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
				...PAYERS.map((payer) => ({ value: payer, label: payer, icon: PAYER_ICONS[payer] })),
			]}
		/>
	);
}

import { KeyRound, FileWarning, Copy, CalendarX, FileX, Stethoscope, FileQuestion, MapPinOff } from 'lucide-react';
import LabeledSelect from './LabeledSelect';
import { REASONS } from '../../types';
import { DashboardFilters } from '../../hooks/useDashboardFilters';

const ALL_REASONS = '__all__';

// One representative Lucide icon per denial reason, purely a visual
// scanning aid in the dropdown -- same pattern as DEPARTMENT_ICONS
// (DepartmentSelect.tsx) and PAYER_ICONS (PayerSelect.tsx).
const REASON_ICONS: Record<(typeof REASONS)[number], typeof KeyRound> = {
	'Authorization missing': KeyRound,
	'Coding error': FileWarning,
	'Duplicate claim': Copy,
	'Expired coverage': CalendarX,
	'Invalid CPT': FileX,
	'Medical necessity': Stethoscope,
	'Missing info': FileQuestion,
	'Out of network': MapPinOff,
};

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

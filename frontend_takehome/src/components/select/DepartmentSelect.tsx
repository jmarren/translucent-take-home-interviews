import { HeartPulse, Brain, Ribbon, Bone, Baby, Radiation } from 'lucide-react';
import LabeledSelect from './LabeledSelect';
import { DEPARTMENTS } from '../../types';
import { DashboardFilters } from '../../hooks/useDashboardFilters';

const ALL_DEPARTMENTS = '__all__';

// One representative icon per department, purely a visual scanning aid in
// the dropdown list -- not tied to any other department-color/identity
// system in the app (see DEPARTMENT_COLORS in BreakdownPage.tsx, which
// exists for chart legibility and is independent of this).
const DEPARTMENT_ICONS: Record<(typeof DEPARTMENTS)[number], typeof HeartPulse> = {
	Cardiology: HeartPulse,
	Neurology: Brain,
	Oncology: Ribbon,
	Orthopedics: Bone,
	Pediatrics: Baby,
	Radiology: Radiation,
};

export default function DepartmentSelect({ filters }: { filters: DashboardFilters }) {
	return (
		<LabeledSelect
			id="department-filter"
			label="Department"
			ariaLabel="Department"
			value={filters.department.value || ALL_DEPARTMENTS}
			onChange={(next) => filters.department.set(next === ALL_DEPARTMENTS ? '' : next)}
			options={[
				{ value: ALL_DEPARTMENTS, label: 'All Departments' },
				...DEPARTMENTS.map((dept) => ({ value: dept, label: dept, icon: DEPARTMENT_ICONS[dept] })),
			]}
		/>
	);
}

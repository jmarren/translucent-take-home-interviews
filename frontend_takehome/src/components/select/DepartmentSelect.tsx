import LabeledSelect from './LabeledSelect';
import { DEPARTMENTS } from '../../types';
import { DEPARTMENT_ICONS } from '../../categoryIcons';
import { DashboardFilters } from '../../hooks/useDashboardFilters';

const ALL_DEPARTMENTS = '__all__';

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

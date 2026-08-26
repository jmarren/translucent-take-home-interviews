import LabeledSelect from './LabeledSelect';
import { DEPARTMENTS } from '../types';
import { DashboardFilters } from '../useDashboardFilters';

const ALL_DEPARTMENTS = '__all__';

export default function DepartmentSelect({ filters }: { filters: DashboardFilters }) {
	return (
		<LabeledSelect
			id="department-filter"
			label="Department"
			ariaLabel="Department"
			value={filters.department || ALL_DEPARTMENTS}
			onChange={(next) => filters.setDepartment(next === ALL_DEPARTMENTS ? '' : next)}
			options={[
				{ value: ALL_DEPARTMENTS, label: 'All Departments' },
				...DEPARTMENTS.map((dept) => ({ value: dept, label: dept })),
			]}
		/>
	);
}

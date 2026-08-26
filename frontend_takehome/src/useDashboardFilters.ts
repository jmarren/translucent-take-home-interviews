import { useSearchParams } from 'react-router-dom';
import { PeriodId, isValidPeriodId, DEFAULT_PERIOD } from './periods';

export interface DashboardFilters {
	department: string;
	period: PeriodId;
	setDepartment: (value: string) => void;
	setPeriod: (value: PeriodId) => void;
}

// Department/period are URL search params rather than route state, since
// they layer on top of whichever tab route is active rather than selecting
// between tabs themselves (that's handled by React Router's own route
// matching now that each tab is a static route -- see DashboardLayout).
export function useDashboardFilters(): DashboardFilters {
	const [searchParams, setSearchParams] = useSearchParams();

	const department = searchParams.get('department') ?? '';
	const periodParam = searchParams.get('period');
	const period: PeriodId = isValidPeriodId(periodParam) ? periodParam : DEFAULT_PERIOD;

	function setDepartment(value: string) {
		const next = new URLSearchParams(searchParams);
		if (value) next.set('department', value);
		else next.delete('department');
		setSearchParams(next, { replace: true });
	}

	function setPeriod(value: PeriodId) {
		const next = new URLSearchParams(searchParams);
		if (value !== DEFAULT_PERIOD) next.set('period', value);
		else next.delete('period');
		setSearchParams(next, { replace: true });
	}

	return { department, period, setDepartment, setPeriod };
}

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PeriodId, isValidPeriodId, DEFAULT_PERIOD } from './periods';
import { isValidTabId } from './tabs';

export interface DashboardFilters {
	activeTab: string;
	department: string;
	period: PeriodId;
	setActiveTab: (id: string) => void;
	setDepartment: (value: string) => void;
	setPeriod: (value: PeriodId) => void;
}

// Returns null when the route's tabId isn't valid, signaling the caller
// should render a redirect -- kept as a plain value instead of JSX so this
// hook has no rendering concerns of its own.
export function useDashboardFilters(): DashboardFilters | null {
	const { tabId } = useParams<{ tabId: string }>();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	if (!isValidTabId(tabId)) {
		return null;
	}
	const activeTab = tabId;

	const department = searchParams.get('department') ?? '';
	const periodParam = searchParams.get('period');
	const period: PeriodId = isValidPeriodId(periodParam) ? periodParam : DEFAULT_PERIOD;

	function setActiveTab(id: string) {
		navigate({ pathname: `/${id}`, search: searchParams.toString() });
	}

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

	return { activeTab, department, period, setActiveTab, setDepartment, setPeriod };
}

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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

// Returns null when the route's path isn't a recognized tab, signaling the
// caller should render a redirect -- kept as a plain value instead of JSX
// so this hook has no rendering concerns of its own.
export function useDashboardFilters(): DashboardFilters | null {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// Tabs are now static routes (e.g. /settings, /reason-breakdown) rather
	// than a single dynamic /:tabId segment, so the active tab is derived
	// from the pathname itself instead of a route param.
	const tabId = location.pathname.slice(1);

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

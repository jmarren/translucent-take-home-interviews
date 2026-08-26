import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PeriodId, isValidPeriodId, DEFAULT_PERIOD, PERIODS } from './periods';

export interface DashboardFilters {
	department: string;
	payer: string;
	reason: string;
	period: PeriodId;
	summary: string | null;
	setDepartment: (value: string) => void;
	setPayer: (value: string) => void;
	setReason: (value: string) => void;
	setPeriod: (value: PeriodId) => void;
}

// Department/period are URL search params rather than route state, since
// they layer on top of whichever tab route is active rather than selecting
// between tabs themselves (that's handled by React Router's own route
// matching now that each tab is a static route -- see Layout).
export function useDashboardFilters(): DashboardFilters {
	const [searchParams, setSearchParams] = useSearchParams();

	const department = searchParams.get('department') ?? '';
	const payer = searchParams.get('payer') ?? '';
	const reason = searchParams.get('reason') ?? '';
	const periodParam = searchParams.get('period');
	const period: PeriodId = isValidPeriodId(periodParam) ? periodParam : DEFAULT_PERIOD;

	const summary = useMemo(() => {
		const parts: string[] = [];
		if (department) parts.push(department);
		if (payer) parts.push(payer);
		if (reason) parts.push(reason);
		if (period !== DEFAULT_PERIOD) {
			parts.push(PERIODS.find((p) => p.id === period)?.label ?? period);
		}
		return parts.length > 0 ? parts.join(' · ') : null;
	}, [department, payer, reason, period]);

	function setDepartment(value: string) {
		const next = new URLSearchParams(searchParams);
		if (value) next.set('department', value);
		else next.delete('department');
		setSearchParams(next, { replace: true });
	}

	function setPayer(value: string) {
		const next = new URLSearchParams(searchParams);
		if (value) next.set('payer', value);
		else next.delete('payer');
		setSearchParams(next, { replace: true });
	}

	function setReason(value: string) {
		const next = new URLSearchParams(searchParams);
		if (value) next.set('reason', value);
		else next.delete('reason');
		setSearchParams(next, { replace: true });
	}

	function setPeriod(value: PeriodId) {
		const next = new URLSearchParams(searchParams);
		if (value !== DEFAULT_PERIOD) next.set('period', value);
		else next.delete('period');
		setSearchParams(next, { replace: true });
	}

	return { department, payer, reason, period, summary, setDepartment, setPayer, setReason, setPeriod };
}

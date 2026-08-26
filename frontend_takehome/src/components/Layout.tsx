import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams, NavigateFunction } from 'react-router-dom';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SidebarShell from './SidebarShell';
import PaletteShell from './PaletteShell';
import { PeriodId, DEFAULT_PERIOD, PERIODS } from '../periods';
import { useThemePreferences, ThemePreferences } from '../useThemePreferences';
import { useDashboardFilters, DashboardFilters } from '../useDashboardFilters';
import { useCommandPalette } from '../useCommandPalette';
import { buildCommands, Command, CommandContext } from '../commands';

// Curried so the "stable" router handles (navigate, current search params)
// are supplied once and partially applied outside the component -- only the
// final, per-call `id` argument is provided at the actual call site inside
// Layout, instead of a fresh navigateToTab closure being declared on every
// render.
const makeNavigateToTab =
	(navigate: NavigateFunction, searchParams: URLSearchParams) => (id: string) =>
		navigate({ pathname: `/${id}`, search: searchParams.toString() });

// The dep list is every field of `ctx`, taken via Object.values() rather
// than named one-by-one, so CommandContext's field list (in ../commands.ts)
// stays the single place enumerating them -- adding/removing a field there
// automatically changes what useMemo re-runs on, with nothing to keep in
// sync here.
function makeCommandsMemoParams(ctx: CommandContext): [() => Command[], unknown[]] {
	return [() => buildCommands(ctx), Object.values(ctx)];
}

// Passed through Outlet's context as the two cohesive objects the hooks
// already return, rather than flattening every field out individually --
// each child page pulls out just the one it needs (filters or theme).
export interface DashboardOutletContext {
	filters: DashboardFilters;
	theme: ThemePreferences;
}

function makeFilterSummaryMemoParams(
	department: string,
	period: PeriodId
): [() => string | null, [string, PeriodId]] {
	return [() => {
		const parts: string[] = [];
		if (department) parts.push(department);
		if (period !== DEFAULT_PERIOD) {
			parts.push(PERIODS.find((p) => p.id === period)?.label ?? period);
		}
		return parts.length > 0 ? parts.join(' · ') : null;
	}, [department, period]]
}

// The settings/coming-soon tabs render even when the Settings tab is active
// (they don't need the department/period filter bar), so this list is the
// one place that decides which routes get it. Kept alongside the layout
// rather than in tabs.ts since it's purely a layout-chrome decision, not
// tab metadata.
const TABS_WITHOUT_FILTER_BAR = new Set(['settings']);

export default function Layout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeTab = location.pathname.slice(1);

	const filters = useDashboardFilters();
	const theme = useThemePreferences();
	const { paletteOpen, setPaletteOpen, closePalette } = useCommandPalette(theme.navMode === 'palette');

	const navigateToTab = makeNavigateToTab(navigate, searchParams);

	const filterSummary = useMemo(...makeFilterSummaryMemoParams(filters.department, filters.period));

	const commands = useMemo(...makeCommandsMemoParams({
		...filters,
		...theme,
		activeTab,
		paletteLabel: theme.palette.label,
		navigateToTab,
		close: closePalette,
	}));

	const outletContext: DashboardOutletContext = { filters, theme };

	const mainContent = (
		<>
			{!TABS_WITHOUT_FILTER_BAR.has(activeTab) && (
				<div className="filter-bar">
					<DepartmentSelect value={filters.department} onChange={filters.setDepartment} />
					<PeriodSelect value={filters.period} onChange={filters.setPeriod} />
				</div>
			)}
			<Outlet context={outletContext} />
		</>
	);

	if (theme.navMode === 'sidebar') {
		return (
			<SidebarShell activeTab={activeTab} onSelectTab={navigateToTab}>
				{mainContent}
			</SidebarShell>
		);
	}

	return (
		<PaletteShell
			activeTab={activeTab}
			filterSummary={activeTab === 'settings' ? null : filterSummary}
			paletteOpen={paletteOpen}
			onOpenPalette={() => setPaletteOpen(true)}
			onPaletteOpenChange={setPaletteOpen}
			commands={commands}
		>
			{mainContent}
		</PaletteShell>
	);
}

import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams, NavigateFunction } from 'react-router-dom';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SidebarShell from './SidebarShell';
import PaletteShell from './PaletteShell';
import { PeriodId, DEFAULT_PERIOD, PERIODS } from '../periods';
import { useThemePreferences, ThemePreferences } from '../useThemePreferences';
import { useDashboardFilters, DashboardFilters } from '../useDashboardFilters';
import { Modal, useCommandPalette } from '../useCommandPalette';
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

function makeFilterSummaryMemoParams(
	filters: DashboardFilters
): [() => string | null, [string, PeriodId]] {
	return [() => {
		const department = filters.department;
		const period = filters.period;
		const parts: string[] = [];
		if (department) parts.push(department);
		if (period !== DEFAULT_PERIOD) {
			parts.push(PERIODS.find((p) => p.id === period)?.label ?? period);
		}
		return parts.length > 0 ? parts.join(' · ') : null;
	}, [filters.department, filters.period]]
}

type Navigation = {
	activeTab: string,
	switchTo: (tabId: string) => void,
}

type CommandPalette = {
	modal: Modal,
	commands: Command[],
}

export type LayoutState = {
	filters: DashboardFilters,
	filterSummary: string | null,
	theme: ThemePreferences,
	navigation: Navigation,
	commandPalette: CommandPalette,
}

// The settings/coming-soon tabs render even when the Settings tab is active
// (they don't need the department/period filter bar), so this list is the
// one place that decides which routes get it. Kept alongside the layout
// rather than in tabs.ts since it's purely a layout-chrome decision, not
// tab metadata.
const TABS_WITHOUT_FILTER_BAR = new Set(['settings']);

export default function Layout() {
	// url info
	const location = useLocation();
	const [searchParams] = useSearchParams();

	// navigation
	const activeTab = location.pathname.slice(1);
	const navigate = useNavigate();
	const navigateToTab = makeNavigateToTab(navigate, searchParams);

	// data
	const filters = useDashboardFilters();
	const theme = useThemePreferences();
	const paletteModal = useCommandPalette(theme.navMode === 'palette');
	const filterSummary = useMemo(...makeFilterSummaryMemoParams(filters));

	const commands = useMemo(...makeCommandsMemoParams({
		filters,
		theme,
		activeTab,
		navigateToTab,
		close: paletteModal.close,
	}));

	const layoutState: LayoutState = {
		filters,
		filterSummary: activeTab === 'settings' ? null : filterSummary,
		theme,
		navigation: {
			activeTab,
			switchTo: navigateToTab,
		},
		commandPalette: {
			modal: paletteModal,
			commands,
		},
	};

	const mainContent = MainContent(layoutState);

	if (theme.navMode === 'sidebar') {
		return WrapSidebarShell(mainContent, layoutState);
	}
	return WrapPaletteShell(mainContent, layoutState);
}

function WrapPaletteShell(mainContent: React.ReactNode, layoutState: LayoutState) {
	return (
		<PaletteShell layoutState={layoutState}>
			{mainContent}
		</PaletteShell>
	);
}

function WrapSidebarShell(mainContent: React.ReactNode, layoutState: LayoutState) {
	return (
		<SidebarShell layoutState={layoutState}>
			{mainContent}
		</SidebarShell>
	);
}

function MainContent(layoutState: LayoutState) {
	return (
		<>
			{!TABS_WITHOUT_FILTER_BAR.has(layoutState.navigation.activeTab) && (
				<div className="filter-bar">
					<DepartmentSelect filters={layoutState.filters} />
					<PeriodSelect filters={layoutState.filters} />
				</div>
			)}
			<Outlet context={layoutState} />
		</>
	);
}

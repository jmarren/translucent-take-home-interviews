import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SidebarShell from './SidebarShell';
import PaletteShell from './PaletteShell';
import { PeriodId, DEFAULT_PERIOD, PERIODS } from '../periods';
import { useThemePreferences, ThemePreferences } from '../useThemePreferences';
import { useDashboardFilters, DashboardFilters } from '../useDashboardFilters';
import { useNavigation, Navigation } from '../useNavigation';
import { useCommandPalette, CommandPalette } from '../useCommandPalette';

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
	// navigation
	const navigation = useNavigation();

	// data
	const filters = useDashboardFilters();
	const theme = useThemePreferences();
	const filterSummary = useMemo(...makeFilterSummaryMemoParams(filters));

	const commandPalette = useCommandPalette(theme.navMode === 'palette', {
		filters,
		theme,
		activeTab: navigation.activeTab,
		navigateToTab: navigation.switchTo,
	});

	const layoutState: LayoutState = {
		filters,
		filterSummary: navigation.activeTab === 'settings' ? null : filterSummary,
		theme,
		navigation,
		commandPalette,
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

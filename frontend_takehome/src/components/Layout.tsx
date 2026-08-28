import React from 'react';
import { Outlet } from 'react-router-dom';
import DepartmentSelect from './select/DepartmentSelect';
import PayerSelect from './select/PayerSelect';
import ReasonSelect from './select/ReasonSelect';
import PeriodSelect from './select/PeriodSelect';
import MetricSelect from './select/MetricSelect';
import SidebarShell from './SidebarShell';
import { useThemePreferences, ThemePreferences } from '../hooks/useThemePreferences';
import { useDashboardFilters, DashboardFilters } from '../hooks/useDashboardFilters';
import { useNavigation, Navigation } from '../hooks/useNavigation';
import { useCommandPalette, CommandPalette } from '../hooks/useCommandPalette';

export type LayoutState = {
	filters: DashboardFilters,
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

	const commandPalette = useCommandPalette({
		filters,
		theme,
		navigation,
	});

	const layoutState: LayoutState = {
		filters,
		theme,
		navigation,
		commandPalette,
	};

	const mainContent = MainContent(layoutState);

	return (
		<SidebarShell layoutState={layoutState}>
			{mainContent}
		</SidebarShell>
	);
}

function MainContent(layoutState: LayoutState) {
	return (
		<>
			{!TABS_WITHOUT_FILTER_BAR.has(layoutState.navigation.activeTab.value) && (
				<div className="filter-bar">
					<DepartmentSelect filters={layoutState.filters} />
					<PayerSelect filters={layoutState.filters} />
					<ReasonSelect filters={layoutState.filters} />
					<PeriodSelect filters={layoutState.filters} />
					<MetricSelect filters={layoutState.filters} />
				</div>
			)}
			<Outlet context={layoutState} />
		</>
	);
}

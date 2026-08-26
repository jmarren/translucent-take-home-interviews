import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SidebarShell from './SidebarShell';
import PaletteShell from './PaletteShell';
import { PeriodId, DEFAULT_PERIOD, PERIODS } from '../periods';
import { useThemePreferences } from '../useThemePreferences';
import { useDashboardFilters } from '../useDashboardFilters';
import { useCommandPalette } from '../useCommandPalette';
import { buildCommands } from '../commands';
import { Palette } from '../palettes';
import { NavMode } from '../navModes';

export interface DashboardOutletContext {
	department: string;
	period: PeriodId;
	font: string;
	setFont: (value: string) => void;
	palette: Palette;
	setPalette: (value: Palette) => void;
	radius: number;
	setRadius: (value: number) => void;
	navMode: NavMode;
	setNavMode: (value: NavMode) => void;
}

// The settings/coming-soon tabs render even when the Settings tab is active
// (they don't need the department/period filter bar), so this list is the
// one place that decides which routes get it. Kept alongside the layout
// rather than in tabs.ts since it's purely a layout-chrome decision, not
// tab metadata.
const TABS_WITHOUT_FILTER_BAR = new Set(['settings']);

export default function DashboardLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeTab = location.pathname.slice(1);

	const { department, period, setDepartment, setPeriod } = useDashboardFilters();
	const { font, setFont, palette, setPalette, radius, setRadius, navMode, setNavMode } =
		useThemePreferences();
	const { paletteOpen, setPaletteOpen, closePalette } = useCommandPalette(navMode === 'palette');

	function navigateToTab(id: string) {
		navigate({ pathname: `/${id}`, search: searchParams.toString() });
	}

	const filterSummary = useMemo(() => {
		const parts: string[] = [];
		if (department) parts.push(department);
		if (period !== DEFAULT_PERIOD) {
			parts.push(PERIODS.find((p) => p.id === period)?.label ?? period);
		}
		return parts.length > 0 ? parts.join(' · ') : null;
	}, [department, period]);

	const commands = useMemo(
		() =>
			buildCommands({
				activeTab,
				department,
				period,
				font,
				paletteLabel: palette.label,
				radius,
				navigateToTab,
				setDepartment,
				setPeriod,
				setFont,
				setPalette,
				setRadius,
				close: closePalette,
			}),
		[activeTab, department, period, font, palette, radius, setDepartment, setPeriod, closePalette]
	);

	const outletContext: DashboardOutletContext = {
		department,
		period,
		font,
		setFont,
		palette,
		setPalette,
		radius,
		setRadius,
		navMode,
		setNavMode,
	};

	const mainContent = (
		<>
			{!TABS_WITHOUT_FILTER_BAR.has(activeTab) && (
				<div className="filter-bar">
					<DepartmentSelect value={department} onChange={setDepartment} />
					<PeriodSelect value={period} onChange={setPeriod} />
				</div>
			)}
			<Outlet context={outletContext} />
		</>
	);

	if (navMode === 'sidebar') {
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

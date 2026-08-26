import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams, NavigateFunction } from 'react-router-dom';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SidebarShell from './SidebarShell';
import PaletteShell from './PaletteShell';
import { PeriodId, DEFAULT_PERIOD, PERIODS } from '../periods';
import { useThemePreferences } from '../useThemePreferences';
import { useDashboardFilters } from '../useDashboardFilters';
import { useCommandPalette } from '../useCommandPalette';
import { buildCommands, Command, CommandContext } from '../commands';
import { Palette } from '../palettes';
import { NavMode } from '../navModes';

// Curried so the "stable" router handles (navigate, current search params)
// are supplied once and partially applied outside the component -- only the
// final, per-call `id` argument is provided at the actual call site inside
// Layout, instead of a fresh navigateToTab closure being declared on every
// render.
const makeNavigateToTab =
	(navigate: NavigateFunction, searchParams: URLSearchParams) => (id: string) =>
		navigate({ pathname: `/${id}`, search: searchParams.toString() });

type CommandsMemoDeps = [
	CommandContext['activeTab'],
	CommandContext['department'],
	CommandContext['period'],
	CommandContext['font'],
	CommandContext['paletteLabel'],
	CommandContext['radius'],
	CommandContext['navigateToTab'],
	CommandContext['setDepartment'],
	CommandContext['setPeriod'],
	CommandContext['setFont'],
	CommandContext['setPalette'],
	CommandContext['setRadius'],
	CommandContext['close'],
];

function makeCommandsMemoParams(ctx: CommandContext): [() => Command[], CommandsMemoDeps] {
	return [() => buildCommands(ctx), [
		ctx.activeTab,
		ctx.department,
		ctx.period,
		ctx.font,
		ctx.paletteLabel,
		ctx.radius,
		ctx.navigateToTab,
		ctx.setDepartment,
		ctx.setPeriod,
		ctx.setFont,
		ctx.setPalette,
		ctx.setRadius,
		ctx.close,
	]];
}

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

	const { department, period, setDepartment, setPeriod } = useDashboardFilters();
	const { font, setFont, palette, setPalette, radius, setRadius, navMode, setNavMode } =
		useThemePreferences();
	const { paletteOpen, setPaletteOpen, closePalette } = useCommandPalette(navMode === 'palette');

	const navigateToTab = makeNavigateToTab(navigate, searchParams);

	const filterSummary = useMemo(...makeFilterSummaryMemoParams(department, period));

	const commands = useMemo(...makeCommandsMemoParams({
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
	}));

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

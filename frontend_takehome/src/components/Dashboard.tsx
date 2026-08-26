import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import DenialChart from './DenialChart';
import DepartmentPieChart from './DepartmentPieChart';
import PayerPieChart from './PayerPieChart';
import DenialsTable from './DenialsTable';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SummaryStats from './SummaryStats';
import TrendSparkline from './TrendSparkline';
import SettingsTab from './SettingsTab';
import SidebarShell from './SidebarShell';
import PaletteShell from './PaletteShell';
import ComingSoon from './ComingSoon';
import { DEFAULT_PERIOD, PERIODS } from '../periods';
import { useThemePreferences } from '../useThemePreferences';
import { TABS, TAB_DESCRIPTIONS, DEFAULT_TAB_ID } from '../tabs';
import { buildCommands } from '../commands';
import { useDenials } from '../useDenials';
import { useDashboardFilters } from '../useDashboardFilters';
import { useCommandPalette } from '../useCommandPalette';

export { DENIALS_QUERY } from '../useDenials';

export default function Dashboard() {
	const filters = useDashboardFilters();
	const { font, setFont, palette, setPalette, radius, setRadius, navMode, setNavMode } =
		useThemePreferences();
	const { paletteOpen, setPaletteOpen, closePalette } = useCommandPalette(navMode === 'palette');

	if (!filters) {
		return <Navigate to={`/${DEFAULT_TAB_ID}`} replace />;
	}
	const { activeTab, department, period, setActiveTab, setDepartment, setPeriod } = filters;

	const { filteredDenials, isInitialLoad, error } = useDenials(department, period);

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
				navigateToTab: setActiveTab,
				setDepartment,
				setPeriod,
				setFont,
				setPalette,
				setRadius,
				close: closePalette,
			}),
		[activeTab, department, period, font, palette, radius, setActiveTab, setDepartment, setPeriod, closePalette]
	);

	if (error) return <p role="alert">Error loading denials.</p>;

	const mainContent = (
		<>
			{activeTab === 'settings' ? (
				<SettingsTab
					font={font}
					onFontChange={setFont}
					palette={palette}
					onPaletteChange={setPalette}
					radius={radius}
					onRadiusChange={setRadius}
					navMode={navMode}
					onNavModeChange={setNavMode}
				/>
			) : (
				<>
					<div className="filter-bar">
						<DepartmentSelect value={department} onChange={setDepartment} />
						<PeriodSelect value={period} onChange={setPeriod} />
					</div>

					{activeTab === 'reason-breakdown' ? (
						<>
							<SummaryStats data={filteredDenials} />
							<div className="charts-row">
								<DenialChart data={filteredDenials} loading={isInitialLoad} />
								<DepartmentPieChart data={filteredDenials} loading={isInitialLoad} />
								<PayerPieChart data={filteredDenials} loading={isInitialLoad} />
								<TrendSparkline data={filteredDenials} loading={isInitialLoad} />
							</div>
							<div className="denial-records-section">
								<h2 className="denial-records-heading">Denial-Level Detail</h2>
								<DenialsTable data={filteredDenials} loading={isInitialLoad} />
							</div>
						</>
					) : (
						<ComingSoon
							title={TABS.find((t) => t.id === activeTab)?.label ?? ''}
							description={TAB_DESCRIPTIONS[activeTab]}
						/>
					)}
				</>
			)}
		</>
	);

	if (navMode === 'sidebar') {
		return (
			<SidebarShell activeTab={activeTab} onSelectTab={setActiveTab}>
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

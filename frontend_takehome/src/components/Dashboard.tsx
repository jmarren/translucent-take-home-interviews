import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import DenialChart from './DenialChart';
import DepartmentPieChart from './DepartmentPieChart';
import DenialsTable from './DenialsTable';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SummaryStats from './SummaryStats';
import TrendSparkline from './TrendSparkline';
import SettingsTab from './SettingsTab';
import TopBar from './TopBar';
import CommandPalette from './CommandPalette';
import Sidebar from './Sidebar';
import ComingSoon from './ComingSoon';
import { Denial } from '../types';
import { PeriodId, filterByPeriod, getReferenceDate, isValidPeriodId, DEFAULT_PERIOD, PERIODS } from '../periods';
import { useThemePreferences } from '../useThemePreferences';
import { TABS, TAB_DESCRIPTIONS, DEFAULT_TAB_ID, isValidTabId } from '../tabs';
import { buildCommands } from '../commands';

export const DENIALS_QUERY = gql`
  query Denials($department: String) {
    denials(department: $department) {
      id
      department
      amount
      reason
      date
      payer
    }
  }
`;

export default function Dashboard() {
	const { tabId } = useParams<{ tabId: string }>();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { font, setFont, palette, setPalette, radius, setRadius, navMode, setNavMode } =
		useThemePreferences();
	const [paletteOpen, setPaletteOpen] = useState(false);

	useEffect(() => {
		if (navMode !== 'palette') return;
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setPaletteOpen((open) => !open);
			}
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [navMode]);

	const closePalette = useCallback(() => setPaletteOpen(false), []);

	if (!isValidTabId(tabId)) {
		return <Navigate to={`/${DEFAULT_TAB_ID}`} replace />;
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

	const { loading, error, data, previousData } = useQuery<{ denials: Denial[] }>(
		DENIALS_QUERY,
		{ variables: { department: department || undefined } }
	);

	const denials = data?.denials ?? previousData?.denials ?? [];

	const filteredDenials = useMemo(() => {
		const referenceDate = getReferenceDate(denials);
		return filterByPeriod(denials, period, referenceDate);
	}, [denials, period]);

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
		[activeTab, department, period, font, palette, radius, navigate, searchParams, closePalette]
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

					{loading && !previousData && !data ? (
						<p>Loading...</p>
					) : activeTab === 'reason-breakdown' ? (
						<>
							<SummaryStats data={filteredDenials} />
							<div className="charts-row">
								<DenialChart data={filteredDenials} />
								<DepartmentPieChart data={filteredDenials} />
								<TrendSparkline data={filteredDenials} />
							</div>
							<div className="denial-records-section">
								<h2 className="denial-records-heading">Denial-Level Detail</h2>
								<DenialsTable data={filteredDenials} />
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
			<div className="dashboard">
				<h1 className="visually-hidden">Denials</h1>

				<div className="dashboard-layout">
					<Sidebar tabs={TABS} activeTab={activeTab} onSelectTab={setActiveTab} />

					<div className="dashboard-content">{mainContent}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="dashboard">
			<h1 className="visually-hidden">Denials</h1>

			<TopBar
				tabs={TABS}
				activeTab={activeTab}
				onOpenPalette={() => setPaletteOpen(true)}
				filterSummary={activeTab === 'settings' ? null : filterSummary}
			/>

			<CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} commands={commands} />

			<div className="dashboard-content">{mainContent}</div>
		</div>
	);
}

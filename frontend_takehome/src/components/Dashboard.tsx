import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { PieChart, Landmark, TrendingUp, Table, Settings } from 'lucide-react';
import DenialChart from './DenialChart';
import DepartmentPieChart from './DepartmentPieChart';
import DenialsTable from './DenialsTable';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SummaryStats from './SummaryStats';
import TrendSparkline from './TrendSparkline';
import SettingsTab from './SettingsTab';
import Sidebar, { SidebarTab } from './Sidebar';
import ComingSoon from './ComingSoon';
import { Denial } from '../types';
import { PeriodId, filterByPeriod, getReferenceDate } from '../periods';
import { useThemePreferences } from '../useThemePreferences';

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

const TABS: SidebarTab[] = [
	{ id: 'reason-breakdown', label: 'Reason Breakdown', icon: PieChart },
	{ id: 'payer-breakdown', label: 'Payer Breakdown', icon: Landmark },
	{ id: 'trends', label: 'Trends Over Time', icon: TrendingUp },
	{ id: 'records', label: 'Denial Records', icon: Table },
	{ id: 'settings', label: 'Settings', icon: Settings },
];

const TAB_DESCRIPTIONS: Record<string, string> = {
	'payer-breakdown':
		'Coming soon: total denied amount by payer, so you can see which insurers are denying the most claims.',
	trends:
		'Coming soon: denial volume and dollar amount over time, to spot spikes and seasonal patterns.',
	records:
		'Coming soon: the full, sortable table of individual denial records currently shown below the chart.',
};

export default function Dashboard() {
	const [department, setDepartment] = useState<string>('');
	const [period, setPeriod] = useState<PeriodId>('all');
	const [activeTab, setActiveTab] = useState<string>(TABS[0].id);
	const { font, setFont, palette, setPalette, radius, setRadius } = useThemePreferences();

	const { loading, error, data, previousData } = useQuery<{ denials: Denial[] }>(
		DENIALS_QUERY,
		{ variables: { department: department || undefined } }
	);

	const denials = data?.denials ?? previousData?.denials ?? [];

	const filteredDenials = useMemo(() => {
		const referenceDate = getReferenceDate(denials);
		return filterByPeriod(denials, period, referenceDate);
	}, [denials, period]);

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
		<div className="dashboard">
			<h1 className="visually-hidden">Denials</h1>

			<div className="dashboard-layout">
				<Sidebar tabs={TABS} activeTab={activeTab} onSelectTab={setActiveTab} />

				<div className="dashboard-content">
					{activeTab === 'settings' ? (
						<SettingsTab
							font={font}
							onFontChange={setFont}
							palette={palette}
							onPaletteChange={setPalette}
							radius={radius}
							onRadiusChange={setRadius}
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
				</div>
			</div>
		</div>
	);
}

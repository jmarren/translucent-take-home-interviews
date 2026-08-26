import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { PieChart, Landmark, TrendingUp, Table } from 'lucide-react';
import DenialChart from './DenialChart';
import DenialsTable from './DenialsTable';
import DepartmentSelect from './DepartmentSelect';
import PeriodSelect from './PeriodSelect';
import SummaryCards from './SummaryCards';
import Sidebar, { SidebarTab } from './Sidebar';
import ComingSoon from './ComingSoon';
import { Denial } from '../types';
import { PeriodId, filterByPeriod, getReferenceDate } from '../periods';

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
			<h1>Denials</h1>

			<div className="dashboard-layout">
				<Sidebar tabs={TABS} activeTab={activeTab} onSelectTab={setActiveTab} />

				<div className="dashboard-content">
					<div className="filter-bar">
						<DepartmentSelect value={department} onChange={setDepartment} />
						<PeriodSelect value={period} onChange={setPeriod} />
					</div>

					{loading && !previousData && !data ? (
						<p>Loading...</p>
					) : activeTab === 'reason-breakdown' ? (
						<div className="reason-breakdown-layout">
							<div className="reason-breakdown-main">
								<DenialChart data={filteredDenials} />
								<DenialsTable data={filteredDenials} />
							</div>
							<SummaryCards data={filteredDenials} />
						</div>
					) : (
						<ComingSoon
							title={TABS.find((t) => t.id === activeTab)?.label ?? ''}
							description={TAB_DESCRIPTIONS[activeTab]}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

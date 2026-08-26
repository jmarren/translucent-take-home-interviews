import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import DenialChart from './DenialChart';
import Sidebar, { SidebarTab } from './Sidebar';
import ComingSoon from './ComingSoon';
import { Denial, DEPARTMENTS } from '../types';

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
	{ id: 'reason-breakdown', label: 'Reason Breakdown' },
	{ id: 'payer-breakdown', label: 'Payer Breakdown' },
	{ id: 'trends', label: 'Trends Over Time' },
	{ id: 'records', label: 'Denial Records' },
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
	const [activeTab, setActiveTab] = useState<string>(TABS[0].id);

	const { loading, error, data, previousData } = useQuery<{ denials: Denial[] }>(
		DENIALS_QUERY,
		{ variables: { department: department || undefined } }
	);

	const denials = data?.denials ?? previousData?.denials ?? [];

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
		<div className="dashboard">
			<h1>Denials</h1>

			<div className="dashboard-layout">
				<Sidebar tabs={TABS} activeTab={activeTab} onSelectTab={setActiveTab} />

				<div className="dashboard-content">
					<label htmlFor="department-filter">Department</label>
					<select
						id="department-filter"
						value={department}
						onChange={(e) => setDepartment(e.target.value)}
					>
						<option value="">All Departments</option>
						{DEPARTMENTS.map((dept) => (
							<option key={dept} value={dept}>
								{dept}
							</option>
						))}
					</select>

					{loading && !previousData && !data ? (
						<p>Loading...</p>
					) : activeTab === 'reason-breakdown' ? (
						<>
							<DenialChart data={denials} />
							<table>
								<thead>
									<tr>
										<th>ID</th>
										<th>Dept</th>
										<th>Amount</th>
										<th>Reason</th>
										<th>Date</th>
										<th>Payer</th>
									</tr>
								</thead>
								<tbody>
									{denials.map((d) => (
										<tr key={d.id}>
											<td>{d.id}</td>
											<td>{d.department}</td>
											<td>{d.amount}</td>
											<td>{d.reason}</td>
											<td>{d.date}</td>
											<td>{d.payer}</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
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

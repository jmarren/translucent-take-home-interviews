import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DenialChart from './DenialChart';
import DepartmentPieChart from './DepartmentPieChart';
import PayerPieChart from './PayerPieChart';
import DenialsTable from './DenialsTable';
import SummaryStats from './SummaryStats';
import TrendSparkline from './TrendSparkline';
import { useDenials } from '../useDenials';
import { DashboardOutletContext } from './DashboardLayout';

export default function ReasonBreakdownPage() {
	const { department, period } = useOutletContext<DashboardOutletContext>();
	const { filteredDenials, isInitialLoad, error } = useDenials(department, period);

	if (error) return <p role="alert">Error loading denials.</p>;

	return (
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
	);
}

import React from 'react';
import Sidebar from './Sidebar';
import { TABS } from '../tabs';

interface SidebarShellProps {
	activeTab: string;
	onSelectTab: (id: string) => void;
	children: React.ReactNode;
}

export default function SidebarShell({ activeTab, onSelectTab, children }: SidebarShellProps) {
	return (
		<div className="dashboard">
			<h1 className="visually-hidden">Denials</h1>

			<div className="dashboard-layout">
				<Sidebar tabs={TABS} activeTab={activeTab} onSelectTab={onSelectTab} />

				<div className="dashboard-content">{children}</div>
			</div>
		</div>
	);
}

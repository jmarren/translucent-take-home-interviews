import React from 'react';
import Sidebar from './Sidebar';
import { LayoutState } from './Layout';

interface SidebarShellProps {
	layoutState: LayoutState,
	children: React.ReactNode;
}

export default function SidebarShell({ layoutState, children }: SidebarShellProps) {
	return (
		<div className="dashboard">
			<h1 className="visually-hidden">Denials</h1>

			<div className="dashboard-layout">
				<Sidebar layoutState={layoutState} />

				<div className="dashboard-content">{children}</div>
			</div>
		</div>
	);
}

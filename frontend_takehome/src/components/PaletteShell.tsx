import React from 'react';
import TopBar from './TopBar';
import CommandPalette from './CommandPalette';
import { LayoutState } from './Layout';

interface PaletteShellProps {
	layoutState: LayoutState;
	children: React.ReactNode;
}

export default function PaletteShell({ layoutState, children }: PaletteShellProps) {
	return (
		<div className="dashboard">
			<h1 className="visually-hidden">Denials</h1>

			<TopBar layoutState={layoutState} />

			<CommandPalette layoutState={layoutState} />

			<div className="dashboard-content">{children}</div>
		</div>
	);
}

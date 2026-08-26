import React from 'react';
import TopBar from './TopBar';
import CommandPalette from './CommandPalette';
import { TABS } from '../tabs';
import { Command } from '../commands';

interface PaletteShellProps {
	activeTab: string;
	filterSummary: string | null;
	paletteOpen: boolean;
	onOpenPalette: () => void;
	onPaletteOpenChange: (open: boolean) => void;
	commands: Command[];
	children: React.ReactNode;
}

export default function PaletteShell({
	activeTab,
	filterSummary,
	paletteOpen,
	onOpenPalette,
	onPaletteOpenChange,
	commands,
	children,
}: PaletteShellProps) {
	return (
		<div className="dashboard">
			<h1 className="visually-hidden">Denials</h1>

			<TopBar
				tabs={TABS}
				activeTab={activeTab}
				onOpenPalette={onOpenPalette}
				filterSummary={filterSummary}
			/>

			<CommandPalette open={paletteOpen} onOpenChange={onPaletteOpenChange} commands={commands} />

			<div className="dashboard-content">{children}</div>
		</div>
	);
}

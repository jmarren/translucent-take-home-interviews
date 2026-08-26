import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SettingsTab from './SettingsTab';
import { LayoutState } from './Layout';

export default function SettingsPage() {
	const { theme } = useOutletContext<LayoutState>();

	return (
		<SettingsTab
			font={theme.font}
			onFontChange={theme.setFont}
			palette={theme.palette}
			onPaletteChange={theme.setPalette}
			radius={theme.radius}
			onRadiusChange={theme.setRadius}
			navMode={theme.navMode}
			onNavModeChange={theme.setNavMode}
		/>
	);
}

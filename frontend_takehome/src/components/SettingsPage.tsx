import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SettingsTab from './SettingsTab';
import { DashboardOutletContext } from './Layout';

export default function SettingsPage() {
	const { font, setFont, palette, setPalette, radius, setRadius, navMode, setNavMode } =
		useOutletContext<DashboardOutletContext>();

	return (
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
	);
}

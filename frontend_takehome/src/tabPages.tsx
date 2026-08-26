import React from 'react';
import BreakdownPage from './components/BreakdownPage';
import SettingsPage from './components/SettingsPage';

// The single place mapping a tab id to the page element its route renders.
// Tabs with no entry here fall back to the generic ComingSoon placeholder
// (see App.tsx / the test file's route setup) -- kept as plain data rather
// than a <Route>-producing component, since React Router's <Routes> can only
// discover <Route> elements that are its own direct JSX children (or nested
// inside another literal <Route>/<Fragment>), not ones returned from an
// arbitrary custom component.
export const TAB_PAGE_ELEMENTS: Record<string, React.ReactNode> = {
	breakdown: <BreakdownPage />,
	settings: <SettingsPage />,
};

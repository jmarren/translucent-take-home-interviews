import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import CategoryCard from '../components/cards/CategoryCard';
import TimeSeriesCard from '../components/cards/TimeSeriesCard';
import { REASON_CARD, DEPARTMENT_CARD, PAYER_CARD, TREND_CARD, CategoryCardData } from '../components/BreakdownPage';
import { DEFAULT_VIZ_PALETTE } from '../theme/vizPalettes';
import Layout from '../components/Layout';
import ComingSoon from '../components/ComingSoon';
import { Denial } from '../types';
import { DENIALS_QUERY, UseDenialsResult } from '../hooks/useDenials';
import { ThemePreferences } from '../hooks/useThemePreferences';
import { makeState } from '../hooks/state';
import { DEFAULT_FONT } from '../theme/fonts';
import { DEFAULT_PALETTE } from '../theme/palettes';
import { DEFAULT_RADIUS } from '../theme/radii';
import { DEFAULT_SIDEBAR_STYLE } from '../theme/sidebarStyles';
import { DEFAULT_CURSOR_STYLE } from '../theme/cursors';
import { DEFAULT_TREND_COLOR } from '../theme/vizPalettes';
import { DEFAULT_PRIMARY_TITLE_STYLE, DEFAULT_SECONDARY_TITLE_STYLE } from '../theme/titleStyles';
import { TABS, TAB_DESCRIPTIONS } from '../tabs';
import { TAB_PAGE_ELEMENTS } from '../tabPages';

// Minimal ThemePreferences for isolated CategoryCard tests -- only
// vizPalette/chartAnimationsEnabled/chartCaptionsEnabled are ever read by
// CategoryCard, but the prop is typed as the full ThemePreferences, so
// every field needs a real (if unused) State<T>.
function mockTheme(overrides: Partial<{ [K in keyof ThemePreferences]: ThemePreferences[K]['value'] }> = {}): ThemePreferences {
	return {
		font: makeState(overrides.font ?? DEFAULT_FONT, () => {}),
		palette: makeState(overrides.palette ?? DEFAULT_PALETTE, () => {}),
		radius: makeState(overrides.radius ?? DEFAULT_RADIUS, () => {}),
		commandPaletteEnabled: makeState(overrides.commandPaletteEnabled ?? true, () => {}),
		sidebarStyle: makeState(overrides.sidebarStyle ?? DEFAULT_SIDEBAR_STYLE, () => {}),
		cursorStyle: makeState(overrides.cursorStyle ?? DEFAULT_CURSOR_STYLE, () => {}),
		vizPalette: makeState(overrides.vizPalette ?? DEFAULT_VIZ_PALETTE, () => {}),
		trendColor: makeState(overrides.trendColor ?? DEFAULT_TREND_COLOR, () => {}),
		primaryTitleStyle: makeState(overrides.primaryTitleStyle ?? DEFAULT_PRIMARY_TITLE_STYLE, () => {}),
		secondaryTitleStyle: makeState(overrides.secondaryTitleStyle ?? DEFAULT_SECONDARY_TITLE_STYLE, () => {}),
		chartAnimationsEnabled: makeState(overrides.chartAnimationsEnabled ?? true, () => {}),
		chartCaptionsEnabled: makeState(overrides.chartCaptionsEnabled ?? true, () => {}),
	};
}

function mockDenials(filteredDenials: Denial[], isInitialLoad = false): UseDenialsResult {
	return {
		filteredDenials,
		unfilteredByPeriod: filteredDenials,
		referenceDate: new Date(),
		isInitialLoad,
		error: undefined,
	};
}

function mockCategoryCardData(filteredDenials: Denial[], isInitialLoad = false): CategoryCardData {
	return {
		denials: mockDenials(filteredDenials, isInitialLoad),
		metric: 'amount',
		theme: mockTheme(),
	};
}

function renderDashboard(mocks: MockedResponse[], initialPath = '/breakdown') {
	return render(
		<MockedProvider mocks={mocks}>
			<MemoryRouter initialEntries={[initialPath]}>
				<Routes>
					<Route element={<Layout />}>
						{TABS.map((tab) => (
							<Route
								key={tab.id}
								path={`/${tab.id}`}
								element={
									TAB_PAGE_ELEMENTS[tab.id] ?? (
										<ComingSoon title={tab.label} description={TAB_DESCRIPTIONS[tab.id]} />
									)
								}
							/>
						))}
					</Route>
				</Routes>
			</MemoryRouter>
		</MockedProvider>
	);
}

const twoCategoryDenials = [
	{ id: 'D1', department: 'Cardiology', amount: 100, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
	{ id: 'D2', department: 'Neurology', amount: 200, reason: 'Missing info', date: '2024-01-02', payer: 'Cigna' },
];

test('renders chart title', () => {
	render(<CategoryCard data={mockCategoryCardData(twoCategoryDenials)} config={REASON_CARD} expanded={false} onToggleExpand={() => {}} />);
	const title = screen.getByText(/Reasons/i);
	expect(title).toBeInTheDocument();
});

test('renders department pie chart title', () => {
	render(<CategoryCard data={mockCategoryCardData(twoCategoryDenials)} config={DEPARTMENT_CARD} expanded={false} onToggleExpand={() => {}} />);
	const title = screen.getByText(/Departments/i);
	expect(title).toBeInTheDocument();
});

test('renders payer pie chart title', () => {
	render(<CategoryCard data={mockCategoryCardData(twoCategoryDenials)} config={PAYER_CARD} expanded={false} onToggleExpand={() => {}} />);
	const title = screen.getByText(/Payers/i);
	expect(title).toBeInTheDocument();
});

test('omits the category card entirely when there is only one category to show', () => {
	const singleCategoryDenial = [
		{ id: 'D1', department: 'Cardiology', amount: 100, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
	];
	render(<CategoryCard data={mockCategoryCardData(singleCategoryDenial)} config={DEPARTMENT_CARD} expanded={false} onToggleExpand={() => {}} />);
	expect(screen.queryByText(/Departments/i)).not.toBeInTheDocument();
});

test('omits the trend card entirely when there is only one month of data', () => {
	const singleMonthDenials = [
		{ id: 'D1', department: 'Cardiology', amount: 100, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
		{ id: 'D2', department: 'Neurology', amount: 200, reason: 'Missing info', date: '2024-01-15', payer: 'Cigna' },
	];
	render(<TimeSeriesCard data={singleMonthDenials} config={TREND_CARD} metric="amount" color={DEFAULT_VIZ_PALETTE.colors[0]} animationsEnabled={true} captionsEnabled={true} expanded={false} onToggleExpand={() => {}} />);
	expect(screen.queryByText('Trend')).not.toBeInTheDocument();
});

test('renders the trend card when it has more than one month of data', () => {
	const twoMonthDenials = [
		{ id: 'D1', department: 'Cardiology', amount: 100, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
		{ id: 'D2', department: 'Neurology', amount: 200, reason: 'Missing info', date: '2024-02-15', payer: 'Cigna' },
	];
	render(<TimeSeriesCard data={twoMonthDenials} config={TREND_CARD} metric="amount" color={DEFAULT_VIZ_PALETTE.colors[0]} animationsEnabled={true} captionsEnabled={true} expanded={false} onToggleExpand={() => {}} />);
	expect(screen.getByText('Trend')).toBeInTheDocument();
});

const allDenials = [
	{ __typename: 'Denial', id: 'D1', department: 'Cardiology', amount: 100, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
	{ __typename: 'Denial', id: 'D2', department: 'Neurology', amount: 200, reason: 'Missing info', date: '2024-01-02', payer: 'Cigna' },
];
const cardiologyDenials = [
	{ __typename: 'Denial', id: 'D1', department: 'Cardiology', amount: 100, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
];

const mocks: MockedResponse[] = [
	{
		request: { query: DENIALS_QUERY, variables: { department: undefined } },
		result: { data: { denials: allDenials } },
	},
	{
		request: { query: DENIALS_QUERY, variables: { department: 'Cardiology' } },
		result: { data: { denials: cardiologyDenials } },
	},
];

test('selecting a department filters the table and chart to that department', async () => {
	const user = userEvent.setup();
	renderDashboard(mocks);

	expect(await screen.findByText('D1')).toBeInTheDocument();
	expect(screen.getByText('D2')).toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: /department/i }));
	await user.click(await screen.findByRole('option', { name: 'Cardiology' }));

	await screen.findByText('D1');
	await waitFor(() => expect(screen.queryByText('D2')).not.toBeInTheDocument());
});

const payerMocks: MockedResponse[] = [
	{
		request: { query: DENIALS_QUERY, variables: { department: undefined, payer: undefined } },
		result: { data: { denials: allDenials } },
	},
	{
		request: { query: DENIALS_QUERY, variables: { department: undefined, payer: 'Cigna' } },
		result: { data: { denials: [allDenials[1]] } },
	},
];

test('selecting a payer filters the table and chart to that payer', async () => {
	const user = userEvent.setup();
	renderDashboard(payerMocks);

	expect(await screen.findByText('D1')).toBeInTheDocument();
	expect(screen.getByText('D2')).toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: /payer/i }));
	await user.click(await screen.findByRole('option', { name: 'Cigna' }));

	await screen.findByText('D2');
	await waitFor(() => expect(screen.queryByText('D1')).not.toBeInTheDocument());
});

const reasonMocks: MockedResponse[] = [
	{
		request: { query: DENIALS_QUERY, variables: { department: undefined, payer: undefined, reason: undefined } },
		result: { data: { denials: allDenials } },
	},
	{
		request: { query: DENIALS_QUERY, variables: { department: undefined, payer: undefined, reason: 'Missing info' } },
		result: { data: { denials: [allDenials[1]] } },
	},
];

test('selecting a reason filters the table and chart to that reason', async () => {
	const user = userEvent.setup();
	renderDashboard(reasonMocks);

	expect(await screen.findByText('D1')).toBeInTheDocument();
	expect(screen.getByText('D2')).toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: /reason/i }));
	await user.click(await screen.findByRole('option', { name: 'Missing info' }));

	await screen.findByText('D2');
	await waitFor(() => expect(screen.queryByText('D1')).not.toBeInTheDocument());
});

const spreadOutDenials = [
	{ __typename: 'Denial', id: 'D3', department: 'Cardiology', amount: 300, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
	{ __typename: 'Denial', id: 'D4', department: 'Neurology', amount: 400, reason: 'Missing info', date: '2024-06-15', payer: 'Cigna' },
];

const periodMocks: MockedResponse[] = [
	{
		request: { query: DENIALS_QUERY, variables: { department: undefined } },
		result: { data: { denials: spreadOutDenials } },
	},
];

test('selecting a period filters out denials outside that range', async () => {
	const user = userEvent.setup();
	renderDashboard(periodMocks);

	expect(await screen.findByText('D3')).toBeInTheDocument();
	expect(screen.getByText('D4')).toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: /period/i }));
	await user.click(await screen.findByRole('option', { name: 'This Month' }));

	await waitFor(() => expect(screen.queryByText('D3')).not.toBeInTheDocument());
	expect(screen.getByText('D4')).toBeInTheDocument();
});

test('selecting the Denial Count metric leaves the summary panel showing dollars and an integer count', async () => {
	const user = userEvent.setup();
	renderDashboard(mocks);

	expect(await screen.findByText('D1')).toBeInTheDocument();
	expect(screen.getByText('Total Denied')).toBeInTheDocument();
	expect(screen.getByText('$300')).toBeInTheDocument();
	expect(screen.getByText('Denial Count')).toBeInTheDocument();
	expect(screen.getByText('2')).toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: 'Metric' }));
	await user.click(await screen.findByRole('option', { name: 'Denial Count' }));

	// The summary panel is metric-independent -- "Total Denied" stays in
	// dollars and "Denial Count" stays an integer no matter which metric
	// drives the charts, so a "Total Denials" duplicate never appears.
	await waitFor(() => expect(screen.getByRole('combobox', { name: 'Metric' })).toHaveTextContent('Denial Count'));
	expect(screen.queryByText('Total Denials')).not.toBeInTheDocument();
	expect(screen.getByText('Total Denied')).toBeInTheDocument();
	expect(screen.getByText('$300')).toBeInTheDocument();
	// Scoped to the summary panel itself, since the metric dropdown's own
	// selected-value text and the top-bar filter summary badge now also
	// happen to say "Denial Count".
	const summaryPanel = screen.getByLabelText('Summary statistics');
	expect(within(summaryPanel).getByText('Denial Count')).toBeInTheDocument();
	expect(within(summaryPanel).getByText('2')).toBeInTheDocument();
});

const trendsDenials = [
	{ __typename: 'Denial', id: 'D5', department: 'Cardiology', amount: 100, reason: 'Coding error', date: '2024-01-01', payer: 'Aetna' },
	{ __typename: 'Denial', id: 'D6', department: 'Neurology', amount: 200, reason: 'Missing info', date: '2024-02-01', payer: 'Cigna' },
];

const trendsMocks: MockedResponse[] = [
	{
		request: { query: DENIALS_QUERY, variables: { department: undefined, payer: undefined, reason: undefined } },
		result: { data: { denials: trendsDenials } },
	},
];

test('navigating to Trends renders the real page, not the Coming Soon placeholder', async () => {
	renderDashboard(trendsMocks, '/trends');

	expect(await screen.findByLabelText('Denial trends over time')).toBeInTheDocument();
	expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
});

test('switching the Trends dimension picker changes which values are charted', async () => {
	const user = userEvent.setup();
	renderDashboard(trendsMocks, '/trends');

	await screen.findByLabelText('Denial trends over time');
	expect(screen.getByText(/split by department/i)).toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: /dimension to compare over time/i }));
	await user.click(await screen.findByRole('option', { name: 'Payer' }));

	await waitFor(() => expect(screen.getByText(/split by payer/i)).toBeInTheDocument());
});

test('the compare-to-previous-period toggle is disabled when the period filter is "All Time"', async () => {
	renderDashboard(trendsMocks, '/trends');

	await screen.findByLabelText('Denial trends over time');
	const popToggle = screen.getByRole('combobox', { name: /compare to previous period/i });
	expect(popToggle).toHaveAttribute('data-disabled');
});

test('the compare-to-previous-period toggle is enabled once a specific period is selected', async () => {
	const user = userEvent.setup();
	renderDashboard(trendsMocks, '/trends');

	await screen.findByLabelText('Denial trends over time');

	await user.click(screen.getByRole('combobox', { name: 'Period' }));
	await user.click(await screen.findByRole('option', { name: 'This Year' }));

	await waitFor(() =>
		expect(screen.getByRole('combobox', { name: /compare to previous period/i })).not.toHaveAttribute(
			'data-disabled'
		)
	);
});

test('selecting a moving-average window shows the caption explaining the smoothing', async () => {
	const user = userEvent.setup();
	renderDashboard(trendsMocks, '/trends');

	await screen.findByLabelText('Denial trends over time');
	expect(screen.queryByText(/period moving average/i)).not.toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: /moving average window/i }));
	await user.click(await screen.findByRole('option', { name: '3-period' }));

	await waitFor(() => expect(screen.getByText(/3-period moving average/i)).toBeInTheDocument());
});

test('the moving-average control is disabled while comparing to the previous period', async () => {
	const user = userEvent.setup();
	renderDashboard(trendsMocks, '/trends');

	await screen.findByLabelText('Denial trends over time');

	await user.click(screen.getByRole('combobox', { name: 'Period' }));
	await user.click(await screen.findByRole('option', { name: 'This Year' }));

	await user.click(screen.getByRole('combobox', { name: /compare to previous period/i }));
	await user.click(await screen.findByRole('option', { name: 'On' }));

	await waitFor(() =>
		expect(screen.getByRole('combobox', { name: /moving average window/i })).toHaveAttribute('data-disabled')
	);
});

test('Cmd+K opens the command palette', async () => {
	const user = userEvent.setup();
	renderDashboard(mocks);

	await screen.findByText('D1');
	expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

	await user.keyboard('{Meta>}k{/Meta}');

	expect(await screen.findByRole('dialog')).toBeInTheDocument();
	expect(screen.getByPlaceholderText(/search views, filters, and settings/i)).toBeInTheDocument();
});

test('choosing a "Go to" command in the palette navigates to that view and closes the palette', async () => {
	const user = userEvent.setup();
	renderDashboard(mocks);

	await screen.findByText('D1');

	await user.keyboard('{Meta>}k{/Meta}');
	const input = await screen.findByPlaceholderText(/search views, filters, and settings/i);

	await user.type(input, 'Payer Breakdown');
	await user.click(await screen.findByText('Go to Payer Breakdown'));

	await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	expect(await screen.findByRole('heading', { name: 'Payer Breakdown' })).toBeInTheDocument();
});

test('Escape closes the command palette without navigating away', async () => {
	const user = userEvent.setup();
	renderDashboard(mocks);

	await screen.findByText('D1');

	await user.keyboard('{Meta>}k{/Meta}');
	await screen.findByRole('dialog');

	await user.keyboard('{Escape}');

	await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	// Still on the original view -- the underlying dashboard content survived intact.
	expect(screen.getByText('D1')).toBeInTheDocument();
});

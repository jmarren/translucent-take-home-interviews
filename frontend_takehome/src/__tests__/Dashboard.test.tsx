import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import DenialChart from '../components/DenialChart';
import DepartmentPieChart from '../components/DepartmentPieChart';
import PayerPieChart from '../components/PayerPieChart';
import Layout from '../components/Layout';
import ComingSoon from '../components/ComingSoon';
import { DENIALS_QUERY } from '../useDenials';
import { TABS, TAB_DESCRIPTIONS } from '../tabs';
import { TAB_PAGE_ELEMENTS } from '../tabPages';

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

test('renders chart title', () => {
	render(<DenialChart data={[]} />);
	const title = screen.getByText(/Reasons/i);
	expect(title).toBeInTheDocument();
});

test('renders department pie chart title', () => {
	render(<DepartmentPieChart data={[]} />);
	const title = screen.getByText(/Departments/i);
	expect(title).toBeInTheDocument();
});

test('renders payer pie chart title', () => {
	render(<PayerPieChart data={[]} />);
	const title = screen.getByText(/Payers/i);
	expect(title).toBeInTheDocument();
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

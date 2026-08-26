import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import DenialChart from '../components/DenialChart';
import DepartmentPieChart from '../components/DepartmentPieChart';
import Dashboard, { DENIALS_QUERY } from '../components/Dashboard';

test('renders chart title', () => {
	render(<DenialChart data={[]} />);
	const title = screen.getByRole('heading', { name: /Denied Amount by Reason/i });
	expect(title).toBeInTheDocument();
});

test('renders department pie chart title', () => {
	render(<DepartmentPieChart data={[]} />);
	const title = screen.getByRole('heading', { name: /Denied Amount by Department/i });
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
	render(
		<MockedProvider mocks={mocks}>
			<Dashboard />
		</MockedProvider>
	);

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
	render(
		<MockedProvider mocks={periodMocks}>
			<Dashboard />
		</MockedProvider>
	);

	expect(await screen.findByText('D3')).toBeInTheDocument();
	expect(screen.getByText('D4')).toBeInTheDocument();

	await user.click(screen.getByRole('combobox', { name: /period/i }));
	await user.click(await screen.findByRole('option', { name: 'This Month' }));

	await waitFor(() => expect(screen.queryByText('D3')).not.toBeInTheDocument());
	expect(screen.getByText('D4')).toBeInTheDocument();
});

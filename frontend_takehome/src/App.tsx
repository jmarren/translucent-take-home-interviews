import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ComingSoon from './components/ComingSoon';
import { TABS, TAB_DESCRIPTIONS, DEFAULT_TAB_ID } from './tabs';
import { TAB_PAGE_ELEMENTS } from './tabPages';

const client = new ApolloClient({ uri: 'http://localhost:4000/', cache: new InMemoryCache() });

export default function App() {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
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
					<Route path="*" element={<Navigate to={`/${DEFAULT_TAB_ID}`} replace />} />
				</Routes>
			</BrowserRouter>
		</ApolloProvider>
	);
}

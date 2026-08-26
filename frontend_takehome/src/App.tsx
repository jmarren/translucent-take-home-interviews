import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { TABS, DEFAULT_TAB_ID } from './tabs';

const client = new ApolloClient({ uri: 'http://localhost:4000/', cache: new InMemoryCache() });

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          {TABS.map((tab) => (
            <Route key={tab.id} path={`/${tab.id}`} element={<Dashboard />} />
          ))}
          <Route path="*" element={<Navigate to={`/${DEFAULT_TAB_ID}`} replace />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

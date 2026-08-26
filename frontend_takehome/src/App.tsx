import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FontExperiment from './components/FontExperiment';
import PaletteExperiment from './components/PaletteExperiment';
import { DEFAULT_TAB_ID } from './tabs';

const client = new ApolloClient({ uri: 'http://localhost:4000/', cache: new InMemoryCache() });

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/:tabId" element={<Dashboard />} />
          <Route path="/" element={<Navigate to={`/${DEFAULT_TAB_ID}`} replace />} />
        </Routes>
      </BrowserRouter>
      <FontExperiment />
      <PaletteExperiment />
    </ApolloProvider>
  );
}

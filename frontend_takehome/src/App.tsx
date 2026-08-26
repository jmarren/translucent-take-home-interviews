import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Dashboard from './components/Dashboard';
import FontExperiment from './components/FontExperiment';

const client = new ApolloClient({ uri: 'http://localhost:4000/', cache: new InMemoryCache() });

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Dashboard />
      <FontExperiment />
    </ApolloProvider>
  );
}

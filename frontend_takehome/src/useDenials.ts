import { useMemo } from 'react';
import { gql, useQuery, ApolloError } from '@apollo/client';
import { Denial } from './types';
import { filterByPeriod, getReferenceDate } from './periods';
import { DashboardFilters } from './useDashboardFilters';

export const DENIALS_QUERY = gql`
  query Denials($department: String, $payer: String, $reason: String) {
    denials(department: $department, payer: $payer, reason: $reason) {
      id
      department
      amount
      reason
      date
      payer
    }
  }
`;

export interface UseDenialsResult {
  filteredDenials: Denial[];
  isInitialLoad: boolean;
  error: ApolloError | undefined;
}

export function useDenials(filters: DashboardFilters): UseDenialsResult {
  const { loading, error, data, previousData } = useQuery<{ denials: Denial[] }>(DENIALS_QUERY, {
    variables: {
      department: filters.department || undefined,
      payer: filters.payer || undefined,
      reason: filters.reason || undefined,
    },
  });

  const denials = data?.denials ?? previousData?.denials ?? [];
  const isInitialLoad = loading && !previousData && !data;

  const filteredDenials = useMemo(() => {
    const referenceDate = getReferenceDate(denials);
    return filterByPeriod(denials, filters.period, referenceDate);
  }, [denials, filters.period]);

  return { filteredDenials, isInitialLoad, error };
}

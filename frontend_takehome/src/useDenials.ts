import { useMemo } from 'react';
import { gql, useQuery, ApolloError } from '@apollo/client';
import { Denial } from './types';
import { PeriodId, filterByPeriod, getReferenceDate } from './periods';

export const DENIALS_QUERY = gql`
  query Denials($department: String) {
    denials(department: $department) {
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

export function useDenials(department: string, period: PeriodId): UseDenialsResult {
	const { loading, error, data, previousData } = useQuery<{ denials: Denial[] }>(
		DENIALS_QUERY,
		{ variables: { department: department || undefined } }
	);

	const denials = data?.denials ?? previousData?.denials ?? [];
	const isInitialLoad = loading && !previousData && !data;

	const filteredDenials = useMemo(() => {
		const referenceDate = getReferenceDate(denials);
		return filterByPeriod(denials, period, referenceDate);
	}, [denials, period]);

	return { filteredDenials, isInitialLoad, error };
}

import { useMemo } from "react";
import { gql, useQuery, ApolloError } from "@apollo/client";
import { Denial } from "../types";
import { filterByPeriod, getReferenceDate } from "../periods";
import { DashboardFilters } from "./useDashboardFilters";

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
  /** Same department/payer/reason-filtered set as `filteredDenials`, but
   *  before the period filter is applied -- needed by period-over-period
   *  comparisons, which look outside the current period's window at the
   *  preceding one. */
  unfilteredByPeriod: Denial[];
  referenceDate: Date;
  isInitialLoad: boolean;
  error: ApolloError | undefined;
}

export function useDenials(filters: DashboardFilters): UseDenialsResult {
  const { loading, error, data, previousData } = useQuery<{
    denials: Denial[];
  }>(DENIALS_QUERY, {
    variables: {
      department: filters.department.value || undefined,
      payer: filters.payer.value || undefined,
      reason: filters.reason.value || undefined,
    },
  });

  const denials = data?.denials ?? previousData?.denials ?? [];
  const isInitialLoad = loading && !previousData && !data;
  const referenceDate = useMemo(() => getReferenceDate(denials), [denials]);

  const filteredDenials = useMemo(
    () => filterByPeriod(denials, filters.period.value, referenceDate),
    [denials, filters.period.value, referenceDate],
  );

  return {
    filteredDenials,
    unfilteredByPeriod: denials,
    referenceDate,
    isInitialLoad,
    error,
  };
}

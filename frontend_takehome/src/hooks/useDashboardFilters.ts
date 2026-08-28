import { useSearchParams } from "react-router-dom";
import { PeriodId, isValidPeriodId, DEFAULT_PERIOD } from "../periods";
import { MetricId, isValidMetricId, DEFAULT_METRIC } from "../types";
import { State, makeState, ValuesOf } from "./state";

export interface DashboardFilters {
  department: State<string>;
  payer: State<string>;
  reason: State<string>;
  period: State<PeriodId>;
  metric: State<MetricId>;
}

function makeFilterSetter<T extends string>(
  name: string,
  searchParams: ReturnType<typeof useSearchParams>,
) {
  return (value: T) => {
    const next = new URLSearchParams(searchParams[0]);
    if (value) next.set(name, value);
    else next.delete(name);
    searchParams[1](next, { replace: true });
  };
}

type DashboardFilterParams = ValuesOf<DashboardFilters>;

function getParams(searchParams: URLSearchParams): DashboardFilterParams {
  const department = searchParams.get("department") ?? "";
  const payer = searchParams.get("payer") ?? "";
  const reason = searchParams.get("reason") ?? "";
  const periodParam = searchParams.get("period");
  const period: PeriodId = isValidPeriodId(periodParam)
    ? periodParam
    : DEFAULT_PERIOD;
  const metricParam = searchParams.get("metric");
  const metric: MetricId = isValidMetricId(metricParam)
    ? metricParam
    : DEFAULT_METRIC;

  return {
    department,
    payer,
    reason,
    period,
    metric,
  };
}

// Department/period are URL search params rather than route state, since
// they layer on top of whichever tab route is active rather than selecting
// between tabs themselves (that's handled by React Router's own route
// matching now that each tab is a static route -- see Layout).
export function useDashboardFilters(): DashboardFilters {
  const searchParamsState = useSearchParams();
  const searchParams = searchParamsState[0];

  const params = getParams(searchParams);

  return {
    department: makeState<string>(
      params.department,
      makeFilterSetter<string>("department", searchParamsState),
    ),
    payer: makeState<string>(
      params.payer,
      makeFilterSetter<string>("payer", searchParamsState),
    ),
    reason: makeState<string>(
      params.reason,
      makeFilterSetter<string>("reason", searchParamsState),
    ),
    period: makeState<PeriodId>(
      params.period,
      makeFilterSetter<PeriodId>("period", searchParamsState),
    ),
    metric: makeState<MetricId>(
      params.metric,
      makeFilterSetter<MetricId>("metric", searchParamsState),
    ),
  };
}

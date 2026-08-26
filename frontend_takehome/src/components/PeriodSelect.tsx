import React from 'react';
import LabeledSelect from './LabeledSelect';
import { PERIODS, PeriodId } from '../periods';
import { DashboardFilters } from '../useDashboardFilters';

interface PeriodSelectProps {
  filters: DashboardFilters;
}

export default function PeriodSelect({ filters }: PeriodSelectProps) {
  return (
    <LabeledSelect
      id="period-filter"
      label="Period"
      ariaLabel="Period"
      value={filters.period}
      onChange={(next) => filters.setPeriod(next as PeriodId)}
      options={PERIODS.map((p) => ({ value: p.id, label: p.label }))}
    />
  );
}

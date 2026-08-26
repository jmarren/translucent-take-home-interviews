import React from 'react';
import LabeledSelect from './LabeledSelect';
import { PERIODS, PeriodId } from '../periods';

interface PeriodSelectProps {
  value: PeriodId;
  onChange: (value: PeriodId) => void;
}

export default function PeriodSelect({ value, onChange }: PeriodSelectProps) {
  return (
    <LabeledSelect
      id="period-filter"
      ariaLabel="Period"
      value={value}
      onChange={(next) => onChange(next as PeriodId)}
      options={PERIODS.map((p) => ({ value: p.id, label: p.label }))}
    />
  );
}

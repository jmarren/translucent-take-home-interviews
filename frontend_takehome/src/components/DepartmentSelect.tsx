import React from 'react';
import LabeledSelect from './LabeledSelect';
import { DEPARTMENTS } from '../types';

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ALL_DEPARTMENTS = '__all__';

export default function DepartmentSelect({ value, onChange }: DepartmentSelectProps) {
  return (
    <LabeledSelect
      id="department-filter"
      ariaLabel="Department"
      value={value || ALL_DEPARTMENTS}
      onChange={(next) => onChange(next === ALL_DEPARTMENTS ? '' : next)}
      options={[
        { value: ALL_DEPARTMENTS, label: 'All Departments' },
        ...DEPARTMENTS.map((dept) => ({ value: dept, label: dept })),
      ]}
    />
  );
}

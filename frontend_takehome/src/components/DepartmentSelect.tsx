import React from 'react';
import * as Select from '@radix-ui/react-select';
import { DEPARTMENTS } from '../types';

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ALL_DEPARTMENTS = '__all__';

export default function DepartmentSelect({ value, onChange }: DepartmentSelectProps) {
  return (
    <Select.Root
      value={value || ALL_DEPARTMENTS}
      onValueChange={(next) => onChange(next === ALL_DEPARTMENTS ? '' : next)}
    >
      <Select.Trigger className="department-select-trigger" id="department-filter" aria-label="Department">
        <Select.Value />
        <Select.Icon className="department-select-icon">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="department-select-content" position="popper" sideOffset={4}>
          <Select.Viewport>
            <Select.Item className="department-select-item" value={ALL_DEPARTMENTS}>
              <Select.ItemText>All Departments</Select.ItemText>
            </Select.Item>
            {DEPARTMENTS.map((dept) => (
              <Select.Item key={dept} className="department-select-item" value={dept}>
                <Select.ItemText>{dept}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

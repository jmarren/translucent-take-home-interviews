import React from 'react';
import * as Select from '@radix-ui/react-select';

export interface SelectOption {
  value: string;
  label: string;
}

interface LabeledSelectProps {
  id: string;
  ariaLabel: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export default function LabeledSelect({ id, ariaLabel, value, options, onChange }: LabeledSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="department-select-trigger" id={id} aria-label={ariaLabel}>
        <Select.Value />
        <Select.Icon className="department-select-icon">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="department-select-content" position="popper" sideOffset={4}>
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item key={option.value} className="department-select-item" value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
